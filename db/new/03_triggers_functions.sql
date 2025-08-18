-- ========================
-- 03_triggers_functions.sql
-- Optimized business logic triggers and automated functions
-- ========================

-- ========================
-- 1. Source Balance Update Function (direction-aware, credit card aware) - CORRECTED
-- ========================

CREATE OR REPLACE FUNCTION update_source_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    amt_adjust NUMERIC;
    is_credit_card BOOLEAN;
    old_type_name TEXT;
    new_type_name TEXT;
BEGIN
    -- Get transaction types to determine if this trigger should run
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        SELECT t.name INTO old_type_name FROM transaction_types t WHERE t.id = OLD.type_id;
    END IF;
    IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
        SELECT t.name INTO new_type_name FROM transaction_types t WHERE t.id = NEW.type_id;
    END IF;

    -- For UPDATE operations, first reverse the OLD amount if it wasn't an investment
    IF (TG_OP = 'UPDATE' AND old_type_name != 'Investment') THEN
        IF OLD.source_id IS NOT NULL AND OLD.amount != 0 THEN
            SELECT (cc.credit_limit IS NOT NULL) INTO is_credit_card
            FROM sources s LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = OLD.source_id;

            amt_adjust := CASE OLD.direction
                WHEN 'in' THEN -OLD.amount
                WHEN 'out' THEN OLD.amount
                ELSE 0
            END;

            IF COALESCE(is_credit_card, FALSE) THEN
                amt_adjust := amt_adjust * -1;
            END IF;

            UPDATE sources SET current_balance = current_balance + amt_adjust WHERE id = OLD.source_id;
        END IF;
    END IF;

    -- For INSERT or UPDATE, apply the NEW amount if it's not an investment
    IF ((TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND new_type_name != 'Investment') THEN
        IF NEW.source_id IS NOT NULL AND NEW.amount != 0 THEN
            SELECT (cc.credit_limit IS NOT NULL) INTO is_credit_card
            FROM sources s LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = NEW.source_id;

            amt_adjust := CASE NEW.direction
                WHEN 'in' THEN NEW.amount
                WHEN 'out' THEN -NEW.amount
                ELSE 0
            END;

            IF COALESCE(is_credit_card, FALSE) THEN
                amt_adjust := amt_adjust * -1;
            END IF;

            UPDATE sources SET current_balance = current_balance + amt_adjust WHERE id = NEW.source_id;
        END IF;
    END IF;

    -- For DELETE operations, reverse the amount if it wasn't an investment
    IF (TG_OP = 'DELETE' AND old_type_name != 'Investment') THEN
        IF OLD.source_id IS NOT NULL AND OLD.amount != 0 THEN
            SELECT (cc.credit_limit IS NOT NULL) INTO is_credit_card
            FROM sources s LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = OLD.source_id;

            amt_adjust := CASE OLD.direction
                WHEN 'in' THEN -OLD.amount
                WHEN 'out' THEN OLD.amount
                ELSE 0
            END;

            IF COALESCE(is_credit_card, FALSE) THEN
                amt_adjust := amt_adjust * -1;
            END IF;

            UPDATE sources SET current_balance = current_balance + amt_adjust WHERE id = OLD.source_id;
        END IF;
    END IF;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$;


-- ==============================================
-- Function: auto-set direction for transactions
-- ==============================================
CREATE OR REPLACE FUNCTION set_transaction_direction()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    type_name TEXT;
BEGIN
    -- Lookup type name
    SELECT name INTO type_name
    FROM transaction_types
    WHERE id = NEW.type_id;

    -- Skip transfer type (direction already handled manually)
    IF type_name = 'Transfer' THEN
        RETURN NEW;
    END IF;

    -- Automatically assign direction based on type
    CASE type_name
        WHEN 'Income' THEN NEW.direction := 'in';
        WHEN 'Expense' THEN NEW.direction := 'out';
        WHEN 'Lend' THEN NEW.direction := 'out';
        WHEN 'Borrow' THEN NEW.direction := 'in';
        WHEN 'Payment' THEN NEW.direction := 'out';
        -- Investment handled by separate function, but you can decide:
        WHEN 'Investment' THEN NEW.direction := 'out';
        ELSE
            -- default safeguard
            NEW.direction := 'out';
    END CASE;

    RETURN NEW;
END;
$$;

-- ==============================================
-- Trigger: call BEFORE insert/update on transactions
-- ==============================================
DROP TRIGGER IF EXISTS trg_set_transaction_direction ON transactions;
CREATE TRIGGER trg_set_transaction_direction
BEFORE INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION set_transaction_direction();


-- ========================
-- 2. Investment Balance Update Function - CORRECTED
-- ========================

CREATE OR REPLACE FUNCTION update_investment_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    delta NUMERIC;
    original_effect NUMERIC;
BEGIN
    -- For UPDATE or DELETE, reverse the effect of the OLD record
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        delta := OLD.quantity * OLD.unit_price;

        -- Determine the original effect on the balance
        original_effect := CASE OLD.action
            WHEN 'Buy' THEN delta
            WHEN 'Dividend' THEN delta
            WHEN 'Contribution' THEN delta -- A contribution originally INCREASED the balance
            WHEN 'Sell' THEN -delta
            WHEN 'Withdrawal' THEN -delta -- A withdrawal originally DECREased the balance
            ELSE 0
        END;

        -- Reverse the original effect by subtracting it
        UPDATE sources
        SET current_balance = current_balance - original_effect
        WHERE id = OLD.source_id;
    END IF;

    -- For UPDATE or INSERT, apply the effect of the NEW record
    IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
        delta := NEW.quantity * NEW.unit_price;

        -- Determine the new effect on the balance
        original_effect := CASE NEW.action
            WHEN 'Buy' THEN delta
            WHEN 'Dividend' THEN delta
            WHEN 'Contribution' THEN delta -- A contribution INCREASES the balance
            WHEN 'Sell' THEN -delta
            WHEN 'Withdrawal' THEN -delta -- A withdrawal DECREASES the balance
            ELSE 0
        END;

        -- Apply the new effect by adding it
        UPDATE sources
        SET current_balance = current_balance + original_effect
        WHERE id = NEW.source_id;
    END IF;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$;


-- ========================
-- 3. Triggers
-- ========================

DROP TRIGGER IF EXISTS trg_update_source_balance ON transactions;
CREATE TRIGGER trg_update_source_balance
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_source_balance();

DROP TRIGGER IF EXISTS trg_update_investment_balance ON investment_details;
CREATE TRIGGER trg_update_investment_balance
AFTER INSERT OR UPDATE OR DELETE ON investment_details
FOR EACH ROW EXECUTE FUNCTION update_investment_balance();


-- ========================
-- 4. Lending and Borrowing Functions (with current_outstanding)
-- ========================

CREATE OR REPLACE FUNCTION get_lending_outstanding()
RETURNS TABLE (
    transaction_id UUID,
    person_name TEXT,
    initial_outstanding NUMERIC,
    current_outstanding NUMERIC,
    due_date DATE,
    status TEXT,
    created_by UUID
) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ld.transaction_id,
        p.name,
        ld.initial_outstanding,
        COALESCE(ld.initial_outstanding - SUM(lr.amount_paid), ld.initial_outstanding) AS current_outstanding,
        ld.due_date,
        ld.status,
        ld.created_by
    FROM lending_details ld
    LEFT JOIN people p ON ld.person_id = p.id
    LEFT JOIN lending_repayments lr ON ld.transaction_id = lr.lending_id
    WHERE ld.created_by = auth.uid()
    GROUP BY ld.transaction_id, p.name, ld.initial_outstanding, ld.due_date, ld.status, ld.created_by;
END;
$$;

CREATE OR REPLACE FUNCTION get_borrowing_outstanding()
RETURNS TABLE (
    transaction_id UUID,
    person_name TEXT,
    initial_outstanding NUMERIC,
    current_outstanding NUMERIC,
    due_date DATE,
    status TEXT,
    created_by UUID
) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bd.transaction_id,
        p.name,
        bd.initial_outstanding,
        COALESCE(bd.initial_outstanding - SUM(br.amount_paid), bd.initial_outstanding) AS current_outstanding,
        bd.due_date,
        bd.status,
        bd.created_by
    FROM borrowing_details bd
    LEFT JOIN people p ON bd.person_id = p.id
    LEFT JOIN borrowing_repayments br ON bd.transaction_id = br.borrowing_id
    WHERE bd.created_by = auth.uid()
    GROUP BY bd.transaction_id, p.name, bd.initial_outstanding, bd.due_date, bd.status, bd.created_by;
END;
$$;

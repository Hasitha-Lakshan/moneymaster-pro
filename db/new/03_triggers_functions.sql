-- ========================
-- 03_triggers_functions.sql
-- Optimized business logic triggers and automated functions
-- ========================

-- ========================
-- 1. Source Balance Update Function (direction-aware, credit card aware)
-- ========================

CREATE OR REPLACE FUNCTION update_source_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    amt_adjust NUMERIC;
    src_type TEXT;
    source_credit_limit NUMERIC;
    is_credit_card BOOLEAN;
BEGIN
    -- INSERT
    IF TG_OP = 'INSERT' THEN
        IF NEW.source_id IS NOT NULL THEN
            SELECT s.type, (cc.credit_limit IS NOT NULL), COALESCE(cc.credit_limit, 0)
            INTO src_type, is_credit_card, source_credit_limit
            FROM sources s
            LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = NEW.source_id;

            amt_adjust := CASE NEW.direction
                WHEN 'in' THEN NEW.amount
                WHEN 'out' THEN -NEW.amount
                ELSE 0
            END;

            UPDATE sources
            SET current_balance = current_balance + amt_adjust
            WHERE id = NEW.source_id;

        END IF;
        RETURN NEW;
    END IF;

    -- UPDATE
    IF TG_OP = 'UPDATE' THEN
        -- Reverse OLD
        IF OLD.source_id IS NOT NULL THEN
            SELECT s.type, (cc.credit_limit IS NOT NULL), COALESCE(cc.credit_limit, 0)
            INTO src_type, is_credit_card, source_credit_limit
            FROM sources s
            LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = OLD.source_id;

            amt_adjust := CASE OLD.direction
                WHEN 'in' THEN -OLD.amount
                WHEN 'out' THEN OLD.amount
                ELSE 0
            END;

            UPDATE sources
            SET current_balance = current_balance + amt_adjust
            WHERE id = OLD.source_id;

        END IF;

        -- Apply NEW
        IF NEW.source_id IS NOT NULL THEN
            SELECT s.type, (cc.credit_limit IS NOT NULL), COALESCE(cc.credit_limit, 0)
            INTO src_type, is_credit_card, source_credit_limit
            FROM sources s
            LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = NEW.source_id;

            amt_adjust := CASE NEW.direction
                WHEN 'in' THEN NEW.amount
                WHEN 'out' THEN -NEW.amount
                ELSE 0
            END;

            UPDATE sources
            SET current_balance = current_balance + amt_adjust
            WHERE id = NEW.source_id;

        END IF;
        RETURN NEW;
    END IF;

    -- DELETE
    IF TG_OP = 'DELETE' THEN
        IF OLD.source_id IS NOT NULL THEN
            SELECT s.type, (cc.credit_limit IS NOT NULL), COALESCE(cc.credit_limit, 0)
            INTO src_type, is_credit_card, source_credit_limit
            FROM sources s
            LEFT JOIN credit_card_details cc ON s.id = cc.source_id
            WHERE s.id = OLD.source_id;

            amt_adjust := CASE OLD.direction
                WHEN 'in' THEN -OLD.amount
                WHEN 'out' THEN OLD.amount
                ELSE 0
            END;

            UPDATE sources
            SET current_balance = current_balance + amt_adjust
            WHERE id = OLD.source_id;

        END IF;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$;


-- ========================
-- 2. Investment Balance Update Function
-- ========================

CREATE OR REPLACE FUNCTION update_investment_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    multiplier NUMERIC;
    delta NUMERIC;
BEGIN
    -- DELETE or UPDATE: reverse OLD record
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        multiplier := -1;
        delta := OLD.quantity * OLD.unit_price;

        UPDATE sources
        SET current_balance = current_balance +
            CASE OLD.action
                WHEN 'Buy' THEN  -delta * multiplier
                WHEN 'Sell' THEN  delta * multiplier
                WHEN 'Dividend' THEN -delta * multiplier
                WHEN 'Contribution' THEN -delta * multiplier
                WHEN 'Withdrawal' THEN  delta * multiplier
                ELSE 0
            END
        WHERE id = OLD.source_id;
    END IF;

    -- INSERT or UPDATE: apply NEW record
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        multiplier := 1;
        delta := NEW.quantity * NEW.unit_price;

        UPDATE sources
        SET current_balance = current_balance +
            CASE NEW.action
                WHEN 'Buy' THEN  delta * multiplier
                WHEN 'Sell' THEN -delta * multiplier
                WHEN 'Dividend' THEN  delta * multiplier
                WHEN 'Contribution' THEN -delta * multiplier
                WHEN 'Withdrawal' THEN -delta * multiplier
                ELSE 0
            END
        WHERE id = NEW.source_id;
    END IF;

    RETURN NEW;
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
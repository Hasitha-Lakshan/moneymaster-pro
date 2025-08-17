-- ========================
-- 03_triggers_functions.sql
-- Optimized business logic triggers and automated functions
-- ========================

-- ========================
-- 1. Source Balance Update Function
-- ========================

CREATE OR REPLACE FUNCTION update_source_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    t_type TEXT;
    src_type TEXT;
    dst_type TEXT;

    -- signed amount to apply (positive for inflow, negative for outflow)
    signed_amt NUMERIC;
BEGIN
    -- Determine whether we are reversing (DELETE/UPDATE) or applying (INSERT/UPDATE)
    IF TG_OP = 'DELETE' THEN
        SELECT name INTO t_type FROM transaction_types WHERE id = OLD.type_id;
        src_type := (SELECT type FROM sources WHERE id = OLD.source_id);
        dst_type := (SELECT type FROM sources WHERE id = OLD.destination_source_id);

        -- reverse transaction effect
        signed_amt := OLD.amount;

        -- Handle source
        IF src_type IS NOT NULL THEN
            UPDATE sources
            SET current_balance = current_balance +
                CASE 
                    WHEN src_type IN ('Bank Account','Cash','Digital Wallet') THEN signed_amt
                    WHEN src_type = 'Credit Card' AND t_type = 'Expense' THEN -signed_amt
                    WHEN src_type = 'Credit Card' AND t_type = 'Payment' THEN signed_amt
                    ELSE 0
                END
            WHERE id = OLD.source_id;
        END IF;

        -- Handle destination
        IF dst_type IS NOT NULL AND dst_type IN ('Bank Account','Cash','Digital Wallet') THEN
            UPDATE sources SET current_balance = current_balance - signed_amt WHERE id = OLD.destination_source_id;
        END IF;

        RETURN OLD;
    END IF;

    -- INSERT or UPDATE: first reverse OLD if UPDATE
    IF TG_OP = 'UPDATE' THEN
        PERFORM update_source_balance() FROM (SELECT OLD.*) oldrow; -- call same logic
    END IF;

    -- Now apply NEW
    SELECT name INTO t_type FROM transaction_types WHERE id = NEW.type_id;
    src_type := (SELECT type FROM sources WHERE id = NEW.source_id);
    dst_type := (SELECT type FROM sources WHERE id = NEW.destination_source_id);

    signed_amt := NEW.amount;

    -- Source
    IF src_type IS NOT NULL THEN
        UPDATE sources
        SET current_balance = current_balance -
            CASE 
                WHEN src_type IN ('Bank Account','Cash','Digital Wallet') THEN signed_amt
                WHEN src_type = 'Credit Card' AND t_type = 'Expense' THEN -signed_amt
                WHEN src_type = 'Credit Card' AND t_type = 'Payment' THEN signed_amt
                ELSE 0
            END
        WHERE id = NEW.source_id;
    END IF;

    -- Destination
    IF dst_type IS NOT NULL AND dst_type IN ('Bank Account','Cash','Digital Wallet') THEN
        UPDATE sources SET current_balance = current_balance + signed_amt WHERE id = NEW.destination_source_id;
    END IF;

    RETURN NEW;
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
    multiplier NUMERIC := 1;
    delta NUMERIC;
BEGIN
    -- On DELETE or UPDATE, reverse old record
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

    -- On INSERT or UPDATE, apply new record
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        multiplier := 1;
        delta := NEW.quantity * NEW.unit_price;

        UPDATE sources
        SET current_balance = current_balance +
            CASE NEW.action
                WHEN 'Buy' THEN  delta * multiplier
                WHEN 'Sell' THEN -delta * multiplier
                WHEN 'Dividend' THEN  delta * multiplier
                WHEN 'Contribution' THEN  delta * multiplier
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
-- 4. Lending and Borrowing Functions
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
        ld.initial_outstanding, -- TODO: replace with repayment-adjusted balance
        ld.due_date,
        ld.status,
        ld.created_by
    FROM lending_details ld
    LEFT JOIN people p ON ld.person_id = p.id
    WHERE ld.created_by = auth.uid();
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
        bd.initial_outstanding, -- TODO: replace with repayment-adjusted balance
        bd.due_date,
        bd.status,
        bd.created_by
    FROM borrowing_details bd
    LEFT JOIN people p ON bd.person_id = p.id
    WHERE bd.created_by = auth.uid();
END;
$$;

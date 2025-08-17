-- ========================
-- 03_triggers_functions.sql
-- Business logic triggers and automated functions
-- ========================

-- ========================
-- 1. Balance Update Functions
-- ========================

-- Unified trigger function for all source types
CREATE OR REPLACE FUNCTION update_source_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    t_type TEXT;
    delta NUMERIC;
BEGIN
    -- Identify transaction type
    SELECT name INTO t_type FROM transaction_types WHERE id = NEW.type_id;

    -- Bank/Cash/Digital Wallet Transfers
    IF NEW.source_id IS NOT NULL AND (SELECT type FROM sources WHERE id = NEW.source_id) IN ('Bank Account','Cash','Digital Wallet') THEN
        UPDATE sources SET current_balance = current_balance - NEW.amount WHERE id = NEW.source_id;
    END IF;

    IF NEW.destination_source_id IS NOT NULL AND (SELECT type FROM sources WHERE id = NEW.destination_source_id) IN ('Bank Account','Cash','Digital Wallet') THEN
        UPDATE sources SET current_balance = current_balance + NEW.amount WHERE id = NEW.destination_source_id;
    END IF;

    -- Credit Card logic
    IF NEW.source_id IS NOT NULL AND (SELECT type FROM sources WHERE id = NEW.source_id) = 'Credit Card' THEN
        IF t_type = 'Expense' THEN
            UPDATE sources SET current_balance = current_balance + NEW.amount WHERE id = NEW.source_id;
        ELSIF t_type = 'Payment' THEN
            UPDATE sources SET current_balance = current_balance - NEW.amount WHERE id = NEW.source_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Investment balance update function
CREATE OR REPLACE FUNCTION update_investment_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    delta NUMERIC;
BEGIN
    IF NEW.action = 'Buy' THEN
        delta := NEW.quantity * NEW.unit_price;
        UPDATE sources SET current_balance = current_balance + delta WHERE id = NEW.source_id;
    ELSIF NEW.action = 'Sell' THEN
        delta := NEW.quantity * NEW.unit_price;
        UPDATE sources SET current_balance = current_balance - delta WHERE id = NEW.source_id;
    ELSIF NEW.action IN ('Dividend', 'Contribution') THEN
        delta := NEW.quantity * NEW.unit_price;
        UPDATE sources SET current_balance = current_balance + delta WHERE id = NEW.source_id;
    ELSIF NEW.action = 'Withdrawal' THEN
        delta := NEW.quantity * NEW.unit_price;
        UPDATE sources SET current_balance = current_balance - delta WHERE id = NEW.source_id;
    END IF;
    RETURN NEW;
END;
$$;

-- ========================
-- 2. Create Triggers
-- ========================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trg_update_source_balance ON transactions;
DROP TRIGGER IF EXISTS trg_update_investment_balance ON investment_details;

-- Trigger on transactions
CREATE TRIGGER trg_update_source_balance
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_source_balance();

-- Investment trigger
CREATE TRIGGER trg_update_investment_balance
AFTER INSERT ON investment_details
FOR EACH ROW
EXECUTE FUNCTION update_investment_balance();

-- ========================
-- 3. Lending and Borrowing Functions (Optional)
-- ========================

-- Function to get lending outstanding balances
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
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ld.transaction_id,
        p.name AS person_name,
        ld.initial_outstanding,
        ld.initial_outstanding AS current_outstanding, -- This could be calculated based on payments
        ld.due_date,
        ld.status,
        ld.created_by
    FROM lending_details ld
    LEFT JOIN people p ON ld.person_id = p.id
    WHERE ld.created_by = auth.uid();
END;
$$;

-- Function to get borrowing outstanding balances
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
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bd.transaction_id,
        p.name AS person_name,
        bd.initial_outstanding,
        bd.initial_outstanding AS current_outstanding, -- This could be calculated based on payments
        bd.due_date,
        bd.status,
        bd.created_by
    FROM borrowing_details bd
    LEFT JOIN people p ON bd.person_id = p.id
    WHERE bd.created_by = auth.uid();
END;
$$;
-- ========================
-- 02_security_rls.sql
-- Row Level Security setup and policies
-- ========================

-- ========================
-- 1. Enable Row Level Security
-- ========================

ALTER TABLE transaction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lending_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowing_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- ========================
-- 2. RLS Policies
-- ========================

-- transaction_types (read-only for all authenticated users)
DROP POLICY IF EXISTS "Allow select for all authenticated" ON transaction_types;
CREATE POLICY "Allow select for all authenticated"
ON transaction_types
FOR SELECT
TO authenticated
USING (true);

-- Categories
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
CREATE POLICY "Users can view own categories"
ON categories
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
CREATE POLICY "Users can insert own categories"
ON categories
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own categories" ON categories;
CREATE POLICY "Users can update own categories"
ON categories
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own categories" ON categories;
CREATE POLICY "Users can delete own categories"
ON categories
FOR DELETE
USING (created_by = auth.uid());

-- Subcategories
DROP POLICY IF EXISTS "Users can view own subcategories" ON subcategories;
CREATE POLICY "Users can view own subcategories"
ON subcategories
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own subcategories" ON subcategories;
CREATE POLICY "Users can insert own subcategories"
ON subcategories
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own subcategories" ON subcategories;
CREATE POLICY "Users can update own subcategories"
ON subcategories
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own subcategories" ON subcategories;
CREATE POLICY "Users can delete own subcategories"
ON subcategories
FOR DELETE
USING (created_by = auth.uid());

-- Sources
DROP POLICY IF EXISTS "Users can view own sources" ON sources;
CREATE POLICY "Users can view own sources"
ON sources
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own sources" ON sources;
CREATE POLICY "Users can insert own sources"
ON sources
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own sources" ON sources;
CREATE POLICY "Users can update own sources"
ON sources
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own sources" ON sources;
CREATE POLICY "Users can delete own sources"
ON sources
FOR DELETE
USING (created_by = auth.uid());

-- People
DROP POLICY IF EXISTS "Users can view own people" ON people;
CREATE POLICY "Users can view own people"
ON people
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own people" ON people;
CREATE POLICY "Users can insert own people"
ON people
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own people" ON people;
CREATE POLICY "Users can update own people"
ON people
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own people" ON people;
CREATE POLICY "Users can delete own people"
ON people
FOR DELETE
USING (created_by = auth.uid());

-- Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
ON transactions
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
CREATE POLICY "Users can insert own transactions"
ON transactions
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own transactions" ON transactions;
CREATE POLICY "Users can update own transactions"
ON transactions
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own transactions" ON transactions;
CREATE POLICY "Users can delete own transactions"
ON transactions
FOR DELETE
USING (created_by = auth.uid());

-- Lending Details
DROP POLICY IF EXISTS "Users can view own lending details" ON lending_details;
CREATE POLICY "Users can view own lending details"
ON lending_details
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own lending details" ON lending_details;
CREATE POLICY "Users can insert own lending details"
ON lending_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own lending details" ON lending_details;
CREATE POLICY "Users can update own lending details"
ON lending_details
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own lending details" ON lending_details;
CREATE POLICY "Users can delete own lending details"
ON lending_details
FOR DELETE
USING (created_by = auth.uid());

-- Borrowing Details
DROP POLICY IF EXISTS "Users can view own borrowing details" ON borrowing_details;
CREATE POLICY "Users can view own borrowing details"
ON borrowing_details
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own borrowing details" ON borrowing_details;
CREATE POLICY "Users can insert own borrowing details"
ON borrowing_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own borrowing details" ON borrowing_details;
CREATE POLICY "Users can update own borrowing details"
ON borrowing_details
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own borrowing details" ON borrowing_details;
CREATE POLICY "Users can delete own borrowing details"
ON borrowing_details
FOR DELETE
USING (created_by = auth.uid());

-- Investment Details
DROP POLICY IF EXISTS "Users can view own investment details" ON investment_details;
CREATE POLICY "Users can view own investment details"
ON investment_details
FOR SELECT
USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can insert own investment details" ON investment_details;
CREATE POLICY "Users can insert own investment details"
ON investment_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update own investment details" ON investment_details;
CREATE POLICY "Users can update own investment details"
ON investment_details
FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete own investment details" ON investment_details;
CREATE POLICY "Users can delete own investment details"
ON investment_details
FOR DELETE
USING (created_by = auth.uid());

-- Credit Card Details
DROP POLICY IF EXISTS "Users can view own credit card details" ON credit_card_details;
CREATE POLICY "Users can view own credit card details"
ON credit_card_details
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

DROP POLICY IF EXISTS "Users can insert own credit card details" ON credit_card_details;
CREATE POLICY "Users can insert own credit card details"
ON credit_card_details
FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

DROP POLICY IF EXISTS "Users can update own credit card details" ON credit_card_details;
CREATE POLICY "Users can update own credit card details"
ON credit_card_details
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

DROP POLICY IF EXISTS "Deny deletes" ON credit_card_details;
CREATE POLICY "Deny deletes"
ON credit_card_details
FOR DELETE
TO public
USING (false);

-- User Profiles
DROP POLICY IF EXISTS "Users can select their own profile" ON user_profiles;
CREATE POLICY "Users can select their own profile"
ON user_profiles
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Deny deletes" ON user_profiles;
CREATE POLICY "Deny deletes"
ON user_profiles
FOR DELETE
TO public
USING (false);

-- ========================
-- Transfers (RLS)
-- ========================

-- SELECT: Users can only see transfers if they own both linked transactions
DROP POLICY IF EXISTS "Users can view own transfers" ON transfers;
CREATE POLICY "Users can view own transfers"
ON transfers
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM transactions t
        WHERE t.id = transfers.transaction_from
          AND t.created_by = auth.uid()
    )
    AND
    EXISTS (
        SELECT 1 FROM transactions t
        WHERE t.id = transfers.transaction_to
          AND t.created_by = auth.uid()
    )
);

-- INSERT: Deny direct inserts (force usage of create_transfer function)
DROP POLICY IF EXISTS "Deny direct inserts" ON transfers;
CREATE POLICY "Deny direct inserts"
ON transfers
FOR INSERT
TO public
WITH CHECK (false);

-- UPDATE: deny updates directly
DROP POLICY IF EXISTS "Deny direct updates" ON transfers;
CREATE POLICY "Deny direct updates"
ON transfers
FOR UPDATE
TO public
USING (false);

-- DELETE: deny deletes directly
DROP POLICY IF EXISTS "Deny direct deletes" ON transfers;
CREATE POLICY "Deny direct deletes"
ON transfers
FOR DELETE
TO public
USING (false);

-- ========================
-- Lending Repayments
-- ========================

ALTER TABLE lending_repayments ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view repayments linked to their lending transactions
DROP POLICY IF EXISTS "Users can view own lending repayments" ON lending_repayments;
CREATE POLICY "Users can view own lending repayments"
ON lending_repayments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM lending_details ld
        WHERE ld.transaction_id = lending_repayments.lending_id
          AND ld.created_by = auth.uid()
    )
);

-- INSERT: Users can only add repayments to their own lending transactions
DROP POLICY IF EXISTS "Users can insert own lending repayments" ON lending_repayments;
CREATE POLICY "Users can insert own lending repayments"
ON lending_repayments
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lending_details ld
        WHERE ld.transaction_id = lending_repayments.lending_id
          AND ld.created_by = auth.uid()
    )
);

-- UPDATE: Users can only update repayments linked to their own lending
DROP POLICY IF EXISTS "Users can update own lending repayments" ON lending_repayments;
CREATE POLICY "Users can update own lending repayments"
ON lending_repayments
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM lending_details ld
        WHERE ld.transaction_id = lending_repayments.lending_id
          AND ld.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lending_details ld
        WHERE ld.transaction_id = lending_repayments.lending_id
          AND ld.created_by = auth.uid()
    )
);

-- DELETE: Users can only delete repayments linked to their own lending
DROP POLICY IF EXISTS "Users can delete own lending repayments" ON lending_repayments;
CREATE POLICY "Users can delete own lending repayments"
ON lending_repayments
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM lending_details ld
        WHERE ld.transaction_id = lending_repayments.lending_id
          AND ld.created_by = auth.uid()
    )
);

-- ========================
-- Borrowing Repayments
-- ========================

ALTER TABLE borrowing_repayments ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can only view repayments linked to their borrowing transactions
DROP POLICY IF EXISTS "Users can view own borrowing repayments" ON borrowing_repayments;
CREATE POLICY "Users can view own borrowing repayments"
ON borrowing_repayments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM borrowing_details bd
        WHERE bd.transaction_id = borrowing_repayments.borrowing_id
          AND bd.created_by = auth.uid()
    )
);

-- INSERT: Users can only add repayments to their own borrowing transactions
DROP POLICY IF EXISTS "Users can insert own borrowing repayments" ON borrowing_repayments;
CREATE POLICY "Users can insert own borrowing repayments"
ON borrowing_repayments
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM borrowing_details bd
        WHERE bd.transaction_id = borrowing_repayments.borrowing_id
          AND bd.created_by = auth.uid()
    )
);

-- UPDATE: Users can only update repayments linked to their own borrowing
DROP POLICY IF EXISTS "Users can update own borrowing repayments" ON borrowing_repayments;
CREATE POLICY "Users can update own borrowing repayments"
ON borrowing_repayments
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM borrowing_details bd
        WHERE bd.transaction_id = borrowing_repayments.borrowing_id
          AND bd.created_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM borrowing_details bd
        WHERE bd.transaction_id = borrowing_repayments.borrowing_id
          AND bd.created_by = auth.uid()
    )
);

-- DELETE: Users can only delete repayments linked to their own borrowing
DROP POLICY IF EXISTS "Users can delete own borrowing repayments" ON borrowing_repayments;
CREATE POLICY "Users can delete own borrowing repayments"
ON borrowing_repayments
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM borrowing_details bd
        WHERE bd.transaction_id = borrowing_repayments.borrowing_id
          AND bd.created_by = auth.uid()
    )
);

-- ========================
-- Security Definer Functions
-- ========================

-- Get source balances function
CREATE OR REPLACE FUNCTION get_source_balances()
RETURNS TABLE (
    source_id UUID,
    source_name TEXT,
    type TEXT,
    currency TEXT,
    created_by UUID,
    current_balance NUMERIC,
    credit_limit NUMERIC,
    available_credit NUMERIC,
    last_updated TIMESTAMP
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id AS source_id,
        s.name AS source_name,
        s.type,
        s.currency,
        s.created_by,
        s.current_balance,
        COALESCE(cc.credit_limit, 0) AS credit_limit,
        CASE 
            WHEN s.type = 'Credit Card' THEN COALESCE(cc.credit_limit, 0) - s.current_balance
            ELSE NULL
        END AS available_credit,
        NOW() AS last_updated
    FROM sources s
    LEFT JOIN credit_card_details cc ON s.id = cc.source_id
    WHERE s.created_by = auth.uid();
END;
$$;

-- =========================================
-- Function: create_transfer (industrial standard)
-- Creates a linked pair of transactions for a transfer
-- All amounts are stored as positive
-- =========================================
CREATE OR REPLACE FUNCTION create_transfer(
    p_source_id UUID,
    p_destination_id UUID,
    p_amount NUMERIC,
    p_date DATE,
    p_type_id UUID,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    transaction_id UUID,
    transaction_date DATE,
    transaction_type_id UUID,
    transaction_category_id UUID,
    transaction_subcategory_id UUID,
    transaction_source_id UUID,
    transaction_amount NUMERIC,
    transaction_notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    from_txn transactions%ROWTYPE;
    to_txn   transactions%ROWTYPE;
BEGIN
    -- Validate source ownership
    IF NOT EXISTS (SELECT 1 FROM sources WHERE id = p_source_id AND created_by = auth.uid()) THEN
        RAISE EXCEPTION 'You do not own the source account';
    END IF;

    -- Validate destination ownership
    IF NOT EXISTS (SELECT 1 FROM sources WHERE id = p_destination_id AND created_by = auth.uid()) THEN
        RAISE EXCEPTION 'You do not own the destination account';
    END IF;

    -- Insert "from" transaction (outgoing)
    INSERT INTO transactions (date, amount, source_id, category_id, type_id, subcategory_id, notes, created_by, direction)
    VALUES (p_date, ABS(p_amount), p_source_id, p_category_id, p_type_id, p_subcategory_id, p_notes, auth.uid(), 'out')
    RETURNING * INTO from_txn;

    -- Insert "to" transaction (incoming)
    INSERT INTO transactions (date, amount, source_id, category_id, type_id, subcategory_id, notes, created_by, direction)
    VALUES (p_date, ABS(p_amount), p_destination_id, p_category_id, p_type_id, p_subcategory_id, p_notes, auth.uid(), 'in')
    RETURNING * INTO to_txn;

    -- Link transactions in transfers table
    INSERT INTO transfers (id, transaction_from, transaction_to)
    VALUES (uuid_generate_v4(), from_txn.id, to_txn.id);

    -- Return both transactions
    RETURN QUERY
    SELECT t.id AS transaction_id,
           t.date AS transaction_date,
           t.type_id AS transaction_type_id,
           t.category_id AS transaction_category_id,
           t.subcategory_id AS transaction_subcategory_id,
           t.source_id AS transaction_source_id,
           t.amount AS transaction_amount,
           t.notes AS transaction_notes
    FROM transactions t
    WHERE t.id = from_txn.id OR t.id = to_txn.id;
END;
$$;

-- =========================================
-- Function: update_transfer
-- Updates both sides of a transfer atomically
-- =========================================
CREATE OR REPLACE FUNCTION update_transfer(
    p_transfer_id UUID,
    p_amount NUMERIC,
    p_date DATE,
    p_type_id UUID,
    p_category_id UUID DEFAULT NULL,
    p_subcategory_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    transaction_id UUID,
    transaction_date DATE,
    transaction_type_id UUID,
    transaction_category_id UUID,
    transaction_subcategory_id UUID,
    transaction_source_id UUID,
    transaction_amount NUMERIC,
    transaction_notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    from_txn_id UUID;
    to_txn_id   UUID;
BEGIN
    -- Get linked transactions
    SELECT transaction_from, transaction_to
    INTO from_txn_id, to_txn_id
    FROM transfers
    WHERE id = p_transfer_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transfer not found';
    END IF;

    -- Update "from" transaction
    UPDATE transactions
    SET date = p_date,
        amount = ABS(p_amount),
        type_id = p_type_id,
        category_id = p_category_id,
        subcategory_id = p_subcategory_id,
        notes = p_notes,
        direction = 'out'
    WHERE id = from_txn_id
      AND created_by = auth.uid()
    RETURNING * INTO STRICT from_txn_id;

     -- Update "to" transaction
    UPDATE transactions
    SET date = p_date,
        amount = ABS(p_amount),
        type_id = p_type_id,
        category_id = p_category_id,
        subcategory_id = p_subcategory_id,
        notes = p_notes,
        direction = 'in'
    WHERE id = to_txn_id
      AND created_by = auth.uid()
    RETURNING * INTO STRICT to_txn_id;

    -- Return both updated transactions
    RETURN QUERY
    SELECT t.id AS transaction_id,
           t.date AS transaction_date,
           t.type_id AS transaction_type_id,
           t.category_id AS transaction_category_id,
           t.subcategory_id AS transaction_subcategory_id,
           t.source_id AS transaction_source_id,
           t.amount AS transaction_amount,
           t.notes AS transaction_notes
    FROM transactions t
    WHERE t.id = from_txn_id OR t.id = to_txn_id;
END;
$$;

-- =========================================
-- Function: delete_transfer
-- Deletes both sides of a transfer atomically
-- =========================================
CREATE OR REPLACE FUNCTION delete_transfer(p_transfer_id UUID)
RETURNS TABLE (
    transaction_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    from_txn_id UUID;
    to_txn_id   UUID;
BEGIN
    SELECT transaction_from, transaction_to
    INTO from_txn_id, to_txn_id
    FROM transfers
    WHERE id = p_transfer_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transfer not found';
    END IF;

    -- Delete both transactions (trigger will adjust balances)
    DELETE FROM transactions
    WHERE id IN (from_txn_id, to_txn_id)
      AND created_by = auth.uid();

    -- Delete transfer record
    DELETE FROM transfers
    WHERE id = p_transfer_id;

    -- Return both deleted transaction IDs
    transaction_id := from_txn_id;
    RETURN NEXT;

    transaction_id := to_txn_id;
    RETURN NEXT;
END;
$$;

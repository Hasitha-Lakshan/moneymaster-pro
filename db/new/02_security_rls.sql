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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
USING (created_by = auth.uid());

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
-- 3. Security Definer Functions
-- ========================

-- Drop old views if they exist
DROP VIEW IF EXISTS source_balances;
DROP VIEW IF EXISTS lending_outstanding;
DROP VIEW IF EXISTS borrowing_outstanding;

-- Create security definer functions replacing those views
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
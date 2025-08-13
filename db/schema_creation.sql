-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- 1. Core Reference Tables
-- ========================

CREATE TABLE IF NOT EXISTS transaction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO transaction_types (name) VALUES
('Income'), ('Expense'), ('Transfer'), ('Lend'), ('Borrow'), ('Investment'), ('Payment')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_by UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL,
    UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Bank Account', 'Credit Card', 'Cash', 'Digital Wallet', 'Investment', 'Other')),
    currency VARCHAR(3) NOT NULL,
    initial_balance DECIMAL(12,2) DEFAULT 0.00,
    current_balance DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID NOT NULL
);

-- ========================
-- 1a. Credit Card Details Table
-- ========================

CREATE TABLE IF NOT EXISTS credit_card_details (
    source_id UUID PRIMARY KEY REFERENCES sources(id) ON DELETE CASCADE,
    credit_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
    interest_rate DECIMAL(5,2),
    billing_cycle_start INT
);

-- ========================
-- 2. People Table
-- ========================

CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    notes TEXT,
    created_by UUID NOT NULL
);

-- ========================
-- 3. Transactions Table
-- ========================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    type_id INT NOT NULL REFERENCES transaction_types(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    destination_source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- ========================
-- 4. Special Detail Tables
-- ========================

CREATE TABLE IF NOT EXISTS lending_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    initial_outstanding DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('Ongoing', 'Paid', 'Partial Paid')),
    created_by UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS borrowing_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    initial_outstanding DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('Ongoing', 'Repaid', 'Partial Repaid')),
    created_by UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS investment_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    asset_name VARCHAR(100) NOT NULL,
    action VARCHAR(20) CHECK (action IN ('Buy', 'Sell', 'Dividend', 'Contribution', 'Withdrawal')),
    quantity DECIMAL(12,4),
    unit_price DECIMAL(12,2),
    created_by UUID NOT NULL
);

-- ========================
-- 5. Enable Row Level Security
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

-- ========================
-- 6. RLS Policies
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

-- ========================
-- 7. Drop old views if they exist
-- ========================

DROP VIEW IF EXISTS source_balances;
DROP VIEW IF EXISTS lending_outstanding;
DROP VIEW IF EXISTS borrowing_outstanding;

-- ========================
-- 8. Create security definer functions replacing those views
-- ========================

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

-- ========================
-- 9. Triggers for automatic balance updates
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

-- Trigger on transactions
CREATE TRIGGER trg_update_source_balance
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_source_balance();

-- Investment trigger
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

CREATE TRIGGER trg_update_investment_balance
AFTER INSERT ON investment_details
FOR EACH ROW
EXECUTE FUNCTION update_investment_balance();

-- ========================
-- 10. Lending and Borrowing RPCs (unchanged)
-- ========================

-- get_lending_outstanding() and get_borrowing_outstanding() as in original script

-- ========================
-- 11. User Profiles table & Policies
-- ========================

-- Create user_profiles table to track if defaults inserted per user
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  defaults_inserted boolean NOT NULL DEFAULT false
);

-- Enable Row Level Security on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to SELECT their own profile
DROP POLICY IF EXISTS "Users can select their own profile" ON user_profiles;
CREATE POLICY "Users can select their own profile"
ON user_profiles
FOR SELECT
USING (user_id = auth.uid());

-- Policy to allow users to INSERT their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy to allow users to UPDATE their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Optional: deny DELETE (uncomment if you want to prevent deletions)
DROP POLICY IF EXISTS "Deny deletes" ON user_profiles;
CREATE POLICY "Deny deletes"
ON user_profiles
FOR DELETE
TO public
USING (false);


-- Enable Row Level Security
ALTER TABLE credit_card_details ENABLE ROW LEVEL SECURITY;

-- Users can view their own credit card details
DROP POLICY IF EXISTS "Users can view own credit card details" ON credit_card_details;
CREATE POLICY "Users can view own credit card details"
ON credit_card_details
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

-- Users can insert their own credit card details
DROP POLICY IF EXISTS "Users can insert own credit card details" ON credit_card_details;
CREATE POLICY "Users can insert own credit card details"
ON credit_card_details
FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

-- Users can update their own credit card details
DROP POLICY IF EXISTS "Users can update own credit card details" ON credit_card_details;
CREATE POLICY "Users can update own credit card details"
ON credit_card_details
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM sources s 
    WHERE s.id = credit_card_details.source_id 
      AND s.created_by = auth.uid()
));

-- Users cannot delete credit card details (optional)
DROP POLICY IF EXISTS "Deny deletes" ON credit_card_details;
CREATE POLICY "Deny deletes"
ON credit_card_details
FOR DELETE
TO public
USING (false);

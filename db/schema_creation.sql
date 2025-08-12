-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- 1. Core Reference Tables
-- ========================

CREATE TABLE transaction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO transaction_types (name) VALUES
('Income'), ('Expense'), ('Transfer'), ('Lend'), ('Borrow'), ('Investment');

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_by UUID NOT NULL
);

CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL,
    UNIQUE (category_id, name)
);

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Bank Account', 'Credit Card', 'Cash', 'Digital Wallet', 'Other')),
    currency VARCHAR(3) NOT NULL,
    initial_balance DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_by UUID NOT NULL
);

-- ========================
-- 2. People Table
-- ========================

CREATE TABLE people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    notes TEXT,
    created_by UUID NOT NULL
);

-- ========================
-- 3. Transactions Table
-- ========================

CREATE TABLE transactions (
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

CREATE TABLE lending_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    initial_outstanding DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('Ongoing', 'Paid', 'Partial Paid')),
    created_by UUID NOT NULL
);

CREATE TABLE borrowing_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    initial_outstanding DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('Ongoing', 'Repaid', 'Partial Repaid')),
    created_by UUID NOT NULL
);

CREATE TABLE investment_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
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

-- ========================
-- 6. RLS Policies
-- ========================

-- transaction_types (read-only for all authenticated users)
CREATE POLICY "Allow select for all authenticated"
ON transaction_types
FOR SELECT
TO authenticated
USING (true);

-- Categories
CREATE POLICY "Users can view own categories"
ON categories
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own categories"
ON categories
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own categories"
ON categories
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own categories"
ON categories
FOR DELETE
USING (created_by = auth.uid());

-- Subcategories
CREATE POLICY "Users can view own subcategories"
ON subcategories
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own subcategories"
ON subcategories
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own subcategories"
ON subcategories
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own subcategories"
ON subcategories
FOR DELETE
USING (created_by = auth.uid());

-- Sources
CREATE POLICY "Users can view own sources"
ON sources
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own sources"
ON sources
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own sources"
ON sources
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own sources"
ON sources
FOR DELETE
USING (created_by = auth.uid());

-- People
CREATE POLICY "Users can view own people"
ON people
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own people"
ON people
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own people"
ON people
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own people"
ON people
FOR DELETE
USING (created_by = auth.uid());

-- Transactions
CREATE POLICY "Users can view own transactions"
ON transactions
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own transactions"
ON transactions
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own transactions"
ON transactions
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own transactions"
ON transactions
FOR DELETE
USING (created_by = auth.uid());

-- Lending Details
CREATE POLICY "Users can view own lending details"
ON lending_details
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own lending details"
ON lending_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own lending details"
ON lending_details
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own lending details"
ON lending_details
FOR DELETE
USING (created_by = auth.uid());

-- Borrowing Details
CREATE POLICY "Users can view own borrowing details"
ON borrowing_details
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own borrowing details"
ON borrowing_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own borrowing details"
ON borrowing_details
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own borrowing details"
ON borrowing_details
FOR DELETE
USING (created_by = auth.uid());

-- Investment Details
CREATE POLICY "Users can view own investment details"
ON investment_details
FOR SELECT
USING (created_by = auth.uid());

CREATE POLICY "Users can insert own investment details"
ON investment_details
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own investment details"
ON investment_details
FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Users can delete own investment details"
ON investment_details
FOR DELETE
USING (created_by = auth.uid());

-- ========================
-- 7. Reporting Views
-- ========================

-- A. Current Balance per Source
CREATE OR REPLACE VIEW source_balances AS
SELECT 
    s.id AS source_id,
    s.name AS source_name,
    s.currency,
    s.created_by,
    s.initial_balance +
    COALESCE(SUM(
        CASE
            WHEN t.source_id = s.id THEN -t.amount
            WHEN t.destination_source_id = s.id THEN t.amount
            ELSE 0
        END
    ), 0) AS current_balance
FROM sources s
LEFT JOIN transactions t
    ON s.id = t.source_id OR s.id = t.destination_source_id
GROUP BY s.id, s.name, s.currency, s.initial_balance, s.created_by;

-- B. Lending Outstanding
CREATE OR REPLACE VIEW lending_outstanding AS
SELECT 
    ld.transaction_id,
    p.name AS person_name,
    t.amount AS lent_amount,
    ld.initial_outstanding,
    (ld.initial_outstanding + t.amount) -
    COALESCE((
        SELECT COALESCE(SUM(t2.amount), 0)
        FROM transactions t2
        JOIN transaction_types tt2 ON t2.type_id = tt2.id
        WHERE tt2.name = 'Repayment-In'
          AND t2.category_id = t.category_id
          AND t2.created_by = t.created_by
    ), 0) AS outstanding_balance,
    t.created_by
FROM lending_details ld
JOIN transactions t ON ld.transaction_id = t.id
LEFT JOIN people p ON ld.person_id = p.id;

-- C. Borrowing Outstanding
CREATE OR REPLACE VIEW borrowing_outstanding AS
SELECT 
    bd.transaction_id,
    p.name AS person_name,
    t.amount AS borrowed_amount,
    bd.initial_outstanding,
    (bd.initial_outstanding + t.amount) -
    COALESCE((
        SELECT COALESCE(SUM(t2.amount), 0)
        FROM transactions t2
        JOIN transaction_types tt2 ON t2.type_id = tt2.id
        WHERE tt2.name = 'Repayment-Out'
          AND t2.category_id = t.category_id
          AND t2.created_by = t.created_by
    ), 0) AS outstanding_balance,
    t.created_by
FROM borrowing_details bd
JOIN transactions t ON bd.transaction_id = t.id
LEFT JOIN people p ON bd.person_id = p.id;

-- ========================
-- 8. user_profiles Table & Policies
-- ========================

-- Create user_profiles table to track if defaults inserted per user
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  defaults_inserted boolean NOT NULL DEFAULT false
);

-- Enable Row Level Security on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to SELECT their own profile
CREATE POLICY "Users can select their own profile"
ON user_profiles
FOR SELECT
USING (user_id = auth.uid());

-- Policy to allow users to INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON user_profiles
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Policy to allow users to UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON user_profiles
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Optional: deny DELETE (uncomment if you want to prevent deletions)
CREATE POLICY "Deny deletes"
ON user_profiles
FOR DELETE
TO public
USING (false);

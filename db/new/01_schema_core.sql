-- ========================
-- 01_schema_core.sql
-- Core database schema with tables, constraints, and relationships
-- ========================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- 0. ENUM Types
-- ========================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_direction') THEN
        CREATE TYPE transaction_direction AS ENUM ('in', 'out');
    END IF;
END$$;

-- ========================
-- 1. Core Reference Tables
-- ========================

CREATE TABLE IF NOT EXISTS transaction_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_by UUID NOT NULL DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL DEFAULT auth.uid(),
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
    created_by UUID NOT NULL DEFAULT auth.uid()
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
    created_by UUID NOT NULL DEFAULT auth.uid()
);

-- ========================
-- 3. Transactions Table
-- ========================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    type_id UUID NOT NULL REFERENCES transaction_types(id) ON DELETE RESTRICT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    direction transaction_direction NOT NULL DEFAULT 'out', -- 'in' for cash inflow, 'out' for cash outflow
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL DEFAULT auth.uid()
);

-- ========================
-- 3a. Transfers Table (normalized)
-- ========================

CREATE TABLE IF NOT EXISTS transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_from UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    transaction_to UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
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
    created_by UUID NOT NULL DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS borrowing_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    initial_outstanding DECIMAL(12,2) DEFAULT 0.00,
    due_date DATE,
    status VARCHAR(20) CHECK (status IN ('Ongoing', 'Repaid', 'Partial Repaid')),
    created_by UUID NOT NULL DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS investment_details (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(id) ON DELETE CASCADE,
    source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
    asset_name VARCHAR(100) NOT NULL,
    action VARCHAR(20) CHECK (action IN ('Buy', 'Sell', 'Dividend', 'Contribution', 'Withdrawal')),
    quantity DECIMAL(12,4),
    unit_price DECIMAL(12,2),
    created_by UUID NOT NULL DEFAULT auth.uid()
);

-- ========================
-- 5. User Profiles table
-- ========================

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    defaults_inserted boolean NOT NULL DEFAULT false
);

-- ========================
-- 6. Lending and Borrowing Repayments
-- ========================

CREATE TABLE IF NOT EXISTS lending_repayments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lending_id UUID NOT NULL REFERENCES lending_details(transaction_id) ON DELETE CASCADE,
    amount_paid DECIMAL(12,2) NOT NULL CHECK (amount_paid >= 0),
    paid_on DATE NOT NULL,
    created_by UUID NOT NULL DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS borrowing_repayments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrowing_id UUID NOT NULL REFERENCES borrowing_details(transaction_id) ON DELETE CASCADE,
    amount_paid DECIMAL(12,2) NOT NULL CHECK (amount_paid >= 0),
    paid_on DATE NOT NULL,
    created_by UUID NOT NULL DEFAULT auth.uid()
);

-- ========================
-- 7. Indexes for faster lookups
-- ========================

CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_lending_details_created_by ON lending_details(created_by);
CREATE INDEX IF NOT EXISTS idx_borrowing_details_created_by ON borrowing_details(created_by);
CREATE INDEX IF NOT EXISTS idx_lending_repayments_lending_id ON lending_repayments(lending_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_repayments_borrowing_id ON borrowing_repayments(borrowing_id);

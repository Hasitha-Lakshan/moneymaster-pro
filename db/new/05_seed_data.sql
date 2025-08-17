-- ========================
-- 05_seed_data.sql
-- Initial system-wide seed data
-- ========================

-- ========================
-- 1. Transaction Types (System-wide reference data)
-- ========================

INSERT INTO transaction_types (name) VALUES
('Income'), 
('Expense'), 
('Transfer'), 
('Lend'), 
('Borrow'), 
('Investment'), 
('Payment')
ON CONFLICT (name) DO NOTHING;

-- ========================
-- 2. Additional System Reference Data (Optional)
-- ========================

-- Note: Add any other system-wide reference data here that applies to all users
-- Examples might include:
-- - Currency codes
-- - Default interest rates
-- - System configurations
-- - etc.

-- Example (commented out - add if needed):
-- CREATE TABLE IF NOT EXISTS currencies (
--     code VARCHAR(3) PRIMARY KEY,
--     name VARCHAR(50) NOT NULL,
--     symbol VARCHAR(5)
-- );
-- 
-- INSERT INTO currencies (code, name, symbol) VALUES
-- ('USD', 'US Dollar', '$'),
-- ('EUR', 'Euro', '€'),
-- ('GBP', 'British Pound', '£'),
-- ('JPY', 'Japanese Yen', '¥')
-- ON CONFLICT (code) DO NOTHING;
-- ========================
-- 04_dashboard_views.sql
-- Views, materialized views, and automatic refresh schedules
-- ========================

-- ========================
-- 1. Recent Transactions View (normal view)
-- ========================

DROP VIEW IF EXISTS vw_recent_transactions;
CREATE VIEW vw_recent_transactions AS
SELECT 
    t.id AS transaction_id,
    t.date AS transaction_date,
    t.amount AS transaction_amount,
    t.direction,
    t.notes,
    t.type_id,
    tt.name AS type_name,
    t.category_id,
    c.name AS category_name,
    t.subcategory_id,
    sc.name AS subcategory_name,
    t.source_id,
    s.name AS source_name,
    t.created_by
FROM transactions t
LEFT JOIN transaction_types tt ON t.type_id = tt.id
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN subcategories sc ON t.subcategory_id = sc.id
LEFT JOIN sources s ON t.source_id = s.id;

-- Security-safe wrapper view for user-specific access
DROP VIEW IF EXISTS vw_recent_transactions_user;
CREATE VIEW vw_recent_transactions_user AS
SELECT *
FROM vw_recent_transactions
WHERE created_by = auth.uid();

-- ========================
-- 2. Materialized View: Monthly Summary
-- ========================

DROP MATERIALIZED VIEW IF EXISTS mv_monthly_summary;
CREATE MATERIALIZED VIEW mv_monthly_summary AS
SELECT
    date_trunc('month', t.date) AS month,
    SUM(CASE WHEN t.direction = 'in' THEN t.amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN t.direction = 'out' THEN t.amount ELSE 0 END) AS total_expense,
    COUNT(t.id) AS transaction_count,
    t.created_by
FROM transactions t
GROUP BY date_trunc('month', t.date), t.created_by;

CREATE INDEX IF NOT EXISTS idx_mv_monthly_summary_user_month
ON mv_monthly_summary (created_by, month);

-- Security-safe view on top of materialized view
DROP VIEW IF EXISTS vw_monthly_summary_user;
CREATE VIEW vw_monthly_summary_user AS
SELECT *
FROM mv_monthly_summary
WHERE created_by = auth.uid();

-- ========================
-- 3. Materialized View: Source Balances
-- ========================

DROP MATERIALIZED VIEW IF EXISTS mv_source_balances;
CREATE MATERIALIZED VIEW mv_source_balances AS
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
    END AS available_credit
FROM sources s
LEFT JOIN credit_card_details cc ON s.id = cc.source_id;

CREATE INDEX IF NOT EXISTS idx_mv_source_balances_user
ON mv_source_balances (created_by);

DROP VIEW IF EXISTS vw_source_balances_user;
CREATE VIEW vw_source_balances_user AS
SELECT *
FROM mv_source_balances
WHERE created_by = auth.uid();

-- ========================
-- 4. Materialized View: Lending Outstanding
-- ========================

DROP MATERIALIZED VIEW IF EXISTS mv_lending_outstanding;
CREATE MATERIALIZED VIEW mv_lending_outstanding AS
SELECT 
    ld.transaction_id,
    p.name AS person_name,
    ld.initial_outstanding,
    COALESCE(ld.initial_outstanding - SUM(lr.amount_paid), ld.initial_outstanding) AS current_outstanding,
    ld.due_date,
    ld.status,
    ld.created_by
FROM lending_details ld
LEFT JOIN people p ON ld.person_id = p.id
LEFT JOIN lending_repayments lr ON ld.transaction_id = lr.lending_id
GROUP BY ld.transaction_id, p.name, ld.initial_outstanding, ld.due_date, ld.status, ld.created_by;

CREATE INDEX IF NOT EXISTS idx_mv_lending_outstanding_user
ON mv_lending_outstanding (created_by);

DROP VIEW IF EXISTS vw_lending_outstanding_user;
CREATE VIEW vw_lending_outstanding_user AS
SELECT *
FROM mv_lending_outstanding
WHERE created_by = auth.uid();

-- ========================
-- 5. Materialized View: Borrowing Outstanding
-- ========================

DROP MATERIALIZED VIEW IF EXISTS mv_borrowing_outstanding;
CREATE MATERIALIZED VIEW mv_borrowing_outstanding AS
SELECT 
    bd.transaction_id,
    p.name AS person_name,
    bd.initial_outstanding,
    COALESCE(bd.initial_outstanding - SUM(br.amount_paid), bd.initial_outstanding) AS current_outstanding,
    bd.due_date,
    bd.status,
    bd.created_by
FROM borrowing_details bd
LEFT JOIN people p ON bd.person_id = p.id
LEFT JOIN borrowing_repayments br ON bd.transaction_id = br.borrowing_id
GROUP BY bd.transaction_id, p.name, bd.initial_outstanding, bd.due_date, bd.status, bd.created_by;

CREATE INDEX IF NOT EXISTS idx_mv_borrowing_outstanding_user
ON mv_borrowing_outstanding (created_by);

DROP VIEW IF EXISTS vw_borrowing_outstanding_user;
CREATE VIEW vw_borrowing_outstanding_user AS
SELECT *
FROM mv_borrowing_outstanding
WHERE created_by = auth.uid();

-- ========================
-- 6. Materialized View: Investment Summary
-- ========================

DROP MATERIALIZED VIEW IF EXISTS mv_investment_summary;
CREATE MATERIALIZED VIEW mv_investment_summary AS
SELECT 
    i.source_id,
    s.name AS source_name,
    SUM(i.quantity * i.unit_price) AS total_value,
    SUM(CASE WHEN i.action IN ('Buy', 'Contribution') THEN i.quantity * i.unit_price
             WHEN i.action IN ('Sell', 'Withdrawal') THEN -i.quantity * i.unit_price
             ELSE 0 END) AS net_invested,
    i.created_by
FROM investment_details i
LEFT JOIN sources s ON i.source_id = s.id
GROUP BY i.source_id, s.name, i.created_by;

CREATE INDEX IF NOT EXISTS idx_mv_investment_summary_user
ON mv_investment_summary (created_by);

DROP VIEW IF EXISTS vw_investment_summary_user;
CREATE VIEW vw_investment_summary_user AS
SELECT *
FROM mv_investment_summary
WHERE created_by = auth.uid();

-- ========================
-- 7. Refresh Function for Materialized Views
-- ========================

CREATE OR REPLACE FUNCTION refresh_all_dashboard_mvs()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_source_balances;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_lending_outstanding;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_borrowing_outstanding;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_investment_summary;
END;
$$;

-- ========================
-- 8. pg_cron Scheduled Refreshes (Optional)
-- ========================

-- Ensure pg_cron extension is installed
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Refresh all dashboard materialized views every 15 minutes
-- SELECT cron.schedule('refresh_all_dashboard_mvs', '*/15 * * * *', 'SELECT refresh_all_dashboard_mvs();');

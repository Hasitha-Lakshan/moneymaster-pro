-- ========================
-- 00_master_setup.sql
-- Master script to execute all database setup files in order
-- ========================

-- This script executes all database setup files in the correct order
-- Run this script to set up the complete database schema

-- ========================
-- IMPORTANT NOTES:
-- ========================
-- 1. Ensure you have proper database permissions before running
-- 2. This script assumes you're using Supabase or PostgreSQL with auth schema
-- 3. Backup your database before running in production
-- 4. Review each file before execution to ensure compatibility with your environment
-- ========================

BEGIN;

-- Log the start of setup
DO $$
BEGIN
    RAISE NOTICE 'Starting database setup at %', NOW();
END $$;

-- ========================
-- 1. Core Schema Setup
-- ========================
DO $$
BEGIN
    RAISE NOTICE 'Executing: 01_schema_core.sql - Core database schema';
END $$;

-- Include 01_schema_core.sql content here or use \i command
-- \i 01_schema_core.sql

-- ========================
-- 2. Security and RLS Setup
-- ========================
DO $$
BEGIN
    RAISE NOTICE 'Executing: 02_security_rls.sql - Row Level Security setup';
END $$;

-- Include 02_security_rls.sql content here or use \i command
-- \i 02_security_rls.sql

-- ========================
-- 3. Triggers and Functions
-- ========================
DO $$
BEGIN
    RAISE NOTICE 'Executing: 03_triggers_functions.sql - Business logic triggers';
END $$;

-- Include 03_triggers_functions.sql content here or use \i command
-- \i 03_triggers_functions.sql

-- ========================
-- 4. Default Data Functions
-- ========================
DO $$
BEGIN
    RAISE NOTICE 'Executing: 04_default_data_functions.sql - User data management';
END $$;

-- Include 04_default_data_functions.sql content here or use \i command
-- \i 04_default_data_functions.sql

-- ========================
-- 5. Seed Data
-- ========================
DO $$
BEGIN
    RAISE NOTICE 'Executing: 05_seed_data.sql - System reference data';
END $$;

-- Include 05_seed_data.sql content here or use \i command
-- \i 05_seed_data.sql

-- ========================
-- Verification Queries (Optional)
-- ========================
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
    policy_count INTEGER;
BEGIN
    -- Count tables
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
        'transaction_types', 'categories', 'subcategories', 'sources', 
        'credit_card_details', 'people', 'transactions', 'lending_details', 
        'borrowing_details', 'investment_details', 'user_profiles'
    );
    
    -- Count functions
    SELECT COUNT(*) INTO function_count 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN (
        'insert_default_data', 'restore_default_data', 'get_source_balances',
        'update_source_balance', 'update_investment_balance'
    );
    
    -- Count RLS policies (approximate)
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'Setup completed successfully!';
    RAISE NOTICE 'Tables created: % (expected: 11)', table_count;
    RAISE NOTICE 'Functions created: % (expected: 5+)', function_count;
    RAISE NOTICE 'RLS policies created: % (expected: 40+)', policy_count;
    
    IF table_count < 11 THEN
        RAISE WARNING 'Some tables may not have been created properly';
    END IF;
    
    IF function_count < 5 THEN
        RAISE WARNING 'Some functions may not have been created properly';
    END IF;
    
END $$;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed at %', NOW();
    RAISE NOTICE 'You can now use the following functions:';
    RAISE NOTICE '  - SELECT insert_default_data(auth.uid()); -- Insert default data for current user';
    RAISE NOTICE '  - SELECT restore_default_data(auth.uid()); -- Reset user data to defaults';
    RAISE NOTICE '  - SELECT * FROM get_source_balances(); -- View account balances';
END $$;

COMMIT;

-- ========================
-- Usage Instructions
-- ========================

/*
USAGE INSTRUCTIONS:

1. USING INDIVIDUAL FILES (Recommended for development):
   Execute each file individually in order:
   
   psql -d your_database -f 01_schema_core.sql
   psql -d your_database -f 02_security_rls.sql
   psql -d your_database -f 03_triggers_functions.sql
   psql -d your_database -f 04_default_data_functions.sql
   psql -d your_database -f 05_seed_data.sql

2. USING THIS MASTER SCRIPT:
   - Uncomment the \i commands above
   - Ensure all SQL files are in the same directory
   - Run: psql -d your_database -f 00_master_setup.sql

3. TESTING THE SETUP:
   After setup, test with a user:
   
   -- Insert default data for current user
   SELECT insert_default_data(auth.uid());
   
   -- View the created data
   SELECT * FROM categories WHERE created_by = auth.uid();
   SELECT * FROM sources WHERE created_by = auth.uid();
   
   -- Reset to defaults (if needed)
   SELECT restore_default_data(auth.uid());

4. ROLLBACK INSTRUCTIONS:
   If you need to rollback, run each DROP statement in reverse order:
   - Drop functions first
   - Drop triggers
   - Drop policies
   - Drop tables last
*/
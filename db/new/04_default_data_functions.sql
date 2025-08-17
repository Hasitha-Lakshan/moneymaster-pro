-- ========================
-- 04_default_data_functions.sql
-- Functions for managing default user data
-- ========================

-- ========================
-- 1. Insert Default Data Function
-- ========================

CREATE OR REPLACE FUNCTION insert_default_data(p_user_id uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  user_flag boolean;
  cat RECORD;
BEGIN
  -- Check if defaults already inserted
  SELECT defaults_inserted INTO user_flag FROM user_profiles WHERE user_id = p_user_id;

  IF user_flag THEN
    -- Already inserted, do nothing
    RETURN;
  END IF;

  -- Insert categories if not exist
  INSERT INTO categories (id, name, created_by)
  SELECT gen_random_uuid(), name, p_user_id
  FROM (VALUES
    ('Transport'),
    ('Food & Dining'),
    ('Housing'),
    ('Utilities'),
    ('Health & Fitness'),
    ('Entertainment'),
    ('Education'),
    ('Investments'),
    ('Loans & Lending'),
    ('Income'),
    ('Miscellaneous')
  ) AS vals(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM categories WHERE name = vals.name AND created_by = p_user_id
  );

  -- Insert subcategories
  FOR cat IN SELECT id, name FROM categories WHERE created_by = p_user_id LOOP
    CASE cat.name
      WHEN 'Transport' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Gas'),('Public Transport'),('Taxi/Rideshare'),('Vehicle Maintenance')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Food & Dining' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Groceries'),('Restaurants'),('Coffee Shops'),('Fast Food')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Housing' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Rent'),('Mortgage'),('Repairs & Maintenance'),('Property Taxes')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Utilities' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Electricity'),('Water'),('Gas'),('Internet'),('Phone')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Health & Fitness' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Doctor Visits'),('Medication'),('Gym Membership'),('Yoga & Wellness')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Entertainment' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Movies & TV'),('Concerts & Events'),('Streaming Services'),('Books & Magazines')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Education' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Tuition'),('Books & Supplies'),('Online Courses')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Investments' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Stocks'),('Bonds'),('Mutual Funds'),('Real Estate')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Loans & Lending' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Personal Loans'),('Credit Card Debt'),('Mortgages')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Income' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Salary'),('Bonus'),('Interest Income'),('Dividends')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );

      WHEN 'Miscellaneous' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, p_user_id
        FROM (VALUES ('Gifts'),('Donations'),('Other')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = p_user_id
        );
    END CASE;
  END LOOP;

  -- Insert sources if not exist
  INSERT INTO sources (id, name, type, currency, initial_balance, current_balance, notes, created_by)
  SELECT
    gen_random_uuid(),
    vals.name,
    vals.type,
    vals.currency,
    vals.initial_balance,
    vals.initial_balance,  -- set current_balance same as initial
    vals.notes,
    p_user_id
  FROM (VALUES
    ('Cash Wallet','Cash','USD',0,'Default cash wallet'),
    ('Bank Checking Account','Bank Account','USD',0,'Main checking account'),
    ('Credit Card Visa','Credit Card','USD',0,'Visa credit card'),
    ('PayPal','Digital Wallet','USD',0,'PayPal account')
  ) AS vals(name, type, currency, initial_balance, notes)
  WHERE NOT EXISTS (
    SELECT 1 FROM sources WHERE name = vals.name AND created_by = p_user_id
  );

  -- Insert default credit card details for Credit Card sources
  INSERT INTO credit_card_details (source_id, credit_limit, interest_rate, billing_cycle_start)
  SELECT s.id, 5000, 18.0, 1  -- example defaults
  FROM sources s
  WHERE s.created_by = p_user_id AND s.type = 'Credit Card'
  ON CONFLICT (source_id) DO NOTHING;

  -- Update user_profiles flag
  INSERT INTO user_profiles(user_id, defaults_inserted)
  VALUES (p_user_id, true)
  ON CONFLICT (user_id) DO UPDATE SET defaults_inserted = true;

END;
$$;

-- ========================
-- 2. Restore Default Data Function
-- ========================

CREATE OR REPLACE FUNCTION restore_default_data(p_user_id uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing lending details for user's transactions
  DELETE FROM lending_details
  WHERE created_by = p_user_id;

  -- Delete existing borrowing details for user's transactions
  DELETE FROM borrowing_details
  WHERE created_by = p_user_id;

  -- Delete existing transactions
  DELETE FROM transactions
  WHERE created_by = p_user_id;

  -- Delete existing investment details for user's sources
  DELETE FROM investment_details
  WHERE source_id IN (SELECT id FROM sources WHERE created_by = p_user_id);

  -- Delete existing credit card details for user's sources
  DELETE FROM credit_card_details
  WHERE source_id IN (SELECT id FROM sources WHERE created_by = p_user_id);

  -- Delete existing people
  DELETE FROM people
  WHERE created_by = p_user_id;

  -- Delete existing sources
  DELETE FROM sources
  WHERE created_by = p_user_id;

  -- Delete subcategories and categories
  DELETE FROM subcategories WHERE created_by = p_user_id;
  DELETE FROM categories WHERE created_by = p_user_id;

  -- Reset flag in user_profiles to false
  INSERT INTO user_profiles(user_id, defaults_inserted)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO UPDATE SET defaults_inserted = false;

  -- Re-insert all default data
  PERFORM insert_default_data(p_user_id);

END;
$$;
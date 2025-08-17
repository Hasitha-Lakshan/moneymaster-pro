-- ========================
-- 04_default_data_functions.sql
-- Functions for managing default user data (hybrid, optional user_id)
-- ========================

-- ========================
-- 1. Insert Default Data Function
-- ========================

CREATE OR REPLACE FUNCTION insert_default_data(p_user_id uuid DEFAULT NULL)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  user_flag boolean;
  cat RECORD;
  uid uuid := COALESCE(p_user_id, auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'No user ID provided and auth.uid() is NULL';
  END IF;

  -- Check if defaults already inserted
  SELECT defaults_inserted INTO user_flag 
  FROM user_profiles 
  WHERE user_id = uid;

  IF user_flag THEN
      -- Already inserted, do nothing
    RETURN;
  END IF;

  -- Insert categories
  INSERT INTO categories (id, name, created_by)
  SELECT gen_random_uuid(), name, uid
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
    SELECT 1 FROM categories WHERE name = vals.name AND created_by = uid
  );

  -- Insert subcategories
  FOR cat IN SELECT id, name FROM categories WHERE created_by = uid LOOP
    CASE cat.name
      WHEN 'Transport' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Gas'),('Public Transport'),('Taxi/Rideshare'),('Vehicle Maintenance')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Food & Dining' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Groceries'),('Restaurants'),('Coffee Shops'),('Fast Food')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Housing' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Rent'),('Mortgage'),('Repairs & Maintenance'),('Property Taxes')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Utilities' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Electricity'),('Water'),('Gas'),('Internet'),('Phone')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Health & Fitness' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Doctor Visits'),('Medication'),('Gym Membership'),('Yoga & Wellness')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Entertainment' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Movies & TV'),('Concerts & Events'),('Streaming Services'),('Books & Magazines')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Education' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Tuition'),('Books & Supplies'),('Online Courses')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Investments' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Stocks'),('Bonds'),('Mutual Funds'),('Real Estate')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Loans & Lending' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Personal Loans'),('Credit Card Debt'),('Mortgages')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Income' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Salary'),('Bonus'),('Interest Income'),('Dividends')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );

      WHEN 'Miscellaneous' THEN
        INSERT INTO subcategories (id, category_id, name, created_by)
        SELECT gen_random_uuid(), cat.id, sub_name, uid
        FROM (VALUES ('Gifts'),('Donations'),('Other')) AS subs(sub_name)
        WHERE NOT EXISTS (
          SELECT 1 FROM subcategories WHERE name = subs.sub_name AND category_id = cat.id AND created_by = uid
        );
    END CASE;
  END LOOP;

  -- Insert default sources
  INSERT INTO sources (id, name, type, currency, initial_balance, current_balance, notes, created_by)
  SELECT
    gen_random_uuid(),
    vals.name,
    vals.type,
    vals.currency,
    vals.initial_balance,
    vals.initial_balance,
    vals.notes,
    uid
  FROM (VALUES
    ('Cash Wallet','Cash','USD',0,'Default cash wallet'),
    ('Bank Checking Account','Bank Account','USD',0,'Main checking account'),
    ('Credit Card Visa','Credit Card','USD',0,'Visa credit card'),
    ('PayPal','Digital Wallet','USD',0,'PayPal account')
  ) AS vals(name, type, currency, initial_balance, notes)
  WHERE NOT EXISTS (
    SELECT 1 FROM sources WHERE name = vals.name AND created_by = uid
  );

  -- Insert default credit card details
  INSERT INTO credit_card_details (source_id, credit_limit, interest_rate, billing_cycle_start)
  SELECT s.id, 5000, 18.0, 1
  FROM sources s
  WHERE s.created_by = uid AND s.type = 'Credit Card'
  ON CONFLICT (source_id) DO NOTHING;

  -- Update user_profiles flag
  INSERT INTO user_profiles(user_id, defaults_inserted)
  VALUES (uid, true)
  ON CONFLICT (user_id) DO UPDATE SET defaults_inserted = true;

END;
$$;

-- ========================
-- 2. Restore Default Data Function
-- ========================

CREATE OR REPLACE FUNCTION restore_default_data(p_user_id uuid DEFAULT NULL)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
DECLARE
  uid uuid := COALESCE(p_user_id, auth.uid());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'No user ID provided and auth.uid() is NULL';
  END IF;

  -- Delete all user data
  DELETE FROM lending_details WHERE created_by = uid;
  DELETE FROM borrowing_details WHERE created_by = uid;
  DELETE FROM transactions WHERE created_by = uid;
  DELETE FROM investment_details WHERE source_id IN (SELECT id FROM sources WHERE created_by = uid);
  DELETE FROM credit_card_details WHERE source_id IN (SELECT id FROM sources WHERE created_by = uid);
  DELETE FROM people WHERE created_by = uid;
  DELETE FROM sources WHERE created_by = uid;
  DELETE FROM subcategories WHERE created_by = uid;
  DELETE FROM categories WHERE created_by = uid;

  -- Reset flag
  INSERT INTO user_profiles(user_id, defaults_inserted)
  VALUES (uid, false)
  ON CONFLICT (user_id) DO UPDATE SET defaults_inserted = false;

  -- Re-insert defaults
  PERFORM insert_default_data(p_user_id);

END;
$$;

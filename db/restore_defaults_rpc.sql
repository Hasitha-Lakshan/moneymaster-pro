CREATE OR REPLACE FUNCTION restore_default_data(p_user_id uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing investment details for user's sources
  DELETE FROM investment_details
  WHERE source_id IN (SELECT id FROM sources WHERE created_by = p_user_id);

  -- Delete existing credit card details for user's sources
  DELETE FROM credit_card_details
  WHERE source_id IN (SELECT id FROM sources WHERE created_by = p_user_id);

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

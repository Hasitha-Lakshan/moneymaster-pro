CREATE OR REPLACE FUNCTION restore_default_data(p_user_id uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- Optionally, delete existing categories, subcategories, sources for the user
  DELETE FROM subcategories WHERE created_by = p_user_id;
  DELETE FROM categories WHERE created_by = p_user_id;
  DELETE FROM sources WHERE created_by = p_user_id;

  -- Reset flag to false
  INSERT INTO user_profiles(user_id, defaults_inserted)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO UPDATE SET defaults_inserted = false;

  -- Call insert_default_data to reinsert all defaults
  PERFORM insert_default_data(p_user_id);

END;
$$;

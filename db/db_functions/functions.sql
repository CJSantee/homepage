CREATE OR REPLACE FUNCTION cs_hello_world()
RETURNS TEXT AS $$
BEGIN
  RETURN 'Hello World!';
END;
$$ LANGUAGE plpgsql;

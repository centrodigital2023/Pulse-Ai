DO $$
DECLARE t text;
DECLARE catalog text[] := ARRAY[
  'products','product_files','product_assets','product_versions',
  'categories','tags','courses','course_modules','course_lessons',
  'organizations','affiliate_programs'
];
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    IF t = ANY(catalog) THEN
      EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    END IF;
  END LOOP;
END $$;
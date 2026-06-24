DROP VIEW IF EXISTS public.webhooks_admin;

REVOKE ALL ON FUNCTION public.set_product_file_owner() FROM PUBLIC, anon, authenticated;
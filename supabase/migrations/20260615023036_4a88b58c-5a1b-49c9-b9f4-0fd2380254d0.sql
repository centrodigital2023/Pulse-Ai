REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.become_seller() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.become_seller() TO authenticated;
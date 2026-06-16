-- Allow superadmins to read platform-wide data for the admin panel

CREATE POLICY "Admins view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view all orders"
ON public.orders FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view all customers"
ON public.customers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
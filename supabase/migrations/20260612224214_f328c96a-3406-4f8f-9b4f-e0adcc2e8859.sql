-- 1. Restrict product_files SELECT to owners only (remove public exposure of storage_path)
DROP POLICY IF EXISTS "Files viewable with product" ON public.product_files;

CREATE POLICY "Owners view files"
ON public.product_files
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_files.product_id
      AND p.owner_id = auth.uid()
  )
);

-- 2. Lock down user_roles writes to admins only (prevent privilege escalation)
CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
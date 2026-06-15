CREATE POLICY "Buyers can read files of purchased products"
ON public.product_files FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.product_id = product_files.product_id::text
      AND o.buyer_id = auth.uid()
      AND o.status = 'paid'
  )
);

CREATE POLICY "Buyers can read modules of purchased courses"
ON public.course_modules FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.orders o ON o.product_id = c.product_id::text
    WHERE c.id = course_modules.course_id
      AND o.buyer_id = auth.uid()
      AND o.status = 'paid'
  )
);

CREATE POLICY "Buyers can read lessons of purchased courses"
ON public.course_lessons FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.orders o ON o.product_id = c.product_id::text
    WHERE c.id = course_lessons.course_id
      AND o.buyer_id = auth.uid()
      AND o.status = 'paid'
  )
);

CREATE POLICY "Program owners can read their affiliate links"
ON public.affiliate_links FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.affiliate_programs p
    WHERE p.id = affiliate_links.program_id
      AND p.owner_id = auth.uid()
  )
);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
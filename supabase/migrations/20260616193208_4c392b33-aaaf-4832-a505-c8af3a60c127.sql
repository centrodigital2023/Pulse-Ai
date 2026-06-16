-- Allow buyers to read parent course rows for products they purchased
CREATE POLICY "Buyers can read purchased courses"
ON public.courses
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.product_id = (courses.product_id)::text
      AND o.buyer_id = auth.uid()
      AND o.status = 'paid'
  )
);

-- Allow product owners (sellers) to read orders for their own products
CREATE POLICY "Sellers can read orders for their products"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = (orders.product_id)::uuid
      AND p.owner_id = auth.uid()
  )
);
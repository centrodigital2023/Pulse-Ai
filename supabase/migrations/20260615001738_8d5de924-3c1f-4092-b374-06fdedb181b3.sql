-- Lock down writes on the orders table.
-- Orders are created and updated exclusively by trusted server code (service_role,
-- which bypasses RLS). Buyers may only READ their own orders.

-- Remove overly broad table grants from public-facing roles.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.orders FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.orders FROM authenticated;

-- Keep buyers' read access to their own orders.
GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

-- Ensure the buyer read policy only matches real, owned orders (never NULL buyer_id).
DROP POLICY IF EXISTS "Buyers view their own orders" ON public.orders;
CREATE POLICY "Buyers view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (buyer_id IS NOT NULL AND auth.uid() = buyer_id);

-- Explicit deny-all for any write attempt from anon/authenticated via the Data API.
-- (No INSERT/UPDATE/DELETE policies exist, so RLS already denies these for non-service roles;
--  these restrictive policies make the intent explicit and future-proof.)
CREATE POLICY "No client inserts on orders"
ON public.orders
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "No client updates on orders"
ON public.orders
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false);

CREATE POLICY "No client deletes on orders"
ON public.orders
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);
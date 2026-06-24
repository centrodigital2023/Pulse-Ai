-- ── product_files: add owner_id and tighten policies ─────────────────────────
ALTER TABLE public.product_files ADD COLUMN IF NOT EXISTS owner_id uuid;

UPDATE public.product_files pf
SET owner_id = p.owner_id
FROM public.products p
WHERE p.id = pf.product_id AND pf.owner_id IS NULL;

CREATE OR REPLACE FUNCTION public.set_product_file_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    SELECT owner_id INTO NEW.owner_id FROM public.products WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_product_file_owner ON public.product_files;
CREATE TRIGGER trg_set_product_file_owner
BEFORE INSERT ON public.product_files
FOR EACH ROW EXECUTE FUNCTION public.set_product_file_owner();

-- Restrict owner management to authenticated users via direct owner_id check
DROP POLICY IF EXISTS "Owners manage files" ON public.product_files;
CREATE POLICY "Owners manage files"
ON public.product_files
FOR ALL
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- ── license_keys: allow buyers to read keys for products they paid for ────────
CREATE POLICY "Buyers read their license keys"
ON public.license_keys
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.buyer_id = auth.uid()
      AND o.status = 'paid'
      AND o.product_id = (license_keys.product_id)::text
  )
);

-- ── storage: allow buyers with a paid order to download product files ─────────
CREATE POLICY "product-files buyer read"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-files'
  AND EXISTS (
    SELECT 1
    FROM public.product_files pf
    JOIN public.orders o ON o.product_id = (pf.product_id)::text
    WHERE pf.storage_path = storage.objects.name
      AND o.buyer_id = auth.uid()
      AND o.status = 'paid'
  )
);

-- ── webhooks: stop exposing signing secrets to admins across tenants ──────────
DROP POLICY IF EXISTS "Admins view all webhooks" ON public.webhooks;

CREATE OR REPLACE VIEW public.webhooks_admin AS
  SELECT id, owner_id, url, events, active, created_at, updated_at
  FROM public.webhooks
  WHERE public.has_role(auth.uid(), 'admin'::app_role);

GRANT SELECT ON public.webhooks_admin TO authenticated;
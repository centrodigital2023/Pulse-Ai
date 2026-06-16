-- ─── organizations ───────────────────────────────────────────────
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  white_label boolean NOT NULL DEFAULT false,
  logo_url text,
  custom_domain text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their organizations" ON public.organizations FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all organizations" ON public.organizations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── product_versions ────────────────────────────────────────────
CREATE TABLE public.product_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version text NOT NULL,
  changelog text,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_versions TO authenticated;
GRANT ALL ON public.product_versions TO service_role;
ALTER TABLE public.product_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage product versions" ON public.product_versions FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all product versions" ON public.product_versions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── product_assets ──────────────────────────────────────────────
CREATE TABLE public.product_assets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  kind text,
  storage_path text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_assets TO authenticated;
GRANT ALL ON public.product_assets TO service_role;
ALTER TABLE public.product_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage product assets" ON public.product_assets FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all product assets" ON public.product_assets FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── tags ────────────────────────────────────────────────────────
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their tags" ON public.tags FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all tags" ON public.tags FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── license_activations ─────────────────────────────────────────
CREATE TABLE public.license_activations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_id uuid NOT NULL REFERENCES public.license_keys(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text,
  device_name text,
  ip text,
  status text NOT NULL DEFAULT 'active',
  activated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.license_activations TO authenticated;
GRANT ALL ON public.license_activations TO service_role;
ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage license activations" ON public.license_activations FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all license activations" ON public.license_activations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── order_items ─────────────────────────────────────────────────
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers view their order items" ON public.order_items FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Buyers view their order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()));
CREATE POLICY "Admins view all order items" ON public.order_items FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── certificates ────────────────────────────────────────────────
CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  code text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  title text,
  url text,
  issued_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage certificates" ON public.certificates FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Students view their certificates" ON public.certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all certificates" ON public.certificates FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── email_sequences ─────────────────────────────────────────────
CREATE TABLE public.email_sequences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_sequences TO authenticated;
GRANT ALL ON public.email_sequences TO service_role;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage email sequences" ON public.email_sequences FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all email sequences" ON public.email_sequences FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── webhooks ────────────────────────────────────────────────────
CREATE TABLE public.webhooks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  secret text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.webhooks TO authenticated;
GRANT ALL ON public.webhooks TO service_role;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their webhooks" ON public.webhooks FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins view all webhooks" ON public.webhooks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ─── updated_at triggers ─────────────────────────────────────────
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON public.email_sequences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
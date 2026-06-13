CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_ref uuid NOT NULL DEFAULT gen_random_uuid(),
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_email text,
  product_id text,
  product_name text NOT NULL,
  product_image text,
  download_url text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'COP',
  installments integer NOT NULL DEFAULT 1,
  payment_method text,
  status text NOT NULL DEFAULT 'pending',
  mp_payment_id text,
  mp_preference_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE INDEX idx_orders_buyer ON public.orders (buyer_id);
CREATE INDEX idx_orders_group_ref ON public.orders (group_ref);
CREATE INDEX idx_orders_status ON public.orders (status);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
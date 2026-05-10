CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT TO anon, authenticated
USING (active = true OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert products" ON public.products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update products" ON public.products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete products" ON public.products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (name, description, price_cents, image_url, stock, sort_order) VALUES
('FaderShifu Pomade', 'Tugev hoid, matt viimistlus. 100ml.', 1500, null, 25, 1),
('Habemeõli', 'Hoiab habeme pehme ja lõhnab värskelt. 30ml.', 1200, null, 30, 2),
('FaderShifu T-särk', 'Must puuvillane t-särk logoga. Unisex.', 2500, null, 15, 3),
('Kingituskaart 25€', 'Kingi lõikus sõbrale. Kehtib 12 kuud.', 2500, null, 100, 4);
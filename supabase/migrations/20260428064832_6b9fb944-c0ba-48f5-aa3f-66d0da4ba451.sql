-- Time slots table
CREATE TABLE public.time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  booking_id uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slot_date, slot_time)
);

CREATE INDEX idx_time_slots_date ON public.time_slots (slot_date);
CREATE INDEX idx_time_slots_available ON public.time_slots (slot_date, is_booked) WHERE is_booked = false;

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view available slots (needed for booking form)
CREATE POLICY "Anyone can view time slots"
ON public.time_slots
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can manage slots
CREATE POLICY "Admins can insert slots"
ON public.time_slots
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update slots"
ON public.time_slots
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete slots"
ON public.time_slots
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND is_booked = false);

-- Add reference from bookings
ALTER TABLE public.bookings ADD COLUMN time_slot_id uuid NULL REFERENCES public.time_slots(id) ON DELETE SET NULL;

-- Secure booking function: atomically reserves slot and creates booking
CREATE OR REPLACE FUNCTION public.book_slot(
  _slot_id uuid,
  _name text,
  _phone text,
  _email text,
  _service text,
  _notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _slot record;
  _booking_id uuid;
BEGIN
  -- Validate inputs
  IF length(trim(_name)) < 2 OR length(_name) > 100 THEN
    RAISE EXCEPTION 'Vigane nimi';
  END IF;
  IF length(trim(_phone)) < 5 OR length(_phone) > 30 THEN
    RAISE EXCEPTION 'Vigane telefoninumber';
  END IF;
  IF _email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_email) > 255 THEN
    RAISE EXCEPTION 'Vigane e-posti aadress';
  END IF;
  IF length(trim(_service)) < 1 OR length(_service) > 100 THEN
    RAISE EXCEPTION 'Vigane teenus';
  END IF;
  IF _notes IS NOT NULL AND length(_notes) > 1000 THEN
    RAISE EXCEPTION 'Märkused liiga pikad';
  END IF;

  -- Lock the slot row
  SELECT * INTO _slot FROM public.time_slots WHERE id = _slot_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aega ei leitud';
  END IF;
  IF _slot.is_booked THEN
    RAISE EXCEPTION 'See aeg on juba broneeritud';
  END IF;

  -- Insert booking
  INSERT INTO public.bookings (name, phone, email, service, booking_date, booking_time, notes, time_slot_id)
  VALUES (trim(_name), trim(_phone), trim(_email), trim(_service), _slot.slot_date, _slot.slot_time, _notes, _slot.id)
  RETURNING id INTO _booking_id;

  -- Mark slot booked
  UPDATE public.time_slots
  SET is_booked = true, booking_id = _booking_id
  WHERE id = _slot.id;

  RETURN _booking_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_slot(uuid, text, text, text, text, text) TO anon, authenticated;
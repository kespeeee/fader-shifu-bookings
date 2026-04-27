
-- Add validation constraints on bookings (length limits, basic email shape)
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_name_len CHECK (char_length(name) BETWEEN 1 AND 100),
  ADD CONSTRAINT bookings_phone_len CHECK (char_length(phone) BETWEEN 3 AND 30),
  ADD CONSTRAINT bookings_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  ADD CONSTRAINT bookings_email_shape CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  ADD CONSTRAINT bookings_service_len CHECK (char_length(service) BETWEEN 1 AND 100),
  ADD CONSTRAINT bookings_notes_len CHECK (notes IS NULL OR char_length(notes) <= 1000);

-- Lock down has_role: only let it be called server-side (service_role), not by anon/authenticated directly
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

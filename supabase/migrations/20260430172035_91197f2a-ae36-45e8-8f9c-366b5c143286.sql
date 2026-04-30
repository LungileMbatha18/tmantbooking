-- Recreate view with security_invoker to enforce caller's RLS, not creator's
DROP VIEW IF EXISTS public.booked_slots;
CREATE VIEW public.booked_slots
WITH (security_invoker = true) AS
  SELECT id, event_date, start_time, end_time, status
  FROM public.bookings
  WHERE status IN ('pending','confirmed');

-- Allow anon/authenticated to read availability (date/time only) via the view
CREATE POLICY "Public can read availability"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (status IN ('pending','confirmed'));

GRANT SELECT ON public.booked_slots TO anon, authenticated;
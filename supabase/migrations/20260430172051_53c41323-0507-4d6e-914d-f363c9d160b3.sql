DROP POLICY IF EXISTS "Public can read availability" ON public.bookings;
DROP VIEW IF EXISTS public.booked_slots;

CREATE OR REPLACE FUNCTION public.get_booked_slots()
RETURNS TABLE (event_date DATE, start_time TIME, end_time TIME)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT event_date, start_time, end_time
  FROM public.bookings
  WHERE status IN ('pending','confirmed');
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots() TO anon, authenticated;
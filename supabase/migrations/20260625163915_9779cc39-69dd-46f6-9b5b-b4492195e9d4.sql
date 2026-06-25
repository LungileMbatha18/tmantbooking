-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Mixtapes
CREATE TABLE public.mixtapes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  audio_path text NOT NULL,
  cover_path text,
  duration_seconds integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.mixtapes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mixtapes TO authenticated;
GRANT ALL ON public.mixtapes TO service_role;

ALTER TABLE public.mixtapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mixtapes" ON public.mixtapes
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert mixtapes" ON public.mixtapes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update mixtapes" ON public.mixtapes
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete mixtapes" ON public.mixtapes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_mixtapes_updated_at
BEFORE UPDATE ON public.mixtapes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies (buckets created via tool)
CREATE POLICY "Public can read mixtape audio"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'mixtapes');

CREATE POLICY "Admins can upload mixtape audio"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'mixtapes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update mixtape audio"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'mixtapes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete mixtape audio"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'mixtapes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read mixtape covers"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'mixtape-covers');

CREATE POLICY "Admins can upload mixtape covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'mixtape-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update mixtape covers"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'mixtape-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete mixtape covers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'mixtape-covers' AND public.has_role(auth.uid(), 'admin'));

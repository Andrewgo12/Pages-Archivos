-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_user_storage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_profiles 
    SET storage_used = storage_used + NEW.file_size
    WHERE id = NEW.owner_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_profiles 
    SET storage_used = storage_used - OLD.file_size
    WHERE id = OLD.owner_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for storage usage
CREATE TRIGGER update_storage_trigger
  AFTER INSERT OR DELETE ON public.files
  FOR EACH ROW EXECUTE FUNCTION update_user_storage();

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(file_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.files 
  SET download_count = download_count + 1
  WHERE id = file_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

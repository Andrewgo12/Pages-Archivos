-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 2147483648, -- 2GB default
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, parent_id, owner_id)
);

-- Create files table
CREATE TABLE IF NOT EXISTS public.files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  blob_url TEXT NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  download_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file shares table
CREATE TABLE IF NOT EXISTS public.file_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  shared_with UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  share_token VARCHAR(255) UNIQUE,
  permissions VARCHAR(20) DEFAULT 'view', -- 'view', 'download', 'edit'
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file comments table
CREATE TABLE IF NOT EXISTS public.file_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create download logs table
CREATE TABLE IF NOT EXISTS public.download_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID REFERENCES public.files(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for folders
CREATE POLICY "Users can manage own folders" ON public.folders
  FOR ALL USING (auth.uid() = owner_id);

-- Create policies for files
CREATE POLICY "Users can manage own files" ON public.files
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can view public files" ON public.files
  FOR SELECT USING (is_public = true);

-- Create policies for file_shares
CREATE POLICY "Users can manage shares they created" ON public.file_shares
  FOR ALL USING (auth.uid() = shared_by);

CREATE POLICY "Users can view shares made to them" ON public.file_shares
  FOR SELECT USING (auth.uid() = shared_with);

-- Create policies for file_comments
CREATE POLICY "Users can manage own comments" ON public.file_comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view comments on accessible files" ON public.file_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.files f 
      WHERE f.id = file_id 
      AND (f.owner_id = auth.uid() OR f.is_public = true)
    )
  );

-- Create policies for download_logs
CREATE POLICY "Users can view download logs for own files" ON public.download_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.files f 
      WHERE f.id = file_id 
      AND f.owner_id = auth.uid()
    )
  );

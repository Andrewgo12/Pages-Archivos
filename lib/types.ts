export interface UserProfile {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  storage_used: number
  storage_limit: number
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  name: string
  parent_id?: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface FileItem {
  id: string
  name: string
  original_name: string
  file_type: string
  file_size: number
  blob_url: string
  folder_id?: string
  owner_id: string
  download_count: number
  is_public: boolean
  description?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface FileShare {
  id: string
  file_id: string
  shared_by: string
  shared_with?: string
  share_token?: string
  permissions: "view" | "download" | "edit"
  expires_at?: string
  created_at: string
}

export interface FileComment {
  id: string
  file_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user_profiles?: UserProfile
}

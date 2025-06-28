export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "admin" | "user" | "viewer"
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
  subscription?: {
    plan: "free" | "pro" | "enterprise"
    expiresAt?: Date
  }
}

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  url?: string
  thumbnailUrl?: string
  lastModified: Date
  createdAt?: Date
  ownerId: string
  parentId?: string | null
  isFolder?: boolean
  isStarred?: boolean
  isShared?: boolean
  sharedWith?: string[]
  tags?: string[]
  description?: string
  version?: number
  checksum?: string
  downloadCount?: number
  viewCount?: number
  shareCount?: number
  permissions?: {
    canView: boolean
    canEdit: boolean
    canDelete: boolean
    canShare: boolean
  }
  metadata?: {
    width?: number
    height?: number
    duration?: number
    pages?: number
    [key: string]: any
  }
}

export interface FolderItem extends FileItem {
  isFolder: true
  children?: FileItem[]
  childCount?: number
}

export interface BreadcrumbItem {
  id: string | null
  name: string
  path: string
}

export interface ShareLink {
  id: string
  fileId: string
  token: string
  expiresAt?: Date
  password?: string
  downloadLimit?: number
  downloadCount: number
  isActive: boolean
  createdAt: Date
  createdBy: string
  permissions: {
    canView: boolean
    canDownload: boolean
    canComment: boolean
  }
}

export interface Comment {
  id: string
  fileId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: Date
  updatedAt?: Date
  parentId?: string
  replies?: Comment[]
  isResolved?: boolean
  mentions?: string[]
  attachments?: string[]
}

export interface FileVersion {
  id: string
  fileId: string
  version: number
  size: number
  url: string
  uploadedBy: string
  uploadedAt: Date
  comment?: string
  checksum: string
  isActive?: boolean
}

export interface Activity {
  id: string
  type: "upload" | "download" | "share" | "delete" | "rename" | "move" | "copy" | "comment" | "version"
  userId: string
  userName: string
  userAvatar?: string
  fileId?: string
  fileName?: string
  folderId?: string
  folderName?: string
  description: string
  metadata?: Record<string, any>
  createdAt: Date
  ipAddress?: string
  userAgent?: string
}

export interface Team {
  id: string
  name: string
  description?: string
  ownerId: string
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
  settings: {
    allowInvites: boolean
    defaultRole: "viewer" | "editor" | "admin"
    requireApproval: boolean
  }
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: Date
  invitedBy?: string
  isActive: boolean
  permissions: {
    canUpload: boolean
    canDelete: boolean
    canShare: boolean
    canInvite: boolean
    canManageTeam: boolean
  }
}

export interface Backup {
  id: string
  name: string
  description?: string
  type: "manual" | "scheduled" | "automatic"
  status: "pending" | "running" | "completed" | "failed" | "cancelled"
  progress: number
  fileCount: number
  totalSize: number
  completedSize: number
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
  schedule?: {
    frequency: "daily" | "weekly" | "monthly"
    time: string
    daysOfWeek?: number[]
    dayOfMonth?: number
  }
  retention: {
    keepDays: number
    maxBackups: number
  }
  destination: {
    type: "local" | "cloud" | "external"
    path: string
    credentials?: Record<string, any>
  }
}

export interface SecurityEvent {
  id: string
  type: "login" | "logout" | "failed_login" | "password_change" | "2fa_enabled" | "2fa_disabled" | "suspicious_activity"
  userId: string
  userName: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  ipAddress: string
  userAgent: string
  location?: {
    country: string
    city: string
    coordinates?: [number, number]
  }
  createdAt: Date
  resolved?: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

export interface Integration {
  id: string
  name: string
  type: "storage" | "productivity" | "communication" | "security" | "analytics"
  status: "connected" | "disconnected" | "error" | "pending"
  config: Record<string, any>
  lastSync?: Date
  syncStatus?: "idle" | "syncing" | "error"
  createdAt: Date
  updatedAt: Date
}

export interface Workflow {
  id: string
  name: string
  description: string
  isActive: boolean
  trigger: {
    type: string
    config: Record<string, any>
  }
  actions: Array<{
    type: string
    config: Record<string, any>
  }>
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  runCount: number
  successCount: number
  errorCount: number
}

export interface Notification {
  id: string
  userId: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UploadProgress {
  fileId: string
  fileName: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

export interface SearchFilters {
  type?: string[]
  size?: {
    min?: number
    max?: number
  }
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  owner?: string[]
  shared?: boolean
  starred?: boolean
}

export interface SortOption {
  field: "name" | "size" | "lastModified" | "type" | "owner"
  direction: "asc" | "desc"
}

export interface ViewSettings {
  mode: "grid" | "list" | "gallery"
  itemsPerPage: number
  showHidden: boolean
  groupBy?: "type" | "date" | "size" | "owner"
}

export interface StorageQuota {
  used: number
  total: number
  percentage: number
  breakdown: {
    files: number
    images: number
    videos: number
    documents: number
    other: number
  }
}

export interface SystemSettings {
  maxFileSize: number
  allowedFileTypes: string[]
  enableVersioning: boolean
  versionRetention: number
  enableThumbnails: boolean
  enablePreview: boolean
  enableSharing: boolean
  enableComments: boolean
  enableActivity: boolean
  enableNotifications: boolean
  maintenanceMode: boolean
  registrationEnabled: boolean
  inviteOnly: boolean
}

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatFileSize } from "@/lib/utils/file"
import type { FileItem, UserProfile, Folder } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import FileUpload from "./file-upload"
import FileList from "./file-list"
import FolderList from "./folder-list"
import UserNav from "./user-nav"
import { Cloud, Files, FolderOpen, Upload, BarChart3 } from "lucide-react"

interface DashboardContentProps {
  user: User
  profile: UserProfile | null
}

export default function DashboardContent({ user, profile }: DashboardContentProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLimit, setStorageLimit] = useState(2147483648) // 2GB
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [currentFolder])

  const fetchData = async () => {
    setLoading(true)

    // Fetch files
    const { data: filesData } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", currentFolder)
      .order("created_at", { ascending: false })

    // Fetch folders
    const { data: foldersData } = await supabase
      .from("folders")
      .select("*")
      .eq("parent_id", currentFolder)
      .order("name")

    // Fetch updated profile for storage info
    const { data: profileData } = await supabase
      .from("user_profiles")
      .select("storage_used, storage_limit")
      .eq("id", user.id)
      .single()

    setFiles(filesData || [])
    setFolders(foldersData || [])
    if (profileData) {
      setStorageUsed(profileData.storage_used)
      setStorageLimit(profileData.storage_limit)
    }
    setLoading(false)
  }

  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Cloud className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">CloudVault</h1>
            </div>
            <UserNav user={user} profile={profile} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <Files className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{files.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{folders.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatFileSize(storageUsed)}</div>
                <p className="text-xs text-muted-foreground">of {formatFileSize(storageLimit)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Progress value={storagePercentage} className="mb-2" />
                <p className="text-xs text-muted-foreground">{storagePercentage.toFixed(1)}% used</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="files" className="space-y-4">
            <TabsList>
              <TabsTrigger value="files">Files & Folders</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>File Manager</CardTitle>
                  <CardDescription>Manage your files and folders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FolderList
                      folders={folders}
                      currentFolder={currentFolder}
                      onFolderClick={setCurrentFolder}
                      onRefresh={fetchData}
                    />
                    <FileList files={files} loading={loading} onRefresh={fetchData} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Files</CardTitle>
                  <CardDescription>Upload files to your cloud storage</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload currentFolder={currentFolder} onUploadComplete={fetchData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shared">
              <Card>
                <CardHeader>
                  <CardTitle>Shared Files</CardTitle>
                  <CardDescription>Files shared with you and by you</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Shared files feature coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

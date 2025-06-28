"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Share2, Users, Link, Clock, Eye, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { FileGrid } from "@/components/files/FileGrid"
import { FileList } from "@/components/files/FileList"
import { formatDate } from "@/lib/utils"
import type { ShareLink } from "@/types"

// Mock shared files and links
const mockSharedFiles = [
  {
    id: "shared1",
    name: "Team Presentation.pptx",
    size: 15728640,
    type: "application/vnd.ms-powerpoint",
    lastModified: new Date("2024-01-15"),
    isFolder: false,
    isShared: true,
    sharedWith: ["user2", "user3"],
    tags: ["work", "presentation"],
    path: "/",
  },
  {
    id: "shared2",
    name: "Project Assets",
    size: 0,
    type: "folder",
    lastModified: new Date("2024-01-14"),
    isFolder: true,
    isShared: true,
    sharedWith: ["team1"],
    path: "/",
  },
]

const mockShareLinks: ShareLink[] = [
  {
    id: "link1",
    fileId: "shared1",
    token: "abc123def456",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    downloadLimit: 10,
    downloadCount: 3,
    createdBy: "user1",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isActive: true,
  },
  {
    id: "link2",
    fileId: "shared2",
    token: "xyz789uvw012",
    downloadCount: 0,
    createdBy: "user1",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isActive: true,
  },
]

export const SharedPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [shareLinks] = useState<ShareLink[]>(mockShareLinks)

  const handleFileClick = (file: any) => {
    console.log("Shared file clicked:", file)
  }

  const handleFileAction = (action: string, file: any) => {
    console.log("Shared file action:", action, file)
  }

  const copyShareLink = async (token: string) => {
    const url = `${window.location.origin}/shared/${token}`
    await navigator.clipboard.writeText(url)
    // Show toast notification
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shared Files</h1>
        <p className="text-gray-600 dark:text-gray-400">Files you've shared and files shared with you</p>
      </div>

      <Tabs defaultValue="shared-with-me" className="space-y-6">
        <TabsList>
          <TabsTrigger value="shared-with-me" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Shared with Me
          </TabsTrigger>
          <TabsTrigger value="shared-by-me" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Shared by Me
          </TabsTrigger>
          <TabsTrigger value="public-links" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Public Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shared-with-me">
          <Card>
            <CardHeader>
              <CardTitle>Files Shared with You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No shared files</h3>
                <p className="text-gray-600 dark:text-gray-400">Files shared with you will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shared-by-me">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Files You've Shared</h2>
                <p className="text-gray-600 dark:text-gray-400">{mockSharedFiles.length} shared items</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <FileGrid files={mockSharedFiles} onFileClick={handleFileClick} onFileAction={handleFileAction} />
            ) : (
              <FileList
                files={mockSharedFiles}
                onFileClick={handleFileClick}
                onFileAction={handleFileAction}
                sortField="name"
                sortDirection="asc"
                onSort={() => {}}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="public-links">
          <Card>
            <CardHeader>
              <CardTitle>Public Share Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shareLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link className="w-4 h-4 text-primary-600" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Share Link #{link.id}</span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              link.isActive
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {link.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created {formatDate(link.createdAt)}
                          </div>
                          {link.expiresAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires {formatDate(link.expiresAt)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {link.downloadCount} downloads
                            {link.downloadLimit && ` / ${link.downloadLimit}`}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Public access
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyShareLink(link.token)}>
                          Copy Link
                        </Button>
                        <Button variant="outline" size="sm">
                          Settings
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {shareLinks.length === 0 && (
                  <div className="text-center py-12">
                    <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No public links</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create public share links to share files with anyone
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

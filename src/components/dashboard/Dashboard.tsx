"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, FolderPlus, TrendingUp, Users, Shield, HardDrive, Star, Clock, Download } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { FileGrid } from "@/components/files/FileGrid"
import type { FileItem } from "@/types"

// Mock data
const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Project Presentation.pptx",
    size: 15728640,
    type: "application/vnd.ms-powerpoint",
    lastModified: new Date("2024-01-15"),
    isFolder: false,
    isStarred: true,
    tags: ["work", "presentation"],
  },
  {
    id: "2",
    name: "Design Assets",
    size: 0,
    type: "folder",
    lastModified: new Date("2024-01-14"),
    isFolder: true,
    isShared: true,
  },
  {
    id: "3",
    name: "vacation-photos.zip",
    size: 524288000,
    type: "application/zip",
    lastModified: new Date("2024-01-13"),
    isFolder: false,
    tags: ["personal", "photos"],
  },
  {
    id: "4",
    name: "Budget 2024.xlsx",
    size: 2097152,
    type: "application/vnd.ms-excel",
    lastModified: new Date("2024-01-12"),
    isFolder: false,
    isStarred: true,
    tags: ["finance"],
  },
]

const stats = [
  {
    title: "Total Files",
    value: "1,247",
    change: "+12%",
    icon: HardDrive,
    color: "text-blue-600",
  },
  {
    title: "Storage Used",
    value: "2.4 GB",
    change: "+5%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Shared Files",
    value: "89",
    change: "+23%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Downloads",
    value: "456",
    change: "+8%",
    icon: Download,
    color: "text-orange-600",
  },
]

export const Dashboard: React.FC = () => {
  const [recentFiles] = useState(mockFiles.slice(0, 8))
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleFileClick = (file: FileItem) => {
    console.log("File clicked:", file)
  }

  const handleFileAction = (action: string, file: FileItem) => {
    console.log("File action:", action, file)
  }

  return (
    <div className="container-responsive space-responsive">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-primary-100 mb-4 sm:mb-6 text-sm sm:text-base">
            You have 12 new files and 3 shared folders waiting for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button variant="secondary" icon={<Upload className="w-4 h-4" />} size={isMobile ? "md" : "lg"}>
              Upload Files
            </Button>
            <Button
              variant="outline"
              icon={<FolderPlus className="w-4 h-4 bg-transparent" />}
              className="border-white/20 text-white hover:bg-white/10"
              size={isMobile ? "md" : "lg"}
            >
              New Folder
            </Button>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 sm:top-10 right-4 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full" />
          <div className="absolute bottom-4 sm:bottom-10 right-16 sm:right-32 w-8 h-8 sm:w-20 sm:h-20 bg-white rounded-full" />
          <div className="absolute top-16 sm:top-32 right-24 sm:right-48 w-6 h-6 sm:w-16 sm:h-16 bg-white rounded-full" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card gradient hover>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color} flex-shrink-0`}>
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card gradient>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Storage Overview</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your storage usage across different file types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Storage</span>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">2.4 GB of 15 GB used</span>
                </div>
                <Progress value={16} showLabel color="primary" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
                        <span className="text-sm truncate">Documents</span>
                      </div>
                      <span className="text-sm font-medium">1.2 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                        <span className="text-sm truncate">Images</span>
                      </div>
                      <span className="text-sm font-medium">800 MB</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0" />
                        <span className="text-sm truncate">Videos</span>
                      </div>
                      <span className="text-sm font-medium">300 MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0" />
                        <span className="text-sm truncate">Others</span>
                      </div>
                      <span className="text-sm font-medium">100 MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <Card gradient>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-sm sm:text-base"
                icon={<Upload className="w-4 h-4" />}
              >
                Upload Files
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-sm sm:text-base"
                icon={<FolderPlus className="w-4 h-4" />}
              >
                Create Folder
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-sm sm:text-base"
                icon={<Star className="w-4 h-4" />}
              >
                View Starred
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent text-sm sm:text-base"
                icon={<Clock className="w-4 h-4" />}
              >
                Recent Activity
              </Button>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card gradient>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Two-Factor Auth</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Encryption</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Files */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card gradient>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl">Recent Files</CardTitle>
                <CardDescription className="text-sm sm:text-base">Files you've worked on recently</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FileGrid files={recentFiles} onFileClick={handleFileClick} onFileAction={handleFileAction} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

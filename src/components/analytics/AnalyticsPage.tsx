"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  Eye,
  Share2,
  RefreshCw,
  FileText,
  ImageIcon,
  Video,
  Music,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { formatFileSize, formatDate } from "@/lib/utils"

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalFiles: 1247,
    totalSize: 15728640000, // ~15GB
    totalDownloads: 3456,
    totalViews: 12890,
    totalShares: 234,
    activeUsers: 89,
  },
  fileTypes: [
    { type: "Images", count: 456, size: 8589934592, color: "bg-blue-500" },
    { type: "Documents", count: 234, size: 4294967296, color: "bg-green-500" },
    { type: "Videos", count: 89, size: 2147483648, color: "bg-purple-500" },
    { type: "Audio", count: 123, size: 1073741824, color: "bg-orange-500" },
    { type: "Other", count: 345, size: 536870912, color: "bg-gray-500" },
  ],
  topFiles: [
    {
      id: "1",
      name: "Project_Presentation.pptx",
      type: "presentation",
      downloads: 234,
      views: 1456,
      shares: 45,
      size: 15728640,
    },
    {
      id: "2",
      name: "Team_Photo.jpg",
      type: "image",
      downloads: 189,
      views: 2341,
      shares: 67,
      size: 5242880,
    },
    {
      id: "3",
      name: "Marketing_Video.mp4",
      type: "video",
      downloads: 156,
      views: 3456,
      shares: 89,
      size: 104857600,
    },
  ],
  activityTrend: [
    { date: "2024-01-01", uploads: 45, downloads: 123, views: 456 },
    { date: "2024-01-02", uploads: 52, downloads: 145, views: 523 },
    { date: "2024-01-03", uploads: 38, downloads: 167, views: 612 },
    { date: "2024-01-04", uploads: 61, downloads: 189, views: 734 },
    { date: "2024-01-05", uploads: 47, downloads: 201, views: 845 },
    { date: "2024-01-06", uploads: 55, downloads: 178, views: 692 },
    { date: "2024-01-07", uploads: 43, downloads: 156, views: 578 },
  ],
  userActivity: [
    { user: "John Doe", uploads: 45, downloads: 123, lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { user: "Jane Smith", uploads: 38, downloads: 98, lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { user: "Mike Johnson", uploads: 52, downloads: 156, lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { user: "Sarah Wilson", uploads: 29, downloads: 87, lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  ],
}

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  const getFileTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "images":
        return <ImageIcon className="w-5 h-5" />
      case "videos":
        return <Video className="w-5 h-5" />
      case "audio":
        return <Music className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics & Insights</h1>
          <p className="text-gray-600 dark:text-gray-400">Track usage patterns and file performance</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button onClick={handleRefresh} loading={refreshing} icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-blue-600">{mockAnalytics.overview.totalFiles.toLocaleString()}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-green-600">{formatFileSize(mockAnalytics.overview.totalSize)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                <p className="text-2xl font-bold text-purple-600">
                  {mockAnalytics.overview.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Views</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockAnalytics.overview.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shares</p>
                <p className="text-2xl font-bold text-pink-600">{mockAnalytics.overview.totalShares}</p>
              </div>
              <Share2 className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-indigo-600">{mockAnalytics.overview.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">File Analytics</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Storage by File Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.fileTypes.map((fileType, index) => (
                    <motion.div
                      key={fileType.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileTypeIcon(fileType.type)}
                          <span className="font-medium text-gray-900 dark:text-gray-100">{fileType.type}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatFileSize(fileType.size)}</p>
                          <p className="text-xs text-gray-500">{fileType.count} files</p>
                        </div>
                      </div>
                      <Progress
                        value={(fileType.size / mockAnalytics.overview.totalSize) * 100}
                        className="h-2"
                        color={fileType.color.replace("bg-", "")}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 flex items-end justify-between gap-2">
                    {mockAnalytics.activityTrend.map((day, index) => (
                      <motion.div
                        key={day.date}
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.views / 1000) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-sm min-h-[20px]"
                        title={`${day.views} views on ${day.date}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    {mockAnalytics.activityTrend.map((day) => (
                      <span key={day.date}>{new Date(day.date).getDate()}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        {getFileTypeIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{file.views}</p>
                        <p className="text-gray-500">Views</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{file.downloads}</p>
                        <p className="text-gray-500">Downloads</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{file.shares}</p>
                        <p className="text-gray-500">Shares</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.userActivity.map((user, index) => (
                  <motion.div
                    key={user.user}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.user}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Last active {formatDate(user.lastActive)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.uploads}</p>
                        <p className="text-gray-500">Uploads</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.downloads}</p>
                        <p className="text-gray-500">Downloads</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">File Growth</p>
                      <p className="text-2xl font-bold text-green-600">+12.5%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Storage Growth</p>
                      <p className="text-2xl font-bold text-blue-600">+8.3%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">User Engagement</p>
                      <p className="text-2xl font-bold text-purple-600">+15.7%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">9:00 AM - 11:00 AM</span>
                    <div className="flex-1 mx-4">
                      <Progress value={85} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">2:00 PM - 4:00 PM</span>
                    <div className="flex-1 mx-4">
                      <Progress value={72} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">7:00 PM - 9:00 PM</span>
                    <div className="flex-1 mx-4">
                      <Progress value={45} className="h-2" />
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

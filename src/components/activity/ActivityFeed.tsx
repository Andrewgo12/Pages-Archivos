"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Upload, Download, Share2, MessageCircle, Trash2, Edit, GitBranch, Clock, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { formatDate } from "@/lib/utils"
import type { Activity } from "@/types"
import { useActivity } from "@/hooks/useActivity"

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "upload":
      return <Upload className="w-4 h-4 text-green-600" />
    case "download":
      return <Download className="w-4 h-4 text-blue-600" />
    case "share":
      return <Share2 className="w-4 h-4 text-purple-600" />
    case "comment":
      return <MessageCircle className="w-4 h-4 text-orange-600" />
    case "rename":
      return <Edit className="w-4 h-4 text-yellow-600" />
    case "delete":
      return <Trash2 className="w-4 h-4 text-red-600" />
    case "version":
      return <GitBranch className="w-4 h-4 text-indigo-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

interface ActivityFeedProps {
  limit?: number
  showHeader?: boolean
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit, showHeader = true }) => {
  const { activities, loading } = useActivity()

  const displayActivities = limit ? activities.slice(0, limit) : activities

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {activity.userAvatar ? (
                      <img
                        src={activity.userAvatar || "/placeholder.svg"}
                        alt={activity.userName}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{activity.userName}</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{activity.description}</p>

                  <p className="text-xs text-gray-500 dark:text-gray-500">{formatDate(activity.createdAt)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  HardDrive,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  Database,
  Cloud,
  Shield,
  RotateCcw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import { formatFileSize, formatDate } from "@/lib/utils"
import type { BackupJob } from "@/types"

// Mock backup data
const mockBackupJobs: BackupJob[] = [
  {
    id: "backup1",
    name: "Daily Full Backup",
    description: "Complete backup of all files and folders",
    schedule: "0 2 * * *", // Daily at 2 AM
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: "active",
    includePatterns: ["*"],
    excludePatterns: ["*.tmp", "*.log"],
    destination: "cloud-storage",
    retentionDays: 30,
  },
  {
    id: "backup2",
    name: "Weekly Archive",
    description: "Weekly backup for long-term storage",
    schedule: "0 3 * * 0", // Weekly on Sunday at 3 AM
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active",
    includePatterns: ["*.pdf", "*.docx", "*.xlsx"],
    excludePatterns: [],
    destination: "external-drive",
    retentionDays: 365,
  },
]

const mockBackupHistory = [
  {
    id: "history1",
    jobId: "backup1",
    jobName: "Daily Full Backup",
    startTime: new Date(Date.now() - 25 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "completed",
    filesBackedUp: 1247,
    totalSize: 2580000000,
    duration: 3600, // 1 hour in seconds
  },
  {
    id: "history2",
    jobId: "backup2",
    jobName: "Weekly Archive",
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
    status: "completed",
    filesBackedUp: 89,
    totalSize: 450000000,
    duration: 1800, // 30 minutes
  },
  {
    id: "history3",
    jobId: "backup1",
    jobName: "Daily Full Backup",
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    endTime: null,
    status: "failed",
    filesBackedUp: 0,
    totalSize: 0,
    duration: 0,
    error: "Network connection timeout",
  },
]

export const BackupPage: React.FC = () => {
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>(mockBackupJobs)
  const [backupHistory] = useState(mockBackupHistory)
  const [currentBackup, setCurrentBackup] = useState<{
    isRunning: boolean
    progress: number
    currentFile: string
  }>({
    isRunning: false,
    progress: 0,
    currentFile: "",
  })
  const { addToast } = useToast()

  const handleRunBackup = async (jobId: string) => {
    setCurrentBackup({
      isRunning: true,
      progress: 0,
      currentFile: "Initializing backup...",
    })

    try {
      // Simulate backup progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setCurrentBackup({
          isRunning: true,
          progress: i,
          currentFile: `Backing up file ${Math.floor(i / 10) + 1}/10...`,
        })
      }

      setCurrentBackup({
        isRunning: false,
        progress: 100,
        currentFile: "Backup completed successfully",
      })

      addToast({
        type: "success",
        title: "Backup completed",
        description: "Your files have been backed up successfully.",
      })
    } catch (error) {
      setCurrentBackup({
        isRunning: false,
        progress: 0,
        currentFile: "",
      })

      addToast({
        type: "error",
        title: "Backup failed",
        description: "Failed to complete backup. Please try again.",
      })
    }
  }

  const handleToggleJob = async (jobId: string) => {
    setBackupJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: job.status === "active" ? "paused" : "active" } : job)),
    )

    addToast({
      type: "success",
      title: "Backup job updated",
      description: "The backup job status has been changed.",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Backup & Recovery</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your data backups and recovery options</p>
      </div>

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Backup</p>
                <p className="text-2xl font-bold text-green-600">24h ago</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Backup Size</p>
                <p className="text-2xl font-bold text-blue-600">2.4 GB</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {backupJobs.filter((j) => j.status === "active").length}
                </p>
              </div>
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recovery Points</p>
                <p className="text-2xl font-bold text-orange-600">15</p>
              </div>
              <RotateCcw className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Backup Progress */}
      {currentBackup.isRunning && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Backup in Progress</h3>
              <span className="text-sm text-blue-700 dark:text-blue-300">{currentBackup.progress}%</span>
            </div>
            <Progress value={currentBackup.progress} className="mb-2" />
            <p className="text-sm text-blue-700 dark:text-blue-300">{currentBackup.currentFile}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
          <TabsTrigger value="history">Backup History</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Backup Jobs</h2>
              <Button variant="primary">Create New Job</Button>
            </div>

            <div className="space-y-4">
              {backupJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{job.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                job.status === "active"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{job.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Last Run</p>
                              <p className="font-medium">{job.lastRun ? formatDate(job.lastRun) : "Never"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Next Run</p>
                              <p className="font-medium">{job.nextRun ? formatDate(job.nextRun) : "Not scheduled"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Destination</p>
                              <p className="font-medium capitalize">{job.destination.replace("-", " ")}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Retention</p>
                              <p className="font-medium">{job.retentionDays} days</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRunBackup(job.id)}
                            disabled={currentBackup.isRunning}
                            icon={<Play className="w-4 h-4" />}
                          >
                            Run Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleJob(job.id)}
                            icon={
                              job.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />
                            }
                          >
                            {job.status === "active" ? "Pause" : "Resume"}
                          </Button>
                          <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4 bg-transparent" />}>
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup, index) => (
                  <motion.div
                    key={backup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {getStatusIcon(backup.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{backup.jobName}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatDate(backup.startTime)}</span>
                          {backup.status === "completed" && (
                            <>
                              <span>{backup.filesBackedUp} files</span>
                              <span>{formatFileSize(backup.totalSize)}</span>
                              <span>{formatDuration(backup.duration)}</span>
                            </>
                          )}
                          {backup.status === "failed" && backup.error && (
                            <span className="text-red-600 dark:text-red-400">{backup.error}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {backup.status === "completed" && (
                        <Button variant="outline" size="sm" icon={<Download className="w-4 h-4 bg-transparent" />}>
                          Download
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Point-in-Time Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Restore your files to a specific point in time from available backup snapshots.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recovery Point</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <option>Today 02:00 AM (Latest)</option>
                      <option>Yesterday 02:00 AM</option>
                      <option>2 days ago 02:00 AM</option>
                      <option>1 week ago (Archive)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Recovery Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                      <option>Full Recovery</option>
                      <option>Selective Recovery</option>
                      <option>Folder Recovery</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" icon={<RotateCcw className="w-4 h-4" />}>
                    Start Recovery
                  </Button>
                  <Button variant="outline">Preview Files</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Recovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Emergency Recovery Mode</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Use this option if you've lost access to your account or need to recover from a catastrophic
                        failure.
                      </p>
                    </div>
                  </div>
                </div>

                <Button variant="destructive" icon={<Shield className="w-4 h-4" />}>
                  Initiate Emergency Recovery
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Automatic Backups</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable automatic daily backups</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Backup Compression</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compress backups to save storage space</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Backup Verification</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Verify backup integrity after completion</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Default Retention Period</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Destinations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cloud className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cloud Storage</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Secure cloud backup storage</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HardDrive className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">External Drive</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Local external storage device</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
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

"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Key,
  Smartphone,
  AlertTriangle,
  Eye,
  Download,
  Clock,
  MapPin,
  Monitor,
  Wifi,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import { formatDate } from "@/lib/utils"
import type { SecurityEvent } from "@/types"

// Mock security data
const mockSecurityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "login",
    userId: "user1",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    description: "Successful login from Chrome on Windows",
    severity: "low",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    resolved: true,
  },
  {
    id: "2",
    type: "failed_login",
    ipAddress: "203.0.113.42",
    userAgent: "Unknown",
    description: "Failed login attempt from unknown location",
    severity: "medium",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    resolved: false,
  },
  {
    id: "3",
    type: "suspicious_activity",
    userId: "user1",
    ipAddress: "198.51.100.25",
    userAgent: "Bot/1.0",
    description: "Multiple rapid file access attempts detected",
    severity: "high",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: false,
  },
]

const mockActiveSessions = [
  {
    id: "session1",
    device: "Chrome on Windows",
    location: "New York, US",
    ipAddress: "192.168.1.100",
    lastActive: new Date(),
    isCurrent: true,
  },
  {
    id: "session2",
    device: "Safari on iPhone",
    location: "New York, US",
    ipAddress: "192.168.1.101",
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isCurrent: false,
  },
  {
    id: "session3",
    device: "Firefox on Linux",
    location: "San Francisco, US",
    ipAddress: "203.0.113.15",
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isCurrent: false,
  },
]

export const SecurityPage: React.FC = () => {
  const [securityEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
  const [activeSessions, setActiveSessions] = useState(mockActiveSessions)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleEnable2FA = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setTwoFactorEnabled(true)
      addToast({
        type: "success",
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to enable 2FA",
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId))
      addToast({
        type: "success",
        title: "Session revoked",
        description: "The session has been successfully terminated.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to revoke session",
        description: "Please try again later.",
      })
    }
  }

  const getSeverityColor = (severity: SecurityEvent["severity"]) => {
    switch (severity) {
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400"
      case "high":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-400"
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getEventIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "login":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed_login":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "file_access":
        return <Eye className="w-4 h-4 text-blue-600" />
      case "permission_change":
        return <Key className="w-4 h-4 text-purple-600" />
      case "suspicious_activity":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Shield className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Security Center</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage your account security</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-green-600">85/100</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{activeSessions.length}</p>
              </div>
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">2FA Status</p>
                <p className="text-2xl font-bold text-orange-600">{twoFactorEnabled ? "Enabled" : "Disabled"}</p>
              </div>
              <Smartphone className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Threats Blocked</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Enable Two-Factor Authentication
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleEnable2FA} loading={loading}>
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Strong Password</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your password meets security requirements
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Backup Your Data</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Regular backups are configured</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="authentication">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        twoFactorEnabled ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Smartphone
                        className={`w-6 h-6 ${
                          twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Authenticator App</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {twoFactorEnabled ? "Two-factor authentication is enabled" : "Use an authenticator app for 2FA"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={twoFactorEnabled ? "outline" : "primary"}
                    onClick={handleEnable2FA}
                    loading={loading}
                  >
                    {twoFactorEnabled ? "Manage" : "Enable"}
                  </Button>
                </div>

                {twoFactorEnabled && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Backup Codes</h4>
                    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
                      <div>1234-5678</div>
                      <div>9876-5432</div>
                      <div>1111-2222</div>
                      <div>3333-4444</div>
                      <div>5555-6666</div>
                      <div>7777-8888</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Save these backup codes in a safe place. You can use them to access your account if you lose your
                      authenticator device.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Password Strength</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Strength</span>
                    <span className="text-green-600">Strong</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{session.device}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3" />
                            {session.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(session.lastActive)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.isCurrent ? (
                        <span className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                          Current Session
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleRevokeSession(session.id)}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{event.ipAddress}</span>
                          <span>{formatDate(event.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                      {!event.resolved && (
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Login Notifications</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new login attempts</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Suspicious Activity Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alert me of unusual account activity</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Auto-lock Sessions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically lock inactive sessions</p>
                  </div>
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Encryption</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Files Encrypted</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        All files are encrypted at rest and in transit
                      </p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">End-to-End Encryption</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enable client-side encryption for maximum security
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

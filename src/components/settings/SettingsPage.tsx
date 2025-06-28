"use client"

import type React from "react"
import { useState } from "react"
import {
  User,
  Bell,
  Shield,
  Palette,
  HardDrive,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Key,
  Smartphone,
  Mail,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/Toast"
import { formatFileSize } from "@/lib/utils"

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  })

  const [preferences, setPreferences] = useState(
    user?.preferences || {
      theme: "system",
      language: "en",
      timezone: "UTC",
      notifications: {
        email: true,
        push: true,
        fileShared: true,
        fileCommented: true,
        storageLimit: true,
        securityAlerts: true,
      },
      defaultView: "grid",
      itemsPerPage: 50,
    },
  )

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      await updateProfile(profileData)
      addToast({
        type: "success",
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      await updateProfile({ preferences })
      addToast({
        type: "success",
        title: "Preferences saved",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Save failed",
        description: "Failed to save preferences. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span className="hidden sm:inline">Storage</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: e.target.checked },
                      }))
                    }
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Activity Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: "fileShared", label: "File Shared", desc: "When someone shares a file with you" },
                      { key: "fileCommented", label: "File Commented", desc: "When someone comments on your files" },
                      { key: "storageLimit", label: "Storage Limit", desc: "When approaching storage limit" },
                      { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.notifications[item.key as keyof typeof preferences.notifications]}
                          onChange={(e) =>
                            setPreferences((prev) => ({
                              ...prev,
                              notifications: { ...prev.notifications, [item.key]: e.target.checked },
                            }))
                          }
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" icon={<Key className="w-4 h-4 bg-transparent" />}>
                  Change Password
                </Button>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                  </div>
                  <Button variant="primary" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chrome on Windows • Active now</p>
                    </div>
                    <span className="text-sm text-green-600 dark:text-green-400">Current</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">iOS App • 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setPreferences((prev) => ({ ...prev, theme: theme.value as any }))}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        preferences.theme === theme.value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Default View</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "grid", label: "Grid View" },
                    { value: "list", label: "List View" },
                  ].map((view) => (
                    <button
                      key={view.value}
                      onClick={() => setPreferences((prev) => ({ ...prev, defaultView: view.value as any }))}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        preferences.defaultView === view.value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Items per page</label>
                <select
                  value={preferences.itemsPerPage}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, itemsPerPage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                  <option value={100}>100 items</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePreferences} loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Used Storage</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(user.storageUsed)} of {formatFileSize(user.storageLimit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(user.storageUsed / user.storageLimit) * 100}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1,247</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Files</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Folders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">156</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Shared</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">23</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Starred</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" icon={<Download className="w-4 h-4 bg-transparent" />}>
                    Export Data
                  </Button>
                  <Button variant="outline" icon={<Upload className="w-4 h-4 bg-transparent" />}>
                    Import Data
                  </Button>
                  <Button variant="outline" icon={<Trash2 className="w-4 h-4 bg-transparent" />}>
                    Clean Up
                  </Button>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Tip:</strong> You're using {((user.storageUsed / user.storageLimit) * 100).toFixed(1)}% of
                    your storage. Consider upgrading your plan for more space.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg">
                  <div>
                    <h3 className="text-xl font-bold capitalize">{user.subscription?.plan} Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatFileSize(user.storageLimit)} storage • Advanced features
                    </p>
                    {user.subscription?.expiresAt && (
                      <p className="text-sm text-gray-500 mt-1">
                        Renews on {new Date(user.subscription.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$9.99</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Free",
                      price: "$0",
                      storage: "2 GB",
                      features: ["Basic file storage", "File sharing", "Mobile app"],
                      current: user.subscription?.plan === "free",
                    },
                    {
                      name: "Pro",
                      price: "$9.99",
                      storage: "15 GB",
                      features: ["Advanced sharing", "Version history", "Priority support", "Advanced security"],
                      current: user.subscription?.plan === "pro",
                      popular: true,
                    },
                    {
                      name: "Business",
                      price: "$19.99",
                      storage: "100 GB",
                      features: ["Team collaboration", "Admin controls", "API access", "Custom branding"],
                      current: user.subscription?.plan === "business",
                    },
                  ].map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative p-6 border rounded-xl ${
                        plan.current
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
                          : "border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="text-center">
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="text-3xl font-bold mt-2">{plan.price}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
                        <div className="text-lg font-medium mt-2">{plan.storage} storage</div>
                      </div>
                      <ul className="mt-6 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-green-600 rounded-full" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-6"
                        variant={plan.current ? "outline" : "primary"}
                        disabled={plan.current}
                      >
                        {plan.current ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

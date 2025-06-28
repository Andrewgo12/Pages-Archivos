"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Mail, Link, Users, Globe, Lock, X, Plus } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import type { FileItem } from "@/types"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  file: FileItem | null
}

interface ShareSettings {
  permission: "view" | "edit" | "download"
  expiresAt?: Date
  password?: string
  downloadLimit?: number
  allowComments: boolean
  requireSignIn: boolean
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, file }) => {
  const [activeTab, setActiveTab] = useState("people")
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    permission: "view",
    allowComments: true,
    requireSignIn: false,
  })
  const [emailInput, setEmailInput] = useState("")
  const [sharedUsers, setSharedUsers] = useState([
    { id: "1", email: "john@example.com", permission: "edit", avatar: "/placeholder.svg?height=32&width=32" },
    { id: "2", email: "jane@example.com", permission: "view", avatar: "/placeholder.svg?height=32&width=32" },
  ])
  const [publicLink, setPublicLink] = useState("")
  const { addToast } = useToast()

  const handleShareWithPeople = async () => {
    if (!emailInput.trim()) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = {
        id: Date.now().toString(),
        email: emailInput,
        permission: shareSettings.permission,
        avatar: "/placeholder.svg?height=32&width=32",
      }

      setSharedUsers((prev) => [...prev, newUser])
      setEmailInput("")

      addToast({
        type: "success",
        title: "Invitation sent",
        description: `${emailInput} has been invited to ${shareSettings.permission} this file.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to share",
        description: "Could not send invitation. Please try again.",
      })
    }
  }

  const handleCreatePublicLink = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const link = `${window.location.origin}/shared/${Math.random().toString(36).substr(2, 9)}`
      setPublicLink(link)

      addToast({
        type: "success",
        title: "Public link created",
        description: "Anyone with this link can access the file.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to create link",
        description: "Could not create public link. Please try again.",
      })
    }
  }

  const handleCopyLink = async () => {
    if (!publicLink) return

    try {
      await navigator.clipboard.writeText(publicLink)
      addToast({
        type: "success",
        title: "Link copied",
        description: "The share link has been copied to your clipboard.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
      })
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSharedUsers((prev) => prev.filter((user) => user.id !== userId))
    addToast({
      type: "success",
      title: "Access removed",
      description: "User access has been revoked.",
    })
  }

  const handleChangePermission = (userId: string, permission: string) => {
    setSharedUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, permission } : user)))
  }

  if (!file) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${file.name}"`} size="lg">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Share with People
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Get Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-6">
            {/* Share with specific people */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleShareWithPeople()
                    }
                  }}
                  icon={<Mail className="w-4 h-4" />}
                />
                <select
                  value={shareSettings.permission}
                  onChange={(e) => setShareSettings((prev) => ({ ...prev, permission: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                  <option value="download">Can download</option>
                </select>
                <Button onClick={handleShareWithPeople} disabled={!emailInput.trim()}>
                  Share
                </Button>
              </div>

              {/* Current shared users */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">People with access</h4>
                {sharedUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.email} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Can {user.permission}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={user.permission}
                        onChange={(e) => handleChangePermission(user.id, e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      >
                        <option value="view">Can view</option>
                        <option value="edit">Can edit</option>
                        <option value="download">Can download</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(user.id)}
                        icon={<X className="w-4 h-4" />}
                      >
                        <span className="sr-only">Remove access</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Advanced sharing options */}
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Advanced Options</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Allow comments</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Let people add comments to this file</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareSettings.allowComments}
                    onChange={(e) => setShareSettings((prev) => ({ ...prev, allowComments: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Require sign-in</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Only signed-in users can access</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareSettings.requireSignIn}
                    onChange={(e) => setShareSettings((prev) => ({ ...prev, requireSignIn: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expiration Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={shareSettings.expiresAt ? shareSettings.expiresAt.toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setShareSettings((prev) => ({
                          ...prev,
                          expiresAt: e.target.value ? new Date(e.target.value) : undefined,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShareSettings((prev) => ({ ...prev, expiresAt: undefined }))}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-6">
            {/* Public link sharing */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">Public Link</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Anyone with this link can access the file</p>
                </div>
              </div>

              {publicLink ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input value={publicLink} readOnly className="font-mono text-sm" />
                    <Button onClick={handleCopyLink} icon={<Copy className="w-4 h-4" />}>
                      Copy
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Link Permission</label>
                      <select
                        value={shareSettings.permission}
                        onChange={(e) => setShareSettings((prev) => ({ ...prev, permission: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      >
                        <option value="view">Can view</option>
                        <option value="download">Can download</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Download Limit</label>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        value={shareSettings.downloadLimit || ""}
                        onChange={(e) =>
                          setShareSettings((prev) => ({
                            ...prev,
                            downloadLimit: e.target.value ? Number.parseInt(e.target.value) : undefined,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password Protection</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Optional password"
                        value={shareSettings.password || ""}
                        onChange={(e) => setShareSettings((prev) => ({ ...prev, password: e.target.value }))}
                        icon={<Lock className="w-4 h-4" />}
                      />
                      <Button
                        variant="outline"
                        onClick={() => setShareSettings((prev) => ({ ...prev, password: undefined }))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm">
                      Disable Link
                    </Button>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No public link</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create a public link to share this file with anyone
                  </p>
                  <Button onClick={handleCreatePublicLink} icon={<Plus className="w-4 h-4" />}>
                    Create Public Link
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}

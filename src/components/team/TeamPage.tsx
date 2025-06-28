"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  Eye,
  Settings,
  Mail,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useToast } from "@/components/ui/Toast"
import { formatDate } from "@/lib/utils"
import type { Team, TeamMember } from "@/types"

// Mock team data
const mockTeam: Team = {
  id: "team1",
  name: "Design Team",
  description: "Creative team working on UI/UX projects",
  ownerId: "user1",
  members: [
    {
      userId: "user1",
      role: "owner",
      joinedAt: new Date("2024-01-01"),
      permissions: ["admin", "read", "write", "delete"],
      user: {
        id: "user1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        storageUsed: 0,
        storageLimit: 0,
        role: "admin",
        isActive: true,
        preferences: {
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
      },
    },
    {
      userId: "user2",
      role: "admin",
      joinedAt: new Date("2024-01-15"),
      permissions: ["read", "write", "delete"],
      user: {
        id: "user2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        storageUsed: 0,
        storageLimit: 0,
        role: "user",
        isActive: true,
        preferences: {
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
      },
    },
    {
      userId: "user3",
      role: "member",
      joinedAt: new Date("2024-02-01"),
      permissions: ["read", "write"],
      user: {
        id: "user3",
        name: "Mike Johnson",
        email: "mike@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        storageUsed: 0,
        storageLimit: 0,
        role: "user",
        isActive: true,
        preferences: {
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
      },
    },
  ],
  createdAt: new Date("2024-01-01"),
  settings: {
    allowMemberInvites: true,
    defaultPermissions: ["read", "write"],
    storageLimit: 10737418240, // 10GB
    retentionPolicy: 90,
  },
}

const mockInvitations = [
  {
    id: "inv1",
    email: "sarah@example.com",
    role: "member",
    invitedBy: "John Doe",
    invitedAt: new Date("2024-01-20"),
    status: "pending",
  },
  {
    id: "inv2",
    email: "alex@example.com",
    role: "viewer",
    invitedBy: "Jane Smith",
    invitedAt: new Date("2024-01-18"),
    status: "pending",
  },
]

export const TeamPage: React.FC = () => {
  const [team] = useState<Team>(mockTeam)
  const [invitations, setInvitations] = useState(mockInvitations)
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member")
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newInvitation = {
        id: Date.now().toString(),
        email: inviteEmail,
        role: inviteRole,
        invitedBy: "John Doe",
        invitedAt: new Date(),
        status: "pending" as const,
      }

      setInvitations((prev) => [...prev, newInvitation])
      setInviteEmail("")

      addToast({
        type: "success",
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to send invitation",
        description: "Please try again later.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      addToast({
        type: "success",
        title: "Member removed",
        description: "The member has been removed from the team.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to remove member",
        description: "Please try again later.",
      })
    }
  }

  const getRoleIcon = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "member":
        return <Users className="w-4 h-4 text-green-500" />
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
      case "admin":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
      case "member":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
      case "viewer":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    }
  }

  const filteredMembers = team.members.filter(
    (member) =>
      member.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{team.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{team.description}</p>
        </div>
        <Button icon={<Settings className="w-4 h-4" />}>Team Settings</Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">{team.members.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invites</p>
                <p className="text-2xl font-bold text-orange-600">{invitations.length}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Storage</p>
                <p className="text-2xl font-bold text-purple-600">8.5 GB</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" icon={<Filter className="w-4 h-4 bg-transparent" />}>
                Filter
              </Button>
            </div>
            <Button icon={<UserPlus className="w-4 h-4" />}>Invite Member</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={member.user?.avatar || "/placeholder.svg"}
                        alt={member.user?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{member.user?.name}</h3>
                          {getRoleIcon(member.role)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.user?.email}</p>
                        <p className="text-xs text-gray-500">Joined {formatDate(member.joinedAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs rounded-full ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>

                      {member.role !== "owner" && (
                        <Button variant="ghost" size="sm" icon={<MoreVertical className="w-4 h-4" />}>
                          <span className="sr-only">More options</span>
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invite New Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  className="flex-1"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <Button onClick={handleInviteMember} loading={loading} disabled={!inviteEmail.trim()}>
                  Send Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations ({invitations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No pending invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation, index) => (
                    <motion.div
                      key={invitation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{invitation.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Invited by {invitation.invitedBy} • {formatDate(invitation.invitedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${getRoleBadgeColor(invitation.role)}`}>
                          {invitation.role}
                        </span>
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                        <Button variant="destructive" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Jane Smith joined the team</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      New project "Mobile App" created
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Team settings updated</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Team Name</label>
                <Input value={team.name} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={team.description}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Allow member invites</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Let team members invite new people</p>
                </div>
                <input
                  type="checkbox"
                  checked={team.settings.allowMemberInvites}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Default Permissions</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">Delete Team</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete this team and all its data
                  </p>
                </div>
                <Button variant="destructive">Delete Team</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

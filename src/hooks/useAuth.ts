"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  loading: boolean
  error: string | null
}

interface RegisterData {
  name: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          // Simulate API call to verify token
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock user data
          const mockUser: User = {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            storageUsed: 2580000000, // 2.58 GB
            storageLimit: 16106127360, // 15 GB
            role: "admin",
            isActive: true,
            lastLogin: new Date(),
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
            subscription: {
              plan: "pro",
              status: "active",
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              features: ["unlimited_storage", "advanced_sharing", "version_history", "priority_support"],
            },
          }
          setUser(mockUser)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (email === "admin@example.com" && password === "password") {
        const token = "mock_jwt_token"
        localStorage.setItem("auth_token", token)

        const mockUser: User = {
          id: "1",
          name: "John Doe",
          email: email,
          avatar: "/placeholder.svg?height=40&width=40",
          storageUsed: 2580000000,
          storageLimit: 16106127360,
          role: "admin",
          isActive: true,
          lastLogin: new Date(),
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
          subscription: {
            plan: "pro",
            status: "active",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            features: ["unlimited_storage", "advanced_sharing", "version_history", "priority_support"],
          },
        }
        setUser(mockUser)
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        storageUsed: 0,
        storageLimit: 2147483648, // 2GB for free users
        role: "user",
        isActive: true,
        preferences: {
          theme: "system",
          language: "en",
          timezone: "UTC",
          notifications: {
            email: true,
            push: false,
            fileShared: true,
            fileCommented: true,
            storageLimit: true,
            securityAlerts: true,
          },
          defaultView: "grid",
          itemsPerPage: 25,
        },
        subscription: {
          plan: "free",
          status: "active",
          features: ["basic_storage", "basic_sharing"],
        },
      }

      const token = "mock_jwt_token"
      localStorage.setItem("auth_token", token)
      setUser(mockUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setUser({ ...user, ...updates })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    login,
    logout,
    register,
    updateProfile,
    loading,
    error,
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

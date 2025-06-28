"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Cloud } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/Toast"

interface LoginPageProps {
  onSwitchToRegister: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("password")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const { login, loading } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(email, password)
      addToast({
        type: "success",
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Cloud className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold gradient-text">Welcome Back</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your MegaVault account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="Enter your email"
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button type="button" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" loading={loading} size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button onClick={onSwitchToRegister} className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign up
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                Email: admin@example.com
                <br />
                Password: password
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

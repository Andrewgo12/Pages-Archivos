"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Cloud, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/components/ui/Toast"

interface RegisterPageProps {
  onSwitchToLogin: () => void
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const { register, loading } = useAuth()
  const { addToast } = useToast()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validatePassword = (password: string) => {
    const requirements = [
      { test: password.length >= 8, text: "At least 8 characters" },
      { test: /[A-Z]/.test(password), text: "One uppercase letter" },
      { test: /[a-z]/.test(password), text: "One lowercase letter" },
      { test: /\d/.test(password), text: "One number" },
      { test: /[!@#$%^&*]/.test(password), text: "One special character" },
    ]
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordValid = passwordRequirements.every((req) => req.test)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptTerms) {
      addToast({
        type: "error",
        title: "Terms required",
        description: "Please accept the terms and conditions to continue.",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      addToast({
        type: "error",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    if (!isPasswordValid) {
      addToast({
        type: "error",
        title: "Password requirements not met",
        description: "Please ensure your password meets all requirements.",
      })
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      addToast({
        type: "success",
        title: "Account created!",
        description: "Welcome to MegaVault. Your account has been created successfully.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
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
            <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join MegaVault and start storing your files securely
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  placeholder="Enter your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="Enter your email"
                  required
                />

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                      placeholder="Create a strong password"
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

                  {/* Password Requirements */}
                  {formData.password && (
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3 h-3 ${req.test ? "text-green-500" : "text-gray-400"}`} />
                          <span className={req.test ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <button type="button" className="text-primary-600 hover:text-primary-500 font-medium">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-primary-600 hover:text-primary-500 font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button type="submit" className="w-full" loading={loading} size="lg">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} className="text-primary-600 hover:text-primary-500 font-medium">
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

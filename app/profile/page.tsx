"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { changePasswordSchema } from "@/lib/validations/auth";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Shield,
  Key,
  LogOut,
  CheckCircle,
  AlertCircle,
  Home,
  Package,
  ShoppingCart,
  Menu,
  X,
  Edit,
  Save,
  UserCircle,
  Settings,
  Lock,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function ProfileContent() {
  const { user, changePassword, logout } = useAuthStore();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setIsLoading(true);

    try {
      const validatedData = changePasswordSchema.parse(passwordData);
      await changePassword(
        validatedData.currentPassword,
        validatedData.newPassword
      );
      setSuccess("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: error.message || "Failed to change password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className=" rounded-lg flex items-center justify-center ">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="w-16 rounded-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent">
                PrintHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/tools">
                <Button
                  variant="ghost"
                  className="hover:bg-[#3366ff]/10 transition-all duration-200 bg-transparent"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-2 space-y-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button
                    variant="ghost"
                    className="hover:bg-[#3366ff]/10 transition-all duration-200 bg-transparent"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Tools
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Button>
                </Link>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link
              href="/dashboard"
              className="hover:text-[#3366ff] transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900">Profile</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600 text-sm">
                Manage your account information and security
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border border-gray-200 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Welcome back, {user?.name}!
                    </CardTitle>
                    <p className="text-gray-600 flex items-center mt-1">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Account verified and active
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-[#3366ff]" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Your account details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Full Name
                    </Label>
                    <div className="relative">
                      <Input
                        value={user?.name || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
                {user?.phone && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center text-sm font-medium text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Phone Number
                      </Label>
                      <Input
                        value={`${user.countryCode || ""} ${user.phone}`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Update your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {errors.general && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert
                        variant="destructive"
                        className="border-red-200 bg-red-50"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">
                          {errors.general}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          {success}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <Key className="h-4 w-4 mr-2 text-gray-500" />
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className={`pr-12 ${
                            errors.currentPassword
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.currentPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500"
                        >
                          {errors.currentPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <Lock className="h-4 w-4 mr-2 text-gray-500" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className={`pr-12 ${
                            errors.newPassword
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Enter your new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500"
                        >
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="flex items-center text-sm font-medium text-gray-700"
                      >
                        <Lock className="h-4 w-4 mr-2 text-gray-500" />
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className={`pr-12 ${
                            errors.confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          placeholder="Confirm your new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <span>Account Actions</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  Manage your account settings and sign out securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button> */}
                </div>
                <div className="text-xs text-red-600 bg-red-100 p-3 rounded-lg">
                  <p className="flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Signing out will end your current session. You'll need to
                      sign in again to access your account.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

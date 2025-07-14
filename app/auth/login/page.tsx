"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/stores/auth-store";
import { loginSchema } from "@/lib/validations/auth";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { VerificationDrawer } from "@/components/verification-drawer";
import { api } from "@/lib/api";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [showVerificationDrawer, setShowVerificationDrawer] = useState(false);

  const handleSubmit = useCallback(async () => {
    console.log("🔥 LOGIN ATTEMPT STARTED");
    console.log("Form data:", formData);

    setErrors({});
    setIsLoading(true);

    try {
      // Validate form data
      const validatedData = loginSchema.parse(formData);
      console.log("✅ Form validation passed");

      // Make API call
      console.log("📡 Making API call to /student/login");
      const response = await api.post("/login", {
        email: validatedData.email,
        password: validatedData.password,
      });

      console.log("📨 API Response received:", response.data);

      // Check for unverified user
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        if (responseData.data.isVerified === false) {
          console.log("🚨 USER NOT VERIFIED - Opening drawer");

          // Set verification data
          const userData = {
            userId: responseData.data.userId,
            email: responseData.data.email,
          };

          console.log("Setting verification data:", userData);
          setVerificationData(userData);

          // Open drawer immediately
          console.log("🎭 Opening verification drawer");
          setShowVerificationDrawer(true);

          // Stop loading but DON'T redirect or do anything else
          setIsLoading(false);
          console.log("✋ Stopping here - drawer should be open");
          return; // CRITICAL: Stop execution here
        }

        // If verified, proceed with login
        if (responseData.data.token) {
          console.log("✅ User verified, proceeding with login");
          const { token } = responseData.data;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Update auth store
          const { login } = useAuthStore.getState();
          await login(validatedData.email, validatedData.password);

          router.push("/dashboard");
        }
      } else {
        setErrors({ general: responseData.message || "Login failed" });
      }
    } catch (error: any) {
      console.log("❌ LOGIN ERROR:", error);

      if (error.errors) {
        // Validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else if (error.response?.data) {
        // API errors
        const responseData = error.response.data;
        console.log("📨 Error response data:", responseData);

        // Check if it's an unverified user in error response
        if (responseData.data && responseData.data.isVerified === false) {
          console.log("🚨 USER NOT VERIFIED (from error) - Opening drawer");

          const userData = {
            userId: responseData.data.userId,
            email: responseData.data.email,
          };

          console.log("Setting verification data from error:", userData);
          setVerificationData(userData);

          console.log("🎭 Opening verification drawer from error");
          setShowVerificationDrawer(true);

          setIsLoading(false);
          console.log("✋ Stopping here - drawer should be open (from error)");
          return; // CRITICAL: Stop execution here
        }

        setErrors({ general: responseData.message || "Login failed" });
      } else {
        setErrors({ general: error.message || "Login failed" });
      }
    } finally {
      setIsLoading(false);
      console.log("🏁 Login attempt finished");
    }
  }, [formData, router]);

  // FIXED: Separate function for Enter key handling
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleDrawerClose = useCallback(() => {
    console.log("🎭 Drawer close requested");
    setShowVerificationDrawer(false);
    setVerificationData(null);
  }, []);

  const handleVerificationSuccess = useCallback(() => {
    console.log("✅ Verification successful");
    setShowVerificationDrawer(false);
    setVerificationData(null);
    router.push("/dashboard");
  }, [router]);

  // FIXED: Button click handler
  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    },
    [handleSubmit]
  );

  // Log current state
  console.log("🎯 RENDER STATE:", {
    showVerificationDrawer,
    verificationData,
    isLoading,
    errors,
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 w-full max-w-md"
        >
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className=" rounded-2xl flex items-center justify-center mx-auto mb-4 "
            >
              <div className=" rounded-lg flex items-center justify-center ">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="w-24 rounded-full object-cover"
                />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-600 dark:text-gray-300"
            >
              Sign in to continue your printing journey
            </motion.p>
          </div>

          {/* Login Card */}
          <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-black/80 border border-white/20 shadow-xl ">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-accentColor to-accentColorLight bg-clip-text text-transparent">
                Sign In
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50 dark:bg-red-900/20"
                    >
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        {errors.general}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      autoComplete="email"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      onKeyDown={handleKeyPress}
                      className={`pl-10 h-12 focus:outline-none bg-white/50 dark:bg-black/50 border-gray-200  dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-500"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      onKeyDown={handleKeyPress}
                      className={`pl-10 pr-12 h-12 focus:outline-none bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-500"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleButtonClick}
                  className="w-full h-12 bg-gradient-to-r from-accentColor to-accentColorLight  text-white font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline dark:hover:text-blue-300 transition-colors"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8"
          >
            <p>Secure • Fast • Reliable</p>
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* CRITICAL: Verification Drawer - Completely isolated */}
      {verificationData && showVerificationDrawer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <VerificationDrawer
            isOpen={true}
            onClose={handleDrawerClose}
            userId={verificationData.userId}
            email={verificationData.email}
            onSuccess={handleVerificationSuccess}
          />
        </div>
      )}
    </div>
  );
}

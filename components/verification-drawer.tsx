"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Mail, Loader2, CheckCircle, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface VerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  email: string;
  onSuccess?: () => void;
}

export function VerificationDrawer({
  isOpen = true,
  onClose,
  userId,
  email,
  onSuccess,
}: VerificationDrawerProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { verifyOTP } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // FIXED: Remove form submission behavior completely
  const handleVerifyOTP = useCallback(async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await verifyOTP(userId, otp);

      setIsSuccess(true);
      // Show success animation for 2 seconds then redirect
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  }, [otp, userId, verifyOTP, onSuccess]);

  const handleResendOTP = useCallback(async () => {
    setIsResending(true);
    setError("");

    try {
      await api.post("/resend-otp", { userId });
      setCountdown(60);

      toast({
        title: "OTP Sent!",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  }, [userId, toast]);

  const handleClose = useCallback(() => {
    setOtp("");
    setError("");
    setIsSuccess(false);
    onClose();
  }, [onClose]);

  const handleOpenChange = useCallback((open: boolean) => {
    // Prevent automatic closing entirely
    if (!open) {
      return false;
    }
  }, []);

  const handleResendClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleResendOTP();
    },
    [handleResendOTP]
  );

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    },
    [handleClose]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      modal={true}
      dismissible={false}
    >
      <DrawerContent className="backdrop-blur-sm bg-white/95 dark:bg-black/95 border-t border-white/20">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-accentColor to-accentColorLight rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mail"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Mail className="h-8 w-8 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <DrawerTitle className="text-2xl font-bold ">
              {isSuccess ? "Account Verified!" : "Verify Your Email"}
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 dark:text-gray-400">
              {isSuccess
                ? "Welcome to Walldeed! Redirecting to dashboard..."
                : `We've sent a 6-digit code to ${email}`}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">
                    Account verified successfully!
                  </p>
                  <div className="flex items-center justify-center mt-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">
                      Redirecting...
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert
                        variant="destructive"
                        className="border-red-200 bg-red-50 dark:bg-red-900/20"
                      >
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <div className="flex justify-center mb-6">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendClick}
                      disabled={isResending || countdown > 0}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : countdown > 0 ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend in {countdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend Code
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isSuccess && (
            <DrawerFooter>
              <Button
                type="button"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 bg-gradient-to-r from-accentColor to-accentColorLight hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify Account
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseClick}
                className="w-full h-12 bg-transparent"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

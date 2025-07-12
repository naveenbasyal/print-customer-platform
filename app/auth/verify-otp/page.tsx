"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Loader2 } from "lucide-react"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { verifyOTP } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get("userId")
  const email = searchParams.get("email")

  useEffect(() => {
    if (!userId || !email) {
      router.push("/auth/register")
    }
  }, [userId, email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await verifyOTP(userId!, otp)
      router.push("/dashboard")
    } catch (error: any) {
      setError(error.message || "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">We've sent a 6-digit code to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Didn't receive the code? Check your spam folder or try again.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

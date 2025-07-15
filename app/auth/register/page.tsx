"use client";

import type React from "react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registerSchema } from "@/lib/validations/auth";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  MapPin,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { VerificationDrawer } from "@/components/verification-drawer";
import Image from "next/image";

interface College {
  id: string;
  name: string;
  state: string;
  country: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

export default function RegisterPage() {
  const [step, setStep] = useState(1); // 1: Location, 2: College, 3: Details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    collegeId: "",
    state: "",
    country: "India",
  });
  const [colleges, setColleges] = useState<College[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);

  const { toast } = useToast();

  const [verificationData, setVerificationData] = useState<{
    userId: string;
    email: string;
  } | null>(null);
  const [showVerificationDrawer, setShowVerificationDrawer] = useState(false);

  const fetchColleges = async () => {
    if (!formData.state || !formData.country) return;

    setIsLoadingColleges(true);
    try {
      const response = await api.get(
        `/find-colleges?state=${formData.state.toLowerCase()}&country=${formData.country.toLowerCase()}`
      );
      setColleges(response.data.data);

      if (response.data.data.length === 0) {
        toast({
          title: "No colleges found",
          description: `No colleges found in ${formData.state}, ${formData.country}. Please try a different location.`,
          variant: "destructive",
        });
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error("Failed to fetch colleges:", error);
      toast({
        title: "Error fetching colleges",
        description: "Failed to load colleges. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingColleges(false);
    }
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.state) {
      setErrors({ state: "Please select a state" });
      return;
    }
    setErrors({});
    fetchColleges();
  };

  const handleCollegeSelect = (collegeId: string) => {
    setFormData({ ...formData, collegeId });
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validatedData = registerSchema.parse(formData);

      const response = await api.post("/register", validatedData);

      if (
        response.data.success &&
        response.data.data &&
        response.data.data.isVerified === false
      ) {
        setVerificationData({
          userId: response.data.data.userId,
          email: response.data.data.email,
        });
        setShowVerificationDrawer(true);
        setIsLoading(false);
        return;
      }

      if (!response.data.success) {
        setErrors({ general: response.data.message || "Registration failed" });
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        if (error.response?.data) {
          const responseData = error.response.data;

          if (responseData.data && responseData.data.isVerified === false) {
            setVerificationData({
              userId: responseData.data.userId,
              email: responseData.data.email,
            });
            setShowVerificationDrawer(true);
            setIsLoading(false);
            return;
          }

          setErrors({ general: responseData.message || "Registration failed" });
        } else {
          setErrors({ general: error.message || "Registration failed" });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber
                ? "bg-gradient-to-r from-accentColor to-accentColorLight text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step > stepNumber
                  ? "bg-gradient-to-r from-accentColor to-accentColorLight"
                  : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AuroraBackground>
      <div className="flex items-center justify-center min-h-screen w-full lg:w-1/2 ">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative  flex flex-col gap-4 items-center justify-center px-4 w-full max-w-md"
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
              Join Walldeed
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-600 dark:text-gray-300"
            >
              Create your account to start printing
            </motion.p>
          </div>

          {renderStepIndicator()}

          {/* Registration Card */}
          <Card className="w-full backdrop-blur-sm bg-white/80 dark:bg-black/80 border border-white/20 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-accentColor to-accentColorLight bg-clip-text text-transparent">
                {step === 1 && "Select Location"}
                {step === 2 && "Choose College"}
                {step === 3 && "Create Account"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                {step === 1 && "Tell us where you're located"}
                {step === 2 && "Select your college from the list"}
                {step === 3 && "Fill in your details to complete registration"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Location Selection */}
              {step === 1 && (
                <form onSubmit={handleLocationSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Country
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="country"
                        value={formData.country}
                        disabled
                        className="pl-10 h-12 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      State
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData({ ...formData, state: value })
                      }
                    >
                      <SelectTrigger
                        className={`h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 ${
                          errors.state ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-500"
                      >
                        {errors.state}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-accentColor to-accentColorLight 
                 hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   text-white font-semibold shadow-lg"
                    disabled={isLoadingColleges}
                  >
                    {isLoadingColleges ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Finding Colleges...
                      </>
                    ) : (
                      <>
                        Find Colleges
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2: College Selection */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {colleges.map((college) => (
                      <motion.div
                        key={college.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all"
                        onClick={() => handleCollegeSelect(college.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {college.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {college.state}, {college.country}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-full h-12 border-gray-200 dark:border-gray-700"
                  >
                    Back to Location
                  </Button>
                </div>
              )}

              {/* Step 3: Registration Form */}
              {step === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
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
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`pl-10 h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${
                          errors.name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-500"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

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
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`pl-10 h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${
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
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className={`pl-10 pr-12 h-12 bg-white/50 dark:bg-black/50 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 ${
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
                        onClick={() => setShowPassword(!showPassword)}
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

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 h-12 border-gray-200 dark:border-gray-700"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-accentColor to-accentColorLight hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Sign in here
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
      </div>

      {verificationData && (
        <VerificationDrawer
          isOpen={showVerificationDrawer}
          onClose={() => {
            setShowVerificationDrawer(false);
            setVerificationData(null);
          }}
          userId={verificationData.userId}
          email={verificationData.email}
          onSuccess={() => {
            setShowVerificationDrawer(false);
            setVerificationData(null);
          }}
        />
      )}
    </AuroraBackground>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  FileText,
  Printer,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Upload,
  CreditCard,
  Package,
  User,
  LogOut,
  Star,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Wrench,
  Menu,
  X,
  BookDashedIcon,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3366ff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="rounded-lg flex items-center justify-center">
                <Image
                  src={"/logo.png"}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="w-16 rounded-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent">
                PrintHub
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-gray-600"
                  >
                    Welcome, {user?.name?.split(" ")[0]} 👋
                  </motion.span>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="hover:bg-[#3366ff]/10 hover:border-[#3366ff] transition-all duration-200 bg-transparent"
                    >
                      <LayoutDashboard />
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
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="pb-3 border-b border-gray-200"
                    >
                      <span className="text-gray-600 font-medium">
                        Welcome, {user?.name?.split(" ")[0]} 👋
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-[#3366ff]/10 hover:text-[#3366ff] transition-all duration-200"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/tools"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-[#3366ff]/10 hover:text-[#3366ff] transition-all duration-200"
                        >
                          <Wrench className="h-4 w-4 mr-2" />
                          Tools
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-100 transition-all duration-200"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="pt-3 border-t border-gray-200"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-gray-100 transition-all duration-200"
                        >
                          Sign In
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/auth/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white shadow-lg hover:shadow-xl transition-all duration-200">
                          Get Started
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3366ff]/5 via-white to-[#5588ff]/5"></div>
        <motion.div
          style={{ y }}
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-[#3366ff]/30 to-[#5588ff]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
        ></motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-[#5588ff]/30 to-[#3366ff]/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 backdrop-blur-sm bg-transparent border-accentColorLight text-[#3366ff] hover:shadow-md transition-all duration-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Made for Students
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Print Your Documents
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent"
              >
                Effortlessly
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Upload, customize, and print your documents from anywhere on
              campus. Fast, reliable, and affordable printing for students.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link href="/auth/register">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Start Printing Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 py-4 bg-white/50 backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-200 border-[#3366ff]/20 hover:border-[#3366ff]"
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-2">4.9/5 from 500+ students</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>10K+ documents printed</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Students Love PrintHub
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for hassle-free printing, designed
              specifically for college life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Easy Upload",
                description:
                  "Drag & drop your PDFs or browse to select. Support for multiple files at once.",
                color: "text-[#3366ff]",
                bg: "bg-[#3366ff]/10",
                delay: 0.1,
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Get your prints ready in minutes. No more waiting in long queues.",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
                delay: 0.2,
              },
              {
                icon: CreditCard,
                title: "Secure Payments",
                description:
                  "Pay safely with Razorpay integration. Multiple payment options available.",
                color: "text-green-600",
                bg: "bg-green-50",
                delay: 0.3,
              },
              {
                icon: Package,
                title: "Track Orders",
                description:
                  "Real-time order tracking with OTP-based pickup system.",
                color: "text-[#5588ff]",
                bg: "bg-[#5588ff]/10",
                delay: 0.4,
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your documents are encrypted and automatically deleted after printing.",
                color: "text-red-600",
                bg: "bg-red-50",
                delay: 0.5,
              },
              {
                icon: Clock,
                title: "24/7 Available",
                description:
                  "Upload anytime, pick up during stationary hours. Flexible for your schedule.",
                color: "text-[#3366ff]",
                bg: "bg-[#3366ff]/10",
                delay: 0.6,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-200 group-hover:border-[#3366ff]/30 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <motion.div
                      className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 5 }}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#3366ff] transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your documents printed in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Configure",
                description:
                  "Upload your PDFs and choose print settings like color, binding, and quantity.",
                icon: FileText,
                delay: 0.2,
              },
              {
                step: "02",
                title: "Pay & Order",
                description:
                  "Select your preferred stationary, choose pickup or delivery, and pay securely.",
                icon: CreditCard,
                delay: 0.4,
              },
              {
                step: "03",
                title: "Collect Your Prints",
                description:
                  "Get notified when ready. Use your OTP to collect from the stationary.",
                icon: Package,
                delay: 0.6,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: step.delay }}
                viewport={{ once: true }}
                className="relative text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300"
                >
                  <step.icon className="h-10 w-10 text-white" />
                </motion.div>
                <div className="text-4xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-[#3366ff] transition-colors duration-200">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {index < 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: step.delay + 0.3 }}
                    viewport={{ once: true }}
                    className="hidden md:block absolute top-10 left-full w-full"
                  >
                    <ArrowRight className="h-6 w-6 text-[#3366ff]/50 mx-auto animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#3366ff] to-[#5588ff] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Documents Printed", delay: 0.1 },
              { number: "500+", label: "Happy Students", delay: 0.2 },
              { number: "50+", label: "Campus Stationaries", delay: 0.3 },
              { number: "99.9%", label: "Uptime", delay: 0.4 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: stat.delay }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3366ff]/5 to-[#5588ff]/5"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Printing?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who trust PrintHub for their printing
              needs.
            </p>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            ) : (
              <Link href="/auth/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create Your Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
                <Printer className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PrintHub</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>© 2024 PrintHub. Made with ❤️ for students.</span>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm">Trusted & Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

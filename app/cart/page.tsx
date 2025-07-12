"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Trash2,
  ShoppingCart,
  Package,
  User,
  Home,
  LogOut,
  Menu,
  X,
  FileText,
  CreditCard,
  Calculator,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Zap,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function CartContent() {
  const { items, fetchCartItems, removeItem, isLoading } = useCartStore();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const platformFee = 5;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId));
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3366ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

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
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-[#3366ff]"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
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
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-600"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <span className="text-gray-900">Shopping Cart</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600">Review your items before checkout</p>
            </div>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent>
                <div className="w-24 h-24 bg-gradient-to-r from-[#3366ff]/10 to-[#5588ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-[#3366ff]/60" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Ready to start printing? Browse available stationaries and
                  upload your documents.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Browse Stationaries
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-[#3366ff]/20 hover:border-[#3366ff] bg-transparent"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-[#3366ff]" />
                        <span>Your Files</span>
                      </div>
                      <Badge className="bg-[#3366ff]/10 text-[#3366ff] border-[#3366ff]/20">
                        {items.length} item{items.length > 1 ? "s" : ""}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-[#3366ff]/5 hover:to-[#5588ff]/5 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-6 w-6 text-red-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {item.coloured && (
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      Colored
                                    </Badge>
                                  )}
                                  {item.duplex && (
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      <FileText className="h-3 w-3 mr-1" />
                                      Duplex
                                    </Badge>
                                  )}
                                  {item.spiral && (
                                    <Badge className="bg-purple-100 text-purple-700 text-xs">
                                      <Package className="h-3 w-3 mr-1" />
                                      Spiral
                                    </Badge>
                                  )}
                                  {item.hardbind && (
                                    <Badge className="bg-orange-100 text-orange-700 text-xs">
                                      <Package className="h-3 w-3 mr-1" />
                                      Hard Bind
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Package className="h-4 w-4 mr-1" />
                                  Quantity: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-4">
                              <div className="text-right">
                                <div className="text-xl font-bold text-[#3366ff]">
                                  ₹{item.price}
                                </div>
                                <div className="text-xs text-gray-500">
                                  per item
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removingItems.has(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              >
                                {removingItems.has(item.id) ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "linear",
                                    }}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                  </motion.div>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border border-gray-200 sticky top-24">
                  <CardHeader className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Order Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Items Summary */}
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Items ({items.length})
                        </span>
                        <span className="font-semibold">₹{totalPrice}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 " />
                          Platform Fee
                        </span>
                        <span className="font-semibold text-green-600">₹5</span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-blue-500" />
                          Processing
                        </span>
                        <span className="font-semibold text-green-600">
                          FREE
                        </span>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                        <span className="text-lg font-bold text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-[#3366ff]">
                          ₹{totalPrice + platformFee}
                        </span>
                      </div>

                      {/* Checkout Button */}
                      <Link href="/checkout">
                        <Button className="w-full mt-6 bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                          <CreditCard className="mr-2 h-5 w-5" />
                          Proceed to Checkout
                        </Button>
                      </Link>

                      {/* Security Badge */}
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Secure & Encrypted
                          </span>
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Your files are protected and will be deleted after
                          printing
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}

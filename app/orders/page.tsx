"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/lib/stores/order-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  FileText,
  User,
  Home,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Calendar,
  CreditCard,
  Hash,
  AlertCircle,
  Zap,
  Star,
  ShoppingBag,
  TrendingUp,
  Timer,
  Sparkles,
  Gift,
  Target,
  ChevronDown,
  ChevronUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function OrdersContent() {
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
          text: "text-amber-800",
          icon: Clock,
          border: "border-amber-200",
          glow: "shadow-amber-100",
        };
      case "ACCEPTED":
        return {
          bg: "bg-gradient-to-r from-accentColor to-accentColorLight",
          text: "text-white",
          icon: CheckCircle,
          border: "border-blue-200",
          glow: "shadow-blue-100",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-gradient-to-r from-purple-100 to-accentColorLight",
          text: "text-purple-800",
          icon: Zap,
          border: "border-purple-200",
          glow: "shadow-purple-100",
        };
      case "COMPLETED":
        return {
          bg: "bg-gradient-to-r from-green-100 to-emerald-100",
          text: "text-green-800",
          icon: CheckCircle,
          border: "border-green-200",
          glow: "shadow-green-100",
        };
      case "DELIVERED":
        return {
          bg: "bg-gradient-to-r from-green-100 to-teal-100",
          text: "text-green-800",
          icon: Truck,
          border: "border-green-200",
          glow: "shadow-green-100",
        };
      case "CANCELLED":
        return {
          bg: "bg-gradient-to-r from-red-100 to-rose-100",
          text: "text-red-800",
          icon: AlertCircle,
          border: "border-red-200",
          glow: "shadow-red-100",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-slate-100",
          text: "text-gray-800",
          icon: Package,
          border: "border-gray-200",
          glow: "shadow-gray-100",
        };
    }
  };

  const getOrderStats = () => {
    const total = orders.length;
    const completed = orders.filter(
      (order) => order.status === "DELIVERED"
    ).length;
    const pending = orders.filter(
      (order) => order.status === "ACCEPTED"
    ).length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + order.totalPrice + order.platformFee,
      0
    );

    return { total, completed, pending, totalSpent };
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-border mx-auto mb-6"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-[#3366ff] animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
          <p className="text-sm text-gray-500 mt-1">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link
              href="/dashboard"
              className="hover:text-[#3366ff] transition-colors flex items-center"
            >
              <Home className="h-3 w-3 mr-1" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">My Orders</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage your print orders with ease
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            {orders.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                      <p className="text-xs text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.completed}
                      </p>
                      <p className="text-xs text-gray-600">Completed</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Timer className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.pending}
                      </p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{stats.totalSpent}
                      </p>
                      <p className="text-xs text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <Card className="text-center py-20 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm border-gray-200/50 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5"></div>
              <CardContent className="relative z-10">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#3366ff]/10 to-[#5588ff]/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <ShoppingBag className="h-16 w-16 text-[#3366ff]/60" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5 rounded-full blur-3xl"></div>
                </div>

                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                  Your order history will appear here once you place your first
                  order. Start exploring our services!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Package className="h-4 w-4 mr-2" />
                      Start Shopping
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="border-[#3366ff]/30 hover:border-[#3366ff] bg-white/80 backdrop-blur-sm hover:bg-[#3366ff]/5 transition-all duration-300"
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
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusColor(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="border border-gray-200/50 hover:border-[#3366ff]/30 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-[#3366ff]/2 to-[#5588ff]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}

                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-xl flex items-center justify-center shadow-lg">
                              <Package className="h-7 w-7 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                              <Hash className="h-2 w-2 text-white" />
                            </div>
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center font-bold">
                              {/* <Hash className="h-4 w-4 mr-1 text-gray-400" /> */}
                              Order #{order.id.slice(-8)}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-600 mt-2">
                              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                              {new Date(order.createdAt).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 justify-between ">
                          <Badge
                            className={`${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} ${statusInfo.glow} flex items-center space-x-2 px-2 py-1 text-xs font-semibold shadow-sm`}
                          >
                            <StatusIcon className="h-4 w-4" />
                            <span>{order.status.replace("_", " ")}</span>
                          </Badge>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrderExpansion(order.id)}
                            className="hover:bg-[#3366ff]/10 transition-colors duration-200"
                          >
                            {expandedOrders.has(order.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Condensed Summary - Always Visible */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-lg p-3 border border-blue-100">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-600">
                                Total Amount
                              </p>
                              <p className="font-bold text-[#3366ff]">
                                ₹{order.totalPrice + order.platformFee}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50/50 rounded-lg p-3 border border-purple-100">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-600">Items</p>
                              <p className="font-bold text-purple-700">
                                {order.OrderItem?.length || 0}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-lg p-3 border border-green-100">
                          <div className="flex items-center space-x-2">
                            {order.orderType === "DELIVERY" ? (
                              <Truck className="h-4 w-4 text-green-600" />
                            ) : (
                              <Package className="h-4 w-4 text-blue-600" />
                            )}
                            <div>
                              <p className="text-xs text-gray-600">Type</p>
                              <p className="font-bold text-green-700">
                                {order.orderType}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50/50 rounded-lg p-3 border border-amber-100">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-amber-600" />
                            <div>
                              <p className="text-xs text-gray-600">Shop</p>
                              <p className="font-bold text-amber-700 truncate">
                                {order.stationary.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedOrders.has(order.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <CardContent className="relative z-10 pt-0">
                            <div className="border-t border-gray-100 pt-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Enhanced Order Info */}
                                <div className="space-y-4">
                                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-5 border border-gray-100">
                                    <h4 className="font-bold mb-4 flex items-center text-lg">
                                      <CreditCard className="h-5 w-5 mr-2 text-[#3366ff]" />
                                      Order Details
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center">
                                          <Target className="h-3 w-3 mr-1" />
                                          Type:
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs font-medium"
                                        >
                                          {order.orderType === "DELIVERY" ? (
                                            <>
                                              <Truck className="h-3 w-3 mr-1 text-green-600" />
                                              Delivery
                                            </>
                                          ) : (
                                            <>
                                              <Package className="h-3 w-3 mr-1 text-blue-600" />
                                              Pickup
                                            </>
                                          )}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Item(s) Total:
                                        </span>
                                        <span className="font-bold text-[#3366ff]">
                                          ₹{order.totalPrice}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Platform Fee:
                                        </span>
                                        <span className="font-bold text-[#3366ff]">
                                          ₹{order.platformFee}
                                        </span>
                                      </div>
                                      <div className="flex justify-between border-t pt-2">
                                        <span className="text-gray-900 font-semibold">
                                          Total Amount:
                                        </span>
                                        <span className="font-bold text-[#3366ff] text-lg">
                                          ₹
                                          {order.totalPrice + order.platformFee}
                                        </span>
                                      </div>
                                      {order.deliveryFee > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Delivery Fee:
                                          </span>
                                          <span className="font-semibold">
                                            ₹{order.deliveryFee}
                                          </span>
                                        </div>
                                      )}
                                      {order.otp && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-600">
                                            Collection OTP:
                                          </span>
                                          <span className="font-mono font-bold bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 px-3 py-1 rounded-lg border border-amber-200">
                                            {order.otp}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Stationary Info */}
                                <div className="space-y-4">
                                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-xl p-5 border border-blue-100">
                                    <h4 className="font-bold mb-4 flex items-center text-lg">
                                      <Package className="h-5 w-5 mr-2 text-blue-600" />
                                      Stationary Details
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="font-semibold flex items-center text-gray-900">
                                        {order.stationary.name}
                                        <div className="flex items-center ml-3">
                                          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                            <span className="text-xs text-yellow-700 ml-1 font-medium">
                                              4.8
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-start text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
                                        <span>{order.stationary.address}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                                        <span className="font-medium">
                                          {order.stationary.countryCode}{" "}
                                          {order.stationary.phone}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Delivery Address */}
                              {order.deliveryAddress && (
                                <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl border border-green-200">
                                  <h4 className="font-bold mb-3 flex items-center text-green-800">
                                    <Truck className="h-5 w-5 mr-2" />
                                    Delivery Address
                                  </h4>
                                  <p className="text-sm text-green-700 font-medium">
                                    {order.deliveryAddress}
                                  </p>
                                </div>
                              )}

                              {/* Enhanced Order Items */}
                              {order.OrderItem &&
                                order.OrderItem.length > 0 && (
                                  <div className="mt-6">
                                    <h4 className="font-bold mb-4 flex items-center text-lg">
                                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                                      Items ({order.OrderItem.length})
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-xs"
                                      >
                                        <Gift className="h-3 w-3 mr-1" />
                                        {order.OrderItem.length} items
                                      </Badge>
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      {order.OrderItem.slice(0, 4).map(
                                        (item: any) => (
                                          <div
                                            key={item.id}
                                            className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
                                          >
                                            <div className="flex items-center space-x-3 min-w-0 flex-1">
                                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-4 w-4 text-white" />
                                              </div>
                                              <span className="text-sm font-semibold truncate text-gray-900">
                                                {item.name}
                                              </span>
                                            </div>
                                            <div className="text-sm text-right flex-shrink-0 ml-3">
                                              <span className="text-gray-600 block">
                                                Qty: {item.quantity}
                                              </span>
                                              <div className="font-bold text-[#3366ff]">
                                                ₹{item.price}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                      {order.OrderItem.length > 4 && (
                                        <div className="col-span-full text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                          <TrendingUp className="h-4 w-4 inline mr-1" />
                                          +{order.OrderItem.length - 4} more
                                          items
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

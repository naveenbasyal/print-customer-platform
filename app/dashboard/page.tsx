"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useStationaryStore } from "@/lib/stores/stationary-store";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  MapPin,
  Phone,
  ShoppingCart,
  Upload,
  Package,
  User,
  Clock,
  Truck,
  Star,
  DollarSign,
  Menu,
  X,
  Home,
  LogOut,
  Wrench,
  IndianRupee,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function DashboardContent() {
  const { user, logout } = useAuthStore();
  const { stationaries, fetchStationaries, isLoading, fetchPrintingRates } =
    useStationaryStore();
  const { items } = useCartStore();
  const [stationaryRates, setStationaryRates] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    fetchStationaries();
  }, [fetchStationaries]);

  // Fetch printing rates for all stationaries
  useEffect(() => {
    const fetchAllRates = async () => {
      const rates: Record<string, any> = {};
      for (const stationary of stationaries) {
        try {
          await fetchPrintingRates(stationary.id);
          rates[stationary.id] = {
            colorRate: 10,
            bwRate: 2,
            duplexExtra: 1,
            hardbindRate: 40,
            spiralRate: 20,
          };
        } catch (error) {
          rates[stationary.id] = {
            colorRate: 10,
            bwRate: 2,
            duplexExtra: 1,
            hardbindRate: 40,
            spiralRate: 20,
          };
        }
      }
      setStationaryRates(rates);
    };

    if (stationaries.length > 0) {
      fetchAllRates();
    }
  }, [stationaries, fetchPrintingRates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3366ff] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to print something today?</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-r from-[#3366ff]/10 to-[#5588ff]/10 border-[#3366ff]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#3366ff] text-sm font-medium">
                    Available Stationaries
                  </p>
                  <p className="text-2xl font-bold text-[#3366ff]">
                    {stationaries.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-[#3366ff]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <Link
                href={"/cart"}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-purple-600 text-sm gap-x-2 flex items-center font-medium">
                    Items in Cart
                    <ExternalLink className="h-4 w-4 text-purple-600" />
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {items.length}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-600" />
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 flex items-center gap-x-2 text-sm font-medium">
                    Ready to Print
                    {items.length > 0 && (
                      <ExternalLink className="h-4 w-4 text-green-600" />
                    )}
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    {items.length > 0 ? "Yes!" : "Upload"}
                  </p>
                </div>
                <Upload className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stationaries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Choose Your Stationary
            </h2>
            <Badge className="bg-[#3366ff]/10 text-[#3366ff] border-[#3366ff]/20">
              {stationaries.filter((s) => s.isActive).length} Active
            </Badge>
          </div>

          {stationaries.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Stationaries Available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are no active stationaries in your college yet. Check
                  back later.
                </p>
                <Button variant="outline">Contact Support</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stationaries.map((stationary) => {
                const rates = stationaryRates[stationary.id];
                return (
                  <motion.div
                    key={stationary.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#3366ff]/30">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-gray-900">
                                {stationary.name}
                              </CardTitle>
                              <div className="flex items-center text-sm text-gray-500">
                                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                                <span>4.8</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1">
                            {stationary.isActive && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                Online
                              </Badge>
                            )}
                            {stationary.canDeliver && (
                              <Badge
                                variant="outline"
                                className="text-xs text-[#3366ff] border-[#3366ff]/30"
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                Delivery
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span className="line-clamp-2">
                            {stationary.address}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Printing Rates */}
                        {rates && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-1 mb-2">
                              <IndianRupee className="h-4 w-4 text-[#3366ff]" />
                              <span className="text-sm font-medium text-gray-700">
                                Printing Rates
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">B&W:</span>
                                <span className="font-medium">
                                  ₹{rates.bwRate}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Color:</span>
                                <span className="font-medium">
                                  ₹{rates.colorRate}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Spiral:</span>
                                <span className="font-medium">
                                  +₹{rates.spiralRate}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Hard Bind:
                                </span>
                                <span className="font-medium">
                                  +₹{rates.hardbindRate}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-400" />
                            <span>
                              {stationary.countryCode} {stationary.phone}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>~5 min</span>
                          </div>
                        </div>

                        <Link href={`/upload?stationaryId=${stationary.id}`}>
                          <Button className="w-full bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white">
                            <Upload className="h-4 w-4 mr-2" />
                            Start Printing
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

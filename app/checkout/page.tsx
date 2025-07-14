"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";
import { useStationaryStore } from "@/lib/stores/stationary-store";
import { useOrderStore } from "@/lib/stores/order-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import {
  Loader2,
  CreditCard,
  MapPin,
  Phone,
  Package,
  Truck,
  Receipt,
  ShoppingBag,
  Star,
  CheckCircle,
  Home,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Calculator,
  Shield,
  Zap,
  Clock,
  AlertCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Gift,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const [orderType, setOrderType] = useState<"TAKEAWAY" | "DELIVERY">(
    "TAKEAWAY"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { items, fetchCartItems, selectedStationaryId } = useCartStore();
  const { stationaries, fetchStationaries } = useStationaryStore();
  const { createOrder } = useOrderStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const platformFee = 5;

  useEffect(() => {
    fetchCartItems();
    fetchStationaries();
  }, [fetchCartItems, fetchStationaries]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = orderType === "DELIVERY" ? 20 : 0;
  const totalPrice = subtotal + deliveryFee;

  const selectedStationaryData = stationaries.find(
    (s) => s.id === selectedStationaryId
  );

  const verifyPayment = async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    try {
      setIsVerifying(true);
      const response = await api.post("/verify-payment", {
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpaySignature: paymentData.razorpaySignature,
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      throw new Error(
        error.response?.data?.message || "Payment verification failed"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedStationaryId) {
      setError(
        "No stationary selected. Please go back and select a stationary."
      );
      return;
    }

    if (orderType === "DELIVERY" && !deliveryAddress.trim()) {
      setError("Please provide delivery address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderData = await createOrder({
        stationaryId: selectedStationaryId,
        orderType,
        deliveryAddress: orderType === "DELIVERY" ? deliveryAddress : "",
      });

      const options = {
        key: "rzp_test_yQG26LZF4tUxWj",
        amount: orderData.newPayment.amountInPaise,
        currency: "INR",
        name: "PrintHub",
        description: "Print Order Payment",
        order_id: orderData.newPayment.order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            router.push(`/orders`);
          } catch (verificationError: any) {
            setError(
              verificationError.message ||
                "Payment verification failed. Please contact support."
            );
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || "Student Name",
          email: user?.email || "student@example.com",
        },
        theme: {
          color: "#3366ff",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setIsVerifying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setError(error.message || "Failed to create order");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-[#3366ff]/10 to-[#5588ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-[#3366ff]/60" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some files to proceed with checkout
            </p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white px-8 py-3">
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Stationaries
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              href="/cart"
              className="hover:text-[#3366ff] transition-colors"
            >
              Cart
            </Link>
            <span>/</span>
            <span className="text-gray-900">Checkout</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Secure Checkout
              </h1>
              <p className="text-gray-600 text-sm">
                Complete your order safely and securely
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isVerifying && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Alert className="border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Verifying your payment... Please don't close this window.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Stationary Info */}
            {selectedStationaryData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border border-gray-200 bg-gradient-to-r from-[#3366ff]/5 to-[#5588ff]/5">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900 flex items-center">
                            <span>Printing at</span>
                            <Badge className="ml-2 bg-green-100 text-green-700">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                              Online
                            </Badge>
                          </CardTitle>
                          <p className="text-lg font-bold text-[#3366ff]">
                            {selectedStationaryData.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-[#3366ff]" />
                        <span className="text-sm">
                          {selectedStationaryData.address}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">
                          {selectedStationaryData.phone}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Order Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-[#3366ff]" />
                    <span>How would you like to receive your order?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderType}
                    onValueChange={(value) =>
                      setOrderType(value as "TAKEAWAY" | "DELIVERY")
                    }
                    className="space-y-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#3366ff]/30 hover:bg-[#3366ff]/5 transition-all cursor-pointer"
                    >
                      <RadioGroupItem value="TAKEAWAY" id="takeaway" />
                      <Label
                        htmlFor="takeaway"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Pickup from Store
                              </div>
                              <div className="text-sm text-gray-600">
                                Collect from the stationary
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600 flex items-center">
                              <Gift className="h-4 w-4 mr-1" />
                              FREE
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Ready in ~10 mins
                            </div>
                          </div>
                        </div>
                      </Label>
                    </motion.div>

                    {selectedStationaryData?.canDeliver && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-[#3366ff]/30 hover:bg-[#3366ff]/5 transition-all cursor-pointer"
                      >
                        <RadioGroupItem value="DELIVERY" id="delivery" />
                        <Label
                          htmlFor="delivery"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Truck className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  Delivery
                                </div>
                                <div className="text-sm text-gray-600">
                                  Delivered to your location (In Campus)
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600 flex items-center">
                                {/* <DollarSign className="h-4 w-4 mr-1" /> */}
                                ₹20
                              </div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Within 30 mins
                              </div>
                            </div>
                          </div>
                        </Label>
                      </motion.div>
                    )}
                  </RadioGroup>

                  {orderType === "DELIVERY" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <Label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-900 mb-2 block flex items-center"
                      >
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        Delivery Address
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete delivery address with landmarks..."
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="bg-white border-blue-200 focus:border-blue-400"
                        rows={3}
                      />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-gray-200 sticky top-24">
                <CardHeader className="bg-gradient-to-r from-[#3366ff] to-[#5588ff] text-white rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5" />
                    <span>Order Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-[#3366ff]" />
                        Your Files
                      </span>
                      <Badge className="bg-[#3366ff]/10 text-[#3366ff] border-[#3366ff]/20">
                        {items.length} item{items.length > 1 ? "s" : ""}
                      </Badge>
                    </div>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 mb-1 truncate">
                            {item.name}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.coloured && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Color
                              </Badge>
                            )}
                            {item.duplex && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                Duplex
                              </Badge>
                            )}
                            {item.spiral && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                Spiral
                              </Badge>
                            )}
                            {item.hardbind && (
                              <Badge className="bg-orange-100 text-orange-700 text-xs">
                                Hard Bind
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-gray-900">
                            ₹{item.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-3 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Calculator className="h-4 w-4 mr-2" />
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Truck className="h-4 w-4 mr-2" />
                        Delivery Fee
                      </span>
                      <span className="font-medium">
                        {orderType === "DELIVERY" ? (
                          <span className="text-blue-600">₹{deliveryFee}</span>
                        ) : (
                          <span className="text-green-600 flex items-center">
                            <Gift className="h-3 w-3 mr-1" />
                            FREE
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Platform Fee
                      </span>
                      <span className="font-medium text-green-600 flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {platformFee}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Taxes & Charges
                      </span>
                      <span className="font-medium text-green-600">
                        Included
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-[#3366ff]">
                      ₹{totalPrice + platformFee}
                    </span>
                  </div>

                  {/* Savings Badge */}
                  {orderType === "TAKEAWAY" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          You're saving ₹20 with pickup!
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Button */}
                  <Button
                    onClick={handlePayment}
                    disabled={
                      isLoading ||
                      isVerifying ||
                      (orderType === "DELIVERY" && !deliveryAddress.trim())
                    }
                    size="lg"
                    className="w-full mt-6 bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isLoading || isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {isVerifying ? "Verifying Payment..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay ₹{totalPrice + platformFee} Securely
                      </>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <span>Secured by Razorpay</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

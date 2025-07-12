"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import {
  Package,
  Home,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  Upload,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  currentPage?: string;
}

export function Navbar({ currentPage }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: Package },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/tools", label: "Tools", icon: Settings },
    { href: "/cart", label: "Cart", icon: ShoppingCart, badge: items.length },
    { href: "/orders", label: "Orders", icon: ShoppingBag },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const isCurrentPage = (href: string) => {
    if (currentPage) {
      return currentPage === href;
    }
    return false;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#3366ff] to-[#5588ff] rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#3366ff] to-[#5588ff] bg-clip-text text-transparent">
              PrintHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.slice(1, -1).map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative transition-colors ${
                        isCurrentPage(item.href)
                          ? "text-[#3366ff] bg-[#3366ff]/10"
                          : "text-gray-600 hover:text-[#3366ff]"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-colors ${
                    isCurrentPage("/profile")
                      ? "text-[#3366ff] bg-[#3366ff]/10"
                      : "text-gray-600 hover:text-[#3366ff]"
                  }`}
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
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
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
            </nav>
          )}

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
              {isAuthenticated ? (
                <>
                  {navItems.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start relative ${
                            isCurrentPage(item.href)
                              ? "text-[#3366ff] bg-[#3366ff]/10"
                              : "text-gray-600"
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                          {item.badge && item.badge > 0 && (
                            <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#3366ff] text-white">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                    );
                  })}
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
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-gray-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-[#3366ff] to-[#5588ff] hover:from-[#2952cc] hover:to-[#4477ee] text-white"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

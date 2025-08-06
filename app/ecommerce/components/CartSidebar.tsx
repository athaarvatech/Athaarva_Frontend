"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "../contexts/CartContext";

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    total,
    itemCount,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    // Placeholder for checkout functionality
    alert("Checkout functionality would be implemented here");
  };

  const subtotal = total;
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 5000 ? 0 : 200; // Free shipping above ₹5000
  const finalTotal = subtotal + tax + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full sm:w-[450px] p-0 flex flex-col h-full bg-white"
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-[#1E3E72] font-['Montserrat']">
              Shopping Cart
            </SheetTitle>
            <div className="flex items-center gap-3">
              <Badge className="bg-[#1E3E72] hover:bg-[#1E3E72] text-white">
                {itemCount} items
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCart}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full px-6 text-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Add some medical equipment and supplies to get started
              </p>
              <Button
                onClick={closeCart}
                className="bg-[#F37336] hover:bg-[#e5642a] text-white"
              >
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <div className="px-6 py-4">
              {/* Clear Cart Button */}
              {items.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    {itemCount} item{itemCount !== 1 ? "s" : ""} in cart
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </div>
              )}

              {/* Cart Items */}
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-xs text-gray-400">IMG</div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-[#1E3E72] font-medium">
                            {item.brand}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#1E3E72]">
                            ₹{item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Line Total */}
                        <div className="mt-2 text-right">
                          <span className="font-semibold text-gray-900">
                            Total: ₹
                            {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 flex-shrink-0 bg-gray-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">
                  ₹{Math.round(tax).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-[#1E3E72]">
                  ₹{Math.round(finalTotal).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Free Shipping Message */}
            {shipping > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Add ₹{(5000 - subtotal).toLocaleString()} more for free
                  shipping!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full bg-[#F37336] hover:bg-[#e5642a] text-white py-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                onClick={closeCart}
                className="w-full border-[#1E3E72] text-[#1E3E72] hover:bg-[#1E3E72] hover:text-white border-2"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Security Badge */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout • SSL encrypted
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

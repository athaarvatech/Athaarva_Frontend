"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { sfFetch, ShopifyCart, ShopifyCartLine } from "../lib/shopify";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_QUERY,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  CartQueryResponse,
} from "../lib/queries";

// Legacy Product interface for backward compatibility
export interface Product {
  id: string;
  name: string;
  image: string;
  specs: string[];
  price: number;
  originalPrice?: number;
  category: string;
  brand?: string;
  inStock: boolean;
  minOrderQty?: number;
}

// Shopify-based cart item interface
export interface ShopifyCartItem {
  id: string; // Shopify cart line ID
  variantId: string; // Shopify variant ID
  productId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image?: string;
  price: number;
  currencyCode: string;
  quantity: number;
}

// Legacy cart item for backward compatibility
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  // Shopify cart data
  shopifyCart: ShopifyCart | null;
  cartId: string | null;
  
  // Legacy compatibility
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  
  // Loading states
  isLoading: boolean;
  isUpdating: boolean;
  
  // Error handling
  error: string | null;
}

type CartAction =
  | { type: "SET_SHOPIFY_CART"; payload: ShopifyCart }
  | { type: "SET_CART_ID"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_UPDATING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

const initialState: CartState = {
  shopifyCart: null,
  cartId: null,
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  isLoading: false,
  isUpdating: false,
  error: null,
};

// Helper functions
function convertShopifyCartToLegacy(shopifyCart: ShopifyCart | null): CartItem[] {
  if (!shopifyCart) return [];
  
  return shopifyCart.lines.edges.map(({ node: line }) => ({
    id: line.merchandise.id, // Use variant ID as product ID for legacy compatibility
    name: `${line.merchandise.product.title} - ${line.merchandise.title}`,
    image: line.merchandise.product.featuredImage?.url || '',
    specs: [], // Not available in Shopify data
    price: parseFloat(line.merchandise.price.amount),
    category: '', // Not available in Shopify data
    inStock: true, // Assume in stock if in cart
    quantity: line.quantity,
  }));
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_SHOPIFY_CART": {
      const legacyItems = convertShopifyCartToLegacy(action.payload);
      return {
        ...state,
        shopifyCart: action.payload,
        items: legacyItems,
        total: action.payload ? parseFloat(action.payload.cost.totalAmount.amount) : 0,
        itemCount: action.payload ? action.payload.totalQuantity : 0,
        isLoading: false,
        isUpdating: false,
        error: null,
      };
    }

    case "SET_CART_ID":
      return {
        ...state,
        cartId: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_UPDATING":
      return {
        ...state,
        isUpdating: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isUpdating: false,
      };

    case "ADD_ITEM": {
      // Legacy support - will be handled by Shopify functions
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
        isOpen: true,
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        shopifyCart: null,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      };

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      };

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
      };

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  // Shopify-specific methods
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  getCheckoutUrl: () => string | null;
  
  // Legacy methods for backward compatibility
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Shopify cart management functions
  const ensureCart = useCallback(async (): Promise<string> => {
    if (state.cartId) {
      return state.cartId;
    }

    // Check if we have a cart ID in localStorage
    const savedCartId = localStorage.getItem("shopify-cart-id");
    if (savedCartId) {
      try {
        // Verify the cart still exists
        const response = await sfFetch<CartQueryResponse>(CART_QUERY, {
          id: savedCartId,
        });
        
        if (response.cart) {
          dispatch({ type: "SET_CART_ID", payload: savedCartId });
          dispatch({ type: "SET_SHOPIFY_CART", payload: response.cart });
          return savedCartId;
        } else {
          // Cart doesn't exist anymore, remove from localStorage
          localStorage.removeItem("shopify-cart-id");
        }
      } catch (error) {
        console.error("Error fetching existing cart:", error);
        localStorage.removeItem("shopify-cart-id");
      }
    }

    // Create new cart
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await sfFetch<CartCreateResponse>(CART_CREATE, {
        input: {
          lines: [],
        },
      });

      if (response.cartCreate.userErrors.length > 0) {
        throw new Error(response.cartCreate.userErrors[0].message);
      }

      const cartId = response.cartCreate.cart.id;
      localStorage.setItem("shopify-cart-id", cartId);
      dispatch({ type: "SET_CART_ID", payload: cartId });
      dispatch({ type: "SET_SHOPIFY_CART", payload: response.cartCreate.cart });
      
      return cartId;
    } catch (error) {
      console.error("Error creating cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create cart" });
      throw error;
    }
  }, [state.cartId]);

  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    try {
      dispatch({ type: "SET_UPDATING", payload: true });
      const cartId = await ensureCart();

      const response = await sfFetch<CartLinesAddResponse>(CART_LINES_ADD, {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      });

      if (response.cartLinesAdd.userErrors.length > 0) {
        throw new Error(response.cartLinesAdd.userErrors[0].message);
      }

      dispatch({ type: "SET_SHOPIFY_CART", payload: response.cartLinesAdd.cart });
      dispatch({ type: "OPEN_CART" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" });
    }
  }, [ensureCart]);

  const updateCartLine = useCallback(async (lineId: string, quantity: number) => {
    if (!state.cartId) return;

    try {
      dispatch({ type: "SET_UPDATING", payload: true });

      if (quantity === 0) {
        // Remove the line instead of setting quantity to 0
        const response = await sfFetch<CartLinesRemoveResponse>(CART_LINES_REMOVE, {
          cartId: state.cartId,
          lineIds: [lineId],
        });

        if (response.cartLinesRemove.userErrors.length > 0) {
          throw new Error(response.cartLinesRemove.userErrors[0].message);
        }

        dispatch({ type: "SET_SHOPIFY_CART", payload: response.cartLinesRemove.cart });
        return;
      }

      const response = await sfFetch<CartLinesUpdateResponse>(CART_LINES_UPDATE, {
        cartId: state.cartId,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      });

      if (response.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(response.cartLinesUpdate.userErrors[0].message);
      }

      dispatch({ type: "SET_SHOPIFY_CART", payload: response.cartLinesUpdate.cart });
    } catch (error) {
      console.error("Error updating cart line:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update cart" });
    }
  }, [state.cartId]);

  const removeCartLine = useCallback(async (lineId: string) => {
    if (!state.cartId) return;

    try {
      dispatch({ type: "SET_UPDATING", payload: true });

      const response = await sfFetch<CartLinesRemoveResponse>(CART_LINES_REMOVE, {
        cartId: state.cartId,
        lineIds: [lineId],
      });

      if (response.cartLinesRemove.userErrors.length > 0) {
        throw new Error(response.cartLinesRemove.userErrors[0].message);
      }

      dispatch({ type: "SET_SHOPIFY_CART", payload: response.cartLinesRemove.cart });
    } catch (error) {
      console.error("Error removing cart line:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" });
    }
  }, [state.cartId]);

  const getCheckoutUrl = useCallback((): string | null => {
    return state.shopifyCart?.checkoutUrl || null;
  }, [state.shopifyCart]);

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      const savedCartId = localStorage.getItem("shopify-cart-id");
      if (savedCartId) {
        try {
          const response = await sfFetch<CartQueryResponse>(CART_QUERY, {
            id: savedCartId,
          });
          
          if (response.cart) {
            dispatch({ type: "SET_CART_ID", payload: savedCartId });
            dispatch({ type: "SET_SHOPIFY_CART", payload: response.cart });
          } else {
            localStorage.removeItem("shopify-cart-id");
          }
        } catch (error) {
          console.error("Error fetching cart on init:", error);
          localStorage.removeItem("shopify-cart-id");
        }
      }
    };

    initializeCart();
  }, []);

  // Legacy cart functions for backward compatibility
  const addItem = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("shopify-cart-id");
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartLine,
        removeCartLine,
        getCheckoutUrl,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

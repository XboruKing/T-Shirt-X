import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Types for better code organization and type safety
const initialState = {
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isLoading: false,
};

export const useCartStore = create((set, get) => ({
  ...initialState,

  getCartItems: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get("/cart");
      set({ cart: data });
      get().calculateTotal();
    } catch (error) {
      set({ cart: [] });
      toast.error(
        error?.response?.data?.error || "Failed to fetch cart items"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async ({ product, size }) => {
    if (!product?._id || !size) {
      toast.error("Invalid product information");
      return;
    }

    set({ isLoading: true });
    try {
      await axios.post("/cart", { 
        productId: product._id, 
        size 
      });

      set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item._id === product._id && item.size === size
        );

        let newCart;
        if (existingItemIndex >= 0) {
          newCart = [...state.cart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + 1
          };
        } else {
          newCart = [...state.cart, { ...product, size, quantity: 1 }];
        }

        return { cart: newCart };
      });

      get().calculateTotal();
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to add item to cart"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async ({ productId, size }) => {
    if (!productId || !size) {
      toast.error("Invalid product information");
      return;
    }

    set({ isLoading: true });
    try {
      await axios.delete("/cart", { 
        data: { productId, size } 
      });

      set((state) => ({
        cart: state.cart.filter(
          (item) => !(item._id === productId && item.size === size)
        )
      }));

      get().calculateTotal();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to remove item from cart"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async ({ productId, quantity, size }) => {
    if (!productId || !size) {
      toast.error("Invalid product information");
      return;
    }

    try {
      if (quantity <= 0) {
        await get().removeFromCart({ productId, size });
        return;
      }

      await axios.post(`/cart`, { 
        productId,
        quantity, 
        size 
      });

      set((state) => ({
        cart: state.cart.map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      }));

      get().calculateTotal();
      toast.success("Cart updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to update cart"
      );
    }
  },

  applyCoupon: async (couponCode) => {
    if (!couponCode) {
      toast.error("Please provide a coupon code");
      return;
    }

    try {
      const { data } = await axios.post("/cart/apply-coupon", { 
        couponCode 
      });
      
      set({ coupon: data });
      get().calculateTotal();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to apply coupon"
      );
    }
  },

  removeCoupon: () => {
    set({ coupon: null });
    get().calculateTotal();
    toast.success("Coupon removed");
  },

  calculateTotal: () => {
    const { cart, coupon } = get();
    
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    let total = subtotal;

    if (coupon?.discountPercentage) {
      const discount = (subtotal * coupon.discountPercentage) / 100;
      total = Math.max(0, subtotal - discount);
    }

    set({ subtotal, total });
  },

  clearCart: () => {
    set(initialState);
  }
}));
import React from 'react';
import { X } from 'lucide-react';
import { loadStripe } from "@stripe/stripe-js";
import axios from '../lib/axios';
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

// Use the public key directly since it's meant to be public anyway
const stripePromise = loadStripe("pk_test_51PC8w52MChm6p0yQHvEMDP18pV4UmIx0jFKBSXmhEMXgV75K1KvOPZIonaXRiDordAD0msg7AINjQzFV4xJYs2ow00ZizYx42N");

export const CartDrawer = ({ isCartOpen, setIsCartOpen }) => {
  const {
    cart,
    total,
    subtotal,
    coupon,
    removeFromCart,
    updateQuantity
  } = useCartStore();
  const { user } = useUserStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  console.log(cart)

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const response = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon?.code || null,
      });

      const { id: sessionId } = response.data;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // You should add proper error handling here, such as showing a toast notification
    }
  };

  return (
    <div 
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Cart ({cart.length})</h3>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 space-y-4 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={`${item._id}-${item.size}`} className="flex items-center gap-4 border-b pb-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <div className="flex flex-row items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm font-medium">{item.size}</p>
                  </div>
                  <p className="text-sm">${Number(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => updateQuantity({ 
                        productId: item._id, 
                        quantity: Math.max(0, item.quantity - 1), 
                        size: item.size 
                      })}
                      className="px-2 border rounded hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity({ 
                        productId: item._id, 
                        quantity: item.quantity + 1, 
                        size: item.size 
                      })}
                      className="px-2 border rounded hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart({ productId: item._id, size: item.size })}
                  className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-4 border-t pt-4">
          {savings > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Savings:</span>
              <span>-${formattedSavings}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${formattedSubtotal}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>${formattedTotal}</span>
          </div>
          <button 
            onClick={handlePayment}
            className="w-full bg-black text-white py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
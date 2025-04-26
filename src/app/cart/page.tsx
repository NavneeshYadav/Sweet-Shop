'use client';
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUser } from '@clerk/clerk-react'; // Import Clerk hook for user data

const ShopCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const { user, isLoaded } = useUser(); // Clerk user hook

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const generateWhatsAppLink = (
    cartItems: any[],
    totalPrice: number,
    name: string,
    phone: string,
    address: string,
    email: string
  ) => {
    const shipping = totalPrice > 0 ? 50 : 0;
    const grandTotal = totalPrice + shipping;

    let message = `*Order Summary*\n\n`;
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - ₹${item.price} x ${item.quantity} = ₹${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\nSubtotal: ₹${totalPrice.toFixed(2)}`;
    message += `\nShipping: ₹${shipping.toFixed(2)}`;
    message += `\n*Total: ₹${grandTotal.toFixed(2)}*\n\n`;

    message += `*Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Email: ${email}\n`;
    message += `Address: ${address}\n`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919926414328"; // Replace with your business number
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const formik = useFormik({
    initialValues: {
      customerName: user?.fullName || '',
      customerPhone: '',
      customerEmail: user?.emailAddresses[0]?.emailAddress || '',
      customerAddress: '',
    },
    validationSchema: Yup.object({
      customerName: Yup.string().required('Name is required'),
      customerPhone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be exactly 10 digits')
        .required('Phone number is required'),
      customerEmail: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      customerAddress: Yup.string().required('Address is required'),
    }),
    onSubmit: (values) => {
      const link = generateWhatsAppLink(
        cartItems,
        totalPrice,
        values.customerName,
        values.customerPhone,
        values.customerAddress,
        values.customerEmail
      );
      window.open(link, '_blank');
    },
  });

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link href="/products"
            className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-300 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center border-b pb-4 gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 rounded-md object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-300 transition"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-300 transition"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-400 transition"
                  onClick={() => handleRemoveItem(item._id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{totalPrice > 0 ? '50.00' : '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalPrice > 0 ? (totalPrice + 50).toFixed(2) : '0.00'}</span>
            </div>
          </div>

          {/* User Info Form */}
          <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4 w-full">
            <input
              type="text"
              name="customerName"
              placeholder="Your Full Name"
              value={formik.values.customerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
              className="w-full border px-4 py-2 rounded-md bg-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {formik.touched.customerName && formik.errors.customerName && (
              <div className="text-red-500 text-sm">{formik.errors.customerName}</div>
            )}
            <input
              type="tel"
              name="customerPhone"
              placeholder="Phone Number"
              value={formik.values.customerPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {formik.touched.customerPhone && formik.errors.customerPhone && (
              <div className="text-red-500 text-sm">{formik.errors.customerPhone}</div>
            )}
            <input
              type="email"
              name="customerEmail"
              placeholder="Email Address"
              value={formik.values.customerEmail}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled
              className="w-full border px-4 py-2 rounded-md bg-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {formik.touched.customerEmail && formik.errors.customerEmail && (
              <div className="text-red-500 text-sm">{formik.errors.customerEmail}</div>
            )}
            <textarea
              name="customerAddress"
              placeholder="Delivery Address"
              value={formik.values.customerAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            {formik.touched.customerAddress && formik.errors.customerAddress && (
              <div className="text-red-500 text-sm">{formik.errors.customerAddress}</div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link href="/products" className="text-orange-400 hover:text-orange-300 transition">
                Continue Shopping
              </Link>
              <button
                type="submit"
                className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-300 transition w-full sm:w-auto text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ShopCart;

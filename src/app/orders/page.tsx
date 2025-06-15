'use client';

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image: string; // ✨ Added "image" field based on your cartItems schema
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  cartItems: CartItem[];
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled'; // ✨ Made "status" required and specific
  createdAt: string;
}

const statusColors: Record<Order['status'], string> = {
  Pending: 'bg-yellow-200 text-yellow-800',
  Shipped: 'bg-blue-200 text-blue-800',
  Delivered: 'bg-green-200 text-green-800',
  Cancelled: 'bg-red-200 text-red-800',
};

const OrdersPage = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();

        const userEmail = user.emailAddresses[0]?.emailAddress;
        const userOrders = data.filter((order: Order) => order.customerEmail === userEmail);

        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: Order['status']) =>
    statusColors[status] || 'bg-yellow-200 text-yellow-800';

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-orange-400">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-400 text-center">My Orders</h1>

      <SignedIn>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-orange-200 rounded-lg p-4 shadow-md relative bg-white"
              >
                <div
                  className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-orange-500">
                    Order ID:- {order._id.slice(-10).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mb-4 text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Name:</span> {order.customerName}</p>
                  <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                  <p><span className="font-semibold">Address:</span> {order.customerAddress}</p>
                </div>

                <div className="space-y-2 border-t pt-3">
                  {order.cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-sm space-y-1 border-t pt-3">
                  <p>Subtotal: ₹{order.totalPrice}</p>
                  <p>Shipping: ₹{order.shippingCost}</p>
                  <p className="font-bold text-orange-500">Total: ₹{order.grandTotal}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-4">
          <p className="text-orange-400">Please sign in to view your orders.</p>
          <Link href="/">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-full transition">
              Go Home
            </button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default OrdersPage;

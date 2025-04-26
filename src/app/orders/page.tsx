'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

const OrdersPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">My Orders</h1>

      {/* When user is signed in */}
      <SignedIn>
        <div className="space-y-4">
          {/* Example orders (you can replace this with real data later) */}
          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">Order #12345</h2>
            <p>Status: <span className="text-green-500">Delivered</span></p>
            <p>Date: 2025-04-25</p>
          </div>

          <div className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold">Order #12346</h2>
            <p>Status: <span className="text-yellow-500">Processing</span></p>
            <p>Date: 2025-04-26</p>
          </div>
        </div>
      </SignedIn>

      {/* When user is not signed in */}
      <SignedOut>
        <div className="text-center space-y-4">
          <p className="text-orange-400">Please sign in to view your orders.</p>
          <Link href="/">
            <button className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-300">
              Go Home
            </button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
};

export default OrdersPage;

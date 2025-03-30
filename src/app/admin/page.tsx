'use client';

import Link from 'next/link';
import { Package, BarChart, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Manage your products, orders, and expenses here.</p>

      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
        <Link href="/admin/manage-products" className="bg-orange-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 transition">
          <Package size={20} />
          <span>Manage Products</span>
        </Link>
        <Link href="/admin/expenses" className="bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition">
          <DollarSign size={20} />
          <span>Check Expenses</span>
        </Link>
        <Link href="/admin/orders-insight" className="bg-green-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition">
          <BarChart size={20} />
          <span>Check Orders Insight</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

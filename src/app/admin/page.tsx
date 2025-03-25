'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react';

const AdminPage = () => {
  const [active, setActive] = useState('Dashboard');
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Orders', icon: Package, href: '/admin/orders' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center space-x-3 p-3 rounded-md transition ${
                pathname === item.href ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <button className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-400 transition">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your products, orders, and customers here.</p>
        
        {/* Example Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Total Orders</h2>
            <p className="text-2xl font-semibold text-orange-500">152</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Revenue</h2>
            <p className="text-2xl font-semibold text-green-500">₹50,000</p>
          </div>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">Customers</h2>
            <p className="text-2xl font-semibold text-blue-500">120</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

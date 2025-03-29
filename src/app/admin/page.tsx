// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react';

// const AdminPage = () => {
//   const [active, setActive] = useState('Dashboard');
//   const pathname = usePathname();

//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
//     { name: 'Orders', icon: Package, href: '/admin/orders' },
//     { name: 'Products', icon: Package, href: '/admin/products' },
//     { name: 'Customers', icon: Users, href: '/admin/customers' },
//     { name: 'Settings', icon: Settings, href: '/admin/settings' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-4">
//         <h2 className="text-2xl font-bold text-orange-400 mb-6 text-center">Admin Panel</h2>
//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <Link 
//               key={item.name} 
//               href={item.href} 
//               className={`flex items-center space-x-3 p-3 rounded-md transition ${
//                 pathname === item.href ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'
//               }`}
//             >
//               <item.icon size={20} />
//               <span>{item.name}</span>
//             </Link>
//           ))}
//         </nav>
//         <div className="mt-8">
//           <button className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-400 transition">
//             <LogOut size={20} />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <h1 className="text-3xl font-semibold text-gray-800">Welcome to Admin Dashboard</h1>
//         <p className="text-gray-600 mt-2">Manage your products, orders, and customers here.</p>
        
//         {/* Example Content */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//           <div className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold text-gray-700">Total Orders</h2>
//             <p className="text-2xl font-semibold text-orange-500">152</p>
//           </div>
//           <div className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold text-gray-700">Revenue</h2>
//             <p className="text-2xl font-semibold text-green-500">₹50,000</p>
//           </div>
//           <div className="bg-white p-4 shadow-md rounded-lg">
//             <h2 className="text-xl font-bold text-gray-700">Customers</h2>
//             <p className="text-2xl font-semibold text-blue-500">120</p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminPage;
"use client";
import React, { useState } from "react";
import ProductAdminCard from "@/components/ProductAdminCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Chocolate Cake", price: 12.99, image: "/images/chocolate-cake.jpg" },
  { id: 2, name: "Strawberry Cupcake", price: 5.49, image: "/images/strawberry-cupcake.jpg" },
];

const ProductAdminList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [newProduct, setNewProduct] = useState<Product>({ id: 0, name: "", price: 0, image: "" });

  const handleUpdate = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0 && newProduct.image) {
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
      setNewProduct({ id: 0, name: "", price: 0, image: "" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Manage Products</h2>

      {/* Add Product Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          className="border p-2 rounded-md w-full mb-2"
        />
        <button onClick={handleAddProduct} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductAdminCard key={product.id} product={product} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default ProductAdminList;

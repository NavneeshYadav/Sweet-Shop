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
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false); // Hide form after adding
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Manage Products</h2>

      {/* Add Product Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        {showForm ? "Cancel" : "Add Product"}
      </button>

      {/* Add Product Form (Only Visible When showForm is True) */}
      {showForm && (
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
          <input type="file"  className="border p-2 rounded-md w-full mb-2" />
          <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Add Product
          </button>
        </div>
      )}

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

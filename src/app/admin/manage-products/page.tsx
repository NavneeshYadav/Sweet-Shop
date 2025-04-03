"use client";
import React, { useState, useEffect } from "react";
import ProductAdminCard from "@/components/ProductAdminCard";

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
}

const ProductAdminList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({ name: "", price: 0, image: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // **Fetch Products from API**
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

// **Handle Image Upload with Preview**
const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setImage?: (url: string) => void
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Create a preview URL
  const previewUrl = URL.createObjectURL(file);
  setImage ? setImage(previewUrl) : setNewProduct({ ...newProduct, image: previewUrl });

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed");

    setImage ? setImage(data.imageUrl) : setNewProduct({ ...newProduct, image: data.imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
  }
};



  // **Handle Add Product**
  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0 || !newProduct.image) return;

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");

      setProducts([...products, data]); // Update UI with new product
      setNewProduct({ name: "", price: 0, image: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Add product error:", error);
    }
    setLoading(false);
  };

  // **Handle Update Product**
  const handleUpdate = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      setProducts(products.map((p) => (p._id === updatedProduct._id ? data : p)));
    } catch (error) {
      console.error("Update product error:", error);
    }
  };

  // **Handle Delete Product**
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Manage Products</h2>

      <button onClick={() => setShowForm(!showForm)} className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
        {showForm ? "Cancel" : "Add Product"}
      </button>

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
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded-md w-full mb-2" />
          {newProduct.image && (
  <img src={newProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-md mb-2" />
)}
          <button onClick={handleAddProduct} className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={loading}>
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductAdminCard key={product._id} product={product} onUpdate={handleUpdate} onDelete={handleDelete} onImage={handleImageUpload}/>
        ))}
      </div>
    </div>
  );
};

export default ProductAdminList;

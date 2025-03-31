"use client";
import React, { useState } from "react";

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
}

interface ProductAdminProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (id?: string) => void;
}

const ProductAdminCard: React.FC<ProductAdminProps> = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [loading, setLoading] = useState(false);

  // **Handle Image Upload to Cloudinary**
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      setEditedProduct({ ...editedProduct, image: data.imageUrl });
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  // **Handle Update Product**
  const handleUpdate = async () => {
    if (!editedProduct._id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${editedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProduct),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      onUpdate(data); // Update UI with new data
      setIsEditing(false);
    } catch (error) {
      console.error("Update product error:", error);
    }
    setLoading(false);
  };

  // **Handle Delete Product**
  const handleDelete = async () => {
    if (!product._id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      onDelete(product._id);
    } catch (error) {
      console.error("Delete product error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            className="border p-2 w-full rounded-md mb-2"
          />
          <input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
            className="border p-2 w-full rounded-md mb-2"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 w-full rounded-md mb-2" />

          <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
        </>
      ) : (
        <>
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
          <h3 className="text-lg font-semibold mt-3 text-orange-600">{product.name}</h3>
          <p className="text-gray-500">${product.price.toFixed(2)}</p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md" disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdminCard;

"use client";
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductAdminProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (id: number) => void;
}

const ProductAdminCard: React.FC<ProductAdminProps> = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product>(product);

  const handleUpdate = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
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
          <input
            type="text"
            value={editedProduct.image}
            onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
            className="border p-2 w-full rounded-md mb-2"
          />
          <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
            Save
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
            <button onClick={() => onDelete(product.id)} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdminCard;

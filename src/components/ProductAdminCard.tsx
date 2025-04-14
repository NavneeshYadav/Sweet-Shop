"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
  imagePublicId?: string;
  availableInStocks: boolean;
  category: string; // ✅ Added
}


interface ProductAdminProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
  onDelete: (id?: string) => void;
  onImage: (event: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().required("Price is required").min(0, "Price must be positive"),
  image: Yup.string().required("Image is required"),
  category: Yup.string().required("Category is required"), // ✅
});

const ProductAdminCard: React.FC<ProductAdminProps> = ({ product, onUpdate, onDelete, onImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: product.name,
      price: product.price,
      image: product.image,
      imagePublicId: product.imagePublicId || "", // ✅ Include this
      availableInStocks: product.availableInStocks,
      category: product.category,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const updatedProduct: Product = {
          ...product,
          ...values,
        };
        onUpdate(updatedProduct);
        setIsEditing(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {isEditing ? (
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 w-full rounded-md mb-2"
            placeholder="Product Name"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mb-2">{formik.errors.name}</div>
          )}

          <input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 w-full rounded-md mb-2"
            placeholder="Price"
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 text-sm mb-2">{formik.errors.price}</div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onImage(e, (url) => {
                formik.setFieldValue("image", url);
                formik.setFieldValue("imagePublicId", product.imagePublicId); // 👈 Add this
              })
            }
            className="border p-2 w-full rounded-md mb-2"
          />
          {formik.errors.image && (
            <div className="text-red-500 text-sm mb-2">{formik.errors.image}</div>
          )}

          {formik.values.image && (
            <img
              src={formik.values.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
          )}

          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              name="availableInStocks"
              checked={formik.values.availableInStocks}
              onChange={formik.handleChange}
            />
            <span>Available in Stock</span>
          </label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded-md w-full mb-2"
          >
            <option value="sweet product">Sweet Product</option>
            <option value="namkeen product">Namkeen Product</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 text-sm">{formik.errors.category}</p>
          )}

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
          <h3 className="text-lg font-semibold mt-3 text-orange-600">{product.name}</h3>
          <p className="text-gray-500">${product.price.toFixed(2)}</p>
          <p className={`text-sm ${product.availableInStocks ? "text-green-600 font-bold" : "text-red-600 font-bold"}`}>
            {product.availableInStocks ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex gap-2 mt-3">
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdminCard;

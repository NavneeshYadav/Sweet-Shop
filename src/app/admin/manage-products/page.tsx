"use client";
import React, { useState, useEffect } from "react";
import ProductAdminCard from "@/components/ProductAdminCard";
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




const ProductAdminList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: 0,
    image: "",
    imagePublicId: "",
    availableInStocks: true,
    category: "sweet product", // ✅ Default
  });

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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

    const previewUrl = URL.createObjectURL(file);
    setImage ? setImage(previewUrl) : setNewProduct({ ...newProduct, image: previewUrl });

    const formData = new FormData();
    formData.append("image", file);

    try {
      setImageUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image upload failed");

      // Update both newProduct and formik field
      setNewProduct((prev) => ({
        ...prev,
        image: data.imageUrl,
        imagePublicId: data.publicId,
      }));
      formik.setFieldValue("image", data.imageUrl); // 👈 Set Formik image field
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      setImageUploading(false);
    }
  };


  // Formik Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Too short").required("Product name is required"),
    price: Yup.number().positive("Price must be positive").required("Price is required"),
    image: Yup.string().required("Image is required"),
    category: Yup.string().required("Category is required"), // ✅
  });



  // **Handle Add Product**
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      image: "",
      category: "sweet product", // ✅ Default
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const newEntry = {
        ...values,
        imagePublicId: newProduct.imagePublicId,
        availableInStocks: newProduct.availableInStocks,
      };

      setLoading(true);
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add product");

        setProducts([...products, data]);
        resetForm();
        setNewProduct({
          name: "",
          price: 0,
          image: "",
          imagePublicId: "",
          availableInStocks: true,
          category: "sweet product", // ✅ reset
        });

        setShowForm(false);
      } catch (error) {
        console.error("Add product error:", error);
      }
      setLoading(false);
    },
  });



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

      <button
        onClick={() => {
          setShowForm((prev) => {
            if (prev) {
              formik.resetForm(); // reset Formik fields
              setNewProduct({
                name: "",
                price: 0,
                image: "",
                imagePublicId: "",
                availableInStocks: true,
                category: "sweet product", // ✅ reset
              });
              // reset image & stock
            }
            return !prev;
          });
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
      >
        {showForm ? "Cancel" : "Add Product"}
      </button>



      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Product</h3>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-2"
          >
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              className="border p-2 rounded-md w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}

            <input
              type="number"
              name="price"
              placeholder="Price"
              className="border p-2 rounded-md w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price && <p className="text-red-500 text-sm">{formik.errors.price}</p>}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (url) => {
                setNewProduct((prev) => ({ ...prev, image: url }));
              })}
              className="border p-2 rounded-md w-full"
            />
            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm">{formik.errors.image}</p>
            )}


            {newProduct.image && (
              <img
                src={newProduct.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newProduct.availableInStocks}
                onChange={(e) =>
                  setNewProduct((prev) => ({
                    ...prev,
                    availableInStocks: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label className="text-gray-700">Available in Stock</label>
            </div>
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
              disabled={loading || imageUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {imageUploading
                ? "Uploading Image..."
                : loading
                  ? "Adding..."
                  : "Add Product"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductAdminCard key={product._id} product={product} onUpdate={handleUpdate} onDelete={handleDelete} onImage={handleImageUpload} />
        ))}
      </div>
    </div>
  );
};

export default ProductAdminList;

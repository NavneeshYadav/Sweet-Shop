"use client";
import React, { useState, useEffect } from "react";
import ProductAdminCard from "@/components/ProductAdminCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
interface Product {
  _id?: string;
  name: string;
  price: number;
  image: string;
  imagePublicId?: string;
  availableInStocks: boolean;
  category: string;
}

const ProductAdminList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Formik Schema
  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Too short").required("Product name is required"),
    price: Yup.number().positive("Price must be positive").required("Price is required"),
    image: Yup.mixed().required("Image is required"),
    category: Yup.string().required("Category is required"),
  });

  // Formik Form Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      image: "",
      imageUrl: "",
      imagePublicId: "",
      category: "sweet product", // Default category
      availableInStocks: true, // Default value
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", values.image);

        // Upload image to Cloudinary
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadResponse.ok) {
          // Create new product with the image URL from Cloudinary
          const productData = {
            name: values.name,
            price: values.price,
            image: uploadData.url,
            imagePublicId: uploadData.public_id,
            category: values.category,
            availableInStocks: values.availableInStocks
          };

          const response = await fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          });

          if (response.ok) {
            const newProduct = await response.json();
            setProducts((prev) => [...prev, newProduct]);
            resetForm();
            setImagePreview(null);
            setShowForm(false);
            toast.success(`Product Added Successfully ${productData.name}!`);
          } else {
            console.error("Failed to create product");
            toast.error(`Failed to Added Product ${productData.name}!`);
          }
        } else {
          console.error("Image upload failed", uploadData.error);
          toast.error(`Failed to upload image!`);
        }
      } catch (error) {
        console.error("Error in submission process:", error);
        toast.error(`Error in submission process!`);
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      // Set the file object in formik values
      formik.setFieldValue("image", file);

      // Create URL for preview
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setImagePreview(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle image change for product edit - update this function in your ProductAdminList component
  const handleProductImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string, publicId: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Pass both the URL and the public_id to the callback
        setImage(data.url, data.public_id);
      } else {
        console.error("Image upload failed", data.error);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  // Handle product update
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? data : p));
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handle product delete
  const handleDeleteProduct = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Toggle Add Product Form
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) {
      formik.resetForm();
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Manage Products</h2>

        <button
          onClick={toggleForm}
          className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>

        {showForm && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Add New Product</h3>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  className="border p-2 rounded-md w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm">{formik.errors.name as string}</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="border p-2 rounded-md w-full"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                />
                {formik.touched.price && formik.errors.price && (
                  <p className="text-red-500 text-sm">{formik.errors.price as string}</p>
                )}
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  className="border p-2 rounded-md w-full"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.image && formik.errors.image && (
                  <p className="text-red-500 text-sm">{formik.errors.image as string}</p>
                )}
              </div>

              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="availableInStocks"
                  checked={formik.values.availableInStocks}
                  onChange={formik.handleChange}
                  className="mr-2"
                />
                <label className="text-gray-700">Available in Stock</label>
              </div>

              <div>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="sweet product">Sweet Product</option>
                  <option value="namkeen product">Namkeen Product</option>
                  <option value="dairy product">Dairy Product</option>
                  <option value="bakery product">Bakery Product</option>
                  <option value="other">Other</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-red-500 text-sm">{formik.errors.category as string}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </form>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No products available. Add your first product!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductAdminCard
                key={product._id}
                product={product}
                onUpdate={handleUpdateProduct}
                onDelete={handleDeleteProduct}
                onImage={handleProductImageChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default ProductAdminList;
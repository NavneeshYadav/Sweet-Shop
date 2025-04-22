"use client";
import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  availableInStocks: boolean;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>(""); // ✅ NEW
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceFilter, categoryFilter, availabilityFilter]); // ✅ NEW

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter !== null ? product.price <= priceFilter : true) &&
      (categoryFilter ? product.category.toLowerCase() === categoryFilter.toLowerCase() : true) &&
      (availabilityFilter === "inStock" ? product.availableInStocks :
       availabilityFilter === "outOfStock" ? !product.availableInStocks : true) // ✅ NEW
    );
  }, [products, searchTerm, priceFilter, categoryFilter, availabilityFilter]); // ✅ NEW

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter(null);
    setCategoryFilter("");
    setAvailabilityFilter(""); // ✅ NEW
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Products</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-1/3"
        />
        <select
          value={priceFilter || ""}
          onChange={(e) => setPriceFilter(e.target.value ? parseFloat(e.target.value) : null)}
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">Filter by price</option>
          <option value="50">Under ₹50</option>
          <option value="100">Under ₹100</option>
          <option value="200">Under ₹200</option>
          <option value="300">Under ₹300</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="sweet product">Sweet</option>
          <option value="namkeen product">Namkeen</option>
          <option value="other">Other</option>
        </select>
        <select
          value={availabilityFilter} // ✅ NEW
          onChange={(e) => setAvailabilityFilter(e.target.value)} // ✅ NEW
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">All Stock</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
        <select
          value={productsPerPage}
          onChange={(e) => {
            setProductsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="15">15 per page</option>
          <option value="20">20 per page</option>
        </select>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Clear Filters
        </button>
      </div>

      {/* Loading, Error, Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-8">No products found.</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-2 ${currentPage === 1 ? "bg-orange-600 text-white" : "bg-gray-200"} rounded`}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2 py-2">...</span>}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page >= currentPage - 1 && page <= currentPage + 1)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 ${currentPage === page ? "bg-orange-600 text-white" : "bg-gray-200"} rounded`}
                >
                  {page}
                </button>
              ))}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="px-2 py-2">...</span>}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-2 ${currentPage === totalPages ? "bg-orange-600 text-white" : "bg-gray-200"} rounded`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;

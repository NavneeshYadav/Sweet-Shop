"use client"
import React, { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term and price filter
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter !== null ? product.price <= priceFilter : true) &&
      (categoryFilter ? product.category === categoryFilter : true)
  );
  

  // Calculate pagination indices
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Products</h2>

      {/* Search, Filter, and Items Per Page Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
          <option value="5">Under $5</option>
          <option value="10">Under $10</option>
          <option value="15">Under $15</option>
        </select>
        <select
          value={productsPerPage}
          onChange={(e) => {
            setProductsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page
          }}
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="15">15 per page</option>
          <option value="20">20 per page</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-1/4"
        >
          <option value="">All Categories</option>
          <option value="sweet">Sweet</option>
          <option value="namkeen">Namkeen</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Loading, Error and Product Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-8">No products found.</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {/* Always Show First Page */}
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

            {/* Show Previous, Current & Next Pages */}
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

            {/* Always Show Last Page */}
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

          {/* Next Button */}
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
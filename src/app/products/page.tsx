"use client"
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";

const products = [
  { id: 1, name: "Chocolate Cake", price: 12.99, image: "/images/chocolate-cake.jpg" },
  { id: 2, name: "Strawberry Cupcake", price: 5.49, image: "/images/strawberry-cupcake.jpg" },
  { id: 3, name: "Vanilla Pastry", price: 4.99, image: "/images/vanilla-pastry.jpg" },
  { id: 4, name: "Red Velvet Cake", price: 15.99, image: "/images/red-velvet-cake.jpg" },
  { id: 5, name: "Blueberry Muffin", price: 3.99, image: "/images/blueberry-muffin.jpg" },
  { id: 6, name: "Carrot Cake", price: 13.49, image: "/images/carrot-cake.jpg" },
  { id: 7, name: "Lemon Tart", price: 6.99, image: "/images/lemon-tart.jpg" },
  { id: 8, name: "Chocolate Chip Cookie", price: 2.49, image: "/images/chocolate-chip-cookie.jpg" },
  { id: 9, name: "Macaron Assortment", price: 8.99, image: "/images/macaron-assortment.jpg" },
  { id: 10, name: "Tiramisu", price: 9.99, image: "/images/tiramisu.jpg" },
  { id: 11, name: "Brownie", price: 3.99, image: "/images/brownie.jpg" },
  { id: 12, name: "Cheesecake", price: 14.99, image: "/images/cheesecake.jpg" },
  { id: 13, name: "Apple Pie", price: 10.99, image: "/images/apple-pie.jpg" },
  { id: 14, name: "Banana Bread", price: 7.49, image: "/images/banana-bread.jpg" },
  { id: 15, name: "Coconut Macaroon", price: 4.99, image: "/images/coconut-macaroon.jpg" },
  { id: 16, name: "Pineapple Upside-Down Cake", price: 11.99, image: "/images/pineapple-cake.jpg" },
  { id: 17, name: "Raspberry Danish", price: 5.99, image: "/images/raspberry-danish.jpg" },
  { id: 18, name: "Black Forest Cake", price: 16.49, image: "/images/black-forest-cake.jpg" },
  { id: 19, name: "Pumpkin Pie", price: 9.49, image: "/images/pumpkin-pie.jpg" },
  { id: 20, name: "Opera Cake", price: 17.99, image: "/images/opera-cake.jpg" },
  { id: 21, name: "Chocolate Éclair", price: 6.49, image: "/images/chocolate-eclair.jpg" },
  { id: 22, name: "Doughnut", price: 2.99, image: "/images/doughnut.jpg" },
  { id: 23, name: "Pistachio Baklava", price: 12.99, image: "/images/pistachio-baklava.jpg" },
  { id: 24, name: "Honey Cake", price: 13.99, image: "/images/honey-cake.jpg" },
  { id: 25, name: "Matcha Cheesecake", price: 15.99, image: "/images/matcha-cheesecake.jpg" },
  { id: 26, name: "Cherry Tart", price: 8.49, image: "/images/cherry-tart.jpg" },
  { id: 27, name: "Mango Mousse", price: 9.49, image: "/images/mango-mousse.jpg" },
  { id: 28, name: "Peanut Butter Brownie", price: 4.99, image: "/images/peanut-butter-brownie.jpg" },
  { id: 29, name: "Lava Cake", price: 7.99, image: "/images/lava-cake.jpg" },
  { id: 30, name: "S'mores Bar", price: 6.99, image: "/images/smores-bar.jpg" },
  { id: 31, name: "Coffee Walnut Cake", price: 14.49, image: "/images/coffee-walnut-cake.jpg" },
  { id: 32, name: "Vanilla Bean Cupcake", price: 4.49, image: "/images/vanilla-bean-cupcake.jpg" },
  { id: 33, name: "Almond Biscotti", price: 3.49, image: "/images/almond-biscotti.jpg" },
  { id: 34, name: "Hazelnut Praline", price: 10.49, image: "/images/hazelnut-praline.jpg" },
  { id: 35, name: "Strawberry Shortcake", price: 12.99, image: "/images/strawberry-shortcake.jpg" },
  { id: 36, name: "Mochi Ice Cream", price: 7.99, image: "/images/mochi-ice-cream.jpg" },
  { id: 37, name: "Chocolate Swiss Roll", price: 8.99, image: "/images/chocolate-swiss-roll.jpg" },
  { id: 38, name: "Churros", price: 5.99, image: "/images/churros.jpg" },
  { id: 39, name: "Cinnamon Roll", price: 6.49, image: "/images/cinnamon-roll.jpg" },
  { id: 40, name: "Blackberry Cobbler", price: 9.99, image: "/images/blackberry-cobbler.jpg" },
  { id: 41, name: "Walnut Fudge", price: 5.49, image: "/images/walnut-fudge.jpg" },
  { id: 42, name: "Peach Galette", price: 8.99, image: "/images/peach-galette.jpg" },
  { id: 43, name: "Custard Tart", price: 6.99, image: "/images/custard-tart.jpg" },
  { id: 44, name: "Raspberry Mousse Cake", price: 13.99, image: "/images/raspberry-mousse-cake.jpg" },
  { id: 45, name: "Peanut Butter Cookie", price: 2.99, image: "/images/peanut-butter-cookie.jpg" },
  { id: 46, name: "Mint Chocolate Cake", price: 15.49, image: "/images/mint-chocolate-cake.jpg" },
  { id: 47, name: "Coconut Cream Pie", price: 10.99, image: "/images/coconut-cream-pie.jpg" },
  { id: 48, name: "Lemon Meringue Pie", price: 11.49, image: "/images/lemon-meringue-pie.jpg" },
  { id: 49, name: "Toffee Pudding", price: 7.99, image: "/images/toffee-pudding.jpg" },
  { id: 50, name: "Salted Caramel Brownie", price: 5.99, image: "/images/salted-caramel-brownie.jpg" },
];

const ProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priceFilter !== null ? product.price <= priceFilter : true)
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
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 ${
                currentPage === index + 1 ? "bg-orange-600 text-white" : "bg-gray-200"
              } rounded`}
            >
              {index + 1}
            </button>
          ))}
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
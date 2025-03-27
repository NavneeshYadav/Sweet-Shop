import React from "react";
import ProductCard from "@/components/ProductCard";


const products = [
  { id: 1, name: "Chocolate Cake", price: 12.99, image: "/images/chocolate-cake.jpg" },
  { id: 2, name: "Strawberry Cupcake", price: 5.49, image: "/images/strawberry-cupcake.jpg" },
  { id: 3, name: "Vanilla Pastry", price: 4.99, image: "/images/vanilla-pastry.jpg" },
];

const ProductList: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

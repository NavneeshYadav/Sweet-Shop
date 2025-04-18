import React from "react";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
      <h3 className="text-lg font-semibold mt-3 text-orange-600">{product.name}</h3>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>
      <button className="mt-3 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-300 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

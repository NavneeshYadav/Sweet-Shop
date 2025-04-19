import React from "react";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    availableInStocks: boolean;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      {!product.availableInStocks && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </span>
      )}
      <h3 className="text-lg font-semibold mt-3 text-orange-600">
        {product.name}
      </h3>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>
      <button
        className={`mt-3 px-4 py-2 rounded-md transition ${
          product.availableInStocks
            ? "bg-orange-400 text-white hover:bg-orange-300"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
        disabled={!product.availableInStocks}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

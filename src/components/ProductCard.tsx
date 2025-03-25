'use client';

import { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  pricePerKg: number;
  image: string;
};

const ProductCard = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products/1'); // Replace with actual API route
        const data = await response.json();

        if (data.success && data.data) {
          setProduct(data.data);
          setTotalPrice(data.data.pricePerKg); // Set initial price
        } else {
          throw new Error('Invalid product data');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Update price when quantity changes
  useEffect(() => {
    if (product) {
      setTotalPrice(product.pricePerKg * quantity);
    }
  }, [quantity, product]);

  // Weight options (0.25kg to 10kg)
  const weightOptions = Array.from({ length: 40 }, (_, i) => (i * 0.25).toFixed(2));

  if (loading) {
    return <div className="text-center p-4">Loading product...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {product ? (
        <>
          <img className="w-full h-48 object-cover" src={product.image} alt={product.name} />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">Price per Kg: ₹{product.pricePerKg.toFixed(2)}</p>

            {/* Quantity Selector */}
            <div className="mt-3">
              <label className="text-gray-700">Quantity (Kg):</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
              >
                {weightOptions.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight} Kg
                  </option>
                ))}
              </select>
            </div>

            {/* Total Price */}
            <p className="mt-3 text-lg font-bold text-orange-500">Total: ₹{totalPrice.toFixed(2)}</p>

            {/* Add to Cart Button */}
            <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
              Add to Cart
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-red-500">Product not found</div>
      )}
    </div>
  );
};

export default ProductCard;

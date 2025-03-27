'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ShopCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Chocolate Cake',
      price: 500,
      quantity: 1,
      image: '/images/chocolate-cake.jpg',
    },
    {
      id: 2,
      name: 'Strawberry Pastry',
      price: 200,
      quantity: 2,
      image: '/images/strawberry-pastry.jpg',
    },
  ]);

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">
        Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center border-b pb-4 gap-4"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 rounded-md object-cover"
                />

                {/* Product Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-300 transition"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-300 transition"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  className="text-red-500 hover:text-red-400 transition"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Total Price and Checkout Button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-lg font-semibold">Total: ₹{totalPrice}</p>
            <button className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-300 transition w-full sm:w-auto mt-3 sm:mt-0">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopCart;

'use client';

import { useState, useEffect } from 'react';

interface CartItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerAddress: string;
    cartItems: CartItem[];
    totalPrice: number;
    shippingCost: number;
    grandTotal: number;
    createdAt: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const OrderInsightPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Fetch orders from the API on component mount
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []); // Empty dependency array to run this once when the component mounts

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }), // Sending the new status in the request body
            });

            if (response.ok) {
                // Update the local state with the new status for the order
                const updatedOrder = await response.json();
                const updatedOrders = orders.map(order =>
                    order._id === orderId ? updatedOrder : order
                );
                setOrders(updatedOrders);
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-orange-400 mb-6">Order Insights</h1>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white text-sm text-left">
                    <thead className="bg-orange-100 text-orange-600 font-semibold">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone No</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Total (₹)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Order Items</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order._id} className="hover:bg-orange-50 transition">
                                <td className="px-6 py-4">{order._id.slice(-10).toUpperCase()}</td>
                                <td className="px-6 py-4">{order.customerName}</td>
                                <td className="px-6 py-4">{order.customerEmail}</td>
                                <td className="px-6 py-4">{order.customerPhone}</td>
                                <td className="px-6 py-4">{order.customerAddress}</td>
                                <td className="px-6 py-4">₹{order.grandTotal}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                                        className={`px-3 py-1 rounded-md text-sm font-medium bg-white border focus:outline-none focus:ring-2
                        ${order.status === 'Delivered' ? 'text-green-600 border-green-300 focus:ring-green-200'
                                                : order.status === 'Pending' ? 'text-yellow-600 border-yellow-300 focus:ring-yellow-200'
                                                    : order.status === 'Shipped' ? 'text-blue-600 border-blue-300 focus:ring-blue-200'
                                                        : 'text-red-600 border-red-300 focus:ring-red-200'}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-sm text-orange-500 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <h2 className="text-xl font-semibold text-orange-400 mb-4">Order Details - {selectedOrder._id.slice(-10).toUpperCase()}</h2>
                        <ul className="space-y-3">
                            {selectedOrder.cartItems.map((product, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{product.name} × {product.quantity}</span>
                                    <span>₹{product.price * product.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4  text-right">
                            <p>Subtotal: ₹{selectedOrder.totalPrice}</p>
                            <p>Shipping: ₹{selectedOrder.shippingCost}</p>
                            <p className='font-semibold'>Total: ₹{selectedOrder.grandTotal}</p>
                        </div>
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-orange-400 text-lg"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderInsightPage;

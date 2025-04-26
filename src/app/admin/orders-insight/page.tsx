'use client';

import { useState } from 'react';

interface Product {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    products: Product[];
    totalPrice: number;
    status: 'Pending' | 'Delivered' | 'Cancelled';
    date: string;
}


const mockOrders: Order[] = [
    {
        id: 'ORD001',
        customerName: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        phone: '9876543210',
        address: '123 Street, Delhi',
        products: [
            { name: 'Chocolate Cake', quantity: 1, price: 400 },
            { name: 'Kaju Katli', quantity: 1, price: 600 },
        ],
        totalPrice: 1000,
        status: 'Pending',
        date: '2025-04-20',
    },
    {
        id: 'ORD002',
        customerName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '9123456780',
        address: '456 Avenue, Mumbai',
        products: [
            { name: 'Rasgulla Box', quantity: 2, price: 300 },
        ],
        totalPrice: 600,
        status: 'Delivered',
        date: '2025-04-18',
    },
];


const OrderInsightPage = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
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
                            <tr key={order.id} className="hover:bg-orange-50 transition">
                                <td className="px-6 py-4">{order.id}</td>
                                <td className="px-6 py-4">{order.customerName}</td>
                                <td className="px-6 py-4">{order.email}</td>
                                <td className="px-6 py-4">{order.phone}</td>
                                <td className="px-6 py-4">{order.address}</td>
                                <td className="px-6 py-4">₹{order.totalPrice}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className={`px-3 py-1 rounded-md text-sm font-medium bg-white border focus:outline-none focus:ring-2
                        ${order.status === 'Delivered' ? 'text-green-600 border-green-300 focus:ring-green-200'
                                                : order.status === 'Pending' ? 'text-yellow-600 border-yellow-300 focus:ring-yellow-200'
                                                    : 'text-red-600 border-red-300 focus:ring-red-200'}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">{order.date}</td>
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
                        <h2 className="text-xl font-semibold text-orange-400 mb-4">Order Details - {selectedOrder.id}</h2>
                        <ul className="space-y-3">
                            {selectedOrder.products.map((product, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{product.name} × {product.quantity}</span>
                                    <span>₹{product.price * product.quantity}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 font-semibold text-right">
                            Total: ₹{selectedOrder.totalPrice}
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

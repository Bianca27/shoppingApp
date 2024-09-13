import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrderView({ order, orderItems, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="relative">
                <div className="py-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                Order Details
                            </h1>
                            <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
                            <p className="text-gray-600">Status: {order.status}</p>
                            <p className="text-gray-600">Total Amount Paid: ${order.total_amount}</p>

                            <h4 className="text-md font-semibold mt-4">Order Items:</h4>
                            <ul className="list-disc list-inside">
                                {orderItems.length > 0 ? (
                                    orderItems.map(item => (
                                        <li key={item.id} className="py-2">
                                            <span className="text-gray-800">
                                                {item.product.name} - {item.quantity} x ${item.price}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No items found</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

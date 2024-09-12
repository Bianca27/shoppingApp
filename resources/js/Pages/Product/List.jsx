import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react'
export default function productList({ products, auth, userRole }) {
    const {delete: destroy, get: get, post } = useForm();
    const { props } = usePage();

    const [successMessage, setSuccessMessage] = useState(props.flash?.success);
    const [errorMessage, setErrorMessage] = useState(props.flash?.error);

    useEffect(() => {
        if (props.flash?.success) {
            setSuccessMessage(props.flash.success);
            const timer = setTimeout(() => setSuccessMessage(''), 1500);
            return () => clearTimeout(timer);
        }

        if (props.flash?.error) {
            setErrorMessage(props.flash.error);
            const timer = setTimeout(() => setErrorMessage(''), 1500);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
           destroy(`/product/delete/${id}`)
        }
    }

    const addToCart = (product) => {
        // Set data
        const cart = {
            product_id: product.id,
            quantity: 1
        };

        router.post('/cart/add', cart);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>
                    {userRole === 'supplier' && (
                        <a href="/product"
                           className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Add Product
                        </a>
                    )}
                    {userRole === 'buyer' && (
                    <button
                        onClick={() => get(route('cart.index'))}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        View Cart
                    </button>
                    )}
                </div>
            }
        >
            <div className="relative">
                {successMessage && (
                    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        {errorMessage}
                    </div>
                )}
                <Head title="Products"/>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {products.map(product => (
                                            <div key={product.id}
                                                 className="bg-white border rounded-lg shadow hover:shadow-lg overflow-hidden">
                                                <img
                                                    src={product.image ? product.image.url : '/placeholder-image.png'}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="p-4">
                                                    <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                                                    <p className="text-gray-500 mt-2">${product.price}</p>
                                                    {userRole === 'supplier' && (
                                                        <div className="mt-4 flex justify-between items-center">
                                                            <a
                                                                href={`/product/${product.id}/edit`}
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                Edit
                                                            </a>
                                                            <button
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={(e) => deleteProduct(product.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                    {userRole === 'buyer' && (
                                                        <form onSubmit={(e) => {
                                                            e.preventDefault();
                                                            addToCart(product);
                                                        }}>
                                                            <button
                                                                type="submit"
                                                                className="text-blue-500 hover:text-blue-700"
                                                            >
                                                                Add to Cart
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No products exist</p>
                                )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react'
export default function productList({ products, auth, userRole, itemsInCart }) {
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
                        View Cart {itemsInCart > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{itemsInCart}</span>}
                    </button>
                    )}
                </div>
            }
        >
            <div className="relative">
                {successMessage && (
                    <div className="fixed top-4 right-4 z-50">
                        <div id="toast-success"
                             className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                             role="alert">
                            <div
                                className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                </svg>
                                <span className="sr-only">Check icon</span>
                            </div>
                            <div className="ms-3 text-sm font-normal">{successMessage}</div>
                        </div>
                    </div>
                )}
                {errorMessage && (
                    <div className="fixed top-4 right-4 z-50">
                        <div id="toast-danger"
                             className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                             role="alert">
                            <div
                                className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                                </svg>
                                <span className="sr-only">Error icon</span>
                            </div>
                            <div className="ms-3 text-sm font-normal">{errorMessage}</div>
                        </div>
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
                                                    <p className="text-gray-600 mt-2">${product.price}</p>
                                                    {userRole === 'supplier' && (
                                                        <div className="mt-4 flex justify-between items-center">
                                                            <a
                                                                href={`/product/${product.id}/edit`}
                                                                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                            >
                                                                Edit
                                                            </a>
                                                            <button
                                                                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
                                                            <button type="submit"
                                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                                <svg className="w-3.5 h-3.5 me-2" aria-hidden="true"
                                                                     xmlns="http://www.w3.org/2000/svg"
                                                                     fill="currentColor" viewBox="0 0 18 21">
                                                                    <path
                                                                        d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
                                                                </svg>
                                                                Buy now
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

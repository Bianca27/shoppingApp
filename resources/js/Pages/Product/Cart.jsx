import React, { useEffect, useState } from 'react';
import {useForm, usePage} from "@inertiajs/react";
import { router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Cart({ auth, cartItems, total }) {
    const { props } = usePage();
    const { delete: destroy, get: get, post: post } = useForm();
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
    const updateQuantity = (cartItemId, quantity) => {
        const cartItem = {
            cart_item_id: cartItemId,
            quantity: quantity
        };
        router.post('/cart/update',cartItem);
    };

    const removeFromCart = (cartItemId) => {
        router.post('cart/remove', { cart_item_id: cartItemId });
    };

    const checkout = () => {
        router.post(route('cart.checkout', { cart_items: cartItems, total: total }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
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
            <section className="bg-gray-50 py-8 antialiased md:py-16">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Shopping Cart</h2>

                <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    {/* Cart Items */}
                    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                        <div className="space-y-6">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6"
                                    >
                                        <div
                                            className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                            <a href="#" className="shrink-0 md:order-1">
                                                <img className="h-20 w-20"
                                                     src={item.product.image ? item.product.image.url : '/default.jpg'}
                                                     alt={item.product.image ? item.product.image.title : item.product.name}
                                                />
                                            </a>

                                            {/* Quantity Controls */}
                                            <label htmlFor="counter-input" className="sr-only">Choose quantity:</label>
                                            <div
                                                className="flex items-center justify-between md:order-3 md:justify-end">
                                                <div className="flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                    >
                                                        <svg className="h-2.5 w-2.5 text-gray-900"
                                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 18 2">
                                                            <path stroke="currentColor" strokeLinecap="round"
                                                                  strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                                        </svg>
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                    >
                                                        <svg className="h-2.5 w-2.5 text-gray-900"
                                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 18 18">
                                                            <path stroke="currentColor" strokeLinecap="round"
                                                                  strokeLinejoin="round" strokeWidth="2"
                                                                  d="M9 1v16M1 9h16"/>
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="text-end md:order-4 md:w-32">
                                                    <p className="text-base font-bold text-gray-900">${item.product.price}</p>
                                                </div>
                                            </div>

                                            <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                                                <p className="text-base font-medium text-gray-900">{item.product.name}</p>

                                                <div className="flex items-center gap-4">

                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                                                        onClick={() => removeFromCart(item.product.id)}
                                                    >
                                                        <svg className="me-1.5 h-5 w-5" aria-hidden="true"
                                                             xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round"
                                                                  strokeLinejoin="round" strokeWidth="2"
                                                                  d="M6 18 17.94 6M18 18 6.06 6"/>
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">Your cart is empty.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <p className="text-xl font-semibold text-gray-900">Order summary</p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <dl className="flex items-center justify-between gap-4">
                                        <dt className="text-base font-normal text-gray-600">Total price</dt>
                                        <dd className="text-base font-medium text-gray-900">${total}</dd>
                                    </dl>
                                </div>
                            </div>

                            <button
                                className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
                                    cartItems.length === 0
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
                                }`}
                                onClick={checkout}
                                disabled={cartItems.length === 0}
                            >
                               Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
        </AuthenticatedLayout>
    );
}

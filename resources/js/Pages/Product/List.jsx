import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react'
export default function productList({ products, auth, userRole }) {
    const { delete: destroy } = useForm();
    const deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
           destroy(`/product/delete/${id}`)
        }

    }
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
                </div>
            }
        >
            <Head title="Products"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {products.length > 0? (
                            <table className="min-w-full table-auto">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    {userRole === 'supplier' && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                        {userRole === 'supplier' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href={`/product/${product.id}/edit`}
                                                   className="text-blue-500 hover:text-blue-700">Edit</a>
                                                <button className="ml-4 text-red-500 hover:text-red-700" onClick={(e) => deleteProduct(product.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            ) : (
                                <p className="text-gray-500">You haven't added any products yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}

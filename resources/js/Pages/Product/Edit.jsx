import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from "@/Components/InputLabel.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";

export default function UpdateProduct({ product, auth }) {
    const { data, setData, patch, errors, processing } = useForm({
        name: product.name,
        price: product.price,
        stock: product.stock.quantity,
        description: product.description,
        user_id: auth.user.id,
    });

    const submit = (e) => {
        e.preventDefault();

        // Submit form data
        patch(route('product.update', product.id), {
            onSuccess: () => {
                // Handle success (e.g., redirect to product list page)
                window.location.href = '/products';
            },
            onError: (errors) => {
                // Handle errors if needed
                console.error('Error creating product:', errors);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Update Product" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold">Update Product</h2>
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name"/>

                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        isFocused
                                        autoComplete="name"
                                    />

                                    <InputError className="mt-2" message={errors.name}/>
                                </div>
                                <div>
                                    <InputLabel htmlFor="price" value="Price"/>

                                    <TextInput
                                        id="price"
                                        className="mt-1 block w-full"
                                        name="price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.price}/>
                                </div>
                                <div>
                                    <InputLabel htmlFor="stock" value="Stock"/>
                                    <TextInput
                                        id="stock"
                                        className="mt-1 block w-full"
                                        name="stock"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.stock}/>
                                </div>
                                <div>
                                    <InputLabel htmlFor="description" value="Description"/>
                                    <TextInput
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError className="mt-2" message={errors.description}/>
                                </div>
                                <div className="flex items-center gap-4">
                                    <PrimaryButton>Update product</PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

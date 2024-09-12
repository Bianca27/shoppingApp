<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Image;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $itemsInCart = 0;
        if (auth()->user()->role == 'supplier') {
            $products = Product::where('user_id', auth()->user()->id)->with('image')->get();

        }

        if (auth()->user()->role == 'buyer') {
            $products = Product::with('image')->get();
            $cart = Cart::with('items')->where('user_id', auth()->id())->first();
            if ($cart) {
                $cartItems = $cart->items;
                foreach ($cartItems as $cartItem) {
                    $itemsInCart += $cartItem->quantity;
                }
            }
        }


        return Inertia::render('Product/List', ['products' => $products, 'userRole' => auth()->user()->role, 'itemsInCart' => $itemsInCart]);
    }

    public function create()
    {
        return Inertia::render('Product/Create');
    }

    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:1000',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $product = Product::create(
            [
                'name' => $request->get('name'),
                'price' => $request->get('price'),
                'description' => $request->get('description'),
                'user_id' => auth()->user()->id,
            ]
        );

        Stock::create([
            'product_id' => $product->id,
            'quantity' => $request->get('stock'),
        ]);

        // Handle the image upload
        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            Image::create([
                'title' => $imageName,
                'url' => '/images/'.$imageName,
                'product_id' => $product->id,
            ]);
        }

        return Inertia::render('Product/List')->with('success', 'Product was successfully created.');
    }

    public function edit($id) {
        $product = Product::with('stock', 'image')->find($id);

        return Inertia::render('Product/Edit', ['product' => $product ]);
    }

    public function update($id, Request $request) {
        $product = Product::with('stock')->find($id);

        $product->update([
            'name' => $request->get('name'),
            'price' => $request->get('price'),
            'description' => $request->get('description'),
        ]);

        $product->stock->update([
            'quantity' => $request->get('stock'),
        ]);

        $image = Image::where('product_id', $product->id)->first();
        // Handle the image upload
        if ($request->hasFile('image')) {
            $imageName = time().'.'.$request->image->extension();
            $request->image->move(public_path('images'), $imageName);
            if ($image) {
                $image->delete();
            }
            Image::create([
                'title' => $imageName,
                'url' => '/images/'.$imageName,
                'product_id' => $product->id,
            ]);
        }

        return Inertia::render('Product/List', ['product' => $product ])->with('success', 'Product was successfully updated.');;
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return back()->with('success', 'Product was successfully deleted.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        if (auth()->user()->role == 'supplier') {
            $products = Product::where('user_id', auth()->user()->id)->get();
        }

        if (auth()->user()->role == 'buyer') {
            $products = Product::all();
        }


        return Inertia::render('Product/List', ['products' => $products, 'userRole' => auth()->user()->role]);
    }

    public function create()
    {
        return Inertia::render('Product/Create');
    }

    public function store(Request $request)
    {
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


        return Inertia::render('Product/List');
    }

    public function edit($id) {
        $product = Product::with('stock')->find($id);

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

        return Inertia::render('Product/List', ['product' => $product ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $product->delete();

        return redirect()->route('product.index');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CartItem;

class CartController extends Controller
{
    // Display the cart items
    public function index()
    {
        $cart = Cart::where('user_id', auth()->id())->first();
        if (!$cart) {
            return Inertia::render('Product/Cart', [
                'cartItems' => [],
                'total' => 0,
            ]);
        }
        $cartItems = CartItem::with('product.image')->where('cart_id', $cart->id)->get();

        $total = $cartItems->reduce(function ($carry, $item) {
            return $carry + ($item->quantity * $item->product->price);
        }, 0);

        return Inertia::render('Product/Cart', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    // Add a product to the cart
    public function add(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);
        $cart = Cart::where('user_id', auth()->id())->first();

        if ($cart) {
            $cartItem = CartItem::where('product_id', $productId)->first();
            if ($cartItem) {
                $cartItem->quantity += $quantity;
                $cartItem->save();
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                ]);
            }
        } else {
            $cart = Cart::create([
                'user_id' => auth()->id(),
            ]);
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }
        return back()->with('success', 'Product was successfully added to your cart.');
    }

    // Update cart quantity
    public function update(Request $request)
    {
        $cartItemId = $request->input('cart_item_id');
        $quantity = $request->input('quantity');
        $cartItem = CartItem::find($cartItemId);
        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();
        }

        return back()->with('success', 'Cart updated.');
    }

    // Remove a product from the cart
    public function remove(Request $request)
    {
        $cartItemId = $request->input('cart_item_id');

        CartItem::destroy($cartItemId);

        return back()->with('success', 'Product removed from cart.');
    }
}

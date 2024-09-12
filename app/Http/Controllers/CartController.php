<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
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

        $total = $this->getCartAmount($cartItems);

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

    public function checkout(Request $request)
    {
        $cartItems = $request->input('cart_items');
        $total = $request->input('total');

        $order = Order::create([
            'user_id' => auth()->id(),
            'total_amount' => $total / 100,
            'payment_method' => 'Visa',
            'shipping_address' => 'Test address',
            'status' => 'pending',
        ]);


        foreach ($cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem['product_id'],
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['product']['price'],
            ]);
        }
        foreach ($cartItems as $cartItem) {
            $cartItem = CartItem::find($cartItem['id']);
            $cartItem->delete();
        }
        $cart = Cart::where('user_id', auth()->id())->first();
        $cart->delete();

        return back()->with('success', 'Checkout successful.');
    }

    public function getCartAmount($cartItems) {
        return $cartItems->reduce(function ($carry, $item) {
            return $carry + ($item->quantity * $item->product->price);
        }, 0);

    }
}

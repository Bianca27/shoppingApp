<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
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
        $validatedData = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $productId = $validatedData['product_id'];
        $quantity = $validatedData['quantity'];

        $product = Product::find($productId);
        if (!$product || $product->stock->quantity < $quantity) {
            return back()->with('error', 'The requested quantity is not available.');
        }

        $cart = Cart::where('user_id', auth()->id())->first();

        if ($cart) {
            $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $productId)->first();

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $quantity;

                if ($newQuantity > $product->stock->quantity) {
                    return back()->with('error', 'The requested quantity exceeds available stock.');
                }

                $cartItem->quantity = $newQuantity;
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
        $validatedData = $request->validate([
            'cart_item_id' => 'required|integer|exists:cart_items,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItemId = $validatedData['cart_item_id'];
        $quantity = $validatedData['quantity'];

        $cartItem = CartItem::find($cartItemId);

        if ($cartItem) {
            $cartItem->quantity = $quantity;
            $cartItem->save();

            return back()->with('success', 'Cart updated.');
        }

        return back()->with('error', 'Cart item could not be found.');
    }


    // Remove a product from the cart
    public function remove(Request $request)
    {
        $cartItemId = $request->input('cart_item_id');

        $cartItem = CartItem::find($cartItemId);
        if ($cartItem)  {
            $cartItem->delete();
            return back()->with('success', 'Product removed from cart.');
        }

        return back()->with('error', 'Product could not be removed from cart.');

    }

    // Checkout create an order
    public function checkout(Request $request)
    {
        $request->validate([
            'cart_items' => 'required|array|min:1',
            'cart_items.*.product_id' => 'required|integer|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric|min:0',
        ]);

        $cartItems = $request->input('cart_items');
        $total = $request->input('total');

        $calculatedTotal = 0;

        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem['product_id']);

            if ($product->stock->quantity < $cartItem['quantity']) {
                return back()->with('error', 'Insufficient stock for product: ' . $product->name);
            }

            $calculatedTotal += $product->price * $cartItem['quantity'];
        }

        if ($calculatedTotal != $total) {
            return back()->with('error', 'The total amount does not match the calculated total');
        }

        $order = Order::create([
            'user_id' => auth()->id(),
            'total_amount' => $calculatedTotal,
            'payment_method' => 'Visa',
            'shipping_address' => 'Test address',
            'status' => 'pending',
        ]);

        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem['product_id']);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $cartItem['quantity'],
                'price' => $product->price,
            ]);

            $product->stock->quantity -= $cartItem['quantity'];
            $product->stock->save();
        }

        $cart = Cart::where('user_id', auth()->id())->first();
        if ($cart) {
            $cart->items()->delete();
            $cart->delete();
        }

        return back()->with('success', 'Checkout successful.');
    }


    public function getCartAmount($cartItems) {
        return $cartItems->reduce(function ($carry, $item) {
            return $carry + ($item->quantity * $item->product->price);
        }, 0);

    }
}

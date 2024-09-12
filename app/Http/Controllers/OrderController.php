<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function orders()
    {
        $orders = Order::with('orderItems')->where('user_id', auth()->id())->get();

        return Inertia::render('Order/List')->with('orders', $orders);
    }

    public function view($id)
    {
        $order = Order::find($id);
        $orderItems = OrderItem::with('product.image')->where('order_id', $id)->get();

        return Inertia::render('Order/View')->with('orderItems', $orderItems)->with('order', $order);
    }

    public function purchasedByUsers()
    {
        $products = Product::where('user_id', auth()->id())->pluck('id');

        $orderItems = OrderItem::with('order.user', 'product')->whereIn('product_id', $products)->get();

        return Inertia::render('Order/Purchased')->with('orderItems', $orderItems);
    }


}

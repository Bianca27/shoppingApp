<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Nike Shoes',
            'price' => 100,
            'description' => 'Nice shoes',
            'user_id' => 3,
            ],
        );

        Stock::create([
            'product_id' => 1,
            'quantity' => 10,
        ]);

        Image::create([
            'title' => 'Nike shoes',
            'product_id' => 1,
            'url' => 'images/default.jpg',
        ]);

        Product::create([
            'name' => 'Puma shoes',
            'price' => 200,
            'description' => 'Running shoes',
            'user_id' => 3,
        ]);

        Stock::create([
            'product_id' => 2,
            'quantity' => 20,
        ]);

        Image::create([
            'title' => 'Puma shoes',
            'product_id' => 2,
            'url' => 'images/default.jpg',
        ]);
        Product::create([
            'name' => 'New balance shoes',
            'price' => 300,
            'description' => 'Awesome shoes',
            'user_id' => 4,
        ]);

        Stock::create([
            'product_id' => 3,
            'quantity' => 20,
        ]);

        Image::create([
            'title' => 'New balance shoes',
            'product_id' => 3,
            'url' => 'images/default.jpg',
        ]);
    }
}

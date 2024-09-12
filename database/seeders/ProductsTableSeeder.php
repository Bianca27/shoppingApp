<?php

namespace Database\Seeders;

use App\Models\Image;
use App\Models\Product;
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
            'description' => 'This is the first product',
            'user_id' => 3,
            ],
        );

        Product::create([
            'name' => 'Puma shoes',
            'price' => 200,
            'description' => 'This is the second product',
            'user_id' => 3,
        ]);
        Product::create([
            'name' => 'New balance shoes',
            'price' => 300,
            'description' => 'This is the third product',
            'user_id' => 4,
        ]);
    }
}

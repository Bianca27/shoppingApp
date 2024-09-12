<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // buyers
        User::create([
            'name' => 'Bianca Buyer',
            'email' => 'bianca.radu19@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
        ]);

        User::create([
            'name' => 'Maria Buyer',
            'email' => 'maria.buyer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
        ]);

        // suppliers
        User::create([
            'name' => 'John Supplier',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'supplier',
        ]);

        User::create([
            'name' => 'Ben Supplier',
            'email' => 'ben@example.com',
            'password' => Hash::make('password123'),
            'role' => 'supplier',
        ]);

        User::create([
            'name' => 'Mark Supplier',
            'email' => 'mark@example.com',
            'password' => Hash::make('password123'),
            'role' => 'supplier',
        ]);
    }
}

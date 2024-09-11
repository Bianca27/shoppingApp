<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Define the fillable properties
    protected $fillable = ['name', 'price', 'description', 'image', 'user_id'];

    protected function price(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) =>$value * 100,
            get: fn (int $value) => $value / 100,
        );
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }
}

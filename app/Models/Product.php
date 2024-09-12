<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Define the fillable properties
    protected $fillable = ['name', 'price', 'description', 'user_id'];

    protected function price(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => $value * 100,
            get: fn (int $value) => $value / 100,
        );
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function image()
    {
        return $this->hasOne(Image::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class)->using(OrderItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}

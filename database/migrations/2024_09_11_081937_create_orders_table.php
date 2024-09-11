<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('status');
            $table->integer('total_amount');
            $table->string('payment_method'); // Payment method
            $table->string('payment_status'); // Payment status
            $table->text('shipping_address'); // Shipping address
            $table->string('shipping_method'); // Shipping method
            $table->timestamps(); // Created at and updated a
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

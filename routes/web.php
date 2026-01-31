<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;

// Public routes
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/catalog', function () {
    return Inertia::render('Public/Catalog');
});
Route::get('/cart', function () {
    return Inertia::render('Public/Cart');
});
Route::get('/product/{id}', function ($id) {
    return Inertia::render('Public/ProductDetail', [
        'productId' => $id
    ]);
});


// Admin route
Route::get('/admin/products', [ProductController::class, 'index']);

// API routes
Route::get('/api/products', [ProductController::class, 'getAll']);
Route::get('/api/products/categories', [ProductController::class, 'getCategories']);
Route::post('/api/products', [ProductController::class, 'store']);
Route::put('/api/products/{product}', [ProductController::class, 'update']);
Route::delete('/api/products/{product}', [ProductController::class, 'destroy']);
Route::get('/api/products/{product}', [ProductController::class, 'show']);
Route::delete('/api/product-images/{image}', [ProductController::class, 'deleteImage']);

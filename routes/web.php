<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public routes - TANPA auth
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/catalog', function () {
    return Inertia::render('Public/Catalog');
})->name('catalog');

Route::get('/cart', function () {
    return Inertia::render('Public/Cart');
})->name('cart');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('Public/ProductDetail', [
        'productId' => $id
    ]);
})->name('product.show');

// ==================== AUTH ROUTES ====================
// Login & Register (public)
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->middleware('guest')->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->middleware('guest')->name('register');

// ==================== ADMIN ROUTES ====================
// HANYA untuk user yang login
Route::middleware(['auth'])->group(function () {
    // Dashboard Admin - TAMBAHKAN NAMA ROUTE 'dashboard'
    Route::get('/admin', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard'); // INI YANG DIPERBAIKI

    // Products management
    Route::get('/admin/products', [ProductController::class, 'index'])
        ->name('admin.products.index');
});

// ==================== API ROUTES ====================
// Public API (untuk user biasa)
Route::get('/api/products', [ProductController::class, 'getAll']);
Route::get('/api/products/categories', [ProductController::class, 'getCategories']);
Route::get('/api/products/{product}', [ProductController::class, 'show']);

// Protected API (hanya untuk admin yang login)
Route::middleware(['auth'])->group(function () {
    Route::post('/api/products', [ProductController::class, 'store']);
    Route::put('/api/products/{product}', [ProductController::class, 'update']);
    Route::delete('/api/products/{product}', [ProductController::class, 'destroy']);
    Route::delete('/api/product-images/{image}', [ProductController::class, 'deleteImage']);
});

// ==================== BREEZE AUTH ROUTES ====================
require __DIR__ . '/auth.php';

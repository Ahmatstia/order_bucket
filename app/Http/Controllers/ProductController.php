<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/ProductIndex');
    }

    public function getAll(Request $request)
    {
        $query = Product::with('images')->orderBy('created_at', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $query->where('is_active', true);

        $products = $query->get();

        return response()->json($products);
    }

    public function getCategories()
    {
        $categories = Product::where('is_active', true)
            ->distinct('category')
            ->pluck('category')
            ->toArray();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'is_active' => 'boolean',
            ]);

            $product = Product::create($validated);

            if ($request->hasFile('images')) {
                $images = $request->file('images');

                foreach ($images as $index => $image) {
                    $imagePath = $image->store('products', 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'sort_order' => $index,
                        'is_primary' => $index === 0
                    ]);
                }
            }

            $product->load('images');

            return response()->json([
                'message' => 'Produk berhasil ditambahkan',
                'product' => $product
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating product:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Gagal menambahkan produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:100',
                'description' => 'nullable|string',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'images' => 'nullable|array',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'is_active' => 'sometimes|boolean',
            ]);

            $product->update($validated);

            if ($request->hasFile('images')) {
                $images = $request->file('images');

                foreach ($images as $index => $image) {
                    $imagePath = $image->store('products', 'public');

                    $maxSort = $product->images()->max('sort_order') ?? 0;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imagePath,
                        'sort_order' => $maxSort + $index + 1,
                        'is_primary' => false
                    ]);
                }
            }

            $product->load('images');

            return response()->json([
                'message' => 'Produk berhasil diupdate',
                'product' => $product
            ]);
        } catch (\Exception $e) {
            \Log::error('Error updating product:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Gagal mengupdate produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Product $product)
    {
        $product->load('images');
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        try {
            // Delete all product images
            foreach ($product->images as $image) {
                if (Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
            }

            $product->delete();

            return response()->json([
                'message' => 'Produk berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting product:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Gagal menghapus produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // API untuk delete single image
    public function deleteImage(ProductImage $image)
    {
        try {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }

            $image->delete();

            return response()->json([
                'message' => 'Gambar berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error deleting image:', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Gagal menghapus gambar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

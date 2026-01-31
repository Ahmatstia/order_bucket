<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Data produk
        $products = [
            [
                'name' => 'Bucket Roses Romantic',
                'category' => 'mawar',
                'description' => 'Bucket berisi 12 mawar merah segar dengan hiasan baby breath dan pita elegan.',
                'price' => 250000,
                'stock' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Bucket Sunflower Happiness',
                'category' => 'sunflower',
                'description' => 'Bucket bunga matahari cerah dengan tambahan gypsophila dan wrapping khusus.',
                'price' => 180000,
                'stock' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Bucket Lily Premium',
                'category' => 'lily',
                'description' => 'Lily putih dengan daun eucalyptus dalam bucket kayu natural.',
                'price' => 320000,
                'stock' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Bucket Mixed Flowers',
                'category' => 'mixed',
                'description' => 'Campuran mawar, gerbera, dan carnation dengan warna harmonis.',
                'price' => 210000,
                'stock' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Bucket Baby Pink',
                'category' => 'mawar',
                'description' => 'Rangkaian bunga warna pink soft untuk ulang tahun atau anniversary.',
                'price' => 195000,
                'stock' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Bucket Luxury Orchid',
                'category' => 'orchid',
                'description' => 'Anggrek ungu dalam bucket kristal dengan hiasan golden ribbon.',
                'price' => 450000,
                'stock' => 3,
                'is_active' => true,
            ],
        ];

        // Mapping kategori ke gambar yang tersedia
        $categoryImages = [
            'mawar' => [
                ['path' => 'products/mawar1.jpg', 'exists' => true],
                ['path' => 'products/mawar2.jpg', 'exists' => true],
                ['path' => 'products/mawar3.jpg', 'exists' => true],
            ],
            'sunflower' => [
                ['path' => 'products/sunflower1.jpg', 'exists' => true],
                ['path' => 'products/sunflower2.jpg', 'exists' => true],
            ],
            'lily' => [
                ['path' => 'products/lily1.jpg', 'exists' => true],
                ['path' => 'products/lily2.jpg', 'exists' => true],
            ],
            'mixed' => [
                ['path' => 'products/mawar1.jpg', 'exists' => true], // Fallback
                ['path' => 'products/sunflower1.jpg', 'exists' => true],
            ],
            'orchid' => [
                ['path' => 'products/lily1.jpg', 'exists' => true], // Fallback
                ['path' => 'products/mawar1.jpg', 'exists' => true],
            ],
        ];

        $this->command->info('🚀 Membuat produk dengan gambar lokal...');

        foreach ($products as $productData) {
            $product = Product::create($productData);
            $category = $productData['category'];

            $images = $categoryImages[$category] ?? $categoryImages['mawar'];

            foreach ($images as $index => $imageInfo) {
                // Cek apakah file benar-benar ada
                if ($imageInfo['exists'] && Storage::disk('public')->exists($imageInfo['path'])) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $imageInfo['path'],
                        'sort_order' => $index,
                        'is_primary' => $index === 0
                    ]);
                    $this->command->info("   📷 Menambahkan gambar: {$imageInfo['path']}");
                } else {
                    $this->command->warn("   ⚠️  Gambar {$imageInfo['path']} tidak ditemukan");
                }
            }

            $this->command->info("   ✅ Produk '{$productData['name']}' selesai");
        }

        $this->command->newLine();
        $this->command->info('🎉 Seeder selesai!');
        $this->command->info('💡 Test gambar di: http://localhost:8000/storage/products/mawar1.jpg');
    }
}

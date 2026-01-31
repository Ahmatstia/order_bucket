import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { useCart } from "../../contexts/CartContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import OnboardingModal from "../../Components/OnboardingModal";
import WhatsAppFloatingButton from "../../Components/WhatsAppFloatingButton";

export default function ProductDetail({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [productImages, setProductImages] = useState([]);

    const { addToCart, getItemQuantity } = useCart();
    const [customerName] = useLocalStorage("customer_name", "");

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching product ${productId}...`);

            const response = await fetch(`/api/products/${productId}`);

            if (!response.ok) {
                throw new Error("Produk tidak ditemukan");
            }

            const data = await response.json();
            console.log("📦 Product data from API:", data);
            setProduct(data);

            // Handle images dari database
            if (data.images && data.images.length > 0) {
                console.log("🖼️ Product has images:", data.images);

                // Ambil semua image_url dari array images
                const images = data.images
                    .map((img) => {
                        // Debug setiap gambar
                        console.log("Image data:", {
                            id: img.id,
                            image_path: img.image_path,
                            image_url: img.image_url,
                            is_primary: img.is_primary,
                        });

                        // Gunakan image_url jika ada, jika tidak generate dari image_path
                        if (img.image_url) {
                            return img.image_url;
                        } else if (img.image_path) {
                            // Generate URL manual
                            return `http://localhost:8000/storage/${img.image_path}`;
                        }
                        return null;
                    })
                    .filter((url) => url !== null); // Filter out null values

                console.log("✅ Processed images URLs:", images);
                setProductImages(images);

                // Set selected image ke primary jika ada
                const primaryIndex = data.images.findIndex(
                    (img) => img.is_primary,
                );
                if (primaryIndex !== -1) {
                    setSelectedImage(primaryIndex);
                }
            } else {
                console.log("⚠️ Product has no images");
                // Fallback ke gambar placeholder lokal
                setProductImages(["/images/placeholder.jpg"]);
            }
        } catch (error) {
            console.error("❌ Error fetching product:", error);
            setError(error.message);

            // Fallback dummy data untuk development
            setProduct({
                id: parseInt(productId),
                name: `Bucket Bunga Premium ${productId}`,
                category: "premium",
                description:
                    "Bucket bunga premium dengan rangkaian bunga segar pilihan. Cocok untuk anniversary, ulang tahun, atau sebagai hadiah spesial. Bunga disusun oleh florist profesional dengan perhatian pada detail dan estetika.",
                price: 350000,
                stock: 10,
                rating: 4.8,
                is_active: true,
                features: [
                    "Bunga segar langsung dari petani",
                    "Free greeting card",
                    "Packaging eksklusif",
                    "Same day delivery",
                    "Free konsultasi florist",
                ],
                care_tips: [
                    "Simpan di tempat sejuk jauh dari sinar matahari langsung",
                    "Ganti air setiap 2 hari",
                    "Potong sedikit batang bunga secara diagonal",
                    "Hindarkan dari buah yang menghasilkan ethylene",
                ],
            });

            // Fallback images
            setProductImages(["/images/placeholder.jpg"]);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;

        const phoneNumber = "6281234567890";
        const message =
            `Halo admin BucketBouquets! 😊\n\n` +
            `Saya ${customerName || "Customer"} mau pesan:\n` +
            `📦 *${product.name}*\n` +
            `💰 Harga: Rp ${product.price.toLocaleString("id-ID")}\n` +
            `📦 Jumlah: ${quantity}\n` +
            `💰 Total: Rp ${(product.price * quantity).toLocaleString("id-ID")}\n\n` +
            `Bisa dikirim hari ini? Terima kasih! 🌸`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        alert(`Ditambahkan ke keranjang: ${quantity} ${product.name}`);
    };

    const incrementQuantity = () => {
        if (quantity < (product?.stock || 10)) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const quantityInCart = getItemQuantity(product?.id);

    if (loading) {
        return (
            <AppLayout>
                <div className="max-w-6xl mx-auto py-12">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded-xl"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (error || !product) {
        return (
            <AppLayout>
                <div className="max-w-6xl mx-auto py-12 text-center">
                    <div className="text-6xl mb-6">🌼</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Produk Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Produk yang Anda cari tidak tersedia atau telah dihapus.
                    </p>
                    <Link href="/catalog" className="btn btn-primary px-6 py-3">
                        Kembali ke Katalog
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto py-6 md:py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <Link href="/" className="hover:text-primary-600">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalog" className="hover:text-primary-600">
                        Katalog
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">
                        {product.name}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Product Images */}
                    <div>
                        {/* Debug Info */}
                        {productImages.length === 0 && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ Produk ini belum memiliki gambar.
                                </p>
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="mb-4">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden h-80 md:h-96">
                                {productImages.length > 0 ? (
                                    <img
                                        src={productImages[selectedImage]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            console.error(
                                                "❌ Gambar gagal load:",
                                                e.target.src,
                                            );
                                            // Coba URL alternatif jika ada image_path
                                            if (
                                                product.images &&
                                                product.images[selectedImage]
                                                    ?.image_path
                                            ) {
                                                const altUrl = `http://localhost:8000/storage/${product.images[selectedImage].image_path}`;
                                                console.log(
                                                    "🔄 Coba URL alternatif:",
                                                    altUrl,
                                                );
                                                e.target.src = altUrl;
                                            } else {
                                                // Show placeholder
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/images/placeholder.jpg";
                                            }
                                        }}
                                        onLoad={() =>
                                            console.log(
                                                "✅ Gambar berhasil load",
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-6xl mb-4">
                                                💐
                                            </span>
                                            <p className="text-gray-500">
                                                Gambar tidak tersedia
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {productImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-primary-500" : "border-gray-200"}`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error(
                                                    "Thumbnail gagal load:",
                                                    e.target.src,
                                                );
                                                if (
                                                    product.images &&
                                                    product.images[index]
                                                        ?.image_path
                                                ) {
                                                    e.target.src = `http://localhost:8000/storage/${product.images[index].image_path}`;
                                                } else {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/images/placeholder.jpg";
                                                }
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Image Counter */}
                        {productImages.length > 0 && (
                            <div className="mt-3 text-sm text-gray-600">
                                Gambar {selectedImage + 1} dari{" "}
                                {productImages.length}
                            </div>
                        )}

                        {/* Product Tags */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                💐 {product.category}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${product.stock > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                            >
                                {product.stock > 5
                                    ? "🟢 Stok Tersedia"
                                    : "🟡 Stok Terbatas"}
                            </span>
                            {product.images && product.images.length > 0 && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                    📸 {product.images.length} gambar
                                </span>
                            )}
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                ⭐ {product.rating || "4.5"}
                            </span>
                            {product.is_active && (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                                    ✅ Aktif
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold text-primary-600">
                                    Rp {product.price.toLocaleString("id-ID")}
                                </div>
                                <div className="text-gray-500 line-through text-lg">
                                    Rp{" "}
                                    {(product.price * 1.2).toLocaleString(
                                        "id-ID",
                                    )}
                                </div>
                                <div className="px-2 py-1 bg-red-100 text-red-800 text-sm font-bold rounded">
                                    -20%
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Stock Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700">
                                        Stok Tersedia:
                                    </span>
                                    <span className="font-bold">
                                        {product.stock} unit
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{
                                            width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Pilih Jumlah:
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-xl">
                                    <button
                                        onClick={decrementQuantity}
                                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <div className="w-16 h-12 flex items-center justify-center text-lg font-bold">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={incrementQuantity}
                                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-gray-700">
                                    <div className="font-bold">
                                        Rp{" "}
                                        {(
                                            product.price * quantity
                                        ).toLocaleString("id-ID")}
                                    </div>
                                    <div className="text-sm">
                                        {quantity} × Rp{" "}
                                        {product.price.toLocaleString("id-ID")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl"
                            >
                                <span>🛒</span>
                                <span className="font-bold">
                                    {quantityInCart > 0
                                        ? `Tambah ke Keranjang (${quantityInCart} di cart)`
                                        : "Tambah ke Keranjang"}
                                </span>
                            </button>

                            <button
                                onClick={handleWhatsAppOrder}
                                className="btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-4 rounded-xl border-2 border-green-600"
                            >
                                <span>💬</span>
                                <span className="font-bold">
                                    Pesan Langsung via WhatsApp
                                </span>
                            </button>

                            <Link
                                href="/catalog"
                                className="btn w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-xl"
                            >
                                ← Kembali ke Katalog
                            </Link>
                        </div>

                        {/* Product Features */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                🌟 Keunggulan Produk
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Bunga segar langsung dari petani lokal",
                                    "Free greeting card & packaging eksklusif",
                                    "Same day delivery (pesan sebelum jam 2 siang)",
                                    "Free konsultasi dengan florist kami",
                                    "Garansi kesegaran bunga 2 hari",
                                    "Bisa custom request warna & jenis bunga",
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-green-600 mt-0.5">
                                            ✓
                                        </span>
                                        <span className="text-gray-700 text-sm">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Care Tips */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <h3 className="text-lg font-bold text-blue-900 mb-2">
                                💡 Tips Perawatan
                            </h3>
                            <ul className="text-blue-800 text-sm space-y-1">
                                <li>
                                    • Simpan di tempat sejuk, hindari sinar
                                    matahari langsung
                                </li>
                                <li>
                                    • Ganti air setiap 2 hari untuk menjaga
                                    kesegaran
                                </li>
                                <li>
                                    • Potong sedikit batang bunga secara
                                    diagonal
                                </li>
                                <li>
                                    • Hindarkan dari buah yang menghasilkan
                                    ethylene
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Produk Serupa Lainnya
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Placeholder for related products */}
                        {[1, 2, 3, 4].map((i) => (
                            <Link
                                key={i}
                                href={`/product/${i}`}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="h-40 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg mb-4 flex items-center justify-center">
                                    <span className="text-4xl">💐</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                    Bucket Bunga {i}
                                </h3>
                                <div className="text-primary-600 font-bold">
                                    Rp{" "}
                                    {(250000 + i * 50000).toLocaleString(
                                        "id-ID",
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Development Note */}
                <div className="mt-12 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-800 text-sm">
                        <span className="font-bold">FITUR BARU:</span> Multiple
                        images support aktif! Produk bisa memiliki beberapa
                        gambar.
                    </p>
                </div>
            </div>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

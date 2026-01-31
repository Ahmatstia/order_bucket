import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AddToCartButton from "./AddToCartButton";
import { Link } from "@inertiajs/react";

export default function ProductCard({ product }) {
    const [customerName] = useLocalStorage("customer_name", "");

    // Fungsi untuk mendapatkan gambar utama
    const getPrimaryImage = () => {
        if (product.images && product.images.length > 0) {
            const primary = product.images.find(
                (img) => img.is_primary === true,
            );
            if (primary) {
                if (primary.image_url) return primary.image_url;
                if (primary.image_path) {
                    return `http://localhost:8000/storage/${primary.image_path}`;
                }
            }

            const firstImage = product.images[0];
            if (firstImage) {
                if (firstImage.image_url) return firstImage.image_url;
                if (firstImage.image_path) {
                    return `http://localhost:8000/storage/${firstImage.image_path}`;
                }
            }
        }

        if (product.image_url) return product.image_url;
        return null;
    };

    const getImageCount = () => {
        return product.images ? product.images.length : 0;
    };

    const handleWhatsAppOrder = () => {
        const phoneNumber = "6282371663414";
        const message =
            `Halo admin BucketBouquets! 😊\n\n` +
            `Saya ${customerName || "Customer"} mau pesan:\n` +
            `📦 *${product.name}*\n` +
            `💰 Harga: Rp ${product.price.toLocaleString("id-ID")}\n\n` +
            `Bisa dikirim hari ini? Terima kasih! 🌸`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    };

    const primaryImage = getPrimaryImage();
    const imageCount = getImageCount();

    return (
        <div className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Product Image - Link ke detail */}
            <Link href={`/product/${product.id}`} className="block">
                <div className="h-48 md:h-56 bg-gradient-to-br from-primary-50 to-pink-50 flex items-center justify-center overflow-hidden relative">
                    {primaryImage ? (
                        <div className="relative w-full h-full overflow-hidden">
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                loading="lazy"
                                onError={(e) => {
                                    if (product.images?.[0]?.image_path) {
                                        e.target.src = `http://localhost:8000/storage/${product.images[0].image_path}`;
                                        return;
                                    }
                                    e.target.style.display = "none";
                                    const container = e.target.parentElement;
                                    container.innerHTML = `
                                        <div class="text-center p-4 w-full h-full flex flex-col items-center justify-center">
                                            <span class="text-5xl md:text-6xl mb-2">💐</span>
                                            <p class="text-gray-500 text-sm px-2">${product.name}</p>
                                            <p class="text-xs text-red-500 mt-2">Gambar gagal dimuat</p>
                                        </div>
                                    `;
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                            {/* Badge jumlah gambar jika lebih dari 1 */}
                            {imageCount > 1 && (
                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                    📸 {imageCount} gambar
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-4">
                            <span className="text-5xl md:text-6xl mb-2">
                                💐
                            </span>
                            <p className="text-gray-500 text-sm px-2">
                                {product.name}
                            </p>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm">
                            {product.category === "premium"
                                ? "⭐ Premium"
                                : "🌸 " + (product.category || "Bucket")}
                        </span>
                    </div>

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                product.stock > 5
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                            {product.stock > 5 ? "Tersedia" : "Terbatas"}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4 md:p-5">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <Link
                        href={`/product/${product.id}`}
                        className="hover:text-primary-600 flex-1 mr-2"
                    >
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                    <span className="text-primary-600 font-bold text-lg md:text-xl whitespace-nowrap">
                        Rp {parseFloat(product.price).toLocaleString("id-ID")}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <span className="mr-1 text-yellow-500">⭐</span>
                        <span>{product.rating || "4.5"}</span>
                        <span className="mx-2">•</span>
                        <span>{product.stock} stok</span>
                    </div>
                    <div className="text-xs">
                        <span className="text-green-600">●</span> Ready Stock
                    </div>
                </div>

                {/* Compact Action Buttons */}
                <div className="flex gap-3">
                    {/* Keranjang Utama */}
                    <div className="flex-1">
                        <AddToCartButton product={product} />
                    </div>

                    {/* WhatsApp Button - Icon Only */}
                    <button
                        onClick={handleWhatsAppOrder}
                        title="Pesan via WhatsApp"
                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl border border-green-300 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="text-xl">💬</span>
                    </button>
                </div>

                {/* Note jika belum isi nama */}
                {!customerName && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        Isi nama dulu yuk biar pesan otomatis 😊
                    </p>
                )}
            </div>
        </div>
    );
}

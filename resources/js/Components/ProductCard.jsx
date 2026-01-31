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
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg">
            {/* Product Image */}
            <Link href={`/product/${product.id}`} className="block relative">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {primaryImage ? (
                        <>
                            <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                    if (product.images?.[0]?.image_path) {
                                        e.target.src = `http://localhost:8000/storage/${product.images[0].image_path}`;
                                        return;
                                    }
                                    e.target.style.display = "none";
                                    const container = e.target.parentElement;
                                    container.innerHTML = `
                                        <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                            <span class="text-6xl mb-3">💐</span>
                                            <p class="text-gray-600 text-sm font-medium">${product.name}</p>
                                        </div>
                                    `;
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                            <span className="text-6xl mb-3">💐</span>
                            <p className="text-gray-600 text-sm font-medium">
                                {product.name}
                            </p>
                        </div>
                    )}

                    {/* Badges - Top Corners */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        {/* Category Badge */}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm">
                            {product.category === "premium"
                                ? "⭐ Premium"
                                : "🌸 " + (product.category || "Bucket")}
                        </span>

                        {/* Image Count */}
                        {imageCount > 1 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 backdrop-blur-sm text-white">
                                📸 {imageCount}
                            </span>
                        )}
                    </div>

                    {/* Stock Badge - Bottom */}
                    <div className="absolute bottom-3 left-3">
                        <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                                product.stock > 5
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                            }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    product.stock > 5
                                        ? "bg-emerald-500"
                                        : "bg-amber-500"
                                }`}
                            ></span>
                            {product.stock > 5 ? "Tersedia" : "Terbatas"}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Title & Price */}
                <div className="mb-3">
                    <Link
                        href={`/product/${product.id}`}
                        className="group/title"
                    >
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1.5 group-hover/title:text-rose-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-rose-600">
                            Rp{" "}
                            {parseFloat(product.price).toLocaleString("id-ID")}
                        </span>
                        <span className="text-xs text-gray-500">
                            • {product.stock} stok
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {/* Add to Cart */}
                    <div className="flex-1">
                        <AddToCartButton product={product} />
                    </div>

                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsAppOrder}
                        title="Pesan via WhatsApp"
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </button>
                </div>

                {/* Note - Optional */}
                {!customerName && (
                    <p className="text-xs text-gray-400 mt-2.5 text-center">
                        💡 Isi nama untuk pesan otomatis via WhatsApp
                    </p>
                )}
            </div>
        </div>
    );
}

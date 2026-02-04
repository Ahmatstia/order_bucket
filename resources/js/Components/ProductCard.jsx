import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AddToCartButton from "./AddToCartButton";
import { Link } from "@inertiajs/react";
// IMPORT FUNGSI WHATSAPP UTILS
import {
    generateWhatsAppMessage,
    sendWhatsAppMessage,
} from "../utils/whatsapp";

export default function ProductCard({ product }) {
    const [customerName] = useLocalStorage("customer_name", "");

    // Fungsi untuk mendapatkan gambar utama dengan lebih baik
    const getPrimaryImage = () => {
        if (!product) return null;

        // Cek apakah ada images array
        if (
            product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {
            // Cari gambar utama
            const primary = product.images.find(
                (img) => img.is_primary === true || img.is_primary === 1,
            );
            if (primary) {
                // Prioritize image_url, fallback to image_path
                return (
                    primary.image_url ||
                    (primary.image_path
                        ? `/storage/${primary.image_path}`
                        : null)
                );
            }

            // Gunakan gambar pertama
            const firstImage = product.images[0];
            return (
                firstImage.image_url ||
                (firstImage.image_path
                    ? `/storage/${firstImage.image_path}`
                    : null)
            );
        }

        // Fallback ke image_url langsung di product
        if (product.image_url) return product.image_url;

        // Fallback ke image_path langsung di product
        if (product.image_path) return `/storage/${product.image_path}`;

        return null;
    };

    const getImageCount = () => {
        return product.images && Array.isArray(product.images)
            ? product.images.length
            : 0;
    };

    const handleWhatsAppOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product) return;

        // GUNAKAN FUNGSI UTILITAS WHATSAPP
        const message = generateWhatsAppMessage(product, customerName);
        sendWhatsAppMessage(message);
    };

    const primaryImage = getPrimaryImage();
    const imageCount = getImageCount();
    const price = product?.price ? parseFloat(product.price) : 0;
    const stock = product?.stock || 0;
    const productName = product?.name || "Produk Bucket Bunga";

    if (!product) return null;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Product Image */}
            <Link
                href={`/product/${product.id}`}
                className="block relative"
                aria-label={`Lihat detail ${productName}`}
            >
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {primaryImage ? (
                        <>
                            <img
                                src={primaryImage}
                                alt={productName}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                    console.error(
                                        "❌ Image failed to load:",
                                        e.target.src,
                                    );
                                    e.target.style.display = "none";
                                    const container = e.target.parentElement;
                                    container.innerHTML = `
                                        <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                            <span class="text-6xl mb-3">💐</span>
                                            <p class="text-gray-600 text-sm font-medium">${productName}</p>
                                        </div>
                                    `;
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Image Loader (sementara) */}
                            <div className="absolute inset-0 bg-gray-100 animate-pulse opacity-0 group-hover:opacity-0 transition-opacity duration-300"></div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-rose-50 to-pink-50">
                            <span className="text-6xl mb-3">💐</span>
                            <p className="text-gray-600 text-sm font-medium">
                                {productName}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Gambar akan segera tersedia
                            </p>
                        </div>
                    )}

                    {/* Badges - Top Corners */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        {/* Category Badge */}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm border border-white/50">
                            {product.category === "premium" ? (
                                <>
                                    <span className="text-yellow-500 mr-1">
                                        ⭐
                                    </span>{" "}
                                    Premium
                                </>
                            ) : product.category === "standard" ? (
                                <>
                                    <span className="text-blue-500 mr-1">
                                        🌸
                                    </span>{" "}
                                    Standard
                                </>
                            ) : (
                                <>
                                    <span className="text-rose-500 mr-1">
                                        💐
                                    </span>{" "}
                                    {product.category || "Bucket"}
                                </>
                            )}
                        </span>

                        {/* Image Count */}
                        {imageCount > 1 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-black/70 backdrop-blur-sm text-white border border-white/20">
                                <span className="mr-1">📸</span> {imageCount}
                            </span>
                        )}
                    </div>

                    {/* Price Tag - Bottom Right */}
                    <div className="absolute bottom-3 right-3">
                        <div className="inline-flex flex-col items-end">
                            <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-bold">
                                Rp {price.toLocaleString("id-ID")}
                            </div>
                        </div>
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
                            Klik untuk detail
                        </div>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Title dengan stok di sebelah kanan */}
                <div className="flex items-start justify-between mb-2">
                    {/* Nama Produk */}
                    <Link
                        href={`/product/${product.id}`}
                        className="group/title flex-1"
                    >
                        <h3
                            className="text-base font-semibold text-gray-900 line-clamp-2 group-hover/title:text-rose-600 transition-colors hover:underline pr-2"
                            title={productName}
                        >
                            {productName}
                        </h3>
                    </Link>

                    {/* Stok di sebelah kanan */}
                    <div className="flex-shrink-0">
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                                stock === 0
                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                    : stock <= 5
                                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                        >
                            {stock === 0 ? (
                                <>
                                    <span className="text-xs">⛔</span>
                                    <span>Habis</span>
                                </>
                            ) : stock <= 5 ? (
                                <>
                                    <span className="text-xs">⚠️</span>
                                    <span>{stock}</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xs">✓</span>
                                    <span>{stock}</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Rating & Reviews (jika ada) */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                        star <= Math.floor(product.rating || 4)
                                            ? "text-amber-400 fill-current"
                                            : "text-gray-300"
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    />
                                </svg>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            {product.rating} • {product.review_count || "0"}{" "}
                            ulasan
                        </span>
                    </div>
                )}

                {/* Short Description (jika ada) */}
                {product.short_description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {product.short_description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    {/* Add to Cart */}
                    <div className="flex-1">
                        <AddToCartButton product={product} variant="compact" />
                    </div>

                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsAppOrder}
                        title="Pesan cepat via WhatsApp"
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group/wa"
                        aria-label="Pesan via WhatsApp"
                    >
                        <span className="text-lg">💬</span>

                        {/* WhatsApp Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/wa:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Pesan via WhatsApp
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                        </div>
                    </button>
                </div>

                {/* Note - Optional */}
                {!customerName && stock > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                        <p className="text-xs text-amber-700 text-center">
                            <span className="font-medium">💡 Tips:</span> Isi
                            nama Anda untuk pesan otomatis via WhatsApp
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

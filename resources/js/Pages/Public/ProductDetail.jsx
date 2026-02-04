import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { useCart } from "../../contexts/CartContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import OnboardingModal from "../../Components/OnboardingModal";
import WhatsAppFloatingButton from "../../Components/WhatsAppFloatingButton";
// IMPORT FUNGSI WHATSAPP UTILS
import {
    generateWhatsAppMessage,
    sendWhatsAppMessage,
} from "../../utils/whatsapp";

export default function ProductDetail({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [productImages, setProductImages] = useState([]);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

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

                const images = data.images
                    .map((img) => {
                        console.log("Image data:", {
                            id: img.id,
                            image_path: img.image_path,
                            image_url: img.image_url,
                            is_primary: img.is_primary,
                        });

                        if (img.image_url) {
                            return img.image_url;
                        } else if (img.image_path) {
                            return `/storage/${img.image_path}`; // Gunakan path relatif
                        }
                        return null;
                    })
                    .filter((url) => url !== null);

                console.log("✅ Processed images URLs:", images);
                setProductImages(images);

                const primaryIndex = data.images.findIndex(
                    (img) => img.is_primary,
                );
                if (primaryIndex !== -1) {
                    setSelectedImage(primaryIndex);
                }
            } else {
                console.log("⚠️ Product has no images");
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
            });

            setProductImages(["/images/placeholder.jpg"]);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;

        // GUNAKAN FUNGSI UTILITAS WHATSAPP
        const message = generateWhatsAppMessage(product, customerName);
        sendWhatsAppMessage(message);
    };

    const handleAddToCart = () => {
        if (!product) return;

        setAddingToCart(true);
        addToCart(product, quantity);

        // Feedback visual
        setTimeout(() => {
            setAddingToCart(false);
        }, 1000);
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
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
                `}</style>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl"></div>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-20 h-20 bg-gray-200 rounded-xl"
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                                <div className="h-24 bg-gray-200 rounded-lg"></div>
                                <div className="h-16 bg-gray-200 rounded-lg"></div>
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
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-5xl">🌼</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Produk Tidak Ditemukan
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Produk yang Anda cari tidak tersedia atau telah
                            dihapus dari katalog kami.
                        </p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
                
                .product-detail-container {
                    font-family: 'DM Sans', sans-serif;
                }
                
                .product-title {
                    font-family: 'Playfair Display', serif;
                }
                
                .image-zoom {
                    cursor: zoom-in;
                    transition: transform 0.3s ease;
                }
                
                .image-zoom:hover {
                    transform: scale(1.02);
                }
                
                .thumbnail-scroll::-webkit-scrollbar {
                    height: 6px;
                }
                
                .thumbnail-scroll::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .thumbnail-scroll::-webkit-scrollbar-thumb {
                    background: #f43f5e;
                    border-radius: 10px;
                }
                
                .thumbnail-scroll::-webkit-scrollbar-thumb:hover {
                    background: #e11d48;
                }
                
                /* Animasi untuk tombol cart */
                @keyframes cartBounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                
                .cart-added {
                    animation: cartBounce 0.5s ease;
                }
            `}</style>

            <div className="product-detail-container bg-gradient-to-b from-white via-rose-50/20 to-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb - Modern */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-500 hover:text-rose-600 transition-colors"
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link
                                    href="/catalog"
                                    className="text-gray-500 hover:text-rose-600 transition-colors"
                                >
                                    Katalog
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900 font-medium truncate max-w-xs">
                                {product.name}
                            </li>
                        </ol>
                    </nav>

                    {/* Main Product Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Left Column - Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                <div className="aspect-square">
                                    {productImages.length > 0 ? (
                                        <img
                                            src={productImages[selectedImage]}
                                            alt={product.name}
                                            className="w-full h-full object-cover image-zoom"
                                            onClick={() =>
                                                setIsImageZoomed(!isImageZoomed)
                                            }
                                            onError={(e) => {
                                                console.error(
                                                    "❌ Gambar gagal load:",
                                                    e.target.src,
                                                );
                                                if (
                                                    product.images?.[
                                                        selectedImage
                                                    ]?.image_path
                                                ) {
                                                    e.target.src = `/storage/${product.images[selectedImage].image_path}`;
                                                } else {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "/images/placeholder.jpg";
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                            <div className="text-center p-8">
                                                <span className="text-7xl mb-4 block">
                                                    💐
                                                </span>
                                                <p className="text-gray-500 font-medium">
                                                    Gambar tidak tersedia
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Image Counter Badge */}
                                {productImages.length > 1 && (
                                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                                        {selectedImage + 1} /{" "}
                                        {productImages.length}
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {productImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setSelectedImage((prev) =>
                                                    prev === 0
                                                        ? productImages.length -
                                                          1
                                                        : prev - 1,
                                                )
                                            }
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                                            aria-label="Previous image"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-700"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedImage((prev) =>
                                                    prev ===
                                                    productImages.length - 1
                                                        ? 0
                                                        : prev + 1,
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
                                            aria-label="Next image"
                                        >
                                            <svg
                                                className="w-5 h-5 text-gray-700"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery */}
                            {productImages.length > 1 && (
                                <div className="thumbnail-scroll flex gap-3 overflow-x-auto pb-2">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                selectedImage === index
                                                    ? "border-rose-500 shadow-md scale-105"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            aria-label={`View image ${index + 1}`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    if (
                                                        product.images?.[index]
                                                            ?.image_path
                                                    ) {
                                                        e.target.src = `/storage/${product.images[index].image_path}`;
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

                            {/* Product Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-semibold">
                                    🌸 {product.category}
                                </span>
                                <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                        product.stock > 5
                                            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                            : "bg-amber-50 border border-amber-200 text-amber-700"
                                    }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${
                                            product.stock > 5
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                        }`}
                                    ></span>
                                    {product.stock > 5
                                        ? "Tersedia"
                                        : "Stok Terbatas"}
                                </span>
                                {product.rating && (
                                    <span className="inline-flex items-center px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-semibold">
                                        ⭐ {product.rating}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="space-y-6">
                            {/* Title & Rating */}
                            <div>
                                <h1 className="product-title text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                {/* Rating & Reviews */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${
                                                    star <=
                                                    Math.floor(
                                                        product.rating || 4.8,
                                                    )
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
                                    <span className="text-gray-600 text-sm">
                                        {product.rating || "4.8"} • 127 ulasan
                                    </span>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-4xl font-bold text-rose-600">
                                        Rp{" "}
                                        {product.price.toLocaleString("id-ID")}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg text-gray-400 line-through">
                                            Rp{" "}
                                            {(
                                                product.price * 1.2
                                            ).toLocaleString("id-ID")}
                                        </span>
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                            -20%
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Hemat Rp{" "}
                                    {(product.price * 0.2).toLocaleString(
                                        "id-ID",
                                    )}{" "}
                                    dari harga normal
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Deskripsi Produk
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock Progress */}
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Stok Tersedia
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {product.stock} unit
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {product.stock > 10
                                        ? "Stok melimpah"
                                        : product.stock > 5
                                          ? "Stok terbatas"
                                          : "Buruan pesan sebelum habis!"}
                                </p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="bg-white rounded-xl p-5 border border-gray-100">
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Pilih Jumlah
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                                        <button
                                            onClick={decrementQuantity}
                                            disabled={quantity <= 1}
                                            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Decrease quantity"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M20 12H4"
                                                />
                                            </svg>
                                        </button>
                                        <div className="w-16 h-12 flex items-center justify-center text-xl font-bold text-gray-900">
                                            {quantity}
                                        </div>
                                        <button
                                            onClick={incrementQuantity}
                                            disabled={quantity >= product.stock}
                                            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label="Increase quantity"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-gray-900">
                                            Rp{" "}
                                            {(
                                                product.price * quantity
                                            ).toLocaleString("id-ID")}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {quantity} item × Rp{" "}
                                            {product.price.toLocaleString(
                                                "id-ID",
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className={`group relative w-full h-14 overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl ${addingToCart ? "cart-added" : ""}`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 transition-all duration-300 group-hover:from-rose-600 group-hover:via-pink-600 group-hover:to-rose-700"></div>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                                    </div>
                                    <div className="relative flex items-center justify-center gap-3 h-full">
                                        {addingToCart ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-white font-bold text-lg">
                                                    Menambahkan...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                                    />
                                                </svg>
                                                <span className="text-white font-bold text-lg">
                                                    {quantityInCart > 0
                                                        ? `Tambah ke Keranjang (${quantityInCart} item)`
                                                        : "Tambah ke Keranjang"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                {/* WhatsApp Order Button */}
                                <button
                                    onClick={handleWhatsAppOrder}
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl group"
                                >
                                    <span className="text-xl">💬</span>
                                    <span>Pesan via WhatsApp</span>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        →
                                    </span>
                                </button>

                                {/* Quick Checkout Note */}
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <p className="text-sm text-blue-700 flex items-center gap-2">
                                        <span className="text-lg">⚡</span>
                                        <span>
                                            <strong>Checkout Cepat:</strong>{" "}
                                            Klik "Pesan via WhatsApp" untuk
                                            langsung konfirmasi dengan admin.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features & Benefits */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Features */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="text-2xl">✨</span>
                                Keunggulan Produk
                            </h3>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: "🌸",
                                        text: "Bunga segar langsung dari petani lokal",
                                    },
                                    {
                                        icon: "🎁",
                                        text: "Free greeting card & packaging eksklusif",
                                    },
                                    {
                                        icon: "🚚",
                                        text: "Same day delivery (pesan sebelum jam 2 siang)",
                                    },
                                    {
                                        icon: "👨‍🌾",
                                        text: "Free konsultasi dengan florist profesional",
                                    },
                                    {
                                        icon: "✅",
                                        text: "Garansi kesegaran bunga 2 hari",
                                    },
                                    {
                                        icon: "🎨",
                                        text: "Bisa custom request warna & jenis bunga",
                                    },
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-2xl flex-shrink-0">
                                            {feature.icon}
                                        </span>
                                        <span className="text-gray-700 leading-relaxed">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Care Tips */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                                <span className="text-2xl">💡</span>
                                Tips Perawatan
                            </h3>
                            <div className="space-y-4">
                                {[
                                    "Simpan di tempat sejuk, hindari sinar matahari langsung",
                                    "Ganti air setiap 2 hari untuk menjaga kesegaran",
                                    "Potong sedikit batang bunga secara diagonal",
                                    "Hindarkan dari buah yang menghasilkan ethylene",
                                    "Semprotkan air pada bunga secara berkala",
                                    "Jauhkan dari AC atau kipas angin langsung",
                                ].map((tip, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3"
                                    >
                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <span className="text-blue-900 leading-relaxed">
                                            {tip}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Produk Serupa
                            </h2>
                            <Link
                                href="/catalog"
                                className="text-rose-600 hover:text-rose-700 font-semibold text-sm flex items-center gap-1"
                            >
                                Lihat Semua
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Link
                                    key={i}
                                    href={`/product/${i}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center overflow-hidden">
                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                            💐
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                            Bucket Bunga Premium {i}
                                        </h3>
                                        <div className="text-rose-600 font-bold text-lg">
                                            Rp{" "}
                                            {(
                                                250000 +
                                                i * 50000
                                            ).toLocaleString("id-ID")}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2">
                                            <svg
                                                className="w-4 h-4 text-amber-400 fill-current"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span className="text-xs text-gray-600">
                                                4.{8 - i}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* WhatsApp Quick Help */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-12">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-900">
                                        Butuh Bantuan?
                                    </h3>
                                    <p className="text-emerald-700">
                                        Admin siap membantu 24/7 via WhatsApp
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleWhatsAppOrder}
                                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                            >
                                <span>💬</span>
                                Chat Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

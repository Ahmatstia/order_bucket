import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import WhatsAppFloatingButton from "../Components/WhatsAppFloatingButton";
import OnboardingModal from "../Components/OnboardingModal";
import ProductCard from "../Components/ProductCard"; // Import komponen ProductCard
import {
    FaWhatsapp,
    FaChevronRight,
    FaHeart,
    FaCheck,
    FaTruck,
    FaLeaf,
    FaGift,
    FaShieldAlt,
    FaClock,
} from "react-icons/fa";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products");

            if (response.ok) {
                const data = await response.json();
                const activeProducts = data.filter((p) => p.is_active);

                // Featured products (first 4)
                setFeaturedProducts(activeProducts.slice(0, 4));

                // Best seller products (next 4 or random)
                setBestSellerProducts(
                    activeProducts.slice(4, 8).length > 0
                        ? activeProducts.slice(4, 8)
                        : activeProducts.slice(0, 4),
                );
            } else {
                // Fallback data - tambahkan properties yang diperlukan untuk ProductCard
                const fallbackProducts = getFallbackProducts();
                setFeaturedProducts(fallbackProducts.slice(0, 4));
                setBestSellerProducts(fallbackProducts.slice(0, 4));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            const fallbackProducts = getFallbackProducts();
            setFeaturedProducts(fallbackProducts.slice(0, 4));
            setBestSellerProducts(fallbackProducts.slice(0, 4));
        } finally {
            setLoading(false);
        }
    };

    const getFallbackProducts = () => {
        return [
            {
                id: 1,
                name: "Sweet Rose Bouquet",
                price: 250000,
                category: "bucket",
                stock: 15,
                rating: 4.9,
                description: "Buket mawar merah segar dengan dekorasi elegan",
                images: [
                    {
                        image_url: "/images/fallback/rose-bouquet.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 2,
                name: "Eternal Love Bouquet",
                price: 350000,
                category: "premium",
                stock: 8,
                rating: 5.0,
                description: "Buket bunga premium untuk ungkapan cinta abadi",
                images: [
                    {
                        image_url: "/images/fallback/love-bouquet.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 3,
                name: "Pastel Bloom Bouquet",
                price: 275000,
                category: "bucket",
                stock: 12,
                rating: 4.8,
                description:
                    "Perpaduan warna pastel yang lembut dan menenangkan",
                images: [
                    {
                        image_url: "/images/fallback/pastel-bouquet.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 4,
                name: "Bucket Roses Romantic",
                price: 280000,
                category: "bucket",
                stock: 10,
                rating: 4.9,
                description: "Bucket mawar romantis dengan sentuhan klasik",
                images: [
                    {
                        image_url: "/images/fallback/romantic-bucket.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 5,
                name: "Sunflower Joy Bucket",
                price: 220000,
                category: "bucket",
                stock: 20,
                rating: 4.7,
                description: "Bucket bunga matahari yang cerah dan ceria",
                images: [
                    {
                        image_url: "/images/fallback/sunflower-bucket.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 6,
                name: "Luxury Orchid Bouquet",
                price: 450000,
                category: "premium",
                stock: 5,
                rating: 5.0,
                description: "Buket anggrek mewah untuk momen spesial",
                images: [
                    {
                        image_url: "/images/fallback/orchid-bouquet.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 7,
                name: "Tulip Garden Bucket",
                price: 320000,
                category: "bucket",
                stock: 18,
                rating: 4.8,
                description: "Bucket tulip warna-warni seperti di taman",
                images: [
                    {
                        image_url: "/images/fallback/tulip-bucket.jpg",
                        is_primary: true,
                    },
                ],
            },
            {
                id: 8,
                name: "Lily Elegance Bouquet",
                price: 380000,
                category: "premium",
                stock: 7,
                rating: 4.9,
                description: "Buket lily elegan dengan aroma menyegarkan",
                images: [
                    {
                        image_url: "/images/fallback/lily-bouquet.jpg",
                        is_primary: true,
                    },
                ],
            },
        ];
    };

    const handleWhatsAppClick = () => {
        window.open("https://wa.me/6282371663414", "_blank");
    };

    const categories = [
        {
            id: 1,
            name: "Bucket Wisuda",
            icon: "🎓",
            color: "from-blue-400 to-purple-500",
            count: "15+ Variasi",
        },
        {
            id: 2,
            name: "Bucket Ulang Tahun",
            icon: "🎂",
            color: "from-pink-400 to-rose-500",
            count: "20+ Pilihan",
        },
        {
            id: 3,
            name: "Bucket Anniversary",
            icon: "💝",
            color: "from-rose-400 to-pink-500",
            count: "18+ Model",
        },
        {
            id: 4,
            name: "Bucket Custom",
            icon: "✨",
            color: "from-purple-400 to-indigo-500",
            count: "Custom Request",
        },
    ];

    const benefits = [
        {
            icon: <FaLeaf className="w-6 h-6" />,
            title: "Bunga Segar",
            description: "Dipetik langsung dari kebun setiap pagi",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            icon: <FaGift className="w-6 h-6" />,
            title: "Custom Sesuai Permintaan",
            description: "Warna dan jenis bunga bisa disesuaikan",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            icon: <FaTruck className="w-6 h-6" />,
            title: "Pengiriman Cepat",
            description: "Same day delivery untuk pesanan sebelum jam 2 siang",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: <FaShieldAlt className="w-6 h-6" />,
            title: "Garansi Kualitas",
            description: "Garansi uang kembali jika tidak puas",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: <FaClock className="w-6 h-6" />,
            title: "Buka 24/7",
            description: "Pesan kapan saja via WhatsApp",
            color: "text-amber-600",
            bgColor: "bg-amber-50",
        },
        {
            icon: "💝",
            title: "Kartu Ucapan Gratis",
            description: "Dilengkapi kartu ucapan personal",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
    ];

    const testimonials = [
        {
            name: "Sarah Wijaya",
            role: "Mahasiswa",
            comment:
                "Bucket bunganya cantik banget! Pacar saya sampai terharu. Terima kasih BucketBouquets!",
            rating: 5,
            product: "Sweet Rose Bouquet",
            avatar: "SW",
        },
        {
            name: "Budi Santoso",
            role: "Karyawan",
            comment:
                "Untuk anniversary ke-5 dengan istri. Bucketnya elegant dan istri sangat senang. Recommended!",
            rating: 5,
            product: "Eternal Love Bouquet",
            avatar: "BS",
        },
        {
            name: "Maya Indah",
            role: "Ibu Rumah Tangga",
            comment:
                "Pesen jam 11 pagi, jam 4 sore udah sampai. Fast response dan packing rapi. Puas banget!",
            rating: 5,
            product: "Pastel Bloom Bouquet",
            avatar: "MI",
        },
    ];

    const processSteps = [
        {
            step: "01",
            title: "Pilih Produk",
            description: "Browse koleksi bouquet kami dan pilih yang sesuai",
            icon: "🛍️",
            color: "from-pink-500 to-rose-500",
        },
        {
            step: "02",
            title: "Hubungi Kami",
            description: "Chat via WhatsApp untuk konfirmasi dan konsultasi",
            icon: "💬",
            color: "from-purple-500 to-pink-500",
        },
        {
            step: "03",
            title: "Proses Pesanan",
            description: "Tim kami merangkai dengan penuh kehati-hatian",
            icon: "🌸",
            color: "from-rose-500 to-pink-400",
        },
        {
            step: "04",
            title: "Pengiriman",
            description: "Dikirim fresh ke alamat tujuan tepat waktu",
            icon: "🚚",
            color: "from-pink-500 to-orange-400",
        },
    ];

    return (
        <AppLayout>
            {/* ==================== HERO SECTION ==================== */}
            <section
                className="relative w-full"
                style={{ marginTop: "-10rem", paddingTop: "10rem" }}
            >
                <div
                    className="w-full min-h-screen bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url(/storage/banners/hero1.png)",
                    }}
                />
            </section>

            {/* ==================== FEATURED PRODUCTS SECTION ==================== */}
            <section className="bg-gradient-to-b from-white to-pink-50 py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10 md:mb-12">
                            <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium mb-3">
                                🌟 TERBARU
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Produk Unggulan
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Koleksi terbaru yang siap mempesona hari spesial
                                Anda
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 rounded-xl aspect-[3/4] mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==================== BEST SELLER SECTION ==================== */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10 md:mb-12">
                            <div className="inline-block px-4 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium mb-3">
                                ⭐ BEST SELLER
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Pilihan Terpopuler
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Produk terfavorit yang selalu dipilih oleh
                                pelanggan kami
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 rounded-xl aspect-[3/4] mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {bestSellerProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-10">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 border border-pink-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 font-medium group"
                            >
                                <span>Lihat Semua Produk</span>
                                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== BENEFITS SECTION ==================== */}
            <section className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Mengapa Memilih Kami?
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Komitmen kami untuk memberikan pengalaman
                                terbaik dalam setiap pesanan
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="group bg-white rounded-xl p-5 border border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div
                                        className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <div className={benefit.color}>
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PROCESS SECTION ==================== */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Cara Pemesanan Mudah
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Hanya 4 langkah sederhana untuk mendapatkan
                                bouquet impian Anda
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {processSteps.map((step, index) => (
                                <div key={index} className="relative group">
                                    <div
                                        className={`bg-gradient-to-br ${step.color} rounded-xl p-5 md:p-6 text-white h-full transform group-hover:-translate-y-1 transition-all duration-300`}
                                    >
                                        <div className="text-3xl mb-3">
                                            {step.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-white/30 mb-3">
                                            {step.step}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-white/90 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Connector line (desktop only) */}
                                    {index < processSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                                            <div className="w-8 h-1 bg-gradient-to-r from-pink-200 to-rose-200 group-hover:from-pink-300 group-hover:to-rose-300 transition-all duration-300"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== QUALITY PROMISE SECTION ==================== */}
            <section className="bg-gradient-to-b from-white to-pink-50 py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4">
                            <FaLeaf className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Bunga Segar & Berkualitas
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Dipetik dengan penuh hati untuk momen spesial Anda
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-10">
                            <div className="text-center">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <FaCheck className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Fresh Daily
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Bunga segar langsung dari supplier
                                    terpercaya
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <FaTruck className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Same Day Delivery
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Pesan sebelum jam 2 siang, terima hari yang
                                    sama
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <FaHeart className="w-6 h-6 text-amber-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Handmade with Love
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Dirangkai dengan penuh perhatian dan
                                    keahlian
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== TESTIMONIALS SECTION ==================== */}
            <section className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                Kata Pelanggan Kami
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Cerita bahagia dari mereka yang mempercayakan
                                momen spesialnya kepada kami
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testi, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-white to-pink-50 rounded-xl border border-pink-100 p-5 md:p-6 hover:border-pink-200 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="text-yellow-500 mr-1"
                                            >
                                                ⭐
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-4 text-sm leading-relaxed italic">
                                        "{testi.comment}"
                                    </p>
                                    <div className="flex items-center justify-between border-t border-pink-100 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {testi.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">
                                                    {testi.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {testi.role}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-pink-600 font-medium">
                                            {testi.product}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CTA SECTION ==================== */}
            <section className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:30px_30px] opacity-10"></div>

                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Siap Berikan{" "}
                            <span className="text-yellow-300">Kejutan?</span>
                        </h2>
                        <p className="text-lg text-pink-100 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Hubungi kami sekarang untuk konsultasi gratis dan
                            wujudkan bucket bunga impian Anda
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleWhatsAppClick}
                                className="group px-8 py-4 bg-white text-pink-700 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 font-bold text-base"
                            >
                                <FaWhatsapp className="w-6 h-6" />
                                <span>Chat via WhatsApp</span>
                                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <Link
                                href="/catalog"
                                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-bold text-base"
                            >
                                Lihat Katalog Lengkap
                            </Link>
                        </div>

                        <p className="text-pink-200 text-xs md:text-sm mt-6">
                            ⚡ Response dalam 5 menit • 🕒 Buka 24/7 • 🎁 Gratis
                            Konsultasi
                        </p>
                    </div>
                </div>
            </section>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

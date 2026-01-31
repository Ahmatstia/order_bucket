import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import OnboardingModal from "../Components/OnboardingModal";
import WhatsAppFloatingButton from "../Components/WhatsAppFloatingButton";
import {
    FaWhatsapp,
    FaStar,
    FaTruck,
    FaLeaf,
    FaGift,
    FaHeart,
    FaShoppingCart,
    FaChevronRight,
    FaCheck,
} from "react-icons/fa";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const data = await response.json();
                const featured = data.filter((p) => p.is_active).slice(0, 6);
                setFeaturedProducts(featured);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setFeaturedProducts([
                {
                    id: 1,
                    name: "Bucket Roses Romantic",
                    price: 250000,
                    category: "bucket",
                    isNew: true,
                    rating: 4.9,
                },
                {
                    id: 2,
                    name: "Bucket Sunflower",
                    price: 180000,
                    category: "bucket",
                    isNew: false,
                    rating: 4.7,
                },
                {
                    id: 3,
                    name: "Luxury Orchid",
                    price: 450000,
                    category: "premium",
                    isNew: true,
                    rating: 5.0,
                },
                {
                    id: 4,
                    name: "Tulip Garden",
                    price: 320000,
                    category: "bucket",
                    isNew: false,
                    rating: 4.8,
                },
                {
                    id: 5,
                    name: "Lily Elegance",
                    price: 280000,
                    category: "premium",
                    isNew: true,
                    rating: 4.9,
                },
                {
                    id: 6,
                    name: "Mixed Flowers",
                    price: 200000,
                    category: "bucket",
                    isNew: false,
                    rating: 4.6,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppClick = () => {
        window.open("https://wa.me/6281234567890", "_blank");
    };

    const categories = [
        {
            name: "Romantic",
            icon: "💖",
            count: "15+",
            color: "bg-gradient-to-br from-pink-500 to-rose-600",
        },
        {
            name: "Birthday",
            icon: "🎂",
            count: "20+",
            color: "bg-gradient-to-br from-pink-400 to-orange-400",
        },
        {
            name: "Graduation",
            icon: "🎓",
            count: "12+",
            color: "bg-gradient-to-br from-purple-400 to-pink-400",
        },
        {
            name: "Anniversary",
            icon: "💝",
            count: "18+",
            color: "bg-gradient-to-br from-rose-500 to-pink-500",
        },
        {
            name: "Congratulation",
            icon: "🎉",
            count: "10+",
            color: "bg-gradient-to-br from-pink-500 to-yellow-400",
        },
        {
            name: "Custom",
            icon: "✨",
            count: "∞",
            color: "bg-gradient-to-br from-gray-900 to-gray-700",
        },
    ];

    const processes = [
        {
            step: "01",
            title: "Pilih Produk",
            desc: "Browse koleksi bucket bunga kami dan pilih yang sesuai",
            icon: "🛍️",
            gradient: "from-pink-500 to-rose-500",
        },
        {
            step: "02",
            title: "Hubungi Kami",
            desc: "Chat via WhatsApp untuk konfirmasi dan konsultasi",
            icon: "💬",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            step: "03",
            title: "Proses Pesanan",
            desc: "Tim kami merangkai dengan penuh kehati-hatian",
            icon: "🌸",
            gradient: "from-rose-500 to-pink-400",
        },
        {
            step: "04",
            title: "Pengiriman",
            desc: "Dikirim fresh ke alamat tujuan tepat waktu",
            icon: "🚚",
            gradient: "from-pink-500 to-orange-400",
        },
    ];

    const benefits = [
        {
            title: "Bunga Segar",
            desc: "Dipilih langsung dari supplier terpercaya setiap hari",
            icon: <FaLeaf className="w-6 h-6" />,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            title: "Custom Request",
            desc: "Warna, jenis bunga, dan ukuran bisa disesuaikan",
            icon: <FaGift className="w-6 h-6" />,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            title: "Gratis Kartu",
            desc: "Setiap pesanan dilengkapi kartu ucapan personal",
            icon: "💌",
            color: "text-pink-500",
            bg: "bg-pink-50",
        },
        {
            title: "Same Day",
            desc: "Pesan sebelum jam 2 siang, terima hari yang sama",
            icon: <FaTruck className="w-6 h-6" />,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            title: "Garansi Kualitas",
            desc: "Jika tidak puas, kami ganti atau refund 100%",
            icon: <FaCheck className="w-6 h-6" />,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            title: "Packing Aman",
            desc: "Dikemas dengan bubble wrap dan box premium",
            icon: "📦",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    const testimonials = [
        {
            name: "Amanda Putri",
            comment:
                "Bucket bunganya cantik banget! Pacar saya sampai nangis haru. Pelayanan ramah dan cepat.",
            rating: 5,
            product: "Bucket Roses Romantic",
            avatar: "AP",
            date: "2 Hari Lalu",
        },
        {
            name: "Rizki Firmansyah",
            comment:
                "Udah 3x pesen disini untuk berbagai acara. Selalu memuaskan, bunga fresh dan pengiriman tepat waktu.",
            rating: 5,
            product: "Mixed Flowers Deluxe",
            avatar: "RF",
            date: "1 Minggu Lalu",
        },
        {
            name: "Siti Nurhaliza",
            comment:
                "Custom bucket sunflower untuk wisuda adik. Hasilnya melebihi ekspektasi! Highly recommended.",
            rating: 5,
            product: "Bucket Sunflower",
            avatar: "SN",
            date: "3 Hari Lalu",
        },
        {
            name: "Budi Santoso",
            comment:
                "Untuk anniversary ke-5 dengan istri. Bucketnya elegant dan istri sangat senang. Terima kasih!",
            rating: 5,
            product: "Luxury Orchid",
            avatar: "BS",
            date: "2 Minggu Lalu",
        },
        {
            name: "Maya Indah",
            comment:
                "Pesen jam 12 siang, jam 5 sore udah sampai. Fast response admin, bucket rapi banget packingnya.",
            rating: 5,
            product: "Tulip Garden",
            avatar: "MI",
            date: "5 Hari Lalu",
        },
        {
            name: "Andi Wijaya",
            comment:
                "Kualitas premium dengan harga reasonable. Bunga segar, warna sesuai request. Pasti order lagi!",
            rating: 5,
            product: "Lily Elegance",
            avatar: "AW",
            date: "1 Bulan Lalu",
        },
    ];

    const faqs = [
        {
            q: "Berapa lama bunga bisa bertahan?",
            a: "Dengan perawatan yang tepat, bunga dapat bertahan 5-7 hari. Kami sertakan kartu perawatan di setiap pembelian.",
        },
        {
            q: "Apakah bisa kirim ke luar kota?",
            a: "Saat ini kami melayani pengiriman di area Jabodetabek. Untuk area lain, silakan hubungi kami terlebih dahulu.",
        },
        {
            q: "Bagaimana cara pembayaran?",
            a: "Kami menerima transfer bank (BCA, Mandiri, BRI), e-wallet (GoPay, OVO, DANA), QRIS, dan COD untuk area tertentu.",
        },
        {
            q: "Apakah ada minimum order?",
            a: "Tidak ada minimum order. Anda bisa pesan 1 bucket saja. Untuk pemesanan dalam jumlah banyak, ada harga special.",
        },
    ];

    const gallery = [
        {
            emoji: "🌹",
            label: "Premium Roses",
            color: "bg-gradient-to-br from-pink-400 to-red-400",
        },
        {
            emoji: "🌻",
            label: "Sunflower Joy",
            color: "bg-gradient-to-br from-yellow-400 to-orange-400",
        },
        {
            emoji: "🌷",
            label: "Tulip Garden",
            color: "bg-gradient-to-br from-pink-500 to-purple-500",
        },
        {
            emoji: "🌺",
            label: "Tropical Mix",
            color: "bg-gradient-to-br from-pink-500 to-orange-400",
        },
        {
            emoji: "💐",
            label: "Elegant Bouquet",
            color: "bg-gradient-to-br from-rose-400 to-pink-500",
        },
        {
            emoji: "🌸",
            label: "Sakura Dreams",
            color: "bg-gradient-to-br from-pink-300 to-pink-500",
        },
    ];

    return (
        <AppLayout>
            {/* Hero Section dengan Gradient Pink */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

                <div className="container relative mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-pink-200 mb-8">
                            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></span>
                            <span className="text-sm font-medium text-pink-700">
                                Bunga Segar Setiap Hari
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                Hadirkan Kebahagiaan
                            </span>
                            <span className="block text-gray-900 mt-2">
                                Lewat Bunga Pilihan
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Setiap bucket bunga kami dirangkai dengan penuh
                            perhatian untuk momen spesial Anda.
                            <span className="text-pink-600 font-medium">
                                {" "}
                                Fresh, elegant, dan berkesan.
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/catalog"
                                className="group px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <span>Lihat Koleksi</span>
                                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button
                                onClick={handleWhatsAppClick}
                                className="group px-8 py-4 bg-white text-pink-600 border-2 border-pink-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                <span>Konsultasi Gratis</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 py-12 border-y border-pink-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                value: "500+",
                                label: "Happy Customers",
                                color: "text-pink-600",
                            },
                            {
                                value: "50+",
                                label: "Flower Varieties",
                                color: "text-rose-600",
                            },
                            {
                                value: "4.9",
                                label: "Average Rating",
                                color: "text-amber-500",
                            },
                            {
                                value: "24/7",
                                label: "Customer Support",
                                color: "text-purple-600",
                            },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group">
                                <div
                                    className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color} group-hover:scale-105 transition-transform`}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Kategori{" "}
                                <span className="text-pink-600">Pilihan</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Temukan bucket bunga untuk setiap momen spesial
                                dalam hidup Anda
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className="relative group cursor-pointer overflow-hidden rounded-xl"
                                    onMouseEnter={() => setHoveredCard(idx)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div
                                        className={`${cat.color} aspect-square rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-500 group-hover:scale-105`}
                                    >
                                        <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                                            {cat.icon}
                                        </div>
                                        <div className="font-bold text-white text-center mb-1">
                                            {cat.name}
                                        </div>
                                        <div className="text-white/80 text-sm">
                                            {cat.count} items
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-gradient-to-b from-white to-pink-50 py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Produk{" "}
                                <span className="text-pink-600">Unggulan</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Pilihan terbaik dari koleksi kami, dirangkai
                                dengan cinta dan keahlian
                            </p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl border border-pink-100 animate-pulse overflow-hidden"
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100"></div>
                                        <div className="p-6">
                                            <div className="h-4 bg-gradient-to-r from-pink-100 to-rose-100 mb-3"></div>
                                            <div className="h-6 bg-gradient-to-r from-pink-100 to-rose-100 w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-xl border border-pink-100 hover:border-pink-300 transition-all duration-300 overflow-hidden hover:shadow-xl"
                                        onMouseEnter={() =>
                                            setHoveredCard(
                                                `product-${product.id}`,
                                            )
                                        }
                                        onMouseLeave={() =>
                                            setHoveredCard(null)
                                        }
                                    >
                                        <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center overflow-hidden">
                                            <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                                                {product.category === "premium"
                                                    ? "💎"
                                                    : "💐"}
                                            </span>
                                            {product.isNew && (
                                                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full">
                                                    NEW
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                                                <FaStar className="w-3 h-3 text-amber-500" />
                                                <span className="text-xs font-bold">
                                                    {product.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-pink-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="text-sm text-gray-500 mb-3">
                                                Mulai dari
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-pink-600">
                                                    Rp{" "}
                                                    {parseFloat(
                                                        product.price,
                                                    ).toLocaleString("id-ID")}
                                                </span>
                                                <Link
                                                    href="/catalog"
                                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-rose-600"
                                                >
                                                    <FaShoppingCart className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-pink-600 border-2 border-pink-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 font-medium group"
                            >
                                <span>Lihat Semua Produk</span>
                                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Cara Pemesanan{" "}
                                <span className="text-pink-600">Mudah</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Proses mudah dari awal hingga pengiriman dengan
                                4 langkah sederhana
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {processes.map((process, idx) => (
                                <div key={idx} className="relative group">
                                    <div
                                        className={`bg-gradient-to-br ${process.gradient} rounded-2xl p-8 text-white h-full transform group-hover:-translate-y-2 transition-all duration-300`}
                                    >
                                        <div className="text-5xl mb-4">
                                            {process.icon}
                                        </div>
                                        <div className="text-3xl font-bold text-white/30 mb-4">
                                            {process.step}
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">
                                            {process.title}
                                        </h3>
                                        <p className="text-white/90 text-sm leading-relaxed">
                                            {process.desc}
                                        </p>
                                    </div>
                                    {idx < processes.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                            <div className="w-6 h-1 bg-gradient-to-r from-pink-200 to-pink-300 group-hover:from-pink-300 group-hover:to-rose-300 transition-all"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-b from-pink-50 to-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Mengapa{" "}
                                <span className="text-pink-600">
                                    Pilih Kami
                                </span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Komitmen kami untuk kepuasan dan keindahan yang
                                tak terlupakan
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((benefit, idx) => (
                                <div
                                    key={idx}
                                    className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div
                                        className={`w-12 h-12 ${benefit.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <div className={benefit.color}>
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {benefit.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-white py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Kata{" "}
                                <span className="text-pink-600">Pelanggan</span>
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Cerita dari mereka yang sudah mempercayakan
                                momen spesialnya kepada kami
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((testi, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gradient-to-br from-white to-pink-50 rounded-xl border border-pink-100 p-6 hover:border-pink-300 transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className="w-4 h-4 text-amber-500"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 leading-relaxed italic">
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
                                                    {testi.product}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {testi.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 py-16 md:py-20">
                <div className="absolute inset-0 bg-floral-pattern opacity-10"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl"></div>

                <div className="container relative mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Siap Berikan{" "}
                            <span className="text-yellow-300">Kejutan?</span>
                        </h2>
                        <p className="text-lg text-pink-100 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Hubungi kami sekarang untuk konsultasi gratis dan
                            wujudkan bucket bunga impian Anda
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleWhatsAppClick}
                                className="group px-8 py-4 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 font-bold text-lg"
                            >
                                <FaWhatsapp className="w-6 h-6" />
                                <span>Chat WhatsApp</span>
                                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <Link
                                href="/catalog"
                                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                            >
                                Lihat Katalog Lengkap
                            </Link>
                        </div>
                        <p className="text-pink-200 text-sm mt-6">
                            Response dalam 5 menit • Buka 24/7 • Gratis
                            Konsultasi
                        </p>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-sm">
                        {[
                            {
                                icon: "✓",
                                text: "100% Fresh Guarantee",
                                color: "text-emerald-600",
                            },
                            {
                                icon: "🔒",
                                text: "Secure Payment",
                                color: "text-blue-600",
                            },
                            {
                                icon: "🚚",
                                text: "Same Day Delivery",
                                color: "text-pink-600",
                            },
                            {
                                icon: "🎁",
                                text: "Premium Packaging",
                                color: "text-amber-600",
                            },
                            {
                                icon: "💝",
                                text: "Free Greeting Card",
                                color: "text-rose-600",
                            },
                        ].map((badge, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 group"
                            >
                                <div className={`text-lg ${badge.color}`}>
                                    {badge.icon}
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {badge.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <WhatsAppFloatingButton />
            <OnboardingModal />

            <style jsx>{`
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, #f472b6 1px, transparent 1px),
                        linear-gradient(to bottom, #f472b6 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .bg-floral-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
            `}</style>
        </AppLayout>
    );
}

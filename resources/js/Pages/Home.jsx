import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import WhatsAppFloatingButton from "../Components/WhatsAppFloatingButton";
import OnboardingModal from "../Components/OnboardingModal";
import ProductCard from "../Components/ProductCard";
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
    FaStar,
    FaQuoteLeft,
} from "react-icons/fa";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellerProducts, setBestSellerProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products");

            if (response.ok) {
                const data = await response.json();
                const activeProducts = data.filter((p) => p.is_active);
                setFeaturedProducts(activeProducts.slice(0, 4));
                setBestSellerProducts(
                    activeProducts.slice(4, 8).length > 0
                        ? activeProducts.slice(4, 8)
                        : activeProducts.slice(0, 4),
                );
            } else {
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

    const stats = [
        { number: "10,000+", label: "Bucket Terjual", icon: "🌸" },
        { number: "5,000+", label: "Pelanggan Puas", icon: "😊" },
        { number: "4.9/5", label: "Rating Terbaik", icon: "⭐" },
        { number: "24/7", label: "Siap Melayani", icon: "💬" },
    ];

    return (
        <AppLayout>
            <style jsx>{`
                @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap");

                .font-playfair {
                    font-family: "Playfair Display", serif;
                }

                .font-poppins {
                    font-family: "Poppins", sans-serif;
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-slide-up {
                    animation: slideInUp 0.6s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scaleIn 0.5s ease-out forwards;
                }

                .delay-100 {
                    animation-delay: 0.1s;
                }
                .delay-200 {
                    animation-delay: 0.2s;
                }
                .delay-300 {
                    animation-delay: 0.3s;
                }
                .delay-400 {
                    animation-delay: 0.4s;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
                .delay-600 {
                    animation-delay: 0.6s;
                }

                .text-gradient {
                    background: linear-gradient(
                        135deg,
                        #ec4899 0%,
                        #f43f5e 50%,
                        #f97316 100%
                    );
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }

                .hover-lift {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2);
                }
            `}</style>

            {/* ==================== HERO SECTION - ENHANCED ==================== */}
            <section
                className="relative w-full overflow-hidden"
                style={{ marginTop: "-11rem", paddingTop: "10rem" }}
            >
                <div className="relative w-full min-h-screen">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                        style={{
                            backgroundImage: "url(/storage/banners/logo.png)",
                        }}
                    />

                    {/* Soft Floral Overlay */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r 
            from-white/75 via-pink-100/50 to-transparent"
                    ></div>

                    {/* Extra Glow Layer */}
                    <div
                        className="absolute inset-0 bg-gradient-to-t 
            from-white via-transparent to-transparent"
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-6 h-screen flex items-center">
                        <div className="max-w-3xl animate-slide-up">
                            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-pink-800 mb-6 leading-tight">
                                Sentuhan Cinta dalam
                                <span className="block text-rose-600 mt-2">
                                    Setiap Kelopak
                                </span>
                            </h1>

                            <p className="font-poppins text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                                Wujudkan momen spesial dengan bucket bunga
                                premium yang dirangkai dengan penuh kasih sayang
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="group px-8 py-4 
                        bg-gradient-to-r from-pink-500 to-rose-500 
                        text-white rounded-full 
                        hover:from-pink-600 hover:to-rose-600 
                        transition-all duration-300 
                        shadow-xl hover:shadow-pink-400/50
                        flex items-center justify-center gap-3
                        font-semibold text-lg"
                                >
                                    <FaWhatsapp className="w-6 h-6" />
                                    Pesan Sekarang
                                    <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <Link
                                    href="/catalog"
                                    className="px-8 py-4 
                        bg-white text-pink-600 
                        rounded-full border border-pink-200
                        hover:bg-pink-50 
                        transition-all duration-300 
                        shadow-lg font-semibold text-lg text-center"
                                >
                                    Lihat Katalog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== FEATURED PRODUCTS - ENHANCED ==================== */}
            <section className="bg-gradient-to-b from-white via-pink-50/30 to-white md:py-28">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 rounded-full text-sm font-semibold mb-6 shadow-sm">
                                <span className="text-xl">🌟</span>
                                <span className="font-poppins">
                                    KOLEKSI TERBARU
                                </span>
                            </div>
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                                Produk Unggulan
                            </h2>
                            <p className="font-poppins text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Karya terbaik kami yang siap mempesona hari
                                spesial Anda
                            </p>

                            {/* Decorative Line */}
                            <div className="flex items-center justify-center gap-3 mt-6">
                                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-pink-300"></div>
                                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                <div className="w-24 h-0.5 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300"></div>
                                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-pink-300"></div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-200 rounded-2xl aspect-[3/4] mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                                {featuredProducts.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className="opacity-0 animate-slide-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==================== BENEFITS - ENHANCED WITH BENTO GRID ==================== */}
            <section className="bg-white py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                                Kenapa Memilih Kami?
                            </h2>
                            <p className="font-poppins text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Pengalaman terbaik di setiap langkah perjalanan
                                Anda bersama kami
                            </p>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-pink-200 transition-all duration-500 hover-lift overflow-hidden ${
                                        index === 0
                                            ? "md:col-span-2 md:row-span-2"
                                            : ""
                                    }`}
                                >
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full filter blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>

                                    <div className="relative">
                                        {/* Icon */}
                                        <div
                                            className={`inline-flex items-center justify-center w-16 h-16 ${benefit.bgColor} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                        >
                                            <div
                                                className={`${benefit.color} text-2xl`}
                                            >
                                                {benefit.icon}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                                            {benefit.title}
                                        </h3>
                                        <p className="font-poppins text-gray-600 leading-relaxed">
                                            {benefit.description}
                                        </p>

                                        {/* Decorative Element for Large Card */}
                                        {index === 0 && (
                                            <div className="mt-6 flex items-center gap-2 text-pink-600 font-medium group-hover:gap-3 transition-all">
                                                <span className="font-poppins">
                                                    Pelajari lebih lanjut
                                                </span>
                                                <FaChevronRight className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== TESTIMONIALS - ENHANCED CAROUSEL ==================== */}
            <section className="bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-4">
                                Cerita Pelanggan
                            </h2>
                            <p className="font-poppins text-lg md:text-xl text-pink-100 max-w-2xl mx-auto">
                                Ribuan pelanggan puas telah mempercayai kami
                            </p>
                        </div>

                        {/* Testimonial Carousel */}
                        <div className="relative">
                            {testimonials.map((testi, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-500 ${
                                        index === activeTestimonial
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 absolute inset-0"
                                    }`}
                                >
                                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 md:p-12 border border-white/20">
                                        {/* Quote Icon */}
                                        <FaQuoteLeft className="w-12 h-12 text-pink-200 mb-6" />

                                        {/* Stars */}
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className="w-6 h-6 text-yellow-400 fill-current"
                                                />
                                            ))}
                                        </div>

                                        {/* Comment */}
                                        <p className="font-poppins text-2xl md:text-3xl text-white mb-8 leading-relaxed italic">
                                            "{testi.comment}"
                                        </p>

                                        {/* Author Info */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                    {testi.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-playfair text-xl font-bold text-white">
                                                        {testi.name}
                                                    </div>
                                                    <div className="font-poppins text-pink-200">
                                                        {testi.role}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hidden md:block font-poppins text-sm text-pink-200 bg-white/10 px-4 py-2 rounded-full">
                                                {testi.product}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Navigation Dots */}
                            <div className="flex justify-center gap-3 mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setActiveTestimonial(index)
                                        }
                                        className={`transition-all duration-300 rounded-full ${
                                            index === activeTestimonial
                                                ? "w-12 h-3 bg-white"
                                                : "w-3 h-3 bg-white/40 hover:bg-white/60"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PROCESS STEPS - ENHANCED ==================== */}
            <section className="bg-white py-20 md:py-28 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-pink-100 rounded-full filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100 rounded-full filter blur-3xl opacity-30"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-playfair text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                                Cara Pemesanan
                            </h2>
                            <p className="font-poppins text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                                Proses sederhana untuk mendapatkan bouquet
                                impian Anda
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {processSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="relative group opacity-0 animate-scale-in"
                                    style={{
                                        animationDelay: `${index * 0.15}s`,
                                    }}
                                >
                                    {/* Card */}
                                    <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-pink-300 transition-all duration-300 hover-lift h-full">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                                            {step.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-playfair text-2xl font-bold text-gray-900 mb-3">
                                            {step.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="font-poppins text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Connector Arrow (desktop only) */}
                                    {index < processSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                                            <FaChevronRight className="w-6 h-6 text-pink-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CTA SECTION - ENHANCED ==================== */}
            <section className="bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-8 border border-white/30">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                            <span className="font-poppins">READY TO ORDER</span>
                        </div>

                        <h2 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6">
                            Wujudkan Momen Spesial
                            <span className="block text-yellow-300 mt-2">
                                Bersama Kami
                            </span>
                        </h2>

                        <p className="font-poppins text-xl md:text-2xl text-pink-100 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Konsultasi gratis untuk membantu Anda memilih bucket
                            bunga yang sempurna
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button
                                onClick={handleWhatsAppClick}
                                className="group px-10 py-5 bg-white text-pink-700 rounded-full hover:bg-pink-50 transition-all duration-300 shadow-2xl hover:shadow-white/30 flex items-center justify-center gap-3 font-bold text-lg hover-lift"
                            >
                                <FaWhatsapp className="w-7 h-7" />
                                <span className="font-poppins">
                                    Chat via WhatsApp
                                </span>
                                <FaChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <Link
                                href="/catalog"
                                className="px-10 py-5 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 font-bold text-lg backdrop-blur-sm hover-lift text-center"
                            >
                                <span className="font-poppins">
                                    Lihat Katalog Lengkap
                                </span>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-pink-100">
                            <div className="flex items-center gap-2 font-poppins">
                                <span className="text-2xl">⚡</span>
                            </div>
                            <div className="w-1 h-1 bg-pink-300 rounded-full hidden sm:block"></div>
                            <div className="flex items-center gap-2 font-poppins">
                                <span className="text-2xl">🕒</span>
                                <span className="font-medium">Buka 24/7</span>
                            </div>
                            <div className="w-1 h-1 bg-pink-300 rounded-full hidden sm:block"></div>
                            <div className="flex items-center gap-2 font-poppins">
                                <span className="text-2xl">🎁</span>
                                <span className="font-medium">
                                    Gratis Konsultasi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

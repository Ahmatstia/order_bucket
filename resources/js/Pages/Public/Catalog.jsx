import React, { useState, useEffect } from "react";
import AppLayout from "../../Layouts/AppLayout";
import ProductCard from "../../Components/ProductCard";
import OnboardingModal from "../../Components/OnboardingModal";
import WhatsAppFloatingButton from "../../Components/WhatsAppFloatingButton";
import {
    FaSearch,
    FaFilter,
    FaTimes,
    FaShoppingBag,
    FaTag,
    FaFire,
    FaStar,
    FaLeaf,
    FaSeedling,
    FaSortAmountDown,
    FaBars,
    FaCheck,
    FaSun,
    FaChevronDown,
    FaHeart,
    FaShieldAlt,
    FaWhatsapp,
    FaTruck,
} from "react-icons/fa";

export default function Catalog() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State untuk filter
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Apply filter ketika state berubah
    useEffect(() => {
        applyFilters();
    }, [products, selectedCategory, sortBy, searchQuery]);

    // Update active filters
    useEffect(() => {
        const filters = [];
        if (selectedCategory !== "all") {
            filters.push({
                type: "category",
                label: `${categoryLabels[selectedCategory] || selectedCategory}`,
                value: selectedCategory,
                icon: categoryIcons[selectedCategory] || "🌸",
            });
        }
        if (searchQuery) {
            filters.push({
                type: "search",
                label: `"${searchQuery}"`,
                value: searchQuery,
                icon: "🔍",
            });
        }
        if (sortBy !== "default") {
            filters.push({
                type: "sort",
                label: `${sortOptions.find((opt) => opt.value === sortBy)?.label}`,
                value: sortBy,
                icon: "↕️",
            });
        }
        setActiveFilters(filters);
    }, [selectedCategory, searchQuery, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("🔄 Fetching products from /api/products...");

            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("📦 API Response data:", data);

            // Filter hanya produk aktif
            const activeProducts = data.filter((p) => p.is_active);
            console.log(
                `📊 Active products: ${activeProducts.length}/${data.length}`,
            );

            setProducts(activeProducts);
            setFilteredProducts(activeProducts);
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            setError(error.message);
            // Fallback dummy data
            const dummyProducts = [
                {
                    id: 1,
                    name: "Bucket Roses Romantic",
                    category: "mawar",
                    description: "Bucket berisi 12 mawar merah segar",
                    price: 250000,
                    image: "🌹",
                    rating: 4.8,
                    is_active: true,
                    stock: 10,
                    isNew: true,
                    tags: ["Romantic", "Best Seller"],
                },
                {
                    id: 2,
                    name: "Sunflower Happiness",
                    category: "sunflower",
                    description: "Bucket bunga matahari cerah",
                    price: 180000,
                    image: "🌻",
                    rating: 4.6,
                    is_active: true,
                    stock: 8,
                    isNew: false,
                    tags: ["Happy", "Bright"],
                },
                {
                    id: 3,
                    name: "Lily Garden",
                    category: "lily",
                    description: "Rangkaian lily putih elegan",
                    price: 320000,
                    image: "🌸",
                    rating: 4.9,
                    is_active: true,
                    stock: 5,
                    isNew: true,
                    tags: ["Elegant", "Premium"],
                },
                {
                    id: 4,
                    name: "Mixed Blooms",
                    category: "mixed",
                    description: "Kombinasi berbagai bunga segar",
                    price: 275000,
                    image: "💐",
                    rating: 4.7,
                    is_active: true,
                    stock: 12,
                    isNew: false,
                    tags: ["Mixed", "Colorful"],
                },
                {
                    id: 5,
                    name: "Orchid Elegance",
                    category: "orchid",
                    description: "Anggrek ungu premium",
                    price: 450000,
                    image: "🌺",
                    rating: 4.9,
                    is_active: true,
                    stock: 3,
                    isNew: true,
                    tags: ["Premium", "Luxury"],
                },
                {
                    id: 6,
                    name: "Carnation Delight",
                    category: "carnation",
                    description: "Buket carnation pink fresh",
                    price: 200000,
                    image: "🌷",
                    rating: 4.5,
                    is_active: true,
                    stock: 15,
                    isNew: false,
                    tags: ["Sweet", "Affordable"],
                },
                {
                    id: 7,
                    name: "Premium Roses Box",
                    category: "mawar",
                    description: "Box mewah berisi 24 mawar premium",
                    price: 500000,
                    image: "🌹",
                    rating: 5.0,
                    is_active: true,
                    stock: 4,
                    isNew: true,
                    tags: ["Luxury", "Premium", "Best Seller"],
                },
                {
                    id: 8,
                    name: "Tropical Paradise",
                    category: "mixed",
                    description: "Kombinasi bunga tropis eksotis",
                    price: 350000,
                    image: "💐",
                    rating: 4.8,
                    is_active: true,
                    stock: 7,
                    isNew: true,
                    tags: ["Exotic", "Colorful"],
                },
            ];
            setProducts(dummyProducts);
            setFilteredProducts(dummyProducts);

            // Extract categories from dummy data
            const dummyCategories = [
                ...new Set(dummyProducts.map((p) => p.category)),
            ];
            setCategories(dummyCategories);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/products/categories");
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            const uniqueCategories = [
                ...new Set(products.map((p) => p.category)),
            ];
            setCategories(uniqueCategories);
        }
    };

    const applyFilters = () => {
        let result = [...products];

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter(
                (product) => product.category === selectedCategory,
            );
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (product) =>
                    (product.name &&
                        product.name.toLowerCase().includes(query)) ||
                    (product.description &&
                        product.description.toLowerCase().includes(query)),
            );
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) =>
                    (a.name || "").localeCompare(b.name || ""),
                );
                break;
            case "rating":
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "newest":
                result.sort((a, b) => b.id - a.id);
                break;
            default:
                result.sort((a, b) => b.id - a.id);
        }

        setFilteredProducts(result);
    };

    const handleResetFilters = () => {
        setSelectedCategory("all");
        setSortBy("default");
        setSearchQuery("");
    };

    const removeFilter = (filterType) => {
        switch (filterType) {
            case "category":
                setSelectedCategory("all");
                break;
            case "search":
                setSearchQuery("");
                break;
            case "sort":
                setSortBy("default");
                break;
        }
    };

    const categoryLabels = {
        mawar: "Mawar",
        sunflower: "Sunflower",
        lily: "Lily",
        mixed: "Mixed",
        orchid: "Orchid",
        bucket: "Bucket",
        premium: "Premium",
        carnation: "Carnation",
    };

    const categoryColors = {
        mawar: "from-rose-500 to-pink-500",
        sunflower: "from-amber-500 to-orange-500",
        lily: "from-fuchsia-500 to-pink-500",
        mixed: "from-violet-500 to-purple-500",
        orchid: "from-indigo-500 to-purple-500",
        carnation: "from-red-500 to-rose-500",
    };

    const categoryIcons = {
        mawar: "🌹",
        sunflower: "🌻",
        lily: "🌸",
        mixed: "💐",
        orchid: "🌺",
        carnation: "🌷",
    };

    const sortOptions = [
        { value: "default", label: "Terbaru", icon: "✨" },
        { value: "price-low", label: "Harga: Rendah - Tinggi", icon: "↗️" },
        { value: "price-high", label: "Harga: Tinggi - Rendah", icon: "↘️" },
        { value: "name-asc", label: "Nama: A-Z", icon: "🔤" },
        { value: "rating", label: "Rating Tertinggi", icon: "⭐" },
        { value: "newest", label: "Produk Terbaru", icon: "🆕" },
    ];

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap');
                
                .font-playfair {
                    font-family: 'Playfair Display', serif;
                }
                
                .font-poppins {
                    font-family: 'Poppins', sans-serif;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out forwards;
                }
                
                .delay-100 { animation-delay: 0.1s; opacity: 0; }
                .delay-200 { animation-delay: 0.2s; opacity: 0; }
                .delay-300 { animation-delay: 0.3s; opacity: 0; }
                .delay-400 { animation-delay: 0.4s; opacity: 0; }
                .delay-500 { animation-delay: 0.5s; opacity: 0; }
                .delay-600 { animation-delay: 0.6s; opacity: 0; }
                .delay-700 { animation-delay: 0.7s; opacity: 0; }
                .delay-800 { animation-delay: 0.8s; opacity: 0; }
                
                .category-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .category-btn:hover {
                    transform: translateY(-3px);
                }
                
                .category-btn.active {
                    transform: scale(1.05);
                }
                
                .search-input:focus {
                    box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.1);
                }
                
                .filter-chip {
                    transition: all 0.2s ease;
                }
                
                .filter-chip:hover {
                    transform: scale(1.05);
                }
                
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
                }

                .skeleton-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>

            <div className="min-h-screen bg-white font-poppins">
                {/* ==================== HERO HEADER ==================== */}
                <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700">
                    {/* Background Decorations */}
                    <div className="absolute inset-0 bg-noise"></div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-fadeInUp">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                <span className="text-white font-medium font-poppins text-sm">
                                    Koleksi Premium 2026
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight animate-fadeInUp delay-100">
                                Katalog Bucket Bunga
                            </h1>
                            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-poppins leading-relaxed animate-fadeInUp delay-200">
                                Rangkaian bucket bunga segar dengan desain
                                elegan untuk setiap momen spesial Anda
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-8 mt-10 animate-fadeInUp delay-300">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <FaShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold font-playfair">
                                            {products.length}+
                                        </div>
                                        <div className="text-sm opacity-90 font-poppins">
                                            Produk Tersedia
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <FaStar className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold font-playfair">
                                            4.9
                                        </div>
                                        <div className="text-sm opacity-90 font-poppins">
                                            Rating Rata-rata
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <FaLeaf className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-3xl font-bold font-playfair">
                                            100%
                                        </div>
                                        <div className="text-sm opacity-90 font-poppins">
                                            Bunga Segar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                    {/* ==================== SEARCH BAR ==================== */}
                    <div className="mb-8 animate-scaleIn">
                        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-2">
                            <div className="flex items-center px-6 py-4">
                                <FaSearch className="w-5 h-5 text-pink-500 mr-4 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Cari bucket bunga favorit Anda..."
                                    className="search-input flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base font-medium font-poppins"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-3 p-2 hover:bg-pink-50 rounded-full transition-colors flex-shrink-0"
                                    >
                                        <FaTimes className="w-4 h-4 text-gray-400 hover:text-pink-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ==================== FILTER SECTION ==================== */}
                    <div className="mb-8">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
                            {/* Categories */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair">
                                        Kategori Produk
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowMobileFilters(
                                                !showMobileFilters,
                                            )
                                        }
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 rounded-xl text-sm font-semibold hover:from-pink-100 hover:to-rose-100 transition-all"
                                    >
                                        <FaFilter className="w-4 h-4" />
                                        <span>Filter</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedCategory("all")
                                        }
                                        className={`category-btn px-6 py-3 rounded-xl text-sm font-semibold font-poppins transition-all ${
                                            selectedCategory === "all"
                                                ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-200 active"
                                                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                        }`}
                                    >
                                        Semua Produk
                                    </button>
                                    {categories.map((category, index) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                setSelectedCategory(category)
                                            }
                                            className={`category-btn px-6 py-3 rounded-xl text-sm font-semibold font-poppins transition-all flex items-center gap-2 animate-scaleIn delay-${(index + 1) * 100} ${
                                                selectedCategory === category
                                                    ? `bg-gradient-to-r ${categoryColors[category]} text-white shadow-lg active`
                                                    : "bg-white text-gray-700 hover:shadow-md border border-gray-200"
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {categoryIcons[category] ||
                                                    "🌸"}
                                            </span>
                                            <span>
                                                {categoryLabels[category] ||
                                                    category}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort & View Options */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 font-poppins">
                                        Menampilkan{" "}
                                        <span className="font-bold text-pink-600">
                                            {filteredProducts.length}
                                        </span>{" "}
                                        produk
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* View Mode Toggle */}
                                    <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2.5 rounded-lg transition-all ${
                                                viewMode === "grid"
                                                    ? "bg-white text-pink-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2.5 rounded-lg transition-all ${
                                                viewMode === "list"
                                                    ? "bg-white text-pink-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowSortDropdown(
                                                    !showSortDropdown,
                                                )
                                            }
                                            className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-pink-200 hover:bg-pink-50 transition-all font-poppins"
                                        >
                                            <FaSortAmountDown className="w-4 h-4 text-gray-500" />
                                            <span>
                                                {
                                                    sortOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            sortBy,
                                                    )?.label
                                                }
                                            </span>
                                            <FaChevronDown
                                                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        {showSortDropdown && (
                                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-10">
                                                {sortOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setSortBy(
                                                                option.value,
                                                            );
                                                            setShowSortDropdown(
                                                                false,
                                                            );
                                                        }}
                                                        className={`w-full text-left px-5 py-3 text-sm transition-all flex items-center justify-between font-poppins ${
                                                            sortBy ===
                                                            option.value
                                                                ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 font-semibold"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span>
                                                                {option.icon}
                                                            </span>
                                                            <span>
                                                                {option.label}
                                                            </span>
                                                        </span>
                                                        {sortBy ===
                                                            option.value && (
                                                            <FaCheck className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==================== ACTIVE FILTERS ==================== */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6 animate-slideInLeft">
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700 font-poppins">
                                        Filter Aktif:
                                    </span>
                                    {activeFilters.map((filter, index) => (
                                        <div
                                            key={index}
                                            className="filter-chip inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200"
                                        >
                                            <span className="text-base">
                                                {filter.icon}
                                            </span>
                                            <span className="text-sm text-pink-700 font-semibold font-poppins">
                                                {filter.label}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeFilter(filter.type)
                                                }
                                                className="p-1 hover:bg-pink-200 rounded-full transition-colors"
                                            >
                                                <FaTimes className="w-3 h-3 text-pink-600" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleResetFilters}
                                        className="text-sm text-gray-500 hover:text-pink-600 font-semibold ml-auto transition-colors font-poppins"
                                    >
                                        Reset Semua
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== LOADING STATE ==================== */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
                                >
                                    <div className="aspect-square skeleton-shimmer"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 skeleton-shimmer rounded-lg"></div>
                                        <div className="h-4 skeleton-shimmer rounded-lg w-2/3"></div>
                                        <div className="h-6 skeleton-shimmer rounded-lg w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ==================== ERROR MESSAGE ==================== */}
                    {error && (
                        <div className="mb-8 animate-scaleIn">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                                        <span className="text-3xl">⚠️</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-amber-900 mb-2 font-playfair">
                                            Mode Demo Aktif
                                        </h4>
                                        <p className="text-sm text-amber-700 mb-4 leading-relaxed font-poppins">
                                            Menampilkan data contoh karena
                                            server offline. Data yang
                                            ditampilkan adalah simulasi.
                                        </p>
                                        <button
                                            onClick={fetchProducts}
                                            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-lg font-poppins"
                                        >
                                            Coba Muat Ulang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================== PRODUCTS GRID ==================== */}
                    {!loading && (
                        <>
                            {filteredProducts.length > 0 ? (
                                <div
                                    className={`grid gap-1 mb-12 ${
                                        viewMode === "grid"
                                            ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {filteredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`animate-scaleIn delay-${(index % 8) * 100}`}
                                        >
                                            <ProductCard
                                                product={product}
                                                categoryColors={categoryColors}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 animate-fadeInUp">
                                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
                                        <FaSearch className="h-12 w-12 text-pink-500" />
                                    </div>
                                    <h3 className="font-playfair text-3xl font-bold text-gray-900 mb-3">
                                        Produk Tidak Ditemukan
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed font-poppins">
                                        Maaf, kami tidak dapat menemukan produk
                                        yang sesuai dengan pencarian Anda. Coba
                                        kata kunci lain atau jelajahi kategori
                                        berbeda.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={handleResetFilters}
                                            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-bold rounded-xl hover:shadow-xl hover:shadow-pink-200 transition-all font-poppins"
                                        >
                                            Reset Semua Filter
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedCategory("all")
                                            }
                                            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 text-sm font-bold rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all font-poppins"
                                        >
                                            Lihat Semua Produk
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ==================== CTA SECTION ==================== */}
                    <div className="mt-16 mb-20">
                        <div className="relative bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 bg-noise"></div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="relative p-10 md:p-16 text-center">
                                <h3 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
                                    Butuh Rekomendasi?
                                </h3>
                                <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-poppins leading-relaxed">
                                    Tim kami siap membantu Anda memilih bucket
                                    bunga yang sempurna untuk momen spesial Anda
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a
                                        href="https://wa.me/6282371663414"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-pink-600 text-base font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105 font-poppins"
                                    >
                                        <FaWhatsapp className="w-5 h-5" />
                                        <span>Hubungi via WhatsApp</span>
                                    </a>
                                    <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-base font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all font-poppins">
                                        Lihat Katalog Lengkap
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ==================== MOBILE FILTER MODAL ==================== */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 rounded-t-3xl z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair">
                                        Filter & Urutkan
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowMobileFilters(false)
                                        }
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 font-poppins">
                                        Urutkan Berdasarkan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setShowMobileFilters(false);
                                                }}
                                                className={`p-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 font-poppins ${
                                                    sortBy === option.value
                                                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                }`}
                                            >
                                                <span>{option.icon}</span>
                                                <span>{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 font-poppins">
                                        Pilih Kategori
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("all");
                                                setShowMobileFilters(false);
                                            }}
                                            className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
                                                selectedCategory === "all"
                                                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg"
                                                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span className="text-2xl">🌸</span>
                                            <span className="text-xs font-bold font-poppins">
                                                Semua
                                            </span>
                                        </button>
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => {
                                                    setSelectedCategory(
                                                        category,
                                                    );
                                                    setShowMobileFilters(false);
                                                }}
                                                className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
                                                    selectedCategory ===
                                                    category
                                                        ? `bg-gradient-to-r ${categoryColors[category]} text-white shadow-lg`
                                                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                                }`}
                                            >
                                                <span className="text-2xl">
                                                    {categoryIcons[category] ||
                                                        "🌸"}
                                                </span>
                                                <span className="text-xs font-bold text-gray-700 font-poppins">
                                                    {categoryLabels[category] ||
                                                        category}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 space-y-3">
                                <button
                                    onClick={handleResetFilters}
                                    className="w-full py-4 text-gray-700 border-2 border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors font-poppins"
                                >
                                    Reset Semua Filter
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all font-poppins"
                                >
                                    Terapkan Filter ({filteredProducts.length}{" "}
                                    Produk)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <WhatsAppFloatingButton />
                <OnboardingModal />
            </div>
        </AppLayout>
    );
}

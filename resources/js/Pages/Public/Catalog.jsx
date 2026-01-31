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
                    product.name.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query),
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
                result.sort((a, b) => a.name.localeCompare(b.name));
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
        mawar: "border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-white",
        sunflower:
            "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white",
        lily: "border-l-4 border-l-fuchsia-500 bg-gradient-to-r from-fuchsia-50 to-white",
        mixed: "border-l-4 border-l-violet-500 bg-gradient-to-r from-violet-50 to-white",
        orchid: "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white",
        carnation:
            "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-white",
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
        { value: "default", label: "Terbaru" },
        { value: "price-low", label: "Harga: Rendah - Tinggi" },
        { value: "price-high", label: "Harga: Tinggi - Rendah" },
        { value: "name-asc", label: "Nama: A-Z" },
        { value: "rating", label: "Rating Tertinggi" },
        { value: "newest", label: "Produk Terbaru" },
    ];

    return (
        <AppLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
                
                .catalog-container {
                    font-family: 'DM Sans', sans-serif;
                }
                
                .catalog-heading {
                    font-family: 'Playfair Display', serif;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
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
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.5s ease-out forwards;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out forwards;
                }
                
                .stagger-1 { animation-delay: 0.1s; }
                .stagger-2 { animation-delay: 0.2s; }
                .stagger-3 { animation-delay: 0.3s; }
                .stagger-4 { animation-delay: 0.4s; }
                .stagger-5 { animation-delay: 0.5s; }
                .stagger-6 { animation-delay: 0.6s; }
                .stagger-7 { animation-delay: 0.7s; }
                .stagger-8 { animation-delay: 0.8s; }
                
                .category-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .category-btn:hover {
                    transform: translateY(-2px);
                }
                
                .category-btn.active {
                    transform: scale(1.05);
                }
                
                .search-input:focus {
                    box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
                }
                
                .filter-chip {
                    transition: all 0.2s ease;
                }
                
                .filter-chip:hover {
                    transform: scale(1.05);
                }
                
                .glass-effect {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                
                .gradient-border {
                    position: relative;
                }
                
                .gradient-border::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(135deg, #f43f5e, #ec4899, #a855f7);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .gradient-border:hover::before {
                    opacity: 1;
                }
                
                .product-grid-enter {
                    opacity: 0;
                    transform: scale(0.9);
                }
                
                .product-grid-enter-active {
                    opacity: 1;
                    transform: scale(1);
                    transition: all 0.3s ease-out;
                }
            `}</style>

            <div className="catalog-container min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-pink-50/20">
                {/* Hero Header with Elegant Design */}
                <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                        <div className="text-center animate-fadeInUp">
                            <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                                <span className="text-white/90 text-sm font-medium">
                                    ✨ Koleksi Premium 2025
                                </span>
                            </div>
                            <h1 className="catalog-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                                Bucket Bunga Pilihan
                            </h1>
                            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light">
                                Rangkaian bucket bunga segar dengan desain
                                elegan untuk momen spesial Anda
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                                <div className="flex items-center space-x-2 text-white/90">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FaShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold">
                                            {products.length}+
                                        </div>
                                        <div className="text-xs opacity-80">
                                            Produk
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-white/90">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FaStar className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold">
                                            4.8
                                        </div>
                                        <div className="text-xs opacity-80">
                                            Rating
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-white/90">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FaLeaf className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold">
                                            100%
                                        </div>
                                        <div className="text-xs opacity-80">
                                            Segar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                    {/* Search Bar - Floating Card */}
                    <div className="mb-8 animate-scaleIn">
                        <div className="glass-effect rounded-2xl shadow-xl border border-white/50 p-2">
                            <div className="flex items-center px-4 py-3">
                                <FaSearch className="w-5 h-5 text-rose-400 mr-3 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    placeholder="Cari bucket bunga favorit Anda..."
                                    className="search-input flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="ml-2 p-2 hover:bg-rose-50 rounded-full transition-colors flex-shrink-0"
                                    >
                                        <FaTimes className="w-4 h-4 text-gray-400 hover:text-rose-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter & Sort Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            {/* Categories */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        Kategori Produk
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowMobileFilters(
                                                !showMobileFilters,
                                            )
                                        }
                                        className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                                    >
                                        <FaFilter className="w-3.5 h-3.5" />
                                        <span>Filter</span>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedCategory("all")
                                        }
                                        className={`category-btn px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                                            selectedCategory === "all"
                                                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200 active"
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
                                            className={`category-btn px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 stagger-${index + 1} ${
                                                selectedCategory === category
                                                    ? `${categoryColors[category]} shadow-md active border`
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center space-x-4">
                                    {/* Results Count */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">
                                            Menampilkan{" "}
                                            <span className="font-bold text-gray-900">
                                                {filteredProducts.length}
                                            </span>{" "}
                                            produk
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {/* View Mode Toggle */}
                                    <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === "grid"
                                                    ? "bg-white text-rose-600 shadow-sm"
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
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === "list"
                                                    ? "bg-white text-rose-600 shadow-sm"
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
                                            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10">
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
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                                                            sortBy ===
                                                            option.value
                                                                ? "bg-rose-50 text-rose-600 font-medium"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        <span>
                                                            {option.label}
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

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6 animate-slideInLeft">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Filter Aktif:
                                    </span>
                                    {activeFilters.map((filter, index) => (
                                        <div
                                            key={index}
                                            className="filter-chip inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100"
                                        >
                                            <span className="text-sm">
                                                {filter.icon}
                                            </span>
                                            <span className="text-sm text-rose-700 font-medium">
                                                {filter.label}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeFilter(filter.type)
                                                }
                                                className="p-1 hover:bg-rose-200 rounded-full transition-colors"
                                            >
                                                <FaTimes className="w-3 h-3 text-rose-500" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={handleResetFilters}
                                        className="text-sm text-gray-500 hover:text-rose-600 font-medium ml-auto transition-colors"
                                    >
                                        Reset Semua
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded-lg"></div>
                                        <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                                        <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 animate-scaleIn">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">⚠️</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-semibold text-amber-900 mb-1">
                                            Mode Demo Aktif
                                        </h4>
                                        <p className="text-sm text-amber-700 mb-3">
                                            Menampilkan data contoh karena
                                            server offline. Data yang
                                            ditampilkan adalah simulasi.
                                        </p>
                                        <button
                                            onClick={fetchProducts}
                                            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                                        >
                                            Coba Muat Ulang
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && (
                        <>
                            {filteredProducts.length > 0 ? (
                                <div
                                    className={`grid gap-1 mb-12 ${
                                        viewMode === "grid"
                                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                                            : "grid-cols-1"
                                    }`}
                                >
                                    {filteredProducts.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`animate-scaleIn stagger-${(index % 8) + 1}`}
                                        >
                                            <ProductCard
                                                product={product}
                                                categoryColors={categoryColors}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 animate-fadeInUp">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                                        <FaSearch className="h-10 w-10 text-rose-400" />
                                    </div>
                                    <h3 className="catalog-heading text-2xl font-semibold text-gray-900 mb-3">
                                        Produk Tidak Ditemukan
                                    </h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        Maaf, kami tidak dapat menemukan produk
                                        yang sesuai dengan pencarian Anda. Coba
                                        kata kunci lain atau jelajahi kategori
                                        berbeda.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <button
                                            onClick={handleResetFilters}
                                            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-rose-200 transition-all"
                                        >
                                            Reset Semua Filter
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedCategory("all")
                                            }
                                            className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 text-sm font-semibold rounded-xl hover:border-rose-300 hover:bg-rose-50 transition-all"
                                        >
                                            Lihat Semua Produk
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Benefits Section */}
                    <div className="mt-16 mb-12">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
                                    <FaLeaf className="w-7 h-7 text-rose-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    100% Bunga Segar
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Setiap bucket dipilih dengan teliti
                                    menggunakan bunga segar berkualitas premium
                                    langsung dari kebun.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                                    <FaShoppingBag className="w-7 h-7 text-amber-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Pengiriman Aman
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Packing rapi dan aman memastikan bucket
                                    bunga tiba dalam kondisi sempurna di tangan
                                    Anda.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                    <FaTag className="w-7 h-7 text-violet-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    Kartu Ucapan Gratis
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Tambahkan sentuhan personal dengan kartu
                                    ucapan gratis untuk setiap pemesanan bucket
                                    bunga.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-12 mb-16">
                        <div className="bg-gradient-to-br from-rose-600 via-pink-500 to-rose-500 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="relative p-8 md:p-12">
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                                <div className="relative text-center">
                                    <h3 className="catalog-heading text-3xl md:text-4xl font-bold text-white mb-4">
                                        Butuh Rekomendasi Khusus?
                                    </h3>
                                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                        Tim kami siap membantu Anda memilih
                                        bucket bunga yang sempurna untuk momen
                                        spesial Anda
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a
                                            href="https://wa.me/YOUR_NUMBER"
                                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-rose-600 text-base font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-105"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                            Hubungi via WhatsApp
                                        </a>
                                        <button className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-base font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                                            Lihat Katalog Lengkap
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Modal */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">
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

                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
                                                className={`p-3 rounded-xl text-sm font-medium transition-all ${
                                                    sortBy === option.value
                                                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                        Pilih Kategori
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedCategory("all");
                                                setShowMobileFilters(false);
                                            }}
                                            className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-2 ${
                                                selectedCategory === "all"
                                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                                                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span className="text-xl">🌸</span>
                                            <span className="text-xs font-medium">
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
                                                className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-2 ${
                                                    selectedCategory ===
                                                    category
                                                        ? `${categoryColors[category]} border shadow-md`
                                                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                                                }`}
                                            >
                                                <span className="text-xl">
                                                    {categoryIcons[category] ||
                                                        "🌸"}
                                                </span>
                                                <span className="text-xs text-gray-700 font-medium">
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
                                    className="w-full py-3 text-gray-700 border-2 border-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Reset Semua Filter
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
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

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
                label: `Kategori: ${categoryLabels[selectedCategory] || selectedCategory}`,
                value: selectedCategory,
            });
        }
        if (searchQuery) {
            filters.push({
                type: "search",
                label: `Pencarian: "${searchQuery}"`,
                value: searchQuery,
            });
        }
        if (sortBy !== "default") {
            filters.push({
                type: "sort",
                label: `Urutan: ${sortOptions.find((opt) => opt.value === sortBy)?.label}`,
                value: sortBy,
            });
        }
        setActiveFilters(filters);
    }, [selectedCategory, searchQuery, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/products");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Filter hanya produk aktif
            const activeProducts = data.filter((p) => p.is_active);
            setProducts(activeProducts);
            setFilteredProducts(activeProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error.message);
            // Fallback dummy data dengan gambar emoji yang lebih menarik
            const dummyProducts = [
                {
                    id: 1,
                    name: "Bucket Roses Romantic",
                    category: "mawar",
                    description:
                        "Bucket berisi 12 mawar merah segar dengan hiasan baby breath dan pita elegan.",
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
                    name: "Bucket Sunflower Happiness",
                    category: "sunflower",
                    description:
                        "Bucket bunga matahari cerah dengan tambahan gypsophila dan wrapping khusus.",
                    price: 180000,
                    image: "🌻",
                    rating: 4.7,
                    is_active: true,
                    stock: 8,
                    isNew: false,
                    tags: ["Happy", "Popular"],
                },
                {
                    id: 3,
                    name: "Bucket Lily Premium",
                    category: "lily",
                    description:
                        "Lily putih dengan daun eucalyptus dalam bucket kayu natural.",
                    price: 320000,
                    image: "🌸",
                    rating: 4.9,
                    is_active: true,
                    stock: 5,
                    isNew: true,
                    tags: ["Premium", "Elegant"],
                },
                {
                    id: 4,
                    name: "Bucket Mixed Flowers",
                    category: "mixed",
                    description:
                        "Campuran mawar, gerbera, dan carnation dengan warna harmonis.",
                    price: 210000,
                    image: "💐",
                    rating: 4.6,
                    is_active: true,
                    stock: 12,
                    isNew: false,
                    tags: ["Colorful", "Fresh"],
                },
                {
                    id: 5,
                    name: "Bucket Baby Pink",
                    category: "mawar",
                    description:
                        "Rangkaian bunga warna pink soft untuk ulang tahun atau anniversary.",
                    price: 195000,
                    image: "🌷",
                    rating: 4.5,
                    is_active: true,
                    stock: 7,
                    isNew: true,
                    tags: ["Soft", "Anniversary"],
                },
                {
                    id: 6,
                    name: "Bucket Luxury Orchid",
                    category: "orchid",
                    description:
                        "Anggrek ungu dalam bucket kristal dengan hiasan golden ribbon.",
                    price: 450000,
                    image: "🌺",
                    rating: 5.0,
                    is_active: true,
                    stock: 3,
                    isNew: false,
                    tags: ["Luxury", "Exclusive"],
                },
                {
                    id: 7,
                    name: "Bucket Spring Garden",
                    category: "mixed",
                    description:
                        "Paduan berbagai bunga musim semi dengan aroma segar.",
                    price: 230000,
                    image: "🌼",
                    rating: 4.7,
                    is_active: true,
                    stock: 6,
                    isNew: true,
                    tags: ["Spring", "Fresh"],
                },
                {
                    id: 8,
                    name: "Bucket Carnation Delight",
                    category: "carnation",
                    description:
                        "Anyelir warna-warni dalam bucket keranjang anyaman.",
                    price: 165000,
                    image: "🌹",
                    rating: 4.4,
                    is_active: true,
                    stock: 15,
                    isNew: false,
                    tags: ["Colorful", "Cheerful"],
                },
                {
                    id: 9,
                    name: "Bucket Rose Gold Edition",
                    category: "mawar",
                    description:
                        "Mawar premium dengan sentuhan emas dan packaging eksklusif.",
                    price: 380000,
                    image: "🌹✨",
                    rating: 4.9,
                    is_active: true,
                    stock: 4,
                    isNew: true,
                    tags: ["Premium", "Luxury"],
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
        mixed: "Mixed Flowers",
        orchid: "Orchid",
        bucket: "Bucket",
        premium: "Premium",
        carnation: "Carnation",
    };

    const categoryColors = {
        mawar: "bg-gradient-to-r from-pink-500 to-rose-600",
        sunflower: "bg-gradient-to-r from-yellow-400 to-orange-500",
        lily: "bg-gradient-to-r from-white to-pink-300",
        mixed: "bg-gradient-to-r from-purple-400 to-pink-500",
        orchid: "bg-gradient-to-r from-purple-500 to-indigo-600",
        carnation: "bg-gradient-to-r from-red-400 to-pink-500",
    };

    const categoryIcons = {
        mawar: "🌹",
        sunflower: "🌻",
        lily: "🌸",
        mixed: "💐",
        orchid: "🌺",
        carnation: "🌹",
    };

    const sortOptions = [
        { value: "default", label: "Terbaru", icon: "🆕" },
        { value: "price-low", label: "Harga: Rendah ke Tinggi", icon: "⬆️" },
        { value: "price-high", label: "Harga: Tinggi ke Rendah", icon: "⬇️" },
        { value: "name-asc", label: "Nama: A-Z", icon: "🔤" },
        { value: "rating", label: "Rating Tertinggi", icon: "⭐" },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
                {/* Header dengan Gradient */}
                <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 py-12 mb-8">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                                    <FaShoppingBag className="w-4 h-4 text-white mr-2" />
                                    <span className="text-white text-sm font-medium">
                                        Katalog Premium
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    Temukan Bucket Bunga{" "}
                                    <span className="text-yellow-300">
                                        Impianmu
                                    </span>
                                </h1>
                                <p className="text-pink-100 max-w-2xl">
                                    Setiap bucket dirangkai dengan cinta dan
                                    keahlian untuk momen spesial Anda. Klik
                                    "Pesan via WhatsApp" untuk langsung
                                    terhubung.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            {products.length}
                                        </div>
                                        <div className="text-sm text-pink-100">
                                            Total Produk
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-white/30"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            4.8
                                        </div>
                                        <div className="text-sm text-pink-100">
                                            Rating Rata-rata
                                        </div>
                                    </div>
                                    <div className="h-12 w-px bg-white/30"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                            24/7
                                        </div>
                                        <div className="text-sm text-pink-100">
                                            Tersedia
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-12">
                    {/* Search Bar dengan Efek Glassmorphism */}
                    <div className="mb-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white rounded-2xl border border-pink-100 shadow-lg">
                                <div className="flex items-center px-6 py-4">
                                    <FaSearch className="w-5 h-5 text-pink-400 mr-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari nama bunga atau deskripsi..."
                                        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="ml-4 p-2 hover:bg-pink-50 rounded-full transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar dengan Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Categories Tabs */}
                            <div className="flex-1">
                                <div className="flex items-center mb-4">
                                    <FaFilter className="w-4 h-4 text-pink-500 mr-2" />
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Kategori Bucket
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() =>
                                            setSelectedCategory("all")
                                        }
                                        className={`group px-5 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                                            selectedCategory === "all"
                                                ? "border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 shadow-md"
                                                : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                                        }`}
                                    >
                                        <span
                                            className={`text-lg ${
                                                selectedCategory === "all"
                                                    ? "text-pink-600"
                                                    : "text-gray-500 group-hover:text-pink-500"
                                            }`}
                                        >
                                            🌟
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                selectedCategory === "all"
                                                    ? "text-pink-700"
                                                    : "text-gray-700 group-hover:text-pink-600"
                                            }`}
                                        >
                                            Semua Kategori
                                        </span>
                                        <span
                                            className={`text-sm px-2 py-0.5 rounded-full ${
                                                selectedCategory === "all"
                                                    ? "bg-pink-100 text-pink-700"
                                                    : "bg-gray-100 text-gray-600 group-hover:bg-pink-100 group-hover:text-pink-700"
                                            }`}
                                        >
                                            {products.length}
                                        </span>
                                    </button>

                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                setSelectedCategory(category)
                                            }
                                            className={`group px-5 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2 ${
                                                selectedCategory === category
                                                    ? `${categoryColors[category] || "bg-gradient-to-r from-pink-500 to-rose-500"} border-transparent text-white shadow-md`
                                                    : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                                            }`}
                                        >
                                            <span className="text-lg">
                                                {categoryIcons[category] ||
                                                    "🌸"}
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    selectedCategory ===
                                                    category
                                                        ? "text-white"
                                                        : "text-gray-700 group-hover:text-pink-600"
                                                }`}
                                            >
                                                {categoryLabels[category] ||
                                                    category}
                                            </span>
                                            <span
                                                className={`text-sm px-2 py-0.5 rounded-full ${
                                                    selectedCategory ===
                                                    category
                                                        ? "bg-white/20 text-white"
                                                        : "bg-gray-100 text-gray-600 group-hover:bg-pink-100 group-hover:text-pink-700"
                                                }`}
                                            >
                                                {
                                                    products.filter(
                                                        (p) =>
                                                            p.category ===
                                                            category,
                                                    ).length
                                                }
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="lg:w-64">
                                <div className="flex items-center mb-4">
                                    <FaTag className="w-4 h-4 text-pink-500 mr-2" />
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Urutkan
                                    </h3>
                                </div>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none appearance-none text-gray-700 cursor-pointer"
                                    >
                                        {sortOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none">
                                        <span className="text-gray-400">▼</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="mb-8 p-4 bg-white rounded-xl border border-pink-100 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="text-sm font-medium text-gray-700">
                                    Filter Aktif:
                                </div>
                                {activeFilters.map((filter, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200"
                                    >
                                        <span className="text-sm text-pink-700">
                                            {filter.label}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeFilter(filter.type)
                                            }
                                            className="p-1 hover:bg-pink-200 rounded-full transition-colors"
                                        >
                                            <FaTimes className="w-3 h-3 text-pink-500" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={handleResetFilters}
                                    className="ml-auto text-sm text-pink-600 hover:text-pink-800 font-medium flex items-center gap-1"
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Reset Semua Filter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Info Bar */}
                    <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`px-4 py-2 rounded-lg ${
                                        filteredProducts.length === 0
                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {filteredProducts.length === 0 ? (
                                            <>
                                                <span>🔍</span>
                                                <span className="font-bold">
                                                    Tidak ditemukan
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <FaFire className="w-4 h-4" />
                                                <span className="font-bold">
                                                    {filteredProducts.length}
                                                </span>
                                                <span>produk tersedia</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {selectedCategory !== "all" && (
                                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <span>Kategori: </span>
                                        <span className="font-bold text-pink-600">
                                            {categoryLabels[selectedCategory] ||
                                                selectedCategory}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaLeaf className="w-4 h-4 text-emerald-500" />
                                    <span>Bunga Segar</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaSeedling className="w-4 h-4 text-emerald-500" />
                                    <span>Quality Guarantee</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FaStar className="w-4 h-4 text-amber-500" />
                                    <span>Premium Quality</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <span className="text-2xl text-white">
                                        ⚠️
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">
                                        Data sedang offline
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Kami sedang menampilkan data contoh.{" "}
                                        {error}
                                    </p>
                                    <button
                                        onClick={fetchProducts}
                                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all font-medium"
                                    >
                                        Coba Muat Ulang
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-pink-100 overflow-hidden animate-pulse"
                                >
                                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100"></div>
                                    <div className="p-6">
                                        <div className="h-6 bg-gradient-to-r from-pink-100 to-rose-100 rounded mb-3"></div>
                                        <div className="h-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded mb-4 w-3/4"></div>
                                        <div className="h-10 bg-gradient-to-r from-pink-100 to-rose-100 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && (
                        <>
                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            categoryColors={categoryColors}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gradient-to-br from-white to-pink-50 rounded-2xl border-2 border-dashed border-pink-200">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
                                        <span className="text-4xl">🔍</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Tidak Ada Hasil Ditemukan
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                        Coba gunakan kata kunci lain atau pilih
                                        kategori yang berbeda untuk menemukan
                                        bucket bunga yang Anda cari.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={handleResetFilters}
                                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium shadow-lg hover:shadow-xl"
                                        >
                                            Reset Semua Filter
                                        </button>
                                        <button
                                            onClick={() =>
                                                setSelectedCategory("all")
                                            }
                                            className="px-6 py-3 bg-white text-pink-600 border-2 border-pink-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all font-medium"
                                        >
                                            Lihat Semua Produk
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Tips Section */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <span className="text-2xl text-white">💡</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">
                                    Tips Pemesanan
                                </h4>
                                <p className="text-gray-700 mb-3">
                                    Pesan minimal 2 hari sebelum acara untuk
                                    hasil terbaik. Konsultasikan kebutuhan
                                    spesial Anda via WhatsApp untuk custom
                                    request.
                                </p>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <span className="px-3 py-1.5 bg-white/50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                        🌸 Bunga Lebih Segar
                                    </span>
                                    <span className="px-3 py-1.5 bg-white/50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                        🎁 Gratis Kartu Ucapan
                                    </span>
                                    <span className="px-3 py-1.5 bg-white/50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                        📦 Packing Premium
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

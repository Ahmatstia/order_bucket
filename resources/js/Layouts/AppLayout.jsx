import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import CustomerGreeting from "../Components/CustomerGreeting";
import CartIcon from "../Components/CartIcon";
import {
    FaInstagram,
    FaFacebookF,
    FaWhatsapp,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaHeart,
    FaShieldAlt,
    FaTruck,
    FaUser,
    FaSignOutAlt,
    FaTachometerAlt,
} from "react-icons/fa";

export default function AppLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    // Ambil data auth dari Inertia
    const { auth } = usePage().props;

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    // Handle logout - FIXED VERSION
    const handleLogout = async (e) => {
        e.preventDefault();

        if (!window.confirm("Yakin ingin logout dari admin panel?")) {
            return;
        }

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]',
            )?.content;

            const response = await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin",
            });

            if (response.ok || response.redirected) {
                // Redirect ke home page
                window.location.href = "/";
            } else {
                alert("Logout gagal, silakan coba lagi.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback: redirect langsung
            window.location.href = "/logout";
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap");

                .font-playfair {
                    font-family: "Playfair Display", serif;
                }

                .font-poppins {
                    font-family: "Poppins", sans-serif;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-down {
                    animation: slideDown 0.3s ease-out forwards;
                }

                .nav-link {
                    position: relative;
                    transition: color 0.3s ease;
                }

                .nav-link::after {
                    content: "";
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, #ec4899, #f43f5e);
                    transition: width 0.3s ease;
                }

                .nav-link:hover::after {
                    width: 100%;
                }

                .mobile-menu-backdrop {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                /* Animasi dropdown admin */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .admin-dropdown {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>

            {/* ==================== HEADER ==================== */}
            <header
                id="main-header"
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-pink-100"
                        : "bg-gradient-to-r from-white/70 via-pink-50/40 to-white/70 backdrop-blur-md border-b border-white/30"
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center py-3 md:py-4">
                        {/* Logo & Brand */}
                        <div className="flex items-center space-x-3 md:space-x-4">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 md:space-x-3 group"
                            >
                                {/* Logo */}
                                <div className="relative">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300 group-hover:scale-105">
                                        <span className="text-white font-bold text-xl md:text-2xl font-playfair">
                                            B
                                        </span>
                                    </div>
                                    {/* Decorative dot */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                                </div>

                                {/* Brand Name */}
                                <div className="hidden sm:block">
                                    <h1 className="text-xl md:text-2xl font-bold font-playfair bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                                        BucketBouquets
                                    </h1>
                                    <p className="text-xs text-gray-500 font-poppins">
                                        Bucket bunga spesialmu ✨
                                    </p>
                                </div>
                            </Link>

                            {/* Customer Greeting - Desktop Only */}
                            <div className="hidden lg:block ml-4">
                                <CustomerGreeting />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <ul className="flex items-center space-x-8">
                                <li>
                                    <Link
                                        href="/"
                                        className="nav-link text-gray-700 hover:text-pink-600 font-medium font-poppins transition-colors"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="nav-link text-gray-700 hover:text-pink-600 font-medium font-poppins transition-colors"
                                    >
                                        Katalog
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#tentang"
                                        className="nav-link text-gray-700 hover:text-pink-600 font-medium font-poppins transition-colors"
                                    >
                                        Tentang
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#kontak"
                                        className="nav-link text-gray-700 hover:text-pink-600 font-medium font-poppins transition-colors"
                                    >
                                        Kontak
                                    </a>
                                </li>
                            </ul>

                            {/* Cart Icon + CTA + Admin Menu */}
                            <div className="flex items-center space-x-4">
                                <CartIcon />

                                {/* Admin Menu (jika login) */}
                                {auth.user && (
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowAdminMenu(!showAdminMenu)
                                            }
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium font-poppins text-sm group"
                                        >
                                            <FaUser className="w-4 h-4" />
                                            <span>Admin</span>
                                        </button>

                                        {/* Dropdown Admin Menu */}
                                        {showAdminMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 admin-dropdown overflow-hidden">
                                                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {auth.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {auth.user.email}
                                                    </p>
                                                </div>
                                                <div className="py-2">
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                                        onClick={() =>
                                                            setShowAdminMenu(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <FaTachometerAlt className="w-4 h-4" />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/admin/products"
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                                                        onClick={() =>
                                                            setShowAdminMenu(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <span className="w-4 h-4 text-center">
                                                            📦
                                                        </span>
                                                        Kelola Produk
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                                                    >
                                                        <FaSignOutAlt className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* WhatsApp CTA */}
                                <a
                                    href="https://wa.me/6282371663414"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium font-poppins text-sm group"
                                >
                                    <FaWhatsapp className="w-4 h-4" />
                                    <span>Chat Now</span>
                                </a>
                            </div>
                        </nav>

                        {/* ================= MOBILE ================= */}
                        <div className="flex items-center gap-3 md:hidden">
                            <CartIcon />

                            {/* Admin Indicator Mobile */}
                            {auth.user && (
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    A
                                </div>
                            )}

                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="p-2 rounded-lg hover:bg-pink-50 transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <svg
                                        className="w-6 h-6 text-pink-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6 text-pink-800"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= MOBILE MENU ================= */}
                {isMobileMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/40 z-[60] mobile-menu-backdrop"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 bg-white shadow-2xl z-[70] animate-slide-down max-h-[80vh] overflow-y-auto">
                            <div className="container mx-auto px-4 py-6 space-y-3">
                                {/* Regular Menu Items */}
                                {[
                                    { label: "🏠 Home", href: "/" },
                                    { label: "🌸 Katalog", href: "/catalog" },
                                    { label: "ℹ️ Tentang", href: "#tentang" },
                                    { label: "📞 Kontak", href: "#kontak" },
                                ].map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 font-medium text-gray-700 hover:text-pink-600 transition-all font-poppins"
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Admin Menu in Mobile - HANYA TAMPIL JIKA auth.user */}
                                {auth.user && (
                                    <>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Admin Menu
                                            </p>
                                            <Link
                                                href="/admin"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl text-purple-700 font-medium"
                                            >
                                                <FaTachometerAlt className="w-4 h-4" />
                                                Dashboard Admin
                                            </Link>
                                            <Link
                                                href="/admin/products"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                                            >
                                                <span>📦</span>
                                                Kelola Produk
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    handleLogout(e);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-left"
                                            >
                                                <FaSignOutAlt className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* WhatsApp CTA */}
                                <a
                                    href="https://wa.me/6282371663414"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full mt-4 px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl shadow-lg font-semibold font-poppins"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    Chat via WhatsApp
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </header>

            {/* Main Content with proper spacing for fixed header */}
            <main className="pt-[73px] md:pt-[81px]">{children}</main>

            {/* ==================== FOOTER ==================== */}
            <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full filter blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
                    {/* Top Section - Trust Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-gray-700">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaShieldAlt className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold font-poppins text-white mb-1">
                                    Garansi Kualitas
                                </h4>
                                <p className="text-sm text-gray-400 font-poppins">
                                    Uang kembali jika tidak puas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaTruck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold font-poppins text-white mb-1">
                                    Pengiriman Cepat
                                </h4>
                                <p className="text-sm text-gray-400 font-poppins">
                                    Same day delivery tersedia
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaHeart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold font-poppins text-white mb-1">
                                    Dibuat dengan Cinta
                                </h4>
                                <p className="text-sm text-gray-400 font-poppins">
                                    Dirangkai penuh kehati-hatian
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-2xl font-playfair">
                                        B
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold font-playfair bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                        BucketBouquets
                                    </h3>
                                    <p className="text-xs text-gray-400 font-poppins">
                                        Premium Flower Arrangements
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm md:text-base mb-6 max-w-md leading-relaxed font-poppins">
                                Menyediakan bucket bunga berkualitas premium
                                untuk setiap momen spesial. Dari ulang tahun,
                                wisuda, anniversary hingga pernikahan - kami
                                hadir dengan rangkaian bunga terbaik yang
                                dirangkai dengan penuh cinta.
                            </p>

                            {/* Social Media */}
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://instagram.com/bucketbouquets"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-11 h-11 bg-gradient-to-br from-pink-500/10 to-rose-500/10 hover:from-pink-500 hover:to-rose-500 border border-pink-500/20 hover:border-pink-500 rounded-xl flex items-center justify-center transition-all duration-300"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram className="w-5 h-5 text-pink-400 group-hover:text-white transition-colors" />
                                </a>
                                <a
                                    href="https://facebook.com/bucketbouquets"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-11 h-11 bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500 hover:to-blue-600 border border-blue-500/20 hover:border-blue-500 rounded-xl flex items-center justify-center transition-all duration-300"
                                    aria-label="Facebook"
                                >
                                    <FaFacebookF className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                                </a>
                                <a
                                    href="https://wa.me/6282371663414"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-11 h-11 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500 hover:to-emerald-500 border border-green-500/20 hover:border-green-500 rounded-xl flex items-center justify-center transition-all duration-300"
                                    aria-label="WhatsApp"
                                >
                                    <FaWhatsapp className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h4 className="font-bold text-lg mb-6 font-playfair relative inline-block">
                                Menu Cepat
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base flex items-center gap-2 group font-poppins"
                                    >
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base flex items-center gap-2 group font-poppins"
                                    >
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Katalog Produk
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base flex items-center gap-2 group font-poppins"
                                    >
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        Keranjang
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-pink-400 transition-colors text-sm md:text-base flex items-center gap-2 group font-poppins"
                                    >
                                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h4 className="font-bold text-lg mb-6 font-playfair relative inline-block">
                                Hubungi Kami
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                            </h4>
                            <div className="space-y-4 text-sm md:text-base">
                                <div className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all">
                                        <FaPhone className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div>
                                        <a
                                            href="https://wa.me/6282371663414"
                                            target="_blank"
                                            className="text-gray-300 hover:text-green-400 transition-colors block font-medium font-poppins"
                                            rel="noopener noreferrer"
                                        >
                                            0823-7166-3414
                                        </a>
                                        <span className="text-xs text-gray-500 font-poppins">
                                            WhatsApp (24/7)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-pink-500/20 group-hover:to-rose-500/20 transition-all">
                                        <FaEnvelope className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <div>
                                        <a
                                            href="mailto:order@bucketbouquets.id"
                                            className="text-gray-300 hover:text-pink-400 transition-colors font-poppins"
                                        >
                                            order@bucketbouquets.id
                                        </a>
                                        <p className="text-xs text-gray-500 mt-1 font-poppins">
                                            Response dalam 1 jam
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 group">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all">
                                        <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <span className="text-gray-300 font-poppins">
                                            Pariaman, Sumatera Barat
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1 font-poppins">
                                            Pengiriman se-Indonesia
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {/* Copyright */}
                            <p className="text-gray-400 text-sm font-poppins text-center md:text-left">
                                © {new Date().getFullYear()}{" "}
                                <span className="font-semibold text-pink-400">
                                    BucketBouquets
                                </span>
                                . Crafted with{" "}
                                <FaHeart className="inline w-3 h-3 text-rose-500 mx-1" />{" "}
                                for you.
                            </p>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 font-poppins">
                                <a
                                    href="#"
                                    className="hover:text-pink-400 transition-colors"
                                >
                                    Privacy Policy
                                </a>
                                <span className="text-gray-600">•</span>
                                <a
                                    href="#"
                                    className="hover:text-pink-400 transition-colors"
                                >
                                    Terms of Service
                                </a>
                                <span className="text-gray-600">•</span>
                                <a
                                    href="#"
                                    className="hover:text-pink-400 transition-colors"
                                >
                                    Refund Policy
                                </a>
                                {auth.user && (
                                    <>
                                        <span className="text-gray-600">•</span>
                                        <Link
                                            href="/admin"
                                            className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payment & Security Badges */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <div className="text-xs text-gray-500 font-poppins">
                                    Metode Pembayaran:
                                </div>
                                <div className="flex gap-3">
                                    {["💳", "🏦", "📱"].map((icon, i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-lg border border-white/10"
                                        >
                                            {icon}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 font-poppins">
                                    🔒 Transaksi Aman & Terpercaya
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

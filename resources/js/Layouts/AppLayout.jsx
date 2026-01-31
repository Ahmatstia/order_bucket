import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import CustomerGreeting from "../Components/CustomerGreeting";
import CartIcon from "../Components/CartIcon";

export default function AppLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        B
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        BucketBouquets
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        Bucket bunga spesialmu
                                    </p>
                                </div>
                            </Link>
                            <div className="hidden sm:block">
                                <CustomerGreeting />
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <ul className="flex space-x-6">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-700 hover:text-primary-600 font-medium"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="text-gray-700 hover:text-primary-600 font-medium"
                                    >
                                        Katalog
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-primary-600 font-medium"
                                    >
                                        Tentang
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-primary-600 font-medium"
                                    >
                                        Kontak
                                    </a>
                                </li>
                            </ul>

                            {/* Cart Icon for Desktop */}
                            <div className="ml-4">
                                <CartIcon />
                            </div>
                        </nav>

                        {/* Mobile: Cart Icon + Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            <CartIcon />
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                {isMobileMenuOpen ? (
                                    <svg
                                        className="w-6 h-6"
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
                                        className="w-6 h-6"
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

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-3">
                                <Link
                                    href="/"
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/catalog"
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Katalog
                                </Link>
                                <Link
                                    href="/cart"
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium flex items-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>🛒</span> Keranjang
                                </Link>
                                <a
                                    href="#"
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                                >
                                    Tentang
                                </a>
                                <a
                                    href="#"
                                    className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium"
                                >
                                    Kontak
                                </a>
                                <div className="pt-3">
                                    <CustomerGreeting />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
                {children}
            </main>

            {/* Footer - lebih ringkas untuk mobile */}
            <footer className="bg-gray-900 text-white mt-12">
                <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-primary-500 rounded-lg"></div>
                                <h3 className="text-lg font-bold">
                                    BucketBouquets
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                Sistem pemesanan bucket bunga modern dan mudah.
                                Pesan bucket bunga favoritmu langsung via
                                WhatsApp tanpa ribet.
                            </p>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <span className="text-lg">📱</span>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <span className="text-lg">📷</span>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <span className="text-lg">✉️</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-base mb-3">Menu</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Katalog Produk
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Keranjang
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white text-sm"
                                    >
                                        Cara Order
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-base mb-3">Kontak</h4>
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-start gap-2">
                                    <span>📞</span>
                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        className="hover:text-green-400"
                                    >
                                        0812-3456-7890
                                    </a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>✉️</span>
                                    <span>order@bucketbouquets.id</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span>📍</span>
                                    <span>
                                        Jl. Bunga Indah No. 123, Kota Bunga
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs md:text-sm">
                        <p className="mb-2">
                            © 2024 BucketBouquets. All rights reserved.
                        </p>
                        <p className="text-xs">
                            Made with ❤️ for beautiful moments |
                            <a href="#" className="ml-2 hover:text-white">
                                Privacy Policy
                            </a>{" "}
                            |
                            <a href="#" className="ml-2 hover:text-white">
                                Terms of Service
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

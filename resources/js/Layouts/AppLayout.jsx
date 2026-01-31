import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import CustomerGreeting from "../Components/CustomerGreeting";
import CartIcon from "../Components/CartIcon";

export default function AppLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header
                id="main-header"
                className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
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
                                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                                    >
                                        Katalog
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                                    >
                                        Tentang
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
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
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg
                                        className="w-6 h-6 text-gray-700"
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
                                        className="w-6 h-6 text-gray-700"
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
                        <div className="md:hidden py-4 border-t border-gray-200 bg-white">
                            <div className="flex flex-col space-y-3">
                                <Link
                                    href="/"
                                    className="px-3 py-2 rounded-lg hover:bg-pink-50 font-medium text-gray-700 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/catalog"
                                    className="px-3 py-2 rounded-lg hover:bg-pink-50 font-medium text-gray-700 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Katalog
                                </Link>
                                <a
                                    href="#"
                                    className="px-3 py-2 rounded-lg hover:bg-pink-50 font-medium text-gray-700 transition-colors"
                                >
                                    Tentang
                                </a>
                                <a
                                    href="#"
                                    className="px-3 py-2 rounded-lg hover:bg-pink-50 font-medium text-gray-700 transition-colors"
                                >
                                    Kontak
                                </a>
                                <div className="pt-3 border-t border-gray-100">
                                    <CustomerGreeting />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Children can decide their own width */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-auto">
                <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        B
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold">
                                    BucketBouquets
                                </h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 max-w-lg">
                                Menyediakan bucket bunga berkualitas tinggi
                                untuk setiap momen spesial. Dari ulang tahun
                                hingga anniversary, kami hadir dengan rangkaian
                                bunga terbaik.
                            </p>
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <span className="text-lg">📷</span>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <span className="text-lg">📘</span>
                                </a>
                                <a
                                    href="#"
                                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <span className="text-lg">💬</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Menu</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/catalog"
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        Katalog Produk
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        Keranjang
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        Cara Order
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Kontak</h4>
                            <div className="space-y-3 text-sm text-gray-400">
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">📱</span>
                                    <div>
                                        <a
                                            href="https://wa.me/6281234567890"
                                            target="_blank"
                                            className="hover:text-green-400 transition-colors block"
                                            rel="noopener noreferrer"
                                        >
                                            0812-3456-7890
                                        </a>
                                        <span className="text-xs text-gray-500">
                                            (WhatsApp)
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">✉️</span>
                                    <div>
                                        <span>order@bucketbouquets.id</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Response cepat via email
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">📍</span>
                                    <div>
                                        <span>Jakarta Selatan</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pengiriman seluruh Jabodetabek
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-500 text-sm mb-2">
                            © {new Date().getFullYear()} BucketBouquets. All
                            rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Terms of Service
                            </a>
                            <span>•</span>
                            <a
                                href="#"
                                className="hover:text-white transition-colors"
                            >
                                Refund Policy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

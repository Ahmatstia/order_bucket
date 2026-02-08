import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard() {
    // Handle logout di dashboard
    const handleLogout = (e) => {
        e.preventDefault();

        if (!window.confirm("Yakin ingin logout?")) {
            return;
        }

        // Buat form dan submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/logout";

        const csrfToken = document.querySelector(
            'meta[name="csrf-token"]',
        )?.content;

        if (csrfToken) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Admin Dashboard - BucketBouquets" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Panel admin untuk mengelola BucketBouquets
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Manage Products */}
                        <Link
                            href="/admin/products"
                            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-pink-300 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Kelola Produk
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Tambah, edit, atau hapus produk bucket bunga
                            </p>
                            <div className="mt-4 text-pink-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Buka →
                            </div>
                        </Link>

                        {/* Card 2: Orders */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl">🛒</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Pesanan
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Lihat dan kelola pesanan dari pelanggan
                            </p>
                            <div className="mt-4 text-gray-400 text-sm">
                                (Coming Soon)
                            </div>
                        </div>

                        {/* Card 3: Analytics */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Analitik
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Lihat statistik penjualan dan performa
                            </p>
                            <div className="mt-4 text-gray-400 text-sm">
                                (Coming Soon)
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                        <h3 className="font-bold text-gray-900 mb-3">
                            🚀 Mulai Mengelola
                        </h3>
                        <p className="text-gray-700 text-sm">
                            Mulai dengan mengelola produk Anda. Pastikan stok
                            selalu update dan gambar produk berkualitas tinggi.
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/admin/products"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all text-sm font-medium"
                            >
                                <span>📦</span>
                                Kelola Produk Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

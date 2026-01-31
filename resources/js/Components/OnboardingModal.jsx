import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function OnboardingModal() {
    const [customerName, setCustomerName] = useLocalStorage(
        "customer_name",
        "",
    );
    const [isOpen, setIsOpen] = useState(false);
    const [inputName, setInputName] = useState("");

    useEffect(() => {
        // Cek apakah modal sudah pernah ditutup atau nama sudah ada
        const hasClosedModal = localStorage.getItem("onboarding_closed");

        // Jika nama belum diisi DAN modal belum pernah ditutup, tampilkan modal
        if (!customerName && !hasClosedModal) {
            // Delay sedikit agar UI lain selesai render
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [customerName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputName.trim()) {
            setCustomerName(inputName.trim());
            setIsOpen(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("onboarding_closed", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            {/* Modal */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">👋</span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Selamat Datang!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Sebelum menjelajahi katalog bucket bunga, boleh
                            kenalan dulu?
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={inputName}
                                    onChange={(e) =>
                                        setInputName(e.target.value)
                                    }
                                    placeholder="Masukkan nama kamu"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                    autoFocus
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2 text-left">
                                    Nama akan disimpan di browser ini saja,
                                    untuk personalisasi pengalaman.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="btn btn-outline flex-1"
                                >
                                    Lewati
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1"
                                    disabled={!inputName.trim()}
                                >
                                    Simpan & Lanjutkan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

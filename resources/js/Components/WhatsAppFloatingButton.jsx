import React, { useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
    generateGeneralInquiryMessage,
    sendWhatsAppMessage,
    quickTemplates,
    getWhatsAppNumber,
} from "../utils/whatsapp";
import { MessageCircle, X, ChevronUp, Phone, Mail, Info } from "lucide-react";

export default function WhatsAppFloatingButton() {
    const [customerName] = useLocalStorage("customer_name", "");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [pulse, setPulse] = useState(true);
    const [clickCount, setClickCount] = useState(0);

    const phoneNumber = getWhatsAppNumber();

    // Auto-hide saat scroll
    useEffect(() => {
        let lastScrollY = window.scrollY;
        let scrollTimer;

        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY = window.scrollY;

            // Reset timer on scroll
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimer);
        };
    }, []);

    // Pulsing effect
    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(true);
            setTimeout(() => setPulse(false), 1000);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // Click counter for special effect
    useEffect(() => {
        if (clickCount >= 3) {
            setTimeout(() => setClickCount(0), 5000);
        }
    }, [clickCount]);

    const handleGeneralInquiry = () => {
        const message = generateGeneralInquiryMessage(customerName);
        sendWhatsAppMessage(message);
        setIsExpanded(false);
        setClickCount((prev) => prev + 1);
    };

    const handleFastQuestion = (questionType) => {
        let additionalInfo = "";
        if (questionType === "delivery") {
            additionalInfo = prompt(
                "Masukkan kota/area pengiriman:",
                "Jakarta",
            );
        } else if (questionType === "price") {
            additionalInfo = prompt("Produk apa yang ingin ditanyakan?", "");
        }

        const message = quickTemplates[questionType](
            customerName,
            additionalInfo || "",
        );
        sendWhatsAppMessage(message);
        setIsExpanded(false);
        setClickCount((prev) => prev + 1);
    };

    const handleCall = () => {
        window.open(`tel:${phoneNumber}`, "_blank");
    };

    const handleEmail = () => {
        window.open(
            "mailto:bucketbouquets@gmail.com?subject=Konsultasi%20Bucket%20Bunga&body=Halo%20BucketBouquets%2C%0A%0ASaya%20ingin%20bertanya%20tentang...",
            "_blank",
        );
    };

    const handleClose = () => {
        setIsExpanded(false);
    };

    const handleMainButtonClick = () => {
        if (clickCount >= 2) {
            // Easter egg after 3 clicks
            const message = `🎉 *SURPRISE!* 🎉

Halo Admin BucketBouquets!
Saya ${customerName || "Customer"} sudah klik tombol ini 3x 😊
Artinya saya SERIUS mau order nih!

Bisa dibantu untuk:
1. Rekomendasi bucket bunga terbaik
2. Custom untuk [acara spesial]
3. Pengiriman cepat

Lokasi: [Kota saya]

Terima kasih! 💖🌸`;
            sendWhatsAppMessage(message);
            setClickCount(0);
        } else {
            setIsExpanded(!isExpanded);
            setClickCount((prev) => prev + 1);
        }
    };

    return (
        <div className="fixed bottom-6 right-4 md:right-6 z-50">
            {/* Expanded Menu */}
            {isExpanded && (
                <div className="absolute bottom-16 right-0 mb-4 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-2xl p-4 w-72 md:w-80 border border-green-100">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-green-50">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                                        <MessageCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm md:text-base">
                                        BucketBouquets Support
                                    </h3>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        Online • Fast Response
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3 font-medium flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Pertanyaan Cepat:
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() =>
                                        handleFastQuestion("catalog")
                                    }
                                    className="flex flex-col items-center gap-1 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all group"
                                >
                                    <span className="text-xl">📚</span>
                                    <span className="text-xs font-medium">
                                        Katalog
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleFastQuestion("price")}
                                    className="flex flex-col items-center gap-1 p-3 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-all group"
                                >
                                    <span className="text-xl">💰</span>
                                    <span className="text-xs font-medium">
                                        Harga
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        handleFastQuestion("delivery")
                                    }
                                    className="flex flex-col items-center gap-1 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all group"
                                >
                                    <span className="text-xl">🚚</span>
                                    <span className="text-xs font-medium">
                                        Ongkir
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleFastQuestion("custom")}
                                    className="flex flex-col items-center gap-1 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all group"
                                >
                                    <span className="text-xl">🎨</span>
                                    <span className="text-xs font-medium">
                                        Custom
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Main Action Button */}
                        <div className="space-y-2">
                            <button
                                onClick={handleGeneralInquiry}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Konsultasi Lengkap
                            </button>

                            {/* Additional Contact Options */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCall}
                                    className="flex-1 bg-white border border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    Telepon
                                </button>
                                <button
                                    onClick={handleEmail}
                                    className="flex-1 bg-white border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    Email
                                </button>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                ⏱️ Response time: 5-15 menit
                            </p>
                            <p className="text-xs text-gray-500 text-center mt-1">
                                🕒 Operational: 08:00 - 21:00 WIB
                            </p>
                        </div>
                    </div>

                    {/* Arrow pointer */}
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-r border-b border-green-100"></div>
                </div>
            )}

            {/* Main Floating Button */}
            <div
                className={`transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
                <div className="relative">
                    {/* Notification Badge */}
                    <div
                        className={`absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg ${pulse ? "animate-ping" : ""}`}
                    >
                        <div className="absolute inset-0 rounded-full bg-pink-500"></div>
                        <span className="relative z-10">!</span>
                    </div>

                    {/* Glow Effect Container */}
                    <div className="absolute inset-0">
                        <div
                            className={`absolute inset-0 rounded-full ${pulse ? "animate-ping-slow" : ""} ${clickCount >= 2 ? "bg-gradient-to-r from-pink-400 to-rose-400" : "bg-green-400"} opacity-20 blur-xl`}
                        ></div>
                    </div>

                    {/* Main Button */}
                    <button
                        onClick={handleMainButtonClick}
                        className={`
                            group relative flex items-center justify-center
                            ${
                                clickCount >= 2
                                    ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            }
                            text-white rounded-full p-4 md:p-5 shadow-2xl hover:shadow-3xl 
                            transition-all duration-300 transform hover:scale-105
                            ${isExpanded ? "rotate-45" : ""}
                        `}
                        title="Chat dengan Admin"
                        aria-label="Hubungi via WhatsApp"
                    >
                        {/* Animated rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping-slow"></div>

                        {/* Icon */}
                        {isExpanded ? (
                            <X className="w-6 h-6 md:w-7 md:h-7 transition-transform" />
                        ) : (
                            <MessageCircle className="w-6 h-6 md:w-7 md:h-7 transition-transform" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap">
                            <div className="bg-gray-900 text-white text-sm font-medium py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                Butuh bantuan? 👋
                                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900"></div>
                            </div>
                        </div>
                    </button>

                    {/* Instruction Text */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <p className="text-xs text-gray-600 font-medium whitespace-nowrap">
                            {clickCount >= 2
                                ? "Mau order nih! 🎉"
                                : "Klik untuk konsultasi"}
                        </p>
                        <div className="flex justify-center mt-1">
                            <ChevronUp
                                className={`w-4 h-4 ${clickCount >= 2 ? "text-pink-500" : "text-green-500"} animate-bounce ${isExpanded ? "hidden" : ""}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

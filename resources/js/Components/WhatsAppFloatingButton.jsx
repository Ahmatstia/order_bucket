// resources/js/Components/WhatsAppFloatingButton.jsx
import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function WhatsAppFloatingButton() {
    const [customerName] = useLocalStorage("customer_name", "");

    const handleGeneralInquiry = () => {
        const phoneNumber = "6282371663414";
        const message =
            `Halo admin BucketBouquets! 😊\n\n` +
            `Saya ${customerName || "Customer"} mau tanya tentang:\n` +
            `- Katalog bucket bunga\n` +
            `- Harga dan pengiriman\n` +
            `- Custom order\n\n` +
            `Bisa dibantu? Terima kasih! 🌸`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-4 md:right-6 z-40">
            <button
                onClick={handleGeneralInquiry}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full p-3 md:px-5 md:py-3 shadow-xl hover:shadow-2xl transition-all duration-300 animate-bounce hover:animate-none"
                title="Konsultasi via WhatsApp"
            >
                <span className="text-xl md:text-2xl">💬</span>
                <span className="hidden md:inline font-medium ml-1">
                    Tanya Admin
                </span>
            </button>

            {/* Badge untuk mobile */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                !
            </div>
        </div>
    );
}

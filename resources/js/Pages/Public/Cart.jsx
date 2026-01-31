import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { useCart } from "../../contexts/CartContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import OnboardingModal from "../../Components/OnboardingModal";
import WhatsAppFloatingButton from "../../Components/WhatsAppFloatingButton";

export default function Cart() {
    const {
        cartItems,
        cartTotal,
        cartCount,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
    } = useCart();

    const [customerName] = useLocalStorage("customer_name", "");

    const handleCheckout = () => {
        if (cartCount === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        if (!customerName) {
            alert("Silakan isi nama Anda terlebih dahulu.");
            return;
        }

        const phoneNumber = "6282371663414";

        // Build WhatsApp message
        let message = `Halo admin BucketBouquets! 😊\n\n`;
        message += `Saya ${customerName} mau pesan:\n\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`;
            message += `   Jumlah: ${item.quantity}\n`;
            message += `   Harga: Rp ${item.price.toLocaleString("id-ID")} × ${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n\n`;
        });

        message += `*TOTAL: Rp ${cartTotal.toLocaleString("id-ID")}*\n\n`;
        message += `Bisa dikirim hari ini? Terima kasih! 🌸`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
    };

    const handleContinueShopping = () => {
        window.history.back();
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Keranjang Belanja
                    </h1>
                    <p className="text-gray-600">
                        Review pesanan Anda sebelum checkout
                    </p>
                </div>

                {cartCount === 0 ? (
                    /* Empty Cart State */
                    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
                        <div className="text-6xl mb-6">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Keranjang Kosong
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Tambahkan beberapa bucket bunga ke keranjang dan
                            buat moment spesial lebih berkesan!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/catalog"
                                className="btn btn-primary px-8 py-3"
                            >
                                Lihat Katalog
                            </Link>
                            <button
                                onClick={handleContinueShopping}
                                className="btn btn-outline px-8 py-3"
                            >
                                Lanjutkan Belanja
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Cart with Items */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        Item dalam Keranjang ({cartCount}{" "}
                                        {cartCount === 1 ? "item" : "items"})
                                    </h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Kosongkan Keranjang
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                                        >
                                            {/* Product Image */}
                                            <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl">
                                                        💐
                                                    </span>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            {item.category}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                decrementQuantity(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-10 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                incrementQuantity(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="w-8 h-8 flex items-center justify-center bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <div className="font-bold text-gray-900">
                                                            Rp{" "}
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Rp{" "}
                                                            {item.price.toLocaleString(
                                                                "id-ID",
                                                            )}{" "}
                                                            / item
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Continue Shopping Button */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleContinueShopping}
                                        className="flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium"
                                    >
                                        ← Lanjutkan Belanja
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">
                                    Ringkasan Pesanan
                                </h2>

                                {/* Order Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>
                                        <span className="font-medium">
                                            Rp{" "}
                                            {cartTotal.toLocaleString("id-ID")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Pengiriman
                                        </span>
                                        <span className="text-green-600 font-medium">
                                            Gratis*
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Pajak
                                        </span>
                                        <span className="font-medium">
                                            Rp 0
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-gray-900">
                                                Total
                                            </span>
                                            <span className="text-2xl font-bold text-primary-600">
                                                Rp{" "}
                                                {cartTotal.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            *Gratis ongkir dalam kota untuk
                                            order minimal Rp 200.000
                                        </p>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={cartCount === 0 || !customerName}
                                    className={`btn w-full flex items-center justify-center gap-2 py-3 rounded-xl text-lg font-bold transition-all ${
                                        cartCount === 0 || !customerName
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                                    }`}
                                >
                                    <span>💬</span>
                                    Checkout via WhatsApp
                                </button>

                                {/* Customer Name Check */}
                                {!customerName && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ Silakan isi nama Anda terlebih
                                            dahulu untuk checkout.
                                        </p>
                                    </div>
                                )}

                                {/* Order Notes */}
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h3 className="font-bold text-blue-900 text-sm mb-2">
                                        📝 Cara Order:
                                    </h3>
                                    <ol className="text-blue-800 text-sm space-y-1">
                                        <li>1. Klik "Checkout via WhatsApp"</li>
                                        <li>
                                            2. Anda akan diarahkan ke WhatsApp
                                        </li>
                                        <li>
                                            3. Konfirmasi pesanan dengan admin
                                        </li>
                                        <li>
                                            4. Admin akan proses pesanan Anda
                                        </li>
                                    </ol>
                                </div>

                                {/* Cart Stats */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Total Item:</span>
                                        <span className="font-medium">
                                            {cartCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>Total Produk:</span>
                                        <span className="font-medium">
                                            {cartItems.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Development Note */}
                <div className="mt-12 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                        <span className="font-bold">FITUR BARU:</span> Keranjang
                        belanja sudah aktif! Coba tambah beberapa produk dan
                        checkout via WhatsApp.
                    </p>
                </div>
            </div>

            <WhatsAppFloatingButton />
            <OnboardingModal />
        </AppLayout>
    );
}

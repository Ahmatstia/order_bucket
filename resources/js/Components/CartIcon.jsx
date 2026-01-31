import React from "react";
import { Link } from "@inertiajs/react";
import { useCart } from "../contexts/CartContext";

export default function CartIcon() {
    const { cartItems, cartCount, cartTotal } = useCart();

    const [showPreview, setShowPreview] = React.useState(false);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
        >
            {/* Cart Link */}
            <Link
                href="/cart"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <div className="relative">
                    <span className="text-2xl">🛒</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                            {cartCount > 9 ? "9+" : cartCount}
                        </span>
                    )}
                </div>

                {/* Desktop only */}
                <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-700">
                        Keranjang
                    </div>
                    <div className="text-xs text-gray-500">
                        Rp {cartTotal.toLocaleString("id-ID")}
                    </div>
                </div>
            </Link>

            {/* Cart preview on hover - SEPARATE dari Link */}
            {showPreview && (
                <div className="hidden md:block absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                    <div className="font-bold text-gray-900 mb-2">
                        Keranjang Belanja
                    </div>

                    {cartCount === 0 ? (
                        <div className="text-center py-4">
                            <div className="text-3xl mb-2">🛒</div>
                            <p className="text-gray-500 text-sm">
                                Keranjang kosong
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-48 overflow-y-auto mb-3">
                                {cartItems.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-pink-50 rounded-lg flex items-center justify-center">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-sm">
                                                    💐
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.quantity} × Rp{" "}
                                                {item.price.toLocaleString(
                                                    "id-ID",
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {cartItems.length > 3 && (
                                    <div className="text-center text-sm text-gray-500 py-2">
                                        +{cartItems.length - 3} item lainnya
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                <div>
                                    <div className="text-sm font-bold text-gray-900">
                                        Total: Rp{" "}
                                        {cartTotal.toLocaleString("id-ID")}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {cartCount} item
                                    </div>
                                </div>
                                <Link
                                    href="/cart"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Lihat Keranjang
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

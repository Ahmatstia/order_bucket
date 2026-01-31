import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function AddToCartButton({ product }) {
    const {
        addToCart,
        getItemQuantity,
        isInCart,
        incrementQuantity,
        decrementQuantity,
    } = useCart();
    const [justAdded, setJustAdded] = useState(false);

    const quantityInCart = getItemQuantity(product.id);
    const alreadyInCart = isInCart(product.id);

    const handleAddToCart = () => {
        if (!alreadyInCart) {
            addToCart(product);
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1200);
        }
    };

    // Jika sudah ada di cart - tampilkan quantity controls dengan desain unik
    if (alreadyInCart) {
        return (
            <div className="relative bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, #f43f5e 1px, transparent 1px)",
                            backgroundSize: "10px 10px",
                        }}
                    ></div>
                </div>

                <div className="relative flex items-center justify-between p-1.5 gap-2">
                    {/* Decrease Button */}
                    <button
                        onClick={() => decrementQuantity(product.id)}
                        className="group relative w-9 h-9 flex items-center justify-center bg-white hover:bg-rose-500 rounded-lg transition-all shadow-sm border border-rose-200 hover:border-rose-500 overflow-hidden"
                        title="Kurangi"
                    >
                        <div className="absolute inset-0 bg-rose-500 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-lg"></div>
                        <svg
                            className="relative w-4 h-4 text-rose-600 group-hover:text-white transition-colors z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M20 12H4"
                            />
                        </svg>
                    </button>

                    {/* Quantity Display */}
                    <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
                        <div className="relative">
                            <span className="font-bold text-rose-600 text-lg leading-none tabular-nums">
                                {quantityInCart}
                            </span>
                            <div className="absolute -inset-1 bg-rose-100 rounded-full -z-10 opacity-50"></div>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                            Item
                        </span>
                    </div>

                    {/* Increase Button */}
                    <button
                        onClick={() => incrementQuantity(product.id)}
                        className="group relative w-9 h-9 flex items-center justify-center bg-rose-600 hover:bg-rose-700 rounded-lg transition-all shadow-sm overflow-hidden"
                        title="Tambah"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <svg
                            className="relative w-4 h-4 text-white z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Tombol tambah ke keranjang dengan desain unik
    return (
        <button
            onClick={handleAddToCart}
            className="group relative w-full h-12 overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 transition-all duration-300 group-hover:from-rose-600 group-hover:via-pink-600 group-hover:to-rose-700"></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            </div>

            {/* Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2 h-full">
                {/* Icon */}
                <div
                    className={`transition-all duration-300 ${justAdded ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}
                >
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                    </svg>
                </div>

                {/* Check Icon - Shows when added */}
                <div
                    className={`absolute transition-all duration-300 ${justAdded ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        </button>
    );
}

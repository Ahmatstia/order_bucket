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
    const [isAnimating, setIsAnimating] = useState(false);

    const quantityInCart = getItemQuantity(product.id);
    const alreadyInCart = isInCart(product.id);

    const handleAddToCart = () => {
        if (!alreadyInCart) {
            addToCart(product);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    if (alreadyInCart) {
        return (
            <div className="flex items-center justify-between bg-primary-50 rounded-xl p-2">
                <button
                    onClick={() => decrementQuantity(product.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border shadow-sm"
                    title="Kurangi"
                >
                    -
                </button>

                <div className="flex flex-col items-center">
                    <div className="font-semibold text-primary-700 text-sm">
                        {quantityInCart}
                    </div>
                    <div className="text-xs text-gray-500">keranjang</div>
                </div>

                <button
                    onClick={() => incrementQuantity(product.id)}
                    className="w-8 h-8 flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors shadow-sm"
                    title="Tambah"
                >
                    +
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`btn w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all ${isAnimating ? "animate-bounce" : ""}`}
        >
            <span className={`text-lg ${isAnimating ? "scale-125" : ""}`}>
                🛒
            </span>
            <span className="font-semibold">Tambah</span>
        </button>
    );
}

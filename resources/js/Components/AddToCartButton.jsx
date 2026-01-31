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
            <div className="flex items-center justify-between gap-2">
                <button
                    onClick={() => decrementQuantity(product.id)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                    -
                </button>

                <div className="flex-1 text-center">
                    <div className="font-medium text-gray-900">
                        {quantityInCart} item
                    </div>
                    <div className="text-xs text-gray-500">di keranjang</div>
                </div>

                <button
                    onClick={() => incrementQuantity(product.id)}
                    className="w-10 h-10 flex items-center justify-center bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
                >
                    +
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white text-sm md:text-base py-3 rounded-xl shadow-md hover:shadow-lg transition-all ${isAnimating ? "animate-bounce" : ""}`}
        >
            <span
                className={`transition-transform ${isAnimating ? "scale-125" : ""}`}
            >
                🛒
            </span>
            <span className="font-semibold">Tambah ke Keranjang</span>
        </button>
    );
}

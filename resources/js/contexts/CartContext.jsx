import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initial render
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("bucketbouquets_cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "bucketbouquets_cart",
                JSON.stringify(cartItems),
            );
        }
    }, [cartItems]);

    // Calculate cart totals
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    );
    const cartCount = cartItems.reduce(
        (count, item) => count + item.quantity,
        0,
    );

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            // Check if product already in cart
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id,
            );

            if (existingItemIndex >= 0) {
                // Update quantity if exists
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Add new item
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    quantity: quantity,
                    image_url: product.image_url || null,
                    category: product.category || "bucket",
                };
                return [...prevItems, newItem];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.id !== productId),
        );
    };

    // Update item quantity
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item,
            ),
        );
    };

    // Increment quantity
    const incrementQuantity = (productId) => {
        updateQuantity(
            productId,
            cartItems.find((item) => item.id === productId).quantity + 1,
        );
    };

    // Decrement quantity
    const decrementQuantity = (productId) => {
        const currentItem = cartItems.find((item) => item.id === productId);
        if (currentItem.quantity > 1) {
            updateQuantity(productId, currentItem.quantity - 1);
        } else {
            removeFromCart(productId);
        }
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get item quantity
    const getItemQuantity = (productId) => {
        const item = cartItems.find((item) => item.id === productId);
        return item ? item.quantity : 0;
    };

    // Check if item in cart
    const isInCart = (productId) => {
        return cartItems.some((item) => item.id === productId);
    };

    const value = {
        cartItems,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

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

    // Fungsi untuk mendapatkan gambar utama dari produk
    const getPrimaryImage = (product) => {
        if (product.images && product.images.length > 0) {
            // Cari gambar primary
            const primaryImage = product.images.find((img) => img.is_primary);
            if (primaryImage) {
                return {
                    image_url: primaryImage.image_url,
                    image_path: primaryImage.image_path,
                };
            }
            // Jika tidak ada primary, ambil gambar pertama
            const firstImage = product.images[0];
            return {
                image_url: firstImage.image_url,
                image_path: firstImage.image_path,
            };
        }
        return {
            image_url: product.image_url || null,
            image_path: null,
        };
    };

    // Add item to cart (DENGAN GAMBAR YANG BENAR)
    const addToCart = (product, quantity = 1) => {
        console.log("🛒 Adding to cart:", {
            productId: product.id,
            productName: product.name,
            images: product.images,
            image_url: product.image_url,
        });

        const primaryImage = getPrimaryImage(product);

        setCartItems((prevItems) => {
            // Check if product already in cart
            const existingItemIndex = prevItems.findIndex(
                (item) => item.id === product.id,
            );

            if (existingItemIndex >= 0) {
                // Update quantity if exists
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                // Update juga gambar jika ada perubahan
                updatedItems[existingItemIndex].images = product.images;
                updatedItems[existingItemIndex].image_url =
                    primaryImage.image_url;
                updatedItems[existingItemIndex].image_path =
                    primaryImage.image_path;
                return updatedItems;
            } else {
                // Add new item with FULL product data
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: parseFloat(product.price),
                    quantity: quantity,
                    category: product.category || "bucket",
                    // Simpan semua data gambar
                    images: product.images || [],
                    image_url: primaryImage.image_url,
                    image_path: primaryImage.image_path,
                    // Simpan data lengkap untuk debugging
                    product_data: product,
                };
                console.log("🛒 New cart item:", newItem);
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

    // Fungsi helper untuk mendapatkan gambar di cart
    const getCartItemImage = (cartItem) => {
        // Priority 1: image_url langsung
        if (cartItem.image_url) {
            return cartItem.image_url;
        }

        // Priority 2: dari images array
        if (cartItem.images && cartItem.images.length > 0) {
            const primaryImage = cartItem.images.find((img) => img.is_primary);
            if (primaryImage && primaryImage.image_url) {
                return primaryImage.image_url;
            }
            if (cartItem.images[0] && cartItem.images[0].image_url) {
                return cartItem.images[0].image_url;
            }
        }

        // Priority 3: dari image_path
        if (cartItem.image_path) {
            return `http://localhost:8000/storage/${cartItem.image_path}`;
        }

        // Priority 4: null (akan render emoji)
        return null;
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
        getCartItemImage, // Export fungsi ini
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};

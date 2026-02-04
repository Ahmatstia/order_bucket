/**
 * WhatsApp Utility Functions for BucketBouquets
 * Centralized message templates and functions
 */

// Format harga Indonesia
const formatPrice = (price) => {
    return price.toLocaleString("id-ID");
};

// ============================
// TEMPLATE GENERATORS
// ============================

/**
 * Generate product inquiry message
 */
export function generateWhatsAppMessage(product, customerName = "") {
    const defaultName = customerName || "Customer";
    const formattedPrice = formatPrice(product.price);

    return `🌸 *INQUIRY BUCKETBOUQUETS* 🌸

Halo Admin! ${defaultName} ingin bertanya tentang:

┌─────────────────────
│  *${product.name}*
│  💰 Rp ${formattedPrice}
│  📝 ${product.description?.substring(0, 80) || "Produk bucket bunga"}...
└─────────────────────

❓ *Pertanyaan:*
• Apakah ready stock?
• Bisa dikirim hari ini?
• Estimasi ongkir ke [area]
• Ada warna lain?

📍 *Alamat:* [Isi alamat lengkap]

Terima kasih! 🌸`;
}

/**
 * Generate cart checkout message
 */
export function generateCartWhatsAppMessage(
    cartItems,
    cartTotal,
    customerName = "",
) {
    const defaultName = customerName || "Customer";
    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    let message = `🛒 *CHECKOUT BUCKETBOUQUETS* 🛒

Halo Admin! Saya *${defaultName}* ingin checkout pesanan:

═══════════════════════
📋 *DETAIL PESANAN:*
═══════════════════════\n`;

    // Tambahkan setiap item
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const itemDescription = item.description
            ? `\n   └─ ${item.description.substring(0, 50)}...`
            : "";

        message += `
${index + 1}. *${item.name}*
   └─ Qty: ${item.quantity} × Rp ${formatPrice(item.price)}
   └─ Subtotal: Rp ${formatPrice(itemTotal)}${itemDescription}\n`;
    });

    // Ringkasan
    message += `
═══════════════════════
💰 *RINGKASAN:*
• Total Item: ${totalQuantity} pcs
• Subtotal: Rp ${formatPrice(cartTotal)}
• Pengiriman: [Estimasi ongkir]
• *GRAND TOTAL: Rp ${formatPrice(cartTotal)}*
═══════════════════════

📍 *ALAMAT PENGIRIMAN:*
[Silakan isi alamat lengkap beserta kode pos]

📦 *PREFERENSI PENGIRIMAN:*
• Bisa dikirim hari ini?
• Estimasi sampai kapan?
• Packing aman untuk bucket bunga?

💳 *PEMBAYARAN:*
• Metode transfer bank apa saja?
• Ada COD untuk area [sebutkan kota]?
• Ada biaya tambahan lain?

Mohon konfirmasi:
1. Ketersediaan stock
2. Total yang harus dibayar
3. Estimasi pengiriman

Terima kasih! 🌸💐`;

    return message;
}

/**
 * Generate general inquiry message
 */
export function generateGeneralInquiryMessage(customerName = "") {
    const defaultName = customerName || "Customer";

    return `🌸 *KONSULTASI BUCKETBOUQUETS* 🌸

Halo Admin! Saya ${defaultName} ingin konsultasi:

📋 *Yang ingin ditanyakan:*
• Katalog bucket bunga terbaru
• Harga dan promo hari ini
• Info pengiriman & estimasi ongkir
• Custom order request
• Booking untuk acara spesial (wedding, anniversary)
• Request warna tertentu

📍 *Lokasi:* [Kota/Area]

📞 *Kontak:* [Nomor HP untuk konfirmasi]

Mohon info lengkapnya ya! Saya tunggu.

Terima kasih! 💐`;
}

/**
 * Generate custom order message
 */
export function generateCustomOrderMessage(
    customerName = "",
    requirements = "",
) {
    const defaultName = customerName || "Customer";

    return `🎨 *CUSTOM ORDER BUCKETBOUQUETS* 🎨

Halo Admin! Saya *${defaultName}* ingin custom bucket bunga.

📝 *Spesifikasi Request:*
${requirements || "[Jelaskan detail custom order: tema, warna, bunga, ukuran, budget, dll]"}

📅 *Deadline:* [Tanggal dibutuhkan]

📍 *Lokasi:* [Alamat pengiriman]

💰 *Budget Range:* [Rp ... - Rp ...]

Mohon bisa dibuatkan:
1. Rancangan konsep
2. Quotation harga
3. Timeline pengerjaan

Terima kasih! 🌟`;
}

// ============================
// QUICK TEMPLATES
// ============================

export const quickTemplates = {
    catalog: (customerName = "") =>
        `Halo Admin BucketBouquets! 😊
Saya ${customerName || "Customer"}.
Boleh minta katalog lengkap bucket bunga beserta harga terkini? Terima kasih! 🌸`,

    price: (customerName = "", product = "") =>
        `Halo! Saya ${customerName || "Customer"}.
Bisa info harga range bucket bunga ${product ? `"${product}"` : ""}?
Termasuk ongkir ke [area/kota].`,

    delivery: (customerName = "", area = "") =>
        `Halo! Saya ${customerName || "Customer"}.
Berapa estimasi ongkir ke ${area || "[sebutkan kota]"}?
Dan berapa lama pengirimannya?
Apakah packing aman untuk bucket bunga?`,

    custom: (customerName = "") =>
        `Halo! Saya ${customerName || "Customer"}.
Apakah bisa custom bucket bunga sesuai tema/warna request?
Boleh konsultasi untuk custom order?`,

    stock: (customerName = "", product = "") =>
        `Halo! Saya ${customerName || "Customer"}.
Apakah ${product ? `"${product}"` : "produk bucket bunga"} ready stock?
Bisa dikirim hari ini?`,

    promo: (customerName = "") =>
        `Halo! Saya ${customerName || "Customer"}.
Ada promo atau diskon khusus untuk bucket bunga saat ini?
Untuk order berapa dapat free ongkir?`,
};

// ============================
// CORE FUNCTIONS
// ============================

/**
 * Open WhatsApp with encoded message
 */
export function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}

/**
 * Send message directly
 */
export function sendWhatsAppMessage(message, phoneNumber = "6282371663414") {
    openWhatsApp(phoneNumber, message);
}

/**
 * Get formatted phone number
 */
export function getWhatsAppNumber() {
    return "6282371663414";
}

/**
 * Check if WhatsApp is available
 */
export function isWhatsAppAvailable() {
    return navigator.userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    );
}

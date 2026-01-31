export function generateWhatsAppMessage(product, customerName = "") {
    const defaultName = customerName || "Customer";

    const messages = [
        `Halo admin BucketBouquets! 😊\n\n`,
        `Saya ${defaultName} mau pesan nih:\n`,
        `📦 *${product.name}*\n`,
        `💰 Harga: Rp ${product.price.toLocaleString("id-ID")}\n`,
        `📝 Detail: ${product.description.substring(0, 100)}...\n\n`,
        `Bisa dikirim hari ini? \n`,
        `Lokasi saya di: [isi alamat lengkap]\n\n`,
        `Terima kasih! 🌸`,
    ];

    return messages.join("");
}

export function openWhatsApp(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
}

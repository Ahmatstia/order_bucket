import React, { useState, useEffect } from "react";
import AppLayout from "../../Layouts/AppLayout";

export default function ProductIndex() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        name: "",
        category: "bucket",
        description: "",
        price: "",
        stock: "",
        is_active: true,
    });
    const [editingId, setEditingId] = useState(null);

    // Multiple images state
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImageIds, setExistingImageIds] = useState([]); // ← TAMBAH INI

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            console.log("📦 Admin: Products data from API:", data);

            // Debug: cek gambar pertama
            if (data.length > 0 && data[0].images) {
                console.log("🖼️ Admin: First product images:", data[0].images);
                console.log(
                    "🔗 Admin: First image URL:",
                    data[0].images[0]?.image_url,
                );
            }

            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            const newFiles = [...imageFiles, ...files];
            setImageFiles(newFiles);

            const newPreviews = [];

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push({
                        type: "new", // Tandai sebagai gambar baru
                        url: reader.result,
                        file: file,
                    });

                    if (newPreviews.length === files.length) {
                        setImagePreviews((prev) => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImagePreview = (index) => {
        const previewToRemove = imagePreviews[index];

        if (previewToRemove.type === "existing") {
            // Jika gambar existing, hapus dari array existingImageIds
            setExistingImageIds((prev) =>
                prev.filter((id) => id !== previewToRemove.imageId),
            );
        } else {
            // Jika gambar baru, hapus dari imageFiles
            const newFiles = [...imageFiles];
            newFiles.splice(index - existingImageIds.length, 1); // Adjust index
            setImageFiles(newFiles);
        }

        // Hapus dari previews
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId ? `/api/products/${editingId}` : "/api/products";

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]',
            )?.content;

            const formData = new FormData();

            if (editingId) {
                formData.append("_method", "PUT");
            }

            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("stock", form.stock);
            formData.append("is_active", form.is_active ? "1" : "0");

            // Append gambar baru
            imageFiles.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });

            // Untuk update, kita perlu handle gambar yang dihapus
            if (editingId) {
                const originalProduct = products.find(
                    (p) => p.id === editingId,
                );
                if (originalProduct && originalProduct.images) {
                    // Simpan ID gambar yang akan dipertahankan
                    const keptImageIds = existingImageIds;
                    const deletedImageIds = originalProduct.images
                        .filter((img) => !keptImageIds.includes(img.id))
                        .map((img) => img.id);

                    // Kirim ID gambar yang dihapus (opsional)
                    if (deletedImageIds.length > 0) {
                        formData.append(
                            "deleted_image_ids",
                            JSON.stringify(deletedImageIds),
                        );
                    }
                }
            }

            const headers = {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            };

            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }

            const response = await fetch(url, {
                method: editingId ? "POST" : "POST",
                headers: headers,
                credentials: "same-origin",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                let errorMsg = "Gagal menyimpan produk";
                if (data.errors) {
                    errorMsg = Object.values(data.errors).flat().join(", ");
                } else if (data.message) {
                    errorMsg = data.message;
                }
                throw new Error(errorMsg);
            }

            await fetchProducts();
            resetForm();
            alert(
                editingId
                    ? "Produk berhasil diupdate!"
                    : "Produk berhasil ditambahkan!",
            );
        } catch (error) {
            console.error("Error saving product:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (product) => {
        console.log("✏️ Editing product:", product);

        setForm({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            stock: product.stock,
            is_active: product.is_active,
        });

        // Reset semua state gambar
        setImagePreviews([]);
        setImageFiles([]);
        setExistingImageIds([]);

        // Set image previews from existing images
        if (product.images && product.images.length > 0) {
            console.log("🖼️ Setting existing images for edit:", product.images);

            const previews = product.images.map((img) => ({
                type: "existing",
                url: getImageUrl(img),
                imageId: img.id,
                imagePath: img.image_path,
            }));

            const imageIds = product.images.map((img) => img.id);

            setImagePreviews(previews);
            setExistingImageIds(imageIds);
        } else {
            console.log("⚠️ Product has no existing images");
            setImagePreviews([]);
        }

        setEditingId(product.id);
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                await fetchProducts();
                if (editingId === id) {
                    resetForm();
                }
                alert("Produk berhasil dihapus!");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Gagal menghapus produk");
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (!confirm("Yakin ingin menghapus gambar ini?")) return;

        try {
            const response = await fetch(`/api/product-images/${imageId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                // Update previews dengan menghapus gambar yang dihapus
                setImagePreviews((prev) =>
                    prev.filter(
                        (p) => p.type !== "existing" || p.imageId !== imageId,
                    ),
                );
                setExistingImageIds((prev) =>
                    prev.filter((id) => id !== imageId),
                );

                alert("Gambar berhasil dihapus!");

                // Refresh data produk
                await fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Gagal menghapus gambar");
        }
    };

    const resetForm = () => {
        setForm({
            name: "",
            category: "bucket",
            description: "",
            price: "",
            stock: "",
            is_active: true,
        });
        setImagePreviews([]);
        setImageFiles([]);
        setExistingImageIds([]);
        setEditingId(null);
    };

    const categories = [
        { value: "bucket", label: "Bucket Bunga" },
        { value: "premium", label: "Premium Series" },
        { value: "mawar", label: "Mawar" },
        { value: "sunflower", label: "Sunflower" },
        { value: "lily", label: "Lily" },
        { value: "orchid", label: "Orchid" },
        { value: "mixed", label: "Mixed Flowers" },
        { value: "custom", label: "Custom Order" },
    ];

    // Fungsi untuk mendapatkan image URL dengan fallback
    const getImageUrl = (image) => {
        if (image.image_url) {
            return image.image_url;
        }
        if (image.image_path) {
            return `http://localhost:8000/storage/${image.image_path}`;
        }
        return "/images/placeholder.jpg";
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin - Kelola Produk
                    </h1>
                    <p className="text-gray-600">
                        Tambah, edit, atau hapus produk bucket bunga
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="card p-6">
                            <h2 className="text-xl font-bold mb-6">
                                {editingId
                                    ? `Edit Produk: ${form.name}`
                                    : "Tambah Produk Baru"}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Produk *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kategori *
                                        </label>
                                        <select
                                            value={form.category}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    category: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat.value}
                                                    value={cat.value}
                                                >
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            value={form.description}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    description: e.target.value,
                                                })
                                            }
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Harga (Rp) *
                                            </label>
                                            <input
                                                type="number"
                                                value={form.price}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        price: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                required
                                                min="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stok *
                                            </label>
                                            <input
                                                type="number"
                                                value={form.stock}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        stock: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Multiple Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gambar Produk{" "}
                                            {editingId &&
                                                "(Gambar existing akan dipertahankan)"}
                                        </label>

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-3">
                                                    {imagePreviews.map(
                                                        (preview, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative w-20 h-20"
                                                            >
                                                                <img
                                                                    src={
                                                                        preview.url
                                                                    }
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeImagePreview(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                                >
                                                                    ✕
                                                                </button>
                                                                {preview.type ===
                                                                    "existing" && (
                                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
                                                                        Existing
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* File Input */}
                                        <div className="border-2 border-dashed border-primary-300 rounded-lg p-4 text-center hover:border-primary-400 transition-colors cursor-pointer">
                                            <input
                                                type="file"
                                                id="images"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                multiple
                                            />
                                            <label
                                                htmlFor="images"
                                                className="cursor-pointer block"
                                            >
                                                <div className="text-primary-500 mb-2">
                                                    {imagePreviews.length > 0
                                                        ? "📷📷"
                                                        : "📷"}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {imagePreviews.length > 0
                                                        ? `Upload gambar ${editingId ? "tambahan" : ""} (${imagePreviews.length} terpilih)`
                                                        : "Klik untuk upload gambar"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    JPEG, PNG, GIF, WebP (max
                                                    5MB per file)
                                                </p>
                                            </label>
                                        </div>

                                        {/* Info */}
                                        {editingId &&
                                            existingImageIds.length > 0 && (
                                                <div className="mt-3 text-sm text-gray-600">
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
                                                        ✓{" "}
                                                        {
                                                            existingImageIds.length
                                                        }{" "}
                                                        gambar existing akan
                                                        dipertahankan
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={form.is_active}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    is_active: e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="is_active"
                                            className="ml-2 text-sm text-gray-700"
                                        >
                                            Produk aktif (ditampilkan di
                                            katalog)
                                        </label>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-1"
                                        >
                                            {editingId
                                                ? "Update Produk"
                                                : "Simpan Produk"}
                                        </button>

                                        {editingId && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="btn btn-outline"
                                            >
                                                Batal Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm">
                                <span className="font-bold">INFO EDIT:</span>{" "}
                                Gambar existing ditampilkan dengan label
                                "Existing". Klik ✕ untuk menghapus, upload untuk
                                menambah gambar baru.
                            </p>
                        </div>
                    </div>

                    {/* Products List - SAMA seperti sebelumnya */}
                    <div className="lg:col-span-2">
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">
                                    Daftar Produk
                                </h2>
                                <div className="text-sm text-gray-600">
                                    Total:{" "}
                                    <span className="font-bold">
                                        {products.length}
                                    </span>{" "}
                                    produk
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    <p className="mt-2 text-gray-600">
                                        Memuat produk...
                                    </p>
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">📦</div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                                        Belum ada produk
                                    </h3>
                                    <p className="text-gray-500">
                                        Tambahkan produk pertama Anda!
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-hidden">
                                    {/* Scrollable Container */}
                                    <div
                                        className="overflow-y-auto"
                                        style={{
                                            maxHeight:
                                                products.length > 10
                                                    ? "600px"
                                                    : "auto",
                                        }}
                                    >
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Produk
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Gambar
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Harga
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Stok
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Status
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {products.map((product) => (
                                                    <tr
                                                        key={product.id}
                                                        className={
                                                            editingId ===
                                                            product.id
                                                                ? "bg-blue-50"
                                                                : "hover:bg-gray-50"
                                                        }
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {
                                                                        product.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex -space-x-2">
                                                                {product.images
                                                                    ?.slice(
                                                                        0,
                                                                        3,
                                                                    )
                                                                    .map(
                                                                        (
                                                                            img,
                                                                            idx,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    img.id
                                                                                }
                                                                                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                                                                            >
                                                                                <img
                                                                                    src={getImageUrl(
                                                                                        img,
                                                                                    )}
                                                                                    alt=""
                                                                                    className="w-full h-full object-cover"
                                                                                    onError={(
                                                                                        e,
                                                                                    ) => {
                                                                                        console.error(
                                                                                            "❌ Admin: Table image failed:",
                                                                                            e
                                                                                                .target
                                                                                                .src,
                                                                                        );
                                                                                        e.target.src =
                                                                                            "/images/placeholder.jpg";
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                {product.images
                                                                    ?.length >
                                                                    3 && (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                                                        +
                                                                        {product
                                                                            .images
                                                                            .length -
                                                                            3}
                                                                    </div>
                                                                )}
                                                                {(!product.images ||
                                                                    product
                                                                        .images
                                                                        .length ===
                                                                        0) && (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                                                                        📷
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium">
                                                                Rp{" "}
                                                                {parseFloat(
                                                                    product.price,
                                                                ).toLocaleString(
                                                                    "id-ID",
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div
                                                                className={
                                                                    product.stock >
                                                                    5
                                                                        ? "text-green-600 font-medium"
                                                                        : "text-yellow-600 font-medium"
                                                                }
                                                            >
                                                                {product.stock}{" "}
                                                                pcs
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {product.is_active ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Aktif
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Nonaktif
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            product,
                                                                        )
                                                                    }
                                                                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            product.id,
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Info */}
                                    {products.length > 10 && (
                                        <div className="mt-4 text-sm text-gray-500 text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                                                📜 {products.length} produk •
                                                Scroll untuk melihat lebih
                                                banyak
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

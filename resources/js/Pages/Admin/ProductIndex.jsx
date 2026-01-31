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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
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
                    newPreviews.push(reader.result);

                    if (newPreviews.length === files.length) {
                        setImagePreviews((prev) => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImagePreview = (index) => {
        const newPreviews = [...imagePreviews];
        const newFiles = [...imageFiles];
        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);
        setImagePreviews(newPreviews);
        setImageFiles(newFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editingId ? `/api/products/${editingId}` : "/api/products";

        const method = editingId ? "PUT" : "POST";

        try {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]',
            )?.content;

            const formData = new FormData();

            // For PUT method with FormData
            if (method === "PUT") {
                formData.append("_method", "PUT");
            }

            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("stock", form.stock);
            formData.append("is_active", form.is_active ? "1" : "0");

            // Append multiple images
            imageFiles.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });

            const headers = {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
            };

            if (csrfToken) {
                headers["X-CSRF-TOKEN"] = csrfToken;
            }

            const fetchMethod = method === "PUT" ? "POST" : method;

            const response = await fetch(url, {
                method: fetchMethod,
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
        setForm({
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,
            stock: product.stock,
            is_active: product.is_active,
        });

        // Set image previews from existing images
        if (product.images && product.images.length > 0) {
            const previews = product.images.map((img) => img.image_url);
            setImagePreviews(previews);
        } else {
            setImagePreviews([]);
        }

        setImageFiles([]);
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
                await fetchProducts();
                alert("Gambar berhasil dihapus!");
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
                                    ? "Edit Produk"
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
                                            Gambar Produk (Bisa upload multiple)
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
                                                                        preview
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
                                                        ? `Upload gambar lagi (${imagePreviews.length} terpilih)`
                                                        : "Klik untuk upload gambar"}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    JPEG, PNG, GIF, WebP (max
                                                    5MB per file)
                                                </p>
                                            </label>
                                        </div>

                                        {/* Existing images (for edit mode) */}
                                        {editingId &&
                                            products.find(
                                                (p) => p.id === editingId,
                                            )?.images?.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Gambar yang sudah ada:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {products
                                                            .find(
                                                                (p) =>
                                                                    p.id ===
                                                                    editingId,
                                                            )
                                                            ?.images?.map(
                                                                (img) => (
                                                                    <div
                                                                        key={
                                                                            img.id
                                                                        }
                                                                        className="relative"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                img.image_url
                                                                            }
                                                                            alt="Product"
                                                                            className="w-12 h-12 object-cover rounded border"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteImage(
                                                                                    img.id,
                                                                                )
                                                                            }
                                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ),
                                                            )}
                                                    </div>
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
                                                Batal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-blue-800 text-sm">
                                <span className="font-bold">FITUR BARU:</span>{" "}
                                Multiple image upload aktif! Bisa upload
                                beberapa gambar sekaligus untuk produk.
                            </p>
                        </div>
                    </div>

                    {/* Products List */}
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
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Produk
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Gambar
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Harga
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stok
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {product.name}
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
                                                                ?.slice(0, 3)
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
                                                                                src={
                                                                                    img.image_url
                                                                                }
                                                                                alt=""
                                                                                className="w-full h-full object-cover"
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
                                                                product.images
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
                                                            {product.stock} pcs
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
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  togglePublishProduct,
} from "../api/productApi";
import ProductCard from "../components/ProductCard";
import logoImage from "../assets/Frame 4.png";

const PRODUCT_TYPES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home Appliances",
  "Toys",
  "Sports Equipment",
  "Beauty Products",
  "Groceries",
  "Furniture",
  "Jewelry",
];

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [form, setForm] = useState({
    Name: "",
    Product_Type: "",
    Quantiy: "",
    MRP: "",
    Selling_Price: "",
    Brand_Name: "",
    Exchange_Available: false,
    published: false,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts();
      setProducts(res.products || []);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((base64Images) => {
      setUploadedImages((prev) => [...prev, ...base64Images]);
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      Name: "",
      Product_Type: "",
      Quantiy: "",
      MRP: "",
      Selling_Price: "",
      Brand_Name: "",
      Exchange_Available: false,
      published: false,
    });
    setUploadedImages([]);
    setEditingProduct(null);
    setFormError("");
    setFormSuccess("");
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      Name: product.Name || "",
      Product_Type: product.Product_Type || "",
      Quantiy: product.Quantiy || "",
      MRP: product.MRP || "",
      Selling_Price: product.Selling_Price || "",
      Brand_Name: product.Brand_Name || "",
      Exchange_Available: product.Exchange_Available || false,
      published: product.published || false,
    });
    setUploadedImages(product.Image_URLs || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      setFormLoading(true);

      const payload = {
        ...form,
        Quantiy: Number(form.Quantiy),
        MRP: Number(form.MRP),
        Selling_Price: Number(form.Selling_Price),
        Image_URLs: uploadedImages,
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload);
        setFormSuccess("Product updated successfully!");
      } else {
        await createProduct(payload);
        setFormSuccess("Product added successfully!");
      }

      resetForm();
      await fetchProducts();

      setTimeout(() => {
        setShowModal(false);
        setFormSuccess("");
      }, 1200);
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          `Failed to ${editingProduct ? "update" : "create"} product`
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.id);
      await fetchProducts();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await togglePublishProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to toggle publish", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filtered =
    activeTab === "published"
      ? products.filter((p) => p.published)
      : products.filter((p) => !p.published);

  const searchedProducts = filtered.filter((p) =>
    `${p.Name || ""} ${p.Brand_Name || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="px-6 py-5">
          <img src={logoImage} alt="Productr logo" className="h-7 w-auto" />
        </div>
        <nav className="px-3 space-y-1 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800">
            Products
          </button>
        </nav>
        <div className="mt-auto px-4 py-4 text-xs text-slate-400">
          admin dashboard
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-[#f8fafc] border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search existing products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-72 text-sm"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium text-sm shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Products
              </button>
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 p-8 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium text-sm shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Products
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b-2 border-gray-200 mb-8">
            {["published", "drafts"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab === "drafts" ? "unpublished" : "published")
                }
                className={`pb-3 px-1 font-semibold text-sm transition-all ${
                  activeTab === (tab === "drafts" ? "unpublished" : "published")
                    ? "border-b-2 border-blue-600 text-blue-600 -mb-[2px]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm">Loading products...</p>
              </div>
            </div>
          ) : searchedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="mb-6 text-blue-600">
                <svg
                  className="h-20 w-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Feels a little empty over here...
              </h3>
              <p className="text-sm text-gray-600 mb-8 max-w-md">
                You can create your products without any coding, once you've
                created products, they'll appear here.
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
              >
                Add New Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onEdit={openEditModal}
                  onTogglePublish={handleTogglePublish}
                  onDelete={(id, name) => setDeleteConfirm({ id, name })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {editingProduct ? "EDIT PRODUCT" : "ADD PRODUCT"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {formError && (
                  <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-red-700 text-sm font-medium">
                      {formError}
                    </p>
                  </div>
                )}
                {formSuccess && (
                  <div className="mb-5 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <p className="text-green-700 text-sm font-medium">
                      {formSuccess}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="product-name"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Product Name
                    </label>
                    <input
                      id="product-name"
                      name="Name"
                      placeholder="Coca Cola Product Beverage"
                      value={form.Name}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-type"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Product Type
                    </label>
                    <select
                      id="product-type"
                      name="Product_Type"
                      value={form.Product_Type}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white"
                      required
                    >
                      <option value="">Select Product Type</option>
                      {PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="brand-name"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Brand Name
                    </label>
                    <input
                      id="brand-name"
                      name="Brand_Name"
                      placeholder="Brand Name"
                      value={form.Brand_Name}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-quantity"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Total number of stock available
                    </label>
                    <input
                      id="product-quantity"
                      name="Quantiy"
                      type="number"
                      placeholder="Quantity"
                      value={form.Quantiy}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="product-mrp"
                        className="block text-sm font-semibold text-gray-800 mb-2.5"
                      >
                        MRP
                      </label>
                      <input
                        id="product-mrp"
                        name="MRP"
                        type="number"
                        placeholder="MRP"
                        value={form.MRP}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="product-selling-price"
                        className="block text-sm font-semibold text-gray-800 mb-2.5"
                      >
                        Selling Price
                      </label>
                      <input
                        id="product-selling-price"
                        name="Selling_Price"
                        type="number"
                        placeholder="Selling Price"
                        value={form.Selling_Price}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="image-upload"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Upload Product Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg
                          className="h-14 w-14 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-gray-600 font-medium mb-3 text-sm">
                          Drag and Drop
                        </span>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium text-sm shadow-sm"
                        >
                          Browse
                        </button>
                      </label>
                    </div>
                    {uploadedImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-5 gap-3">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-28 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="exchange-available"
                      className="block text-sm font-semibold text-gray-800 mb-2.5"
                    >
                      Exchange or return eligibility
                    </label>
                    <select
                      id="exchange-available"
                      name="Exchange_Available"
                      value={form.Exchange_Available ? "yes" : "no"}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          Exchange_Available: e.target.value === "yes",
                        }))
                      }
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="published"
                      id="published"
                      checked={form.published}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="published"
                      className="text-sm font-semibold text-gray-800 cursor-pointer"
                    >
                      Publish this product
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      {formLoading
                        ? editingProduct
                          ? "Updating..."
                          : "Creating..."
                        : editingProduct
                        ? "Update"
                        : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Delete Product
                  </h3>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Are you sure you really want to delete this Product{" "}
                  <span className="font-semibold text-gray-900">
                    '{deleteConfirm.name}'
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-8 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {formSuccess && !showModal && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{formSuccess}</span>
            <button
              onClick={() => setFormSuccess("")}
              className="ml-2 hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

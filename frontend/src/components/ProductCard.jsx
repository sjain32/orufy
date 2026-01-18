function ProductCard({ product, onEdit, onTogglePublish, onDelete }) {
  const image =
    product.Image_URLs?.[0] ||
    "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <img
        src={image}
        alt={product.Name}
        className="h-40 sm:h-44 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-base text-gray-900">
            {product.Name}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              product.published
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {product.published ? "Published" : "Unpublished"}
          </span>
        </div>
        <p className="text-xs text-gray-500">{product.Brand_Name}</p>

        <div className="text-xs text-gray-600 space-y-1">
          <p>Category: {product.Product_Type}</p>
          <p>Stock: {product.Quantiy}</p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-lg font-semibold text-blue-600">
            ₹{product.Selling_Price}
          </span>
          <span className="line-through text-gray-400 text-sm">
            ₹{product.MRP}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => onTogglePublish?.(product._id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              product.published
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {product.published ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => onEdit?.(product)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(product._id, product.Name)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

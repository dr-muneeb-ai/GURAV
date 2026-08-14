import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Watches");
  const [subCategory, setSubCategory] = useState("Premium");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const [oldImages, setOldImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // Image URL Helper
  // ==========================================
  const getImageUrl = (img) => {
    if (!img) return "";

    // Cloudinary / any full HTTPS URL
    if (
      img.startsWith("http://") ||
      img.startsWith("https://")
    ) {
      return img;
    }

    // Old local uploads path
    if (img.startsWith("/uploads/")) {
      return `${backendUrl}${img}`;
    }

    // If only filename is stored
    return `${backendUrl}/uploads/${img}`;
  };

  // ==========================================
  // Fetch Product
  // ==========================================
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/product/single/${id}`
      );

      if (data.success) {
        const p = data.product;

        setName(p.name || "");
        setDescription(p.description || "");
        setCategory(p.category || "Watches");
        setSubCategory(p.subCategory || "Premium");
        setPrice(p.price || "");
        setSizes(p.sizes || []);
        setBestseller(Boolean(p.bestseller));
        setOldImages(p.image || []);
      } else {
        toast.error(data.message || "Product not found");
      }
    } catch (error) {
      console.error("Fetch Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Submit Update
  // ==========================================
  const submitHandler = async (e) => {
    e.preventDefault();

    if (updating) return;

    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append(
        "bestseller",
        bestseller ? "true" : "false"
      );

      // New images
      images.forEach((img) => {
        formData.append("image", img);
      });

      const { data } = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(
          data.message || "Product Updated Successfully"
        );

        // Small delay so toast can be seen
        setTimeout(() => {
          navigate("/list");
        }, 700);
      } else {
        toast.error(
          data.message || "Failed to update product"
        );
      }
    } catch (error) {
      console.error("Update Product Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <p className="text-lg font-semibold">
          Loading product...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <form
      onSubmit={submitHandler}
      className="max-w-3xl flex flex-col gap-5 pb-10"
    >
      {/* Title */}
      <h2 className="text-3xl font-bold">
        Edit Product
      </h2>

      {/* ========================================
          CURRENT IMAGES
      ======================================== */}
      <div>
        <p className="font-semibold mb-3">
          Current Images
        </p>

        <div className="flex flex-wrap gap-3">
          {oldImages.length > 0 ? (
            oldImages.map((img, index) => (
              <div
                key={index}
                className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300 bg-gray-100"
              >
                <img
                  src={getImageUrl(img)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(
                      "Image failed:",
                      getImageUrl(img)
                    );

                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No current images
            </p>
          )}
        </div>
      </div>

      {/* ========================================
          NEW IMAGES
      ======================================== */}
      <div>
        <p className="font-semibold mb-2">
          Upload New Images (optional)
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const selectedFiles = Array.from(
              e.target.files || []
            );

            if (selectedFiles.length > 6) {
              toast.error(
                "You can upload maximum 6 images"
              );

              setImages(selectedFiles.slice(0, 6));
              return;
            }

            setImages(selectedFiles);
          }}
          className="border p-2 rounded w-full"
        />

        {/* Selected images */}
        {images.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              Selected Images: {images.length}
            </p>

            <div className="flex flex-wrap gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 rounded-lg overflow-hidden border"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================
          NAME
      ======================================== */}
      <input
        className="border rounded p-3"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="Product Name"
        required
      />

      {/* ========================================
          DESCRIPTION
      ======================================== */}
      <textarea
        className="border rounded p-3"
        rows="6"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
        placeholder="Product Description"
        required
      />

      {/* ========================================
          CATEGORY / SUB CATEGORY / PRICE
      ======================================== */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border p-3 rounded"
        >
          <option value="Watches">
            Watches
          </option>

          <option value="Sneakers">
            Sneakers
          </option>

          <option value="Hoodies">
            Hoodies
          </option>

          <option value="Accessories">
            Accessories
          </option>
        </select>

        <select
          value={subCategory}
          onChange={(e) =>
            setSubCategory(e.target.value)
          }
          className="border p-3 rounded"
        >
          <option value="Premium">
            Premium
          </option>

          <option value="Classic">
            Classic
          </option>

          <option value="Luxury">
            Luxury
          </option>

          <option value="Limited Edition">
            Limited Edition
          </option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="border rounded p-3"
          placeholder="Price"
          required
          min="0"
        />
      </div>

      {/* ========================================
          SIZES
      ======================================== */}
      <div>
        <p className="mb-2 font-semibold">
          Sizes
        </p>

        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map(
            (size) => {
              const selected =
                sizes.includes(size);

              return (
                <button
                  type="button"
                  key={size}
                  onClick={() => {
                    setSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter(
                            (item) =>
                              item !== size
                          )
                        : [...prev, size]
                    );
                  }}
                  className={`px-4 py-2 rounded border ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-black"
                  }`}
                >
                  {size}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* ========================================
          BESTSELLER
      ======================================== */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={(e) =>
            setBestseller(e.target.checked)
          }
        />

        <span>Bestseller</span>
      </label>

      {/* ========================================
          UPDATE BUTTON
      ======================================== */}
      <button
        className={`text-white py-3 rounded font-semibold ${
          updating
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        type="submit"
        disabled={updating}
      >
        {updating
          ? "UPDATING PRODUCT..."
          : "UPDATE PRODUCT"}
      </button>
    </form>
  );
};

export default Edit;

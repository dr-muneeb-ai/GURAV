import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

// Nike Men's US -> EU shoe size chart
const MEN_SHOE_SIZES = [
  { us: 6, eu: 38.5 },
  { us: 6.5, eu: 39 },
  { us: 7, eu: 40 },
  { us: 7.5, eu: 40.5 },
  { us: 8, eu: 41 },
  { us: 8.5, eu: 42 },
  { us: 9, eu: 42.5 },
  { us: 9.5, eu: 43 },
  { us: 10, eu: 44 },
  { us: 10.5, eu: 44.5 },
  { us: 11, eu: 45 },
  { us: 11.5, eu: 45.5 },
  { us: 12, eu: 46 },
  { us: 12.5, eu: 47 },
  { us: 13, eu: 47.5 },
];

// Nike Women's US -> EU shoe size chart
const WOMEN_SHOE_SIZES = [
  { us: 5, eu: 35.5 },
  { us: 5.5, eu: 36 },
  { us: 6, eu: 36.5 },
  { us: 6.5, eu: 37.5 },
  { us: 7, eu: 38 },
  { us: 7.5, eu: 38.5 },
  { us: 8, eu: 39 },
  { us: 8.5, eu: 40 },
  { us: 9, eu: 40.5 },
  { us: 9.5, eu: 41 },
  { us: 10, eu: 42 },
  { us: 10.5, eu: 42.5 },
  { us: 11, eu: 43 },
  { us: 11.5, eu: 44 },
  { us: 12, eu: 44.5 },
];

const STANDARD_SIZES = ["S", "M", "L", "XL", "Standard"];

// Figures out which gender chart a saved size label like "Women US 8 / EU 39"
// belongs to, so editing an existing shoe product pre-selects the right tab.
const detectShoeGender = (savedSizes = []) => {
  const hit = savedSizes.find((s) => /^women /i.test(s));
  return hit ? "Women" : "Men";
};

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
  const [shoeGender, setShoeGender] = useState("Men");
  const [tags, setTags] = useState("");
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
        setShoeGender(detectShoeGender(p.sizes || []));
        setTags((p.tags || []).join(", "));
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

      // Tags: comma separated text -> clean JSON array, used for search
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));

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

        {category === "Sneakers" ? (
          <>
            {/* Men / Women toggle for shoe size chart */}
            <div className="flex gap-3 mb-3">
              {["Men", "Women"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setShoeGender(g)}
                  className={`px-3 py-1.5 text-sm rounded border transition ${
                    shoeGender === g
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-300 hover:text-gray-900"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              {(shoeGender === "Men"
                ? MEN_SHOE_SIZES
                : WOMEN_SHOE_SIZES
              ).map(({ us, eu }) => {
                const sizeLabel = `${shoeGender} US ${us} / EU ${eu}`;
                const selected = sizes.includes(sizeLabel);

                return (
                  <button
                    type="button"
                    key={sizeLabel}
                    onClick={() => {
                      setSizes((prev) =>
                        prev.includes(sizeLabel)
                          ? prev.filter(
                              (item) => item !== sizeLabel
                            )
                          : [...prev, sizeLabel]
                      );
                    }}
                    className={`px-3 py-2 rounded border text-sm flex flex-col items-center leading-tight ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-black"
                    }`}
                  >
                    <span>US {us}</span>
                    <span className="text-[10px] opacity-75">
                      EU {eu}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {STANDARD_SIZES.map((size) => {
              const selected = sizes.includes(size);

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
            })}
          </div>
        )}
      </div>

      {/* ========================================
          TAGS
      ======================================== */}
      <div>
        <p className="mb-2 font-semibold">
          Tags{" "}
          <span className="text-xs font-normal text-gray-500">
            (comma separated — used for easy search)
          </span>
        </p>

        <input
          type="text"
          placeholder="e.g. running, black, waterproof"
          className="border rounded p-3 w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        {tags.trim() && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {t}
                </span>
              ))}
          </div>
        )}
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

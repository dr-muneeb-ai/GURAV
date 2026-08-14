import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [images, setImages] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Watches");
  const [subCategory, setSubCategory] = useState("Premium");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      return toast.error("Please select at least one image.");
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

      images.forEach((image) => {
        formData.append("image", image);
      });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: {
            token,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setImages([]);
        setName("");
        setDescription("");
        setCategory("Watches");
        setSubCategory("Premium");
        setPrice("");
        setSizes([]);
        setBestseller(false);

        e.target.reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-5 w-full max-w-3xl"
    >
      {/* Images */}
      <div>
        <p className="mb-2 font-semibold">
          Upload Images (Maximum 6)
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          className="border p-2 rounded-md w-full"
          onChange={(e) => {
            const files = Array.from(e.target.files);

            if (files.length > 6) {
              toast.error("Maximum 6 images allowed.");
              e.target.value = "";
              return;
            }

            setImages(files);
          }}
          required
        />

        {images.length > 0 && (
          <>
            <p className="mt-2 text-sm text-gray-500">
              {images.length} image(s) selected
            </p>

            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Name */}
      <div>
        <p className="mb-2 font-semibold">Product Name</p>

        <input
          type="text"
          placeholder="Product Name"
          className="border rounded-md p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div>
        <p className="mb-2 font-semibold">Description</p>

        <textarea
          rows="4"
          placeholder="Description"
          className="border rounded-md p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      {/* Category & SubCategory */}
      <div className="flex gap-5 flex-wrap">
        <div>
          <p className="mb-2 font-semibold">Category</p>

          <select
            className="border rounded-md p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Watches</option>
            <option>Sneakers</option>
            <option>Hoodies</option>
            <option>Accessories</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Sub Category</p>

          <select
            className="border rounded-md p-2"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option>Premium</option>
            <option>Classic</option>
            <option>Luxury</option>
            <option>Limited Edition</option>
          </select>
        </div>

        <div>
          <p className="mb-2 font-semibold">Price</p>

          <input
            type="number"
            placeholder="100"
            className="border rounded-md p-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2 font-semibold">Sizes</p>

        <div className="flex flex-wrap gap-3">
          {["S", "M", "L", "XL", "Standard",].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((item) => item !== size)
                    : [...prev, size]
                )
              }
              className={`px-4 py-2 rounded-md border transition ${
                sizes.includes(size)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-2">
        <input
          id="best"
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(!bestseller)}
        />

        <label htmlFor="best">Bestseller</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition"
      >
        ADD PRODUCT
      </button>
    </form>
  );
};

export default Add;

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

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/product/single/${id}`
      );

      if (data.success) {
        const p = data.product;

        setName(p.name);
        setDescription(p.description);
        setCategory(p.category);
        setSubCategory(p.subCategory);
        setPrice(p.price);
        setSizes(p.sizes || []);
        setBestseller(p.bestseller);
        setOldImages(p.image || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

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
        toast.success(data.message);
        navigate("/list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="max-w-3xl flex flex-col gap-5"
    >
      <h2 className="text-3xl font-bold">
        Edit Product
      </h2>

      <div>
        <p className="font-semibold mb-2">
          Current Images
        </p>

        <div className="flex flex-wrap gap-3">
          {oldImages.map((img, index) => (
            <img
              key={index}
              src={backendUrl + img}
              alt=""
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold mb-2">
          Upload New Images (optional)
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setImages(Array.from(e.target.files))
          }
          className="border p-2 rounded w-full"
        />
      </div>

      <input
        className="border rounded p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <textarea
        className="border rounded p-2"
        rows="5"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <div className="flex gap-4">
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border p-2 rounded"
        >
          <option>Watches</option>
          <option>Sneakers</option>
          <option>Hoodies</option>
          <option>Accessories</option>
        </select>

        <select
          value={subCategory}
          onChange={(e) =>
            setSubCategory(e.target.value)
          }
          className="border p-2 rounded"
        >
          <option>Premium</option>
          <option>Classic</option>
          <option>Luxury</option>
          <option>Limited Edition</option>
        </select>

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="border rounded p-2"
          placeholder="Price"
        />
      </div>

      <div>
        <p className="mb-2 font-semibold">
          Sizes
        </p>

        <div className="flex gap-3 flex-wrap">
          {["S", "M", "L", "XL", "XXL"].map(
            (size) => (
              <button
                type="button"
                key={size}
                onClick={() =>
                  setSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter(
                          (item) => item !== size
                        )
                      : [...prev, size]
                  )
                }
                className={`px-4 py-2 rounded border ${
                  sizes.includes(size)
                    ? "bg-blue-600 text-white"
                    : ""
                }`}
              >
                {size}
              </button>
            )
          )}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() =>
            setBestseller(!bestseller)
          }
        />
        Bestseller
      </label>

      <button
        className="bg-blue-600 text-white py-3 rounded"
        type="submit"
      >
        UPDATE PRODUCT
      </button>
    </form>
  );
};

export default Edit;

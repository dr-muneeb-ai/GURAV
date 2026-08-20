import React, { useEffect, useState } from "react";
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

const SHOE_SUBCATEGORIES = [
  "NIKE TN",
  "NIKE SHOX",
  "LV",
  "GUCCI",
  "PRADA",
  "DIOR",
  "BALENCIAGA",
];

const DEFAULT_SUBCATEGORIES = [
  "Premium",
  "Classic",
  "Luxury",
  "Limited Edition",
];

const Add = ({ token }) => {
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

  // Clear previously picked sizes / subCategory whenever category changes
  // so a leftover "S/M/L" or "Premium" doesn't stay selected on a shoe
  // product (or vice versa).
  useEffect(() => {
    setSizes([]);
    setSubCategory(
      category === "Shoes" ? SHOE_SUBCATEGORIES[0] : DEFAULT_SUBCATEGORIES[0]
    );
  }, [category]);

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

      // Tags: comma separated text -> clean JSON array, used for search
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArray));

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
        setShoeGender("Men");
        setTags("");
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
            <option>Shoes</option>
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
            {(category === "Shoes"
              ? SHOE_SUBCATEGORIES
              : DEFAULT_SUBCATEGORIES
            ).map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
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

	  {category === "Shoes" ? (
	    <>
	      {/* Men / Women toggle for shoe size chart */}
	      <div className="flex gap-3 mb-3">
		{["Men", "Women"].map((g) => (
		  <button
		    key={g}
		    type="button"
		    onClick={() => setShoeGender(g)}
		    className={`px-3 py-1.5 text-sm rounded-md border transition ${
		      shoeGender === g
			? "bg-gray-900 text-white border-gray-900"
			: "bg-transparent text-gray-300 border-gray-500 hover:text-white"
		    }`}
		  >
		    {g}
		  </button>
		))}
	      </div>

	      <div className="flex flex-wrap gap-3">
		{(shoeGender === "Men"
		  ? MEN_SHOE_SIZES
		  : WOMEN_SHOE_SIZES
		).map(({ us, eu }) => {
		  const sizeLabel = `${shoeGender} US ${us} / EU ${eu}`;

		  return (
		    <button
		      key={sizeLabel}
		      type="button"
		      onClick={() =>
			setSizes((prev) =>
			  prev.includes(sizeLabel)
			    ? prev.filter((item) => item !== sizeLabel)
			    : [...prev, sizeLabel]
			)
		      }
		      className={`px-3 py-2 rounded-md text-sm transition flex flex-col items-center leading-tight ${
			sizes.includes(sizeLabel)
			  ? "bg-blue-600 text-white"
			  : "bg-transparent text-gray-300 hover:text-white border border-gray-500"
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
	    <div className="flex flex-wrap gap-3">
	      {STANDARD_SIZES.map((size) => (
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
		  className={`px-4 py-2 rounded-md transition ${
		    sizes.includes(size)
		      ? "bg-blue-600 text-white"
		      : "bg-transparent text-gray-300 hover:text-white border border-gray-500"
		  }`}
		>
		  {size}
		</button>
	      ))}
	    </div>
	  )}
	</div>

	{/* Tags */}
	<div>
	  <p className="mb-2 font-semibold">
	    Tags{" "}
	    <span className="text-xs font-normal text-gray-500">
	      (comma separated — used for easy search, e.g. running, leather, casual)
	    </span>
	  </p>
	  <input
	    type="text"
	    placeholder="e.g. running, black, waterproof"
	    className="border rounded-md p-2 w-full"
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

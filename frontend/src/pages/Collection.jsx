import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // =========================
  // DERIVE FILTER OPTIONS
  // =========================

  const allCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const allSubCategories = [
    ...new Set(products.map((p) => p.subCategory).filter(Boolean)),
  ];

  // =========================
  // CATEGORY FILTER
  // =========================

  const toggleCategory = (e) => {
    const { value } = e.target;

    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // =========================
  // SUB CATEGORY FILTER
  // =========================

  const toggleSubCategory = (e) => {
    const { value } = e.target;

    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // =========================
  // APPLY FILTER
  // =========================

  const applyFilter = () => {
    let productsCopy = [...products];

    // Search
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Sub Category
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Sorting
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    setFilterProduct(productsCopy);
  };

  // =========================
  // UPDATE PRODUCTS
  // =========================

  useEffect(() => {
    applyFilter();
  }, [
    category,
    subCategory,
    search,
    showSearch,
    sortType,
    products,
  ]);

  const activeFilterCount =
    category.length + subCategory.length;

  return (
    <section className="relative">

      {/* ==========================================
          BACKGROUND GLOW
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-40
          -left-40
          w-[450px]
          h-[450px]
          rounded-full
          bg-[#b9572c]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          top-[35%]
          -right-40
          w-[450px]
          h-[450px]
          rounded-full
          bg-[#b9572c]/[0.07]
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[40%]
          w-[350px]
          h-[350px]
          rounded-full
          bg-orange-300/[0.05]
          blur-[100px]
        "
      />

      {/* ==========================================
          MAIN CONTAINER
      ========================================== */}

      <div
        className="
          relative
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-12
          py-10
          md:py-14
        "
      >

        {/* ==========================================
            MOBILE FILTER BUTTON
        ========================================== */}

        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className="
            w-full
            flex
            items-center
            justify-between
            mb-5
            px-5
            py-4
            text-xs
            font-semibold
            uppercase
            tracking-[3px]
            text-[#181818]
            bg-white/60
            backdrop-blur-xl
            border
            border-white/80
            rounded-2xl
            shadow-[0_10px_35px_rgba(0,0,0,0.06)]
            sm:hidden
            hover:bg-white/80
            transition-all
          "
        >
          <span className="flex items-center gap-3">
            Filters

            {activeFilterCount > 0 && (
              <span
                className="
                  flex
                  items-center
                  justify-center
                  min-w-6
                  h-6
                  px-2
                  rounded-full
                  bg-[#b9572c]
                  text-white
                  text-[10px]
                  shadow-[0_0_15px_rgba(185,87,44,0.45)]
                "
              >
                {activeFilterCount}
              </span>
            )}
          </span>

          <img
            className={`
              h-3
              transition-transform
              duration-300
              ${showFilter ? "rotate-90" : ""}
            `}
            src={assets.dropdown_icon}
            alt=""
          />
        </button>

        {/* ==========================================
            MAIN LAYOUT
        ========================================== */}

        <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">

          {/* ========================================
              LEFT FILTER PANEL
          ======================================== */}

          <aside
            className={`
              w-full
              sm:w-[240px]
              lg:w-[260px]
              shrink-0
              ${showFilter ? "" : "hidden"}
              sm:block
            `}
          >

            {/* FILTER HEADING */}

            <div className="mb-6 hidden sm:block">

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[5px]
                  text-[#b9572c]
                  font-semibold
                  
                "
              >
                Purify
              </p>

              <h3
                className="
                  text-3xl
                  mt-2
                  text-[#181818]
                "
                style={{
                  fontFamily: "'Prata', serif",
                }}
              >
                Shop
              </h3>

              <div className="mt-4 h-px w-full bg-black/10" />

            </div>

            {/* ======================================
                CATEGORY GLASS CARD
            ====================================== */}

            <div className="relative group mb-5">

              {/* Glow */}

              <div
                className="
                  absolute
                  -inset-1
                  rounded-3xl
                  bg-[#d3d3d3]/20
                  blur-2xl
                  opacity-60
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                "
              />

              {/* Gradient Border */}

              <div
                className="
                  relative
                  rounded-3xl
                  p-[1px]
                  bg-gradient-to-br
                  from-[#d3d3d3]/20
                  via-white/30
                  to-[#b9572c]/30
                "
              >

                {/* Glass */}

                <div
                  className="
                    rounded-[23px]
                    bg-white/45
                    backdrop-blur-2xl
                    border
                    border-white/60
                    px-5
                    py-6
                    shadow-[0_20px_60px_rgba(0,0,0,0.07)]
                  "
                >

                  {/* Header */}

                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[4px]
                          text-[#b9572c]
                          font-semibold
                        "
                      >
                        Explore
                      </p>

                      <p
                        className="
                          text-xl
                          text-[#181818]
                          mt-1
                        "
                        style={{
                          fontFamily: "'Prata', serif",
                        }}
                      >
                        Categories
                      </p>

                    </div>

                    <div
                      className="
                        h-9
                        w-9
                        rounded-full
                        bg-[#b9572c]/10
                        border
                        border-[#b9572c]/20
                        flex
                        items-center
                        justify-center
                        shadow-[0_0_20px_rgba(185,87,44,0.15)]
                      "
                    >
                      <span className="text-[#b9572c] text-sm">
                        ✦
                      </span>
                    </div>

                  </div>

                  {/* Category Options */}

                  <div className="space-y-2">

                    {allCategories.map((cat) => {
                      const checked = category.includes(cat);

                      return (
                        <label
                          key={cat}
                          className={`
                            flex
                            items-center
                            justify-between
                            cursor-pointer
                            px-3
                            py-3
                            rounded-xl
                            border
                            transition-all
                            duration-300
                            ${
                              checked
                                ? "bg-[#b9572c]/10 border-[#b9572c]/30 shadow-[0_0_18px_rgba(185,87,44,0.10)]"
                                : "bg-white/20 border-transparent hover:bg-white/50 hover:border-white/70"
                            }
                          `}
                        >

                          <span
                            className={`
                              text-sm
                              transition-colors
                              ${
                                checked
                                  ? "text-[#b9572c] font-medium"
                                  : "text-gray-700 hover:text-[#b9572c]"
                              }
                            `}
                          >
                            {cat}
                          </span>

                          <input
                            type="checkbox"
                            value={cat}
                            checked={checked}
                            onChange={toggleCategory}
                            className="
                              appearance-none
                              w-4
                              h-4
                              rounded-full
                              border
                              border-gray-300
                              bg-white/70
                              cursor-pointer
                              transition-all
                              duration-300
                              checked:bg-[#b9572c]
                              checked:border-[#b9572c]
                              checked:shadow-[0_0_12px_rgba(185,87,44,0.5)]
                            "
                          />

                        </label>
                      );
                    })}

                  </div>

                </div>

              </div>

            </div>

            {/* ======================================
                TYPE GLASS CARD
            ====================================== */}

            <div className="relative group">

              {/* Glow */}

              <div
                className="
                  absolute
                  -inset-1
                  rounded-3xl
                  bg-[#000000]/10
                  blur-2xl
                  opacity-50
                  group-hover:opacity-90
                  transition-opacity
                  duration-500
                "
              />

              {/* Border */}

              <div
                className="
                  relative
                  rounded-3xl
                  p-[1px]
                  bg-gradient-to-br
                  from-[#d3d3d3]/20
                  via-white/30
                  to-[#b9572c]/20
                "
              >

                {/* Glass */}

                <div
                  className="
                    rounded-[23px]
                    bg-white/40
                    backdrop-blur-2xl
                    border
                    border-white/60
                    px-5
                    py-6
                    shadow-[0_20px_60px_rgba(0,0,0,0.06)]
                  "
                >

                  {/* Header */}

                  <div className="flex items-center justify-between mb-5">

                    <div>

                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[4px]
                          text-[#b9572c]
                          font-semibold
                        "
                      >
                        Refine By
                      </p>

                      <p
                        className="
                          text-xl
                          text-[#181818]
                          mt-1
                        "
                        style={{
                          fontFamily: "'Prata', serif",
                        }}
                      >
                        Type
                      </p>

                    </div>

                    <div
                      className="
                        h-9
                        w-9
                        rounded-full
                        bg-black/[0.04]
                        border
                        border-black/5
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <span className="text-[#b9572c] text-sm">
                        ◇
                      </span>
                    </div>

                  </div>

                  {/* Type Options */}

                  <div className="space-y-2">

                    {allSubCategories.map((sub) => {
                      const checked = subCategory.includes(sub);

                      return (
                        <label
                          key={sub}
                          className={`
                            flex
                            items-center
                            justify-between
                            cursor-pointer
                            px-3
                            py-3
                            rounded-xl
                            border
                            transition-all
                            duration-300
                            ${
                              checked
                                ? "bg-[#b9572c]/10 border-[#b9572c]/30 shadow-[0_0_18px_rgba(185,87,44,0.10)]"
                                : "bg-white/20 border-transparent hover:bg-white/50 hover:border-white/70"
                            }
                          `}
                        >

                          <span
                            className={`
                              text-sm
                              transition-colors
                              ${
                                checked
                                  ? "text-[#b9572c] font-medium"
                                  : "text-gray-700 hover:text-[#b9572c]"
                              }
                            `}
                          >
                            {sub}
                          </span>

                          <input
                            type="checkbox"
                            value={sub}
                            checked={checked}
                            onChange={toggleSubCategory}
                            className="
                              appearance-none
                              w-4
                              h-4
                              rounded-full
                              border
                              border-gray-300
                              bg-white/70
                              cursor-pointer
                              transition-all
                              duration-300
                              checked:bg-[#b9572c]
                              checked:border-[#b9572c]
                              checked:shadow-[0_0_12px_rgba(185,87,44,0.5)]
                            "
                          />

                        </label>
                      );
                    })}

                  </div>

                </div>

              </div>

            </div>

          </aside>

          {/* ========================================
              RIGHT SIDE
          ======================================== */}

          <div className="flex-1 min-w-0">

            {/* HEADER */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-end
                sm:justify-between
                gap-5
                mb-8
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[5px]
                    text-[#b9572c]
                    font-semibold
                    mb-2
                  "
                >
                  Curated Selection
                </p>

                <Title
                  text1={"ALL"}
                  text2={"COLLECTIONS"}
                />

              </div>

              {/* SORT */}

              <div className="relative">

                <select
                  value={sortType}
                  onChange={(e) =>
                    setSortType(e.target.value)
                  }
                  className="
                    appearance-none
                    w-full
                    sm:w-auto
                    min-w-[190px]
                    text-xs
                    uppercase
                    tracking-[1.5px]
                    px-5
                    py-3.5
                    pr-10
                    rounded-full
                    border
                    border-white/80
                    bg-white/60
                    backdrop-blur-xl
                    text-gray-700
                    shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                    outline-none
                    focus:border-[#b9572c]/50
                    focus:shadow-[0_0_20px_rgba(185,87,44,0.12)]
                    transition-all
                    cursor-pointer
                  "
                >

                  <option value="relevant">
                    Sort by: Relevant
                  </option>

                  <option value="low-high">
                    Sort by: Low to High
                  </option>

                  <option value="high-low">
                    Sort by: High to Low
                  </option>

                </select>

                <span
                  className="
                    pointer-events-none
                    absolute
                    right-5
                    top-1/2
                    -translate-y-1/2
                    text-[#b9572c]
                  "
                >
                  ↓
                </span>

              </div>

            </div>

            {/* ======================================
                ACTIVE FILTERS
            ====================================== */}

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-7">

                {[...category, ...subCategory].map(
                  (filter) => (
                    <span
                      key={filter}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-2
                        rounded-full
                        bg-[#b9572c]/10
                        border
                        border-[#b9572c]/20
                        text-[#b9572c]
                        text-[10px]
                        uppercase
                        tracking-[1.5px]
                        shadow-[0_0_15px_rgba(185,87,44,0.08)]
                      "
                    >
                      {filter}
                    </span>
                  )
                )}

              </div>
            )}

            {/* ======================================
                PRODUCTS
            ====================================== */}

            {filterProducts.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-x-4
                  md:gap-x-5
                  gap-y-10
                "
              >

                {filterProducts.map(
                  (item, index) => (
                    <ProductItem
                      key={index}
                      name={item.name}
                      id={item._id}
                      price={item.price}
                      image={item.image}
                      bestseller={item.bestseller}
                      rating={item.rating}
                      reviewsCount={item.reviewsCount}
                    />
                  )
                )}

              </div>

            ) : (

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  py-28
                  rounded-3xl
                  border
                  border-dashed
                  border-black/10
                  bg-white/30
                  backdrop-blur-xl
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    rounded-full
                    bg-[#b9572c]/10
                    flex
                    items-center
                    justify-center
                    mb-5
                    shadow-[0_0_30px_rgba(185,87,44,0.15)]
                  "
                >
                  <span className="text-[#b9572c] text-xl">
                    ✦
                  </span>
                </div>

                <p
                  className="
                    text-gray-600
                    text-xs
                    uppercase
                    tracking-[3px]
                  "
                >
                  No products found
                </p>

                <p className="text-gray-400 text-xs mt-3">
                  Try adjusting your filters or search
                </p>

              </div>

            )}

          </div>

        </div>
      </div>
    </section>
  );
};

export default Collection;

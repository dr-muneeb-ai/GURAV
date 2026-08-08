import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaEye, FaShoppingBag, FaStar } from "react-icons/fa";

const ProductItem = ({
  id,
  image,
  name,
  price,
  bestseller,
  rating,
  reviewsCount,
}) => {
  const { currency, backendUrl } = useContext(ShopContext);

  const imageUrl =
    image && Array.isArray(image) && image.length > 0
      ? backendUrl + image[0]
      : "";
console.log(name, rating, reviewsCount);
  return (
    <Link to={`/product/${id}`} className="group w-full">
      <div className="bg-white rounded-3xl overflow-hidden border border-[#eadfce] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-52 object-cover group-hover:scale-105 duration-500"
          />

          {bestseller && (
            <span className="absolute top-3 left-3 bg-black text-white text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
              Bestseller
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="p-3">
          <p className="uppercase text-[10px] tracking-[2px] text-gray-400">
            Premium Collection
          </p>

          <h3 className="text-[18px] font-semibold text-[#1d1d1b] mt-1 truncate">
            {name}
          </h3>

          {/* RATING */}
          <div className="flex items-center gap-1 mt-1">
  <FaStar className="text-[#c97a2c] text-[11px]" />
  <FaStar className="text-[#c97a2c] text-[11px]" />
  <FaStar className="text-[#c97a2c] text-[11px]" />
  <FaStar className="text-[#c97a2c] text-[11px]" />
  <FaStar className="text-[#c97a2c] text-[11px]" />

  <span className="text-xs text-gray-500 ml-1">
  {(rating ?? 0).toFixed(1)} ({reviewsCount ?? 0})
</span>
</div>

          {/* PRICE */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xs text-gray-400 line-through">
                {currency}
                {Math.round(price * 1.2)}
              </p>

              <p className="text-xl font-bold text-black">
                {currency}
                {price}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">
                <FaEye size={13} />
              </button>

              <button className="w-9 h-9 rounded-full bg-[#b76a34] text-white flex items-center justify-center hover:bg-black transition">
                <FaShoppingBag size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProductItem;

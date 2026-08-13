import React, { useContext, useState } from "react";
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
  const { currency } = useContext(ShopContext);
  const [imgError, setImgError] = useState(false);

  const imageUrl =
    image && Array.isArray(image) && image.length > 0
      ? image[0]
      : "";

  return (
    <Link to={`/product/${id}`} className="group w-full block">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#eadfce] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        {/* IMAGE */}
        <div className="relative w-full h-52 sm:h-60 bg-[#f5f2ec] overflow-hidden">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
              No Image
            </div>
          )}

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
          <h3 className="text-[15px] sm:text-[18px] font-semibold text-[#1d1d1b] mt-1 truncate">
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
              <p className="text-lg sm:text-xl font-bold text-black">
                {currency}
                {price}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2">
              <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition">
                <FaEye size={12} />
              </button>
              <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#b76a34] text-white flex items-center justify-center hover:bg-black transition">
                <FaShoppingBag size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

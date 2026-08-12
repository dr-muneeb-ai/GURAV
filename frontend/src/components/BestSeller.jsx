import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    const best = products.filter(
      (item) => item.bestseller === true
    );
    setBestSellers(best);
  }, [products]);
  return (
    <div className="my-8 sm:my-10 px-3 sm:px-6 lg:px-10">
      <div className="text-center text-3xl py-6 sm:py-8">
        <Title text1="BEST" text2="SELLERS" />
        <p className="w-full sm:w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our most popular products! These best sellers are selected
          fresh every time you visit.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2.5 gap-y-5 sm:gap-4 lg:gap-6">
        {bestSellers.map((item) => (
          <ProductItem
	  key={item._id}
	  id={item._id}
	  image={item.image}
	  name={item.name}
	  price={item.price}
	  bestseller={item.bestseller}
	  rating={item.rating}
	  reviewsCount={item.reviewsCount}
	/>
        ))}
      </div>
    </div>
  );
};
export default BestSeller;

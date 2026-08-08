/* eslint-disable react/jsx-no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
	  if (!products.length) return;

	  const latest = [...products]
	    .sort(
	      (a, b) =>
		new Date(b.createdAt) - new Date(a.createdAt)
	    )
	    .slice(0, 15);

	  setLatestProducts(latest);
	}, [products]);
console.log(products);
    return (
        <div className="py-20 px-6 lg:px-12 max-w-[1600px] mx-auto">
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTION'} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Discover the latest fashion trends, stylish home décor, and unique gift ideas. Shop our new collection with premium quality, exclusive designs, and fast delivery.
                </p>
            </div>

            {/* Rendering Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                {latestProducts.map((item, index) => (
	    <ProductItem
		  key={index}
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

export default LatestCollection;

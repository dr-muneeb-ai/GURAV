import React, { useContext, useEffect, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title';
const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (products.length > 0) {
      let filteredProducts = products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts); // Show every related product, not just the first 5
    }
  }, [products, category, subCategory]);
  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };
  if (related.length === 0) return null;
  return (
    <div className='mt-6 sm:mt-8 mb-16 sm:mb-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='relative mt-4 sm:mt-6'>
        {/* LEFT ARROW - desktop only */}
        <button
          onClick={() => scrollByAmount(-320)}
          className='hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-100 transition'
          aria-label='Scroll left'
          type='button'
        >
          ‹
        </button>
        {/* HORIZONTAL SLIDER - drag/swipe on mobile, arrows on desktop */}
        <div
          ref={scrollRef}
          className='
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            pb-2
            px-1
          '
          style={{ scrollbarWidth: 'none' }}
        >
          {related.map((item, index) => (
            <div
              key={item._id || index}
              className='shrink-0 snap-start w-[46%] sm:w-[31%] md:w-[23%] lg:w-[18.5%]'
            >
              <ProductItem
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
                bestseller={item.bestseller}
                rating={item.rating}
                reviewsCount={item.reviewsCount}
              />
            </div>
          ))}
        </div>
        {/* RIGHT ARROW - desktop only */}
        <button
          onClick={() => scrollByAmount(320)}
          className='hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center hover:bg-gray-100 transition'
          aria-label='Scroll right'
          type='button'
        >
          ›
        </button>
      </div>
    </div>
  );
};
export default RelatedProducts;

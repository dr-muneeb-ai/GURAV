import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const Hero = () => {
  const navigate = useNavigate();
  const heroImages = [
  assets.nitesh_img,
  assets.hero2,
  assets.hero3,
  assets.hero4,
];

  const scrollToProducts = () => {
    const section = document.getElementById("products");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="w-full bg-[#D3D3D3] ">
      <div className="flex flex-col lg:flex-row min-h-fit lg:min-h-[650px]">

        {/* LEFT CONTENT */}
        <div
          className="w-full lg:w-1/2 flex items-center"
          style={{
            paddingLeft: "clamp(1.25rem, 5vw, 5rem)",
            paddingRight: "clamp(1.25rem, 5vw, 5rem)",
            paddingTop: "clamp(2.5rem, 6vw, 4rem)",
            paddingBottom: "clamp(2.5rem, 6vw, 4rem)",
          }}
        >
          <div className="max-w-xl">

            {/* Small Label */}
            <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md shadow-md">
              <span className="w-8 h-[1px] bg-[#b9572c]"></span>

              <p
                className="tracking-[0.25em] uppercase text-[#b9572c] font-extrabold"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(0.7rem, 1.1vw, 0.875rem)",
                }}
              >
                New Collection .
              </p>
            </div>

            {/* Heading */}
            <h1
              className="leading-[1.05] text-[#1d1d1b] text-extrabold"
              style={{
                fontFamily: "'Prata', serif",
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              }}
            >
              Latest
              <br />

              <span
                className="shine-text italic text-[#b9572c]"
                style={{ fontFamily: "'Prata', serif" }}
              >
                Arrivals.
              </span>
            </h1>

            {/* Description */}
            <p
              className="mt-7 max-w-md text-gray-600 leading-7"
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}
            >
              Explore our newest collection of careful designed 
              items that will help to enhance your daily life.
            </p>

            {/* Buttons */}
            <div className="flex flex-nowrap gap-2 sm:gap-4 mt-6 sm:mt-8">

              {/* Shop Collection */}
              <button
                onClick={() => navigate("/collection")}
                className="bg-[#1d1d1b] text-white rounded-full font-semibold hover:bg-[#b9572c] transition-all duration-300 whitespace-nowrap"
                style={{
                  paddingLeft: "clamp(1.1rem, 2vw, 2rem)",
                  paddingRight: "clamp(1.1rem, 2vw, 2rem)",
                  paddingTop: "clamp(0.7rem, 1.2vw, 1rem)",
                  paddingBottom: "clamp(0.7rem, 1.2vw, 1rem)",
                  fontSize: "clamp(0.8rem, 1vw, 0.875rem)",
                }}
              >
                Shop the Collection
              </button>
              

              {/* Explore More */}
              <button
                onClick={scrollToProducts}
                className="border border-[#b9572c] text-[#1d1d1b] rounded-full font-semibold transition-all duration-300 hover:bg-[#b9572c] hover:text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:scale-105 whitespace-nowrap"
                style={{
                  paddingLeft: "clamp(1.1rem, 2vw, 2rem)",
                  paddingRight: "clamp(1.1rem, 2vw, 2rem)",
                  paddingTop: "clamp(0.7rem, 1.2vw, 1rem)",
                  paddingBottom: "clamp(0.7rem, 1.2vw, 1rem)",
                  fontSize: "clamp(0.8rem, 1vw, 0.875rem)",
                }}
              >
                Explore More
              </button>

            </div>

            {/* Rating */}
            <div className="flex gap-8 sm:gap-12 mt-7 sm:mt-10 ">
              <div>
                <h3
                  className="text-[#1d1d1b]"
                  style={{
                    fontFamily: "'Prata', serif",
                    fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)",
                  }}
                >
                  4.8/5
                </h3>

                <p className="text-[10px] uppercase tracking-widest text-[#000000] mt-1">
                  Customer Rating
                </p>
              </div>
            </div>

          </div>
        </div>
	{/*Right imGE*/}
	<div
	  className="w-full lg:w-[54%] flex justify-center lg:justify-end items-center"
	  style={{
	    padding: "clamp(1rem, 2vw, 1.5rem)",
	  }}
	>
	  <div
	    className="hero-image w-full max-w-[650px] overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-transparent shadow-2xl"
	    style={{ height: "clamp(320px, 42vw, 600px)" }}
	  >

	    <Swiper
	      modules={[Autoplay]}
	      autoplay={{
		delay: 3500,
		disableOnInteraction: false,
	      }}
	      loop={true}
	      grabCursor={true}
	      slidesPerView={1}
	      className="w-full h-full"
	    >
	      {heroImages.map((image, index) => (
		<SwiperSlide key={index}>
		  <img
		    src={image}
		    alt={`Hero ${index + 1}`}
		    className="
w-full
h-full
object-cover
transition-transform
duration-[5000ms]
group-hover:scale-110
"
		  />
		</SwiperSlide>
	      ))}
	    </Swiper>

	  </div>
	</div>
	</div>
    </section>
  );
};

export default Hero;

import React from "react";
import { useNavigate } from "react-router-dom";
const categories = [
  {
    title: "Watches",
    tagline: "Luxury, durable watches",
    buttonText: "Select your Watch →",
    image: "/watch.jpeg",
  },
  {
    title: "Sneakers",
    tagline: "Sneakers & lifestyle",
    buttonText: "Select your Sneakers →",
    image: "/sneaker.png",
  },
  {
    title: "Hoodies",
    tagline: "Cotton, & Street hoodies",
    buttonText: "Select your Hoodie →",
    image: "/hoodie.png",
  },
  {
    title: "Accessories",
    tagline: "Wallets, belts & leather",
    buttonText: "Select your Accessories →",
    image: "/accessories.png",
  },
];
const FeaturedCategories = () => {
  const navigate = useNavigate();
  return (
    <section className="py-14 px-2 lg:px-8">
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 6px rgba(211,211,211,1),
                        0 0 14px rgba(211,211,211,0.3);
          }
          50% {
            box-shadow: 0 0 12px rgba(211,211,211,1),
                        0 0 26px rgba(211,211,211,0.55);
          }
        }
        .glow-btn {
          animation: glowPulse 2.5s ease-in-out infinite;
        }
      `}</style>
      <div className="text-center mb-10 sm:mb-14">
        <h2
          className="text-4xl sm:text-5xl mt-4 font-extrabold"
          style={{ fontFamily: "'Prata', serif" }}
        >
          Open Your Closet
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 max-w-[1400px] mx-auto">
        {categories.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate("/collection")}
            className="group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer aspect-square"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition"></div>

            {/* Title & Tagline */}
            <div className="absolute left-3 right-3 sm:left-8 sm:right-8 bottom-[38%] sm:bottom-20">
	  <h3
	    className="text-white text-lg sm:text-3xl leading-tight"
	    style={{ fontFamily: "'Prata', serif" }}
	  >
	    {item.title}
	  </h3>
	  <p
	    className="text-white/80 text-[9px] sm:text-sm mt-1"
	    style={{ fontFamily: "'Courier New', serif" }}
	  >
	    {item.tagline}
	  </p>
	</div>

            {/* Button */}
	<button
	  className="absolute left-3 right-3 sm:left-8 sm:right-8 bottom-[10%] sm:bottom-8 glow-btn px-2.5 py-1.5 sm:px-5 sm:py-2 rounded-full border border-[#D3D3D3] bg-black/30 text-white text-[8.5px] sm:text-xs tracking-widest hover:bg-[#D3D3D3] hover:text-black transition-colors duration-300"
	  style={{
	    fontFamily: "'Georgia', serif",
	    whiteSpace: "nowrap",
	    overflow: "hidden",
	    textOverflow: "ellipsis",
	    width: "fit-content",
	    maxWidth: "100%",
	  }}
	>
	  {item.buttonText}
	</button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default FeaturedCategories;

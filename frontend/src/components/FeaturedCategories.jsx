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
            style={{ containerType: "inline-size" }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition"></div>
            {/* Title & Tagline */}
            <div
              className="absolute"
              style={{
                left: "clamp(0.75rem, 6cqw, 2rem)",
                bottom: "clamp(3.5rem, 22cqw, 5rem)",
              }}
            >
	  <h3
	    className="text-white"
	    style={{
	      fontFamily: "'Prata', serif",
	      fontSize: "clamp(1rem, 9cqw, 1.875rem)",
	      lineHeight: 1.1,
	    }}
	  >
	    {item.title}
	  </h3>
	  <p
	    className="text-white/80 mt-1"
	    style={{
	      fontFamily: "'Courier New', serif",
	      fontSize: "clamp(0.55rem, 3.4cqw, 0.875rem)",
	      maxWidth: "clamp(100px, 55cqw, 220px)",
	    }}
	  >
	    {item.tagline}
	  </p>
	</div>
           
	<button
	  className="absolute glow-btn rounded-full border border-[#D3D3D3] bg-black/30 text-white tracking-widest whitespace-nowrap hover:bg-[#D3D3D3] hover:text-black transition-colors duration-300"
	  style={{
	    fontFamily: "'Georgia', serif",
	    left: "clamp(0.75rem, 6cqw, 2rem)",
	    bottom: "clamp(0.75rem, 5cqw, 2rem)",
	    paddingLeft: "clamp(0.5rem, 4cqw, 1.25rem)",
	    paddingRight: "clamp(0.5rem, 4cqw, 1.25rem)",
	    paddingTop: "clamp(0.3rem, 2cqw, 0.5rem)",
	    paddingBottom: "clamp(0.3rem, 2cqw, 0.5rem)",
	    fontSize: "clamp(0.5rem, 3cqw, 0.75rem)",
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

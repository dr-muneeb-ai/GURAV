import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const initials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const CustomerReviews = () => {
  const { backendUrl } = useContext(ShopContext);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/review/latest?limit=12`
        );

        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl) fetchReviews();
  }, [backendUrl]);

  // Render the list twice back-to-back so the marquee can loop seamlessly
  const marqueeReviews = [...reviews, ...reviews];

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="py-20 bg-[#D3D3D3] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <h2
          className="text-center text-2xl md:text-4xl mb-14 tracking-[6px] text"
          style={{ fontFamily: "'Prata', serif" }}
        >
          What Customers Consistently Expressed
        </h2>

      </div>

      {loading ? (

        <p className="text-center text-gray-500">Loading reviews...</p>

      ) : (

        <div className="marquee-track">
          <div className="marquee-content">

            {marqueeReviews.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="review-card bg-white rounded-3xl p-8 shadow-lg border border-[#e8dccd] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >

                {/* Stars */}
                <div className="text-[#b9572c] text-xl mb-5">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>

                {/* Review */}
                <p className="text-gray-600 leading-7 text-sm line-clamp-4">
                  "{item.comment}"
                </p>

                {/* Product referenced */}
                {item.productId?.name && (
                  <p className="text-xs text-[#b9572c] mt-3 uppercase tracking-wide">
                    {item.productId.name}
                  </p>
                )}

                {/* User */}
                <div className="flex items-center gap-3 mt-8">

                  <div className="w-12 h-12 rounded-full bg-[#b9572c] text-white flex items-center justify-center font-semibold shrink-0">
                    {initials(item.userId?.name)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-[#1d1d1b]">
                      {item.userId?.name || "Customer"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {item.verifiedPurchase
                        ? "Verified Customer"
                        : "Customer"}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>

      )}

      {/* Marquee animation - right to left, pauses on hover */}
      <style>{`
        .marquee-track {
          overflow: hidden;
          width: 100%;
        }

        .marquee-content {
          display: flex;
          gap: 2rem;
          width: max-content;
          padding: 0.5rem 1rem;
          animation: scroll-left 8s linear infinite;
        }

        .marquee-track:hover .marquee-content {
          animation-play-state: paused;
        }

        .review-card {
          width: 340px;
          flex-shrink: 0;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

    </section>
  );
};

export default CustomerReviews;

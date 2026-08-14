import React, { useContext, useEffect, useRef, useState } from "react";
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

  // Drag / touch refs
  const trackRef = useRef(null);
  const contentRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTranslate = useRef(0);
  const currentTranslate = useRef(0);

  const resumeTimer = useRef(null);

  // Pause auto animation
  const pauseAnimation = () => {
    if (!contentRef.current) return;

    contentRef.current.style.animationPlayState = "paused";

    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }
  };

  // Resume auto animation after interaction
  const resumeAnimation = () => {
    if (!contentRef.current) return;

    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }

    resumeTimer.current = setTimeout(() => {
      if (!isDragging.current && contentRef.current) {
        contentRef.current.style.animationPlayState = "running";
      }
    }, 1200);
  };

  // =========================
  // Mouse
  // =========================

  const handleMouseDown = (e) => {
    if (!contentRef.current) return;

    isDragging.current = true;
    startX.current = e.clientX;

    const transform = window.getComputedStyle(
      contentRef.current
    ).transform;

    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      startTranslate.current = matrix.m41;
      currentTranslate.current = matrix.m41;
    } else {
      startTranslate.current = 0;
      currentTranslate.current = 0;
    }

    pauseAnimation();

    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !contentRef.current) return;

    const distance = e.clientX - startX.current;

    currentTranslate.current =
      startTranslate.current + distance;

    contentRef.current.style.transform = `translateX(${currentTranslate.current}px)`;

    e.preventDefault();
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }

    resumeAnimation();
  };

  // =========================
  // Touch
  // =========================

  const handleTouchStart = (e) => {
    if (!contentRef.current) return;

    isDragging.current = true;

    startX.current = e.touches[0].clientX;

    const transform = window.getComputedStyle(
      contentRef.current
    ).transform;

    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      startTranslate.current = matrix.m41;
      currentTranslate.current = matrix.m41;
    } else {
      startTranslate.current = 0;
      currentTranslate.current = 0;
    }

    pauseAnimation();
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !contentRef.current) return;

    const distance =
      e.touches[0].clientX - startX.current;

    currentTranslate.current =
      startTranslate.current + distance;

    contentRef.current.style.transform = `translateX(${currentTranslate.current}px)`;

    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    resumeAnimation();
  };

  // =========================
  // Mouse leaves
  // =========================

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;

      if (trackRef.current) {
        trackRef.current.style.cursor = "grab";
      }

      resumeAnimation();
    }
  };

  // =========================
  // Fetch Reviews
  // =========================

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

    if (backendUrl) {
      fetchReviews();
    }
  }, [backendUrl]);

  // Render twice for seamless marquee
  const marqueeReviews = [...reviews, ...reviews];

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  if (!loading && reviews.length === 0) {
    return null;
  }

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
        <p className="text-center text-gray-500">
          Loading reviews...
        </p>
      ) : (
        <div
          ref={trackRef}
          className="marquee-track"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={contentRef}
            className="marquee-content"
          >
            {marqueeReviews.map((item, index) => (
              <div
                key={`${item._id}-${index}`}
                className="
                  review-card
                  bg-white
                  rounded-3xl
                  p-8
                  shadow-lg
                  border
                  border-[#e8dccd]
                  hover:-translate-y-2
                  hover:shadow-2xl
                  transition-all
                  duration-300
                  select-none
                "
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

                {/* Product */}
                {item.productId?.name && (
                  <p className="text-xs text-[#b9572c] mt-3 uppercase tracking-wide">
                    {item.productId.name}
                  </p>
                )}

                {/* User */}
                <div className="flex items-center gap-3 mt-8">

                  <div className="
                    w-12
                    h-12
                    rounded-full
                    bg-[#b9572c]
                    text-white
                    flex
                    items-center
                    justify-center
                    font-semibold
                    shrink-0
                  ">
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

      <style>{`
        .marquee-track {
          overflow: hidden;
          width: 100%;
          cursor: grab;
          touch-action: pan-y;
        }

        .marquee-track:active {
          cursor: grabbing;
        }

        .marquee-content {
          display: flex;
          gap: 2rem;
          width: max-content;
          padding: 0.5rem 1rem;
          animation: scroll-left 5s linear infinite;
          will-change: transform;
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

        @media (max-width: 640px) {
          .review-card {
            width: 290px;
          }

          .marquee-content {
            gap: 1rem;
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerReviews;

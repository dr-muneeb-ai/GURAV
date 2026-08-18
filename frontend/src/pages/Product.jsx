import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const RelatedProducts = lazy(() =>
  import("../components/Relatedproducts")
);

const initials = (name = "") =>
  name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Product = () => {
  const { productId } = useParams();

  const {
  products,
  setProducts,
  currency,
  addToCart,
  backendUrl,
  token,
  user,
  navigate,
} = useContext(ShopContext);

  const productData = products.find(
    (item) => item._id === productId
  );

  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  // Swipe tracking for the main image gallery
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Sets the main image whenever the product data becomes available/changes
  useEffect(() => {
    if (productData) {
      setImage(productData.image[0]);
    }
  }, [productData]);

  // Fetches reviews only when the productId actually changes (e.g. navigating
  // to a different product). Deliberately NOT dependent on `productData`,
  // because fetchReviews() calls setProducts() internally, which creates a
  // brand-new productData object on every success — if this effect depended
  // on productData, that would re-trigger fetchReviews in an infinite loop.
  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Fetches the review list + rating summary for this product
  const fetchReviews = async () => {
    if (!productId) return;

    try {
      setLoadingReviews(true);

      const { data } = await axios.get(
        `${backendUrl}/api/review/${productId}`
      );

      if (data.success) {
        setReviews(data.reviews || []);
        setRatingAverage(data.averageRating || 0);
        setReviewsCount(data.reviewsCount || 0);

        // Keep the product list rating in sync without mutating state directly.
        // (The averageRating/reviewsCount only exist on this GET response,
        // not on the POST /api/review/add response.)
        setProducts((prev) =>
          prev.map((item) =>
            item._id === productId
              ? {
                  ...item,
                  rating: data.averageRating,
                  reviewsCount: data.reviewsCount,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const submitReview = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Write your review");
      return;
    }

    try {
      setSubmittingReview(true);

      const { data } = await axios.post(
        `${backendUrl}/api/review/add`,
        {
          productId,
          rating: reviewRating,
          comment: reviewComment,
        },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success("Review Added");

        setReviewComment("");
        setReviewRating(5);

        // Refresh the review list / rating summary for this product
        // (this also syncs the product list's rating/reviewsCount)
        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmittingReview(false);
    }
  };
const handleBuyNow = async () => {
  if (productData.sizes.length > 0 && !size) {
    toast.error("Please select a size");
    return;
  }

  const added = await addToCart(productData._id, size, false);

  if (added) {
    navigate("/cart");
  }
};
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <img
        key={i}
        src={
          i < Math.round(rating)
            ? assets.star_icon
            : assets.star_dull_icon
        }
        className="w-4"
        alt=""
      />
    ));
  };

  // ================= IMAGE SWIPE HANDLERS =================

  const goToNextImage = () => {
    if (!productData) return;
    const currentIndex = productData.image.findIndex((img) => img === image);
    const nextIndex = (currentIndex + 1) % productData.image.length;
    setImage(productData.image[nextIndex]);
  };

  const goToPrevImage = () => {
    if (!productData) return;
    const currentIndex = productData.image.findIndex((img) => img === image);
    const prevIndex =
      (currentIndex - 1 + productData.image.length) %
      productData.image.length;
    setImage(productData.image[prevIndex]);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      goToNextImage();
    } else if (distance < -swipeThreshold) {
      goToPrevImage();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (!productData)
    return <div className="opacity-0"></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#ece7e2] to-[#121212] py-8 sm:py-16 rounded-2xl sm:rounded-3xl overflow-hidden">
      <div
	  className="
	    max-w-[1500px]
	    mx-auto
	    px-3
	    sm:px-5
	    lg:px-10
	  "
	>
        <div
	  className="
	  
	    p-4
	    sm:p-8
	    lg:p-12
	    flex
	    flex-col
	    lg:flex-row
	    gap-6
	    sm:gap-16

	    
	  "
	>
          {/* LEFT SIDE */}
          <div className="
            rounded-[24px]
            sm:rounded-[40px]
            w-full
            lg:w-[46%]
            flex
            flex-col
            gap-3
            sm:gap-4
          ">
            {/* MAIN IMAGE (swipeable) */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="
                relative
                aspect-square
                rounded-2xl
                sm:rounded-3xl
                overflow-hidden
                bg-grey
                border
                border-grey
                shadow-lg
                hover:shadow-xl
                transition-shadow
                duration-500
                select-none
              "
            >
              <img
                src={image}
                alt={productData.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-110
		duration-700
		ease-out
                  transition-transform
                  duration-300
                "
              />

              {/* Prev/Next arrows - desktop only, mobile relies on swipe */}
              {productData.image.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-md transition"
                    aria-label="Previous image"
                    type="button"
                  >
                    ‹
                  </button>

                  <button
                    onClick={goToNextImage}
                    className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white items-center justify-center shadow-md transition"
                    aria-label="Next image"
                    type="button"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* DOT INDICATORS - mirrors the swipeable gallery position */}
            {productData.image.length > 1 && (
              <div className="flex justify-center items-center gap-1.5">
                {productData.image.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(item)}
                    aria-label={`Go to image ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      image === item
                        ? "w-5 bg-[#b9572c]"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* THUMBNAILS */}
            <div className="
              flex
              gap-2
              sm:gap-4
              overflow-x-auto
            ">
              {productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  onClick={() => setImage(item)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className={`
                    w-16
                    h-14
                    sm:w-24
                    sm:h-20
                    shrink-0
                    rounded-xl
                    sm:rounded-2xl
                    object-cover
                    cursor-pointer
                    border-2
                    transition-colors
                    duration-300
                    ${
                      image === item
                        ? "ring-4 ring-[#b9572c]/30 border-[#b9572c]"
                        : "border-transparent hover:border-[#b9572c]"
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="
            w-full
            lg:w-[54%]
            flex-[0.9]
            flex
            flex-col
            justify-between
          ">
            <div>
              <h1
                className="
                  text-3xl
                  sm:text-5xl
		lg:text-6xl
		leading-tight
		tracking-wide
		font-normal
                  text-[#1d1d1b]
                "
                style={{
                  fontFamily: "'Prata', serif",
                }}
              >
                {productData.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <div className="flex">
                  {renderStars(ratingAverage)}
                </div>

                <button
                  onClick={() => setShowReviews(true)}
                  className="text-gray-500 hover:text-[#b9572c] transition text-xs sm:text-base"
                >
                  {reviewsCount} Customer Reviews
                </button>
              </div>

              {/* TRUSTED BY - stacked reviewer avatars */}
              {reviews.length > 0 && (
                <button
                  onClick={() => setShowReviews(true)}
                  className="
                    mt-3
                    sm:mt-4
                    inline-flex
                    items-center
                    gap-3
                    bg-gray-100
                    hover:bg-gray-200
                    transition-colors
                    rounded-full
                    pl-1.5
                    pr-4
                    py-1.5
                  "
                  type="button"
                >
                  <div className="flex -space-x-2.5">
                    {reviews.slice(0, 3).map((r, i) =>
                      r.userId?.profileImage ? (
                        <img
                          key={r._id || i}
                          src={r.userId.profileImage}
                          alt={r.userId?.name || "Customer"}
                          className="w-7 h-7 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div
                          key={r._id || i}
                          className="w-7 h-7 rounded-full bg-[#b9572c] text-white text-[10px] font-semibold flex items-center justify-center border-2 border-[#111111]"
                        >
                          {initials(r.userId?.name)}
                        </div>
                      )
                    )}
                  </div>

                  <span className="text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide">
                    Trusted by {reviewsCount}+ customers
                  </span>
                </button>
              )}

              {/* PRICE */}
              <div className="mt-4 sm:mt-5">
                <p className="
                  text-base
                  sm:text-xl
                  text-gray-400
                  line-through
                ">
                  {currency}
                  {Math.round(productData.price * 1.25)}
                </p>

                <h2 className="
                  text-2xl
                  sm:text-4xl
                  font-bold
                  text-[#1d1d1b]
                ">
                  {currency}
                  {productData.price}
                </h2>

                <span className="
                  inline-block
                  mt-2
                  sm:mt-3
                  bg-[#b9572c]
                  text-white
                  px-3
                  sm:px-4
                  py-1
                  rounded-full
                  text-xs
                  sm:text-sm
                ">
                  Save 20%
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="
                mt-4
                sm:mt-5
                text-gray-600
                leading-6
                sm:leading-7
                text-sm
                sm:text-base
              ">
                {productData.description}
              </p>

              {/* SIZE */}
              <div className="mt-5 sm:mt-6">
                <p className="
                  font-medium
                  mb-2
                  sm:mb-3
                  text-sm
                  sm:text-base
                ">
                  Select Size
                </p>

                <div className="
                  flex
                  flex-wrap
                  gap-2
                  sm:gap-3
                ">
                  {productData.sizes.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSize(item)}
                      className={`
                        px-4
                        sm:px-5
                        py-1.5
                        sm:py-2
                        text-sm
                        sm:text-base
                        rounded-xl
                        border
                        transition-colors
                        duration-300
                        ${
                          item === size
                            ? "bg-[#b9572c] text-white border-[#b9572c]"
                            : "bg-white hover:border-[#b9572c] hover:text-[#b9572c]"
                        }
                      `}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* QUANTITY */}
              <div className="mt-5 sm:mt-6">
                <p className="
                  font-medium
                  mb-2
                  sm:mb-3
                  text-sm
                  sm:text-base
                ">
                  Quantity
                </p>

                <div className="
                  flex
                  items-center
                  w-fit
                  border
                  rounded-full
                  overflow-hidden
                  bg-white
                ">
                  <button
                    onClick={() =>
                      quantity > 1 && setQuantity(quantity - 1)
                    }
                    className="
                      px-4
                      sm:px-5
                      py-2
                      sm:py-3
                      hover:bg-[#b9572c]
                      hover:text-white
                      transition
                    "
                  >
                    −
                  </button>

                  <span className="
                    px-5
                    sm:px-6
                    font-semibold
                    text-sm
                    sm:text-base
                  ">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="
                      px-4
                      sm:px-5
                      py-2
                      sm:py-3
                      hover:bg-[#b9572c]
                      hover:text-white
                      transition
                    "
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="
              flex
              flex-row
              gap-3
              sm:gap-6
              mt-6
              sm:mt-8
            ">
              <button
                onClick={() => addToCart(productData._id, size)}
                className="
                  flex-1
                  sm:w-44
                  sm:flex-none
                  bg-[#1d1d1b]
                  hover:bg-[#b9572c]
                  text-white
                  px-3
                  sm:px-6
                  py-2.5
                  sm:py-3
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-medium
                  transition-colors
                  duration-300
                  hover:scale-105
                  whitespace-nowrap
                "
              >
                ADD TO CART
              </button>

              <button
		  onClick={handleBuyNow}
		  className="
		    flex-1
		    sm:w-44
		    sm:flex-none
		    border-2
		    border-[#1d1d1b]
		    hover:border-[#b9572c]
		    hover:bg-[#b9572c]
		    hover:text-white
		    text-[#1d1d1b]
		    px-3
		    sm:px-6
		    py-2.5
		    sm:py-3
		    rounded-full
		    text-xs
		    sm:text-sm
		    font-medium
		    transition-colors
		    duration-300
		    hover:scale-105
		    whitespace-nowrap
		  "
		>
		  BUY NOW
		</button>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS - moved above the trust box, per request */}
        <Suspense fallback={<div className="h-40"></div>}>
          <RelatedProducts
            category={productData.category}
            subCategory={productData.subCategory}
          />
        </Suspense>

        {/* TRUST BOX */}
        <div
  className="
    mt-6
    sm:mt-10
    rounded-2xl
    border-2
    border-[#708090]
    bg-gradient-to-br
    from-[#708090]
    to-gray-100
    p-4
    sm:p-6
    grid
    grid-cols-2
    sm:grid-cols-4
    gap-3
    sm:gap-4
    text-xs
    sm:text-lg
    text-[#b9572c]
    font-['Prata']
  "
>
  <p>✓ 100% Original Product</p>
  <p>✓ Shipping Australia</p>
  <p>✓ Easy 7-Day Returns</p>
  <p>✓ Secure Checkout</p>
</div>

        {/* PRODUCT DETAILS */}
        <div className="mt-10 sm:mt-20">
          <div className="
            inline-block
            border-b-2
            border-[#b9572c]
          ">
            <h2
              className="
                text-xl
                sm:text-3xl
                pb-2
                sm:pb-3
              "
              style={{
                fontFamily: "'Prata', serif",
              }}
            >
              Product Details
            </h2>
          </div>

          <div className="
            mt-5
            sm:mt-8
            bg-transparent
            rounded-[22px]
            sm:rounded-[32px]
shadow-[0_30px_80px_rgba(0,0,0,0.10)]
border
border-transparent
bg-gradient-to-br
from-[#708090]
to-gray-100
            p-4
            sm:p-8
            text-black
            font-Calibiri
            leading-6
            sm:leading-8
            text-sm
            sm:text-lg
          "
          style= {{fontFamily: "'Prata,Serif"}}>
            <p>
              Step into style and comfort with our beautifully hand-made
              embellished slippers. Each pair is carefully crafted by skilled
              artisans and decorated with elegant embellishments to give a
              unique and fashionable look.
            </p>

            <br />

            <p>
              These slippers are lightweight, comfortable, and perfect for
              everyday wear as well as festive occasions. Every pair reflects
              premium craftsmanship and attention to detail.
            </p>

            <div className="mt-5 sm:mt-8">
              <h3 className="
                font-semibold
                text-black
                mb-2
                sm:mb-3
                text-sm
                sm:text-base
              ">
                Specifications
              </h3>

              <ul className="
                list-disc
                pl-5
                sm:pl-6
                space-y-1.5
                sm:space-y-2
                text-sm
                sm:text-base
              ">
                <li>Hand-made embellished design</li>
                <li>Comfortable & lightweight</li>
                <li>Premium anti-slip sole</li>
                <li>Perfect for casual & festive wear</li>
              </ul>
            </div>
          </div>
        </div>

        {/* REVIEWS DRAWER */}
        {showReviews && (
          <div className="fixed inset-0 z-50">
            <div
              onClick={() => setShowReviews(false)}
              className="
                absolute
                inset-0
                bg-black/40
              "
            ></div>

            <div className="
              absolute
              right-0
              top-0
              h-full
              w-full
              sm:w-[420px]
              bg-white
              shadow-2xl
              p-5
              sm:p-8
              overflow-y-auto
            ">
              <div className="
                flex
                justify-between
                items-center
                mb-5
                sm:mb-8
              ">
                <h2
                  className="text-2xl sm:text-3xl"
                  style={{
                    fontFamily: "'Prata', serif",
                  }}
                >
                  Reviews
                </h2>

                <button
                  onClick={() => setShowReviews(false)}
                  className="text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <div>
                {/* Average Rating */}
                <div className="mb-6 sm:mb-8 border-b pb-4 sm:pb-6">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {ratingAverage.toFixed(1)} ★
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {reviewsCount} Reviews
                  </p>
                </div>

                {/* Add Review */}
                {token ? (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                      Write a Review
                    </h3>

                    {/* Stars */}
                    <div className="flex gap-2 mb-3 sm:mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`text-xl sm:text-2xl transition
                            ${
                              star <= reviewRating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                          `}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience..."
                      className="w-full border rounded-xl p-3 resize-none text-sm sm:text-base"
                    />

                    <button
                      onClick={submitReview}
                      disabled={
                        submittingReview ||
                        reviews.some((r) => r.userId?._id === user?._id)
                      }
                      className="mt-3 sm:mt-4 bg-[#b9572c] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full disabled:opacity-50 text-sm sm:text-base"
                    >
                      {reviews.some((r) => r.userId?._id === user?._id)
                        ? "Already Reviewed"
                        : submittingReview
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 sm:mb-8 bg-gray-100 rounded-xl p-4 text-center">
                    <p className="text-gray-600 text-sm sm:text-base">
                      Login to write a review.
                    </p>
                  </div>
                )}

                {/* Reviews */}
                {loadingReviews ? (
                  <p className="text-sm sm:text-base">Loading Reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm sm:text-base">No reviews yet.</p>
                ) : (
                  <div className="space-y-5 sm:space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 sm:pb-5">
                        <div className="flex items-center gap-3">
                          {review.userId?.profileImage ? (
                            <img
                              src={review.userId.profileImage}
                              alt={review.userId?.name || "Customer"}
                              className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#b9572c] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                              {initials(review.userId?.name)}
                            </div>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base">
                              {review.userId?.name}
                            </h3>

                            {review.verifiedPurchase && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-yellow-500 text-base sm:text-lg mt-2">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>

                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                          {review.comment}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;

"use client";
import { useState } from "react";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/app/store/apis/ReviewApi";
import {
  Star,
  MessageSquare,
  User,
  Clock,
  ThumbsUp,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useGetMeQuery } from "@/app/store/apis/UserApi";

interface ProductReviewsProps {
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userId: string;
    user?: { name: string };
  }[];
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  reviews,
  productId,
}) => {
  const { data } = useGetMeQuery(undefined);
  const userId = data?.user?.id;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const [createReview, { isLoading: isSubmitting, error }] =
    useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        userId,
        rating,
        comment,
      }).unwrap();
      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
        }`}
      />
    ));
  };

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const getRatingDistribution = () => {
    if (!reviews || reviews.length === 0) return null;
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    const total = reviews.length;
    return distribution
      .map((count) => ({
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .reverse();
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = reviews?.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  if (isSubmitting) {
    return (
      <div className="my-12 text-center flex justify-center items-center space-x-3">
        <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
        <span className="text-gray-600 text-sm">Submitting your review...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-12 bg-red-50 border border-red-200 rounded-lg p-4 text-center flex justify-center items-center text-red-600">
        <AlertCircle className="mr-2" size={20} />
        <span className="text-sm">
          Error loading reviews. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
          <MessageSquare className="mr-2 text-indigo-600" size={20} />
          Customer Reviews
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"} for
          this product
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-semibold text-gray-800">
              {averageRating}
            </div>
            <div className="flex justify-center mt-1">
              {renderStars(Math.round(Number(averageRating)))}
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Based on {reviews.length} reviews
            </p>
          </div>
          <div className="flex-1 w-full">
            {ratingDistribution?.map((data, idx) => (
              <div
                key={idx}
                className="flex items-center mb-2 text-xs sm:text-sm"
              >
                <div className="w-12 text-right text-gray-700">
                  {5 - idx} stars
                </div>
                <div className="ml-2 flex-1">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-2 w-10 text-gray-600">
                  {data.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {userId ? (
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <ThumbsUp className="mr-2 text-indigo-600" size={18} />
            Write a Review
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setRating(index + 1)}
                      className={`focus:outline-none transition-transform duration-150 ${
                        index < rating ? "scale-110" : ""
                      }`}
                    >
                      <Star
                        size={20}
                        className={`${
                          index < rating
                            ? "text-indigo-500 fill-indigo-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {rating} - {ratingLabels[rating]}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm"
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium text-xs sm:text-sm flex items-center hover:bg-indigo-700 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} className="mr-2" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 text-indigo-600 flex items-center text-xs sm:text-sm">
          <AlertCircle size={16} className="mr-2" />
          Please log in to write a review.
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <User className="mr-2 text-indigo-600" size={18} />
          Customer Feedback
        </h3>
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 text-xs sm:text-sm">
              No reviews yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {review?.user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">
                        {review?.user?.name || "Anonymous"}
                      </span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                {(data?.user?.role === "ADMIN" || userId === review.userId) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-600 text-xs sm:text-sm">
                  {expandedReviews[review.id] ||
                  (review.comment?.length || 0) <= 200
                    ? review.comment
                    : `${review.comment?.slice(0, 200)}...`}
                  {(review.comment?.length || 0) > 200 && (
                    <button
                      onClick={() => toggleReviewExpansion(review.id)}
                      className="text-indigo-600 hover:text-indigo-700 text-xs font-medium ml-2"
                    >
                      {expandedReviews[review.id] ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;

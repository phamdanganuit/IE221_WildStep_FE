import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BsHandThumbsUp,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
  BsHandThumbsUpFill,
} from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import StarRating from "./StarRating";
import { useToast } from "@/contexts/ToastContext";
import { useAuthStore } from "@/store/authStore";
import { getProductReviews, reactToReview } from "@/service/reviewService";

const REVIEWS_PER_PAGE = 3;
const FILTER_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "with-media", label: "Có ảnh / video" },
  { id: "with-description", label: "Có mô tả" },
];
const STAR_OPTIONS = [5, 4, 3, 2, 1];

const getReviewId = (review) =>
  review?.id || review?._id || review?.reviewId || review?.review_id;

const pickNumber = (...values) => {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return 0;
};

const pickBoolean = (...values) => {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
  }
  return false;
};

const normalizeReview = (review = {}) => ({
  ...review,
  likes: pickNumber(review.likes, review.likeCount, review.like_count),
  dislikes: pickNumber(
    review.dislikes,
    review.dislikeCount,
    review.dislike_count
  ),
  isLiked: pickBoolean(review.isLiked, review.liked, review.is_liked),
  isDisliked: pickBoolean(review.isDisliked, review.is_disliked),
});

const ReviewSection = ({ productId }) => {
  const { addToast } = useToast();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [open, setOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRating, setSelectedRating] = useState(null);
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reactionLoading, setReactionLoading] = useState(null);
  const [filterSections, setFilterSections] = useState({
    stars: true,
  });

  const toggleFilterSection = (section) => {
    setFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const resetAndSetPage = (value) => {
    setPage(value);
  };

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError("");

    const params = {
      page,
      page_size: REVIEWS_PER_PAGE,
      sort: "newest",
    };

    if (selectedRating) {
      params.rating = selectedRating;
      params.ratings = selectedRating;
    }
    if (activeFilter === "with-media") {
      params.has_images = true;
      params.has_media = true;
    }
    if (activeFilter === "with-description") {
      params.has_description = true;
    }

    const result = await getProductReviews(productId, params);
    if (result.success) {
      const payload = result.data || {};
      const normalizedSummary =
        payload.summary ||
        payload.data?.summary ||
        payload.meta?.summary ||
        null;
      const rawReviews =
        payload.reviews ||
        payload.data?.reviews ||
        payload.data ||
        payload.data?.data ||
        [];
      setReviews(
        Array.isArray(rawReviews)
          ? rawReviews.map((review) => normalizeReview(review))
          : []
      );
      setSummary(normalizedSummary);
      setPagination(
        payload.pagination ||
          payload.meta?.pagination || {
            page: params.page,
            total_pages: 1,
            total: 0,
          }
      );
    } else {
      setReviews([]);
      setSummary(null);
      setPagination({ page: 1, total_pages: 1, total: 0 });
      setError(result.error || "Không thể tải danh sách đánh giá");
    }

    setLoading(false);
  }, [productId, page, activeFilter, selectedRating]);

  useEffect(() => {
    resetAndSetPage(1);
  }, [productId]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, selectedRating]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [fetchReviews, productId]);

  const ratingDistribution = useMemo(() => {
    const distribution =
      summary?.ratingDistribution ||
      summary?.distribution ||
      summary?.ratings ||
      {};
    const total =
      summary?.totalReviews ||
      summary?.total ||
      summary?.count ||
      summary?.total_count ||
      0;

    return STAR_OPTIONS.map((star) => {
      const count = distribution[String(star)] || 0;
      const percentage = total > 0 ? (count / total) * 100 : 0;
      return {
        star,
        count,
        percentage,
      };
    });
  }, [summary]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination.total_pages || 1)) return;
    setPage(newPage);
  };

  const handleReaction = async (review, intent) => {
    const reviewId = getReviewId(review);
    if (!reviewId) return;

    if (!isAuthenticated) {
      addToast({
        type: "warning",
        message: "Vui lòng đăng nhập để tương tác với đánh giá.",
      });
      return;
    }

    const requiresServerCall =
      intent === "like" || (intent === "dislike" && review.isLiked);

    if (!requiresServerCall) {
      setReviews((prev) =>
        prev.map((item) => {
          const itemId = getReviewId(item);
          if (itemId !== reviewId) return item;
          if (intent === "dislike") {
            return {
              ...item,
              isDisliked: !item.isDisliked,
            };
          }
          return item;
        })
      );
      return;
    }

    const finalAction =
      intent === "like"
        ? review.isLiked
          ? "unlike"
          : "like"
        : "unlike";

    const loadingKey = `${reviewId}-${intent}`;
    setReactionLoading(loadingKey);

    const response = await reactToReview(reviewId, finalAction);

    if (!response.success) {
      addToast({
        type: "error",
        message: response.error || "Không thể cập nhật phản ứng.",
      });
    } else {
      const payload = response.data || {};
      setReviews((prev) =>
        prev.map((item) => {
          const itemId = getReviewId(item);
          if (itemId !== reviewId) return item;

          const updatedLikes = pickNumber(
            payload.likeCount,
            payload.likes,
            payload.like_count,
            item.likes
          );
          const updatedIsLiked =
            typeof payload.liked === "boolean"
              ? payload.liked
              : finalAction === "like";
          const shouldMarkDisliked =
            intent === "dislike" && updatedIsLiked === false;

          return {
            ...item,
            likes: updatedLikes,
            isLiked: updatedIsLiked,
            isDisliked: shouldMarkDisliked ? true : false,
          };
        })
      );
    }

    setReactionLoading(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateString;
    }
  };

  const renderPagination = () => {
    if ((pagination.total_pages || 1) === 1) return null;

    const pages = [];
    const totalPages = pagination.total_pages || 1;
    const currentPage = pagination.page || page;

    const pushRange = (start, end) => {
      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }
    };

    if (totalPages <= 7) {
      pushRange(1, totalPages);
    } else if (currentPage <= 4) {
      pushRange(1, 5);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push("...");
      pushRange(totalPages - 4, totalPages);
    } else {
      pages.push(1);
      pages.push("...");
      pushRange(currentPage - 1, currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return (
      <nav
        className="flex gap-2 self-center mt-7 max-w-full text-sm font-medium leading-relaxed text-center whitespace-nowrap text-neutral-500"
        aria-label="Review pagination"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex justify-center items-center w-11 h-11 rounded-lg border border-slate-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </button>
        {pages.map((p, idx) => (
          <button
            key={`${p}-${idx}`}
            onClick={() => typeof p === "number" && handlePageChange(p)}
            disabled={p === "..."}
            className={`flex justify-center items-center w-11 h-11 rounded-lg border border-solid transition-all ${
              p === currentPage
                ? "bg-white border-zinc-800 text-neutral-900"
                : "border-slate-200 hover:bg-gray-50"
            } ${p === "..." ? "cursor-default" : ""}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex justify-center items-center w-11 h-11 rounded-lg border border-slate-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </button>
      </nav>
    );
  };

  if (!productId) {
    return null;
  }

  const averageRating =
    summary?.averageRating || summary?.average || summary?.avg || 0;
  const totalReviews =
    summary?.totalReviews ||
    summary?.total ||
    summary?.count ||
    summary?.total_count ||
    0;

  return (
    <section className="w-full max-md:mt-10 max-md:max-w-full">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-start text-left gap-2"
      >
        <h2 className="z-10 self-start text-[1.875rem] font-semibold leading-tight text-slate-900">
          Đánh giá sản phẩm
        </h2>
        {open ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {open && (
        <>
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="p-6 mt-6 w-full rounded-lg border border-dashed border-zinc-400 max-md:px-5 max-md:max-w-full">
              <div className="flex gap-5 items-center max-md:flex-col">
                <div className="w-[24%] max-md:ml-0 max-md:w-full">
                  <div className="flex gap-4 items-center max-md:mt-10">
                    <div className="flex flex-col self-stretch my-auto">
                      <p className="text-5xl font-semibold text-slate-900">
                        {averageRating.toFixed(1)}
                      </p>
                      <StarRating rating={Math.round(averageRating)} />
                      <p className="mt-2 text-base leading-relaxed text-neutral-600">
                        từ {totalReviews.toLocaleString("vi-VN")} lượt đánh giá
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                    {ratingDistribution.map((item, index) => (
                      <div
                        key={item.star}
                        className={`flex gap-6 justify-between items-center w-full max-md:max-w-full ${
                          index > 0 ? "mt-3" : ""
                        }`}
                      >
                        <div className="flex gap-1 items-center self-stretch my-auto text-base font-medium leading-relaxed whitespace-nowrap text-neutral-950">
                          <span className="self-stretch my-auto text-neutral-950">
                            {item.star}.0
                          </span>
                          <StarRating rating={1} maxRating={1} />
                        </div>
                        <div className="self-stretch my-auto min-w-60 w-[669px] max-md:max-w-full">
                          <div className="flex flex-col items-start rounded-lg bg-slate-200 max-md:pr-5 max-md:max-w-full">
                            <div
                              className="flex shrink-0 max-w-full h-2 bg-color4 rounded-lg"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="self-stretch my-auto text-base font-medium leading-relaxed text-neutral-950 w-[39px]">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-6 mt-6 w-full max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <aside
                className="flex w-[24%] flex-col box-border bg-white rounded-lg border-dashed border-[0.8px] border-zinc-400 px-6 pt-6 pb-6 max-md:w-full max-sm:rounded-md"
                role="complementary"
                aria-label="Bộ lọc đánh giá sản phẩm"
              >
                <h2 className="text-xl font-semibold tracking-normal leading-7 text-zinc-800 max-sm:text-lg">
                  Lọc đánh giá
                </h2>

                <div className="flex flex-col border-t border-dashed border-gray-300 mt-4 pt-4">
                  <button
                    onClick={() => toggleFilterSection("stars")}
                    className="flex justify-between w-full items-center font-semibold"
                  >
                    <span>Số sao</span>
                    {filterSections.stars ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {filterSections.stars && (
                    <ul className="mt-3 space-y-2">
                      {STAR_OPTIONS.map((star) => (
                        <li key={star} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`star-${star}`}
                            checked={selectedRating === star}
                            onChange={() =>
                              setSelectedRating((prev) =>
                                prev === star ? null : star
                              )
                            }
                            className="w-5 h-5 accent-[#5BC0BE] rounded cursor-pointer"
                          />
                          <label
                            htmlFor={`star-${star}`}
                            className="flex items-center justify-center gap-1 cursor-pointer select-none"
                          >
                            <FaStar className="text-[#FFA439] w-5 h-5" />
                            <span className="text-[#818B9C] font-semibold text-[1.25rem] self-center">
                              {star}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>

              <main className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                <div className="flex z-10 flex-col w-full max-md:mt-10 max-md:max-w-full">
                  <div className="flex gap-5 justify-between w-full max-md:max-w-full flex-wrap">
                    <div className="flex gap-3 text-sm font-medium leading-relaxed text-neutral-900 flex-wrap">
                      {FILTER_TABS.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setActiveFilter(filter.id);
                          }}
                          className={`flex flex-col justify-center px-9 py-2.5 rounded-lg max-md:px-5 ${
                            activeFilter === filter.id
                              ? "font-bold text-white bg-color4"
                              : "border border-solid border-neutral-200 hover:bg-gray-50"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col w-full space-y-8 mt-10">
                    {loading && (
                      <div className="flex justify-center py-10">
                        <p className="text-gray-500">Đang tải đánh giá...</p>
                      </div>
                    )}
                    {!loading && error && (
                      <div className="text-center py-10 text-red-500">
                        {error}
                      </div>
                    )}
                    {!loading && !error && reviews.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                        Chưa có đánh giá nào cho sản phẩm này.
                      </div>
                    )}

                    {!loading &&
                      !error &&
                      reviews.map((review) => {
                        const reviewId = getReviewId(review);
                        const images = Array.isArray(review.images)
                          ? review.images
                          : [];
                        return (
                          <article
                            key={reviewId}
                            className="flex justify-between w-full border-b border-dashed border-gray-300 pb-6 gap-6 flex-col md:flex-row"
                          >
                            <div className="flex flex-col items-start gap-2 flex-1">
                              <StarRating rating={review.rating} />
                              <div className="flex flex-col gap-2">
                                <h4 className="text-lg font-semibold">
                                  {review.title ||
                                    `Đánh giá ${review.rating}/5`}
                                </h4>
                                <p className="text-sm text-slate-600">
                                  {review.content || review.comment}
                                </p>
                                {images[0] && (
                                  <img
                                    src={images[0]}
                                    alt="review media"
                                    className="w-32 h-32 rounded-md object-cover border"
                                  />
                                )}
                                <time className="text-sm text-slate-500">
                                  {formatDate(
                                    review.createdAt ||
                                      review.created_at ||
                                      review.date ||
                                      review.updated_at
                                  )}
                                </time>
                              </div>

                              <div className="flex items-center gap-3 mt-4">
                                <img
                                  src={
                                    review.user?.avatar ||
                                    "https://i.pravatar.cc/80?img=1"
                                  }
                                  alt={review.user?.displayName || "avatar"}
                                  className="w-8 h-8 rounded-full object-cover border border-solid border-neutral-200"
                                />
                                <span className="text-base font-medium">
                                  {review.user?.displayName ||
                                    review.author ||
                                    "Người dùng ẩn danh"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-4">
                              <button
                                onClick={() => handleReaction(review, "like")}
                                disabled={reactionLoading === `${reviewId}-like`}
                                className="flex items-center gap-1 border border-[#E4E9EE] px-3 py-1 rounded-[0.5rem] hover:bg-gray-50 disabled:opacity-60"
                              >
                                {review.isLiked ? (
                                  <BsHandThumbsUpFill className="w-5 h-5 text-[#141414]" />
                                ) : (
                                  <BsHandThumbsUp className="w-5 h-5 text-gray-500" />
                                )}
                                <span>{review.likes ?? 0}</span>
                              </button>

                              <button
                                onClick={() =>
                                  handleReaction(review, "dislike")
                                }
                                disabled={
                                  reactionLoading === `${reviewId}-dislike`
                                }
                                className="flex items-center gap-1 border border-[#E4E9EE] rounded-[0.5rem] px-3 py-1 hover:bg-gray-50 disabled:opacity-60"
                              >
                                {review.isDisliked ? (
                                  <BsHandThumbsDownFill className="w-5 h-5 text-[#141414]" />
                                ) : (
                                  <BsHandThumbsDown className="w-5 h-5 text-gray-500" />
                                )}
                                <span>{review.dislikes ?? 0}</span>
                              </button>
                            </div>
                          </article>
                        );
                      })}
                  </div>

                  {!loading && !error && renderPagination()}
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ReviewSection;

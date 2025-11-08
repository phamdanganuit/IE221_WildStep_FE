import React, { useState } from "react";
import StarRating from "./StarRating";
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

const ReviewSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id === id) {
          if (review.liked) {
            return { ...review, liked: false, likes: review.likes - 1 };
          } else {
            return {
              ...review,
              liked: true,
              disliked: false,
              likes: review.likes + 1,
              dislikes: review.disliked ? review.dislikes - 1 : review.dislikes,
            };
          }
        }
        return review;
      })
    );
  };

  const handleDislike = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) => {
        if (review.id === id) {
          if (review.disliked) {
            return {
              ...review,
              disliked: false,
              dislikes: review.dislikes - 1,
            };
          } else {
            return {
              ...review,
              disliked: true,
              liked: false,
              dislikes: review.dislikes + 1,
              likes: review.liked ? review.likes - 1 : review.likes,
            };
          }
        }
        return review;
      })
    );
  };

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "with-media", label: "Có ảnh / video" },
    { id: "with-description", label: "Có mô tả" },
  ];

  const [reviews, setReviews] = useState([
    {
      id: 1,
      rating: 5,
      title: "Giày cực kỳ êm, giao hàng nhanh",
      content: "Mình đặt tối hôm trước, sáng hôm sau nhận được...",
      author: "Nguyễn Minh Quân",
      date: "Ngày 12/10/2025 02:31 PM",
      avatar: "https://i.pravatar.cc/80?img=1",
      likes: 42,
      dislikes: 1,
      liked: false,
      disliked: false,
      hasMedia: true,
      hasDescription: true,
      image:
        "https://myshoes.vn/image/catalog/2024/blog/huyen/18724/a40ec0660e20be4435ca8ed348b01a90.jpg",
    },
    {
      id: 2,
      rating: 4,
      title: "Ổn trong tầm giá",
      content: "Giày form hơi nhỏ, nên mua lớn hơn 1 size...",
      author: "Lê Trà My",
      date: "Ngày 15/10/2025 11:02 AM",
      avatar: "https://i.pravatar.cc/80?img=2",
      likes: 25,
      dislikes: 3,
      liked: false,
      disliked: false,
      hasMedia: false,
      hasDescription: true,
    },
    {
      id: 3,
      rating: 5,
      title: "Rất hài lòng",
      content: "Hàng giống hình, đóng gói cẩn thận...",
      author: "Đặng Hoàng Tùng",
      date: "Ngày 17/10/2025 06:43 PM",
      avatar: "https://i.pravatar.cc/80?img=3",
      likes: 60,
      dislikes: 0,
      liked: false,
      disliked: false,
      hasMedia: true,
      hasDescription: true,
      image: "https://giaycaosmartmen.com/wp-content/uploads/2020/12/giay-trang-di-voi-tat-mau-gi-3.jpg",
    },
    {
      id: 4,
      rating: 3,
      title: "Ổn nhưng hơi nặng",
      content: "Giày đẹp nhưng đế hơi nặng, đi lâu hơi mỏi...",
      author: "Trần Quỳnh Anh",
      date: "Ngày 20/10/2025 08:11 PM",
      avatar: "https://i.pravatar.cc/80?img=4",
      likes: 11,
      dislikes: 2,
      liked: false,
      disliked: false,
      hasMedia: false,
      hasDescription: true,
    },
    {
      id: 5,
      rating: 4,
      title: "Sản phẩm như mô tả",
      content: "Đóng gói kỹ, nhưng màu hơi khác ảnh...",
      author: "Phạm Gia Huy",
      date: "Ngày 22/10/2025 09:00 AM",
      avatar: "https://i.pravatar.cc/80?img=5",
      likes: 33,
      dislikes: 4,
      liked: false,
      disliked: false,
      hasMedia: false,
      hasDescription: true,
    },
    {
      id: 6,
      rating: 5,
      title: "Best choice luôn!",
      content: "Mình mua tặng bạn trai, ảnh thích lắm...",
      author: "Ngô Bảo Nhi",
      date: "Ngày 24/10/2025 05:15 PM",
      avatar: "https://i.pravatar.cc/80?img=6",
      likes: 78,
      dislikes: 1,
      liked: false,
      disliked: false,
      hasMedia: true,
      hasDescription: true,
      image:
        "https://myshoes.vn/image/catalog/2024/blog/huyen/18724/a40ec0660e20be4435ca8ed348b01a90.jpg",
    },
  ]);

  // Lọc review theo tab
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "with-media") return r.hasMedia;
    if (activeFilter === "with-description") return r.hasDescription;
    return true;
  });

  // Phân trang
const itemsPerPage = 3;
const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
const currentReviews = filteredReviews.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  const [openSections, setOpenSections] = useState({
    stars: true,
    topics: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const starOptions = [5, 4, 3, 2, 1];
  const topicOptions = [
    "Chất lượng sản phẩm",
    "Dịch vụ người bán",
    "Giá tiền",
    "Giao hàng",
  ];
  const [open, setOpen] = useState(true);
  return (
    <section className="w-full max-md:mt-10 max-md:max-w-full">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-start text-left gap-2"
      >
        <h2 className="z-10 self-start text-[1.875rem] font-semibold leading-tight text-slate-900">
          Thông tin chi tiết
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
                    <img
                      src="https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/e5196d901354dd00056ecfe86bac57dccdc7247d?placeholderIfAbsent=true"
                      alt="Overall rating visualization"
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[84px]"
                    />
                    <div className="flex flex-col self-stretch my-auto">
                      <StarRating rating={5} />
                      <p className="mt-2 text-base leading-relaxed text-neutral-600">
                        từ 1,25k lượt đánh giá
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
                    {[
                      { rating: "5.0", width: "w-full", count: "196" },
                      { rating: "4.0", width: "w-[318px]", count: "50" },
                      { rating: "3.0", width: "w-[100px]", count: "4" },
                      { rating: "2.0", width: "w-0", count: "0" },
                      { rating: "1.0", width: "w-0", count: "0" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex gap-6 justify-between items-center w-full max-md:max-w-full ${
                          index > 0 ? "mt-3" : ""
                        }`}
                      >
                        <div className="flex gap-1 items-center self-stretch my-auto text-base font-medium leading-relaxed whitespace-nowrap text-neutral-950">
                          <span className="self-stretch my-auto text-neutral-950">
                            {item.rating}
                          </span>
                          <StarRating rating={1} maxRating={1} />
                        </div>
                        <div className="self-stretch my-auto min-w-60 w-[669px] max-md:max-w-full">
                          <div className="flex flex-col items-start rounded-lg bg-slate-200 max-md:pr-5 max-md:max-w-full">
                            <div
                              className={`flex shrink-0 max-w-full h-2 bg-color4 rounded-lg ${item.width}`}
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
                className="flex w-[24%] flex-col box-border bg-white rounded-lg border-dashed border-[0.8px] border-zinc-400 px-6 pt-6 pb-6 max-md:mx-auto max-md:my-0 max-md:w-full max-sm:mx-auto max-sm:my-0 max-sm:w-full max-sm:rounded-md"
                role="complementary"
                aria-label="Bộ lọc đánh giá sản phẩm"
              >
                <h2 className="text-xl font-semibold tracking-normal leading-7 text-zinc-800 max-sm:text-lg">
                  Lọc đánh giá
                </h2>

                {/* ===== Nhóm: Số sao ===== */}
                <div className="flex flex-col border-t border-dashed border-gray-300 mt-4 pt-4">
                  <button
                    onClick={() => toggleSection("stars")}
                    className="flex justify-between w-full items-center font-semibold"
                  >
                    <span>Số sao</span>
                    {openSections.stars ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {openSections.stars && (
                    <ul className="mt-3 space-y-2">
                      {starOptions.map((star) => (
                        <li key={star} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`star-${star}`}
                            className="w-5 h-5 accent-[#5BC0BE] rounded cursor-pointer"
                          />
                          <label
                            htmlFor={`star-${star}`}
                            className="flex items-center justify-center gap-1 cursor-pointer select-none"
                          >
                            {Array.from({ length: 1 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className="text-[#FFA439] w-5 h-5"
                              />
                            ))}
                            <span className="text-[#818B9C] font-semibold text-[1.25rem] self-center">
                              {star}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                  <button
                    onClick={() => toggleSection("topics")}
                    className="flex justify-between w-full items-center font-semibold"
                  >
                    <span>Chủ đề</span>
                    {openSections.topics ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {openSections.topics && (
                    <ul className="mt-3 space-y-2">
                      {topicOptions.map((topic) => (
                        <li key={topic} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`topic-${topic}`}
                            className="w-5 h-5 accent-[#5BC0BE] rounded cursor-pointer"
                          />
                          <label
                            htmlFor={`topic-${topic}`}
                            className="cursor-pointer select-none text-[#818B9C] font-semibold text-[1.125rem]"
                          >
                            {topic}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>

              <main className="ml-5 w-[76%] max-md:ml-0 max-md:w-full">
                <div className="flex z-10 flex-col w-full max-md:mt-10 max-md:-mr-0.5 max-md:max-w-full">
                  <div className="flex gap-5 justify-between w-full max-md:mr-0.5 max-md:max-w-full">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 text-sm font-medium leading-relaxed text-neutral-900">
                        {filters.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => {
                              setActiveFilter(filter.id);
                              setCurrentPage(1);
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

                      <div className="flex flex-col w-full space-y-8 mt-10 ">
                        {currentReviews.map((review, index) => (
                          <article
                            key={review.id}
                            className="flex justify-between w-full border-b border-dashed border-gray-300 pb-6"
                          >
                            <div className="flex flex-col items-start gap-2">
                              <StarRating rating={review.rating} />
                              <div className="flex flex-col gap-2">
                                <h4 className="text-lg font-semibold">
                                  {review.title}
                                </h4>
                                {review.image && (
                                  <img
                                    src={review.image}
                                    alt="review media"
                                    className="w-32 h-32 rounded-md object-cover border"
                                  />
                                )}
                                <time className="text-sm text-slate-500">
                                  {review.date}
                                </time>
                              </div>

                              {/* Avatar */}
                              <div className="flex items-center gap-3 mt-4">
                                <img
                                  src={review.avatar}
                                  alt="avatar"
                                  className="w-8 h-8 rounded-full object-cover border border-solid border-neutral-200"
                                />
                                <span className="text-base font-medium">
                                  {review.author}
                                </span>
                              </div>
                            </div>

                            {/* Like */}
                            <div className="flex items-center gap-3 mt-4">
                              <button
                                onClick={() => handleLike(review.id)}
                                className="flex items-center gap-1 border border-[#E4E9EE] px-3 py-1 rounded-[0.5rem] hover:bg-gray-50"
                              >
                                {review.liked ? (
                                  <BsHandThumbsUpFill className="w-5 h-5 text-[#141414]" />
                                ) : (
                                  <BsHandThumbsUp className="w-5 h-5 text-gray-500" />
                                )}
                                <span>{review.likes}</span>
                              </button>

                              <button
                                onClick={() => handleDislike(review.id)}
                                className="flex items-center gap-1 border border-[#E4E9EE] rounded-[0.5rem] px-3 py-1 hover:bg-gray-50"
                              >
                                {review.disliked ? (
                                  <BsHandThumbsDownFill className="w-5 h-5 text-[#141414]" />
                                ) : (
                                  <BsHandThumbsDown className="w-5 h-5 text-gray-500" />
                                )}
                                <span>{review.dislikes}</span>
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>

                  <nav
                    className="flex gap-2 self-center mt-7 max-w-full text-sm font-medium leading-relaxed text-center whitespace-nowrap text-neutral-500"
                    aria-label="Review pagination"
                  >
                    {/* Nút Prev */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex justify-center items-center w-11 h-11 rounded-lg border border-slate-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>

                    {/* Sinh danh sách trang động */}
                    {(() => {
                      const pages = [];
                      const totalPages = Math.ceil(
                        filteredReviews.length / itemsPerPage
                      );

                      // Tạo logic hiển thị trang
                      const createRange = (start, end) => {
                        for (let i = start; i <= end; i++) pages.push(i);
                      };

                      if (totalPages <= 7) {
                        createRange(1, totalPages);
                      } else {
                        if (currentPage <= 4) {
                          createRange(1, 5);
                          pages.push("...");
                          pages.push(totalPages);
                        } else if (currentPage >= totalPages - 3) {
                          pages.push(1);
                          pages.push("...");
                          createRange(totalPages - 4, totalPages);
                        } else {
                          pages.push(1);
                          pages.push("...");
                          createRange(currentPage - 1, currentPage + 1);
                          pages.push("...");
                          pages.push(totalPages);
                        }
                      }

                      return pages.map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" && setCurrentPage(page)
                          }
                          disabled={page === "..."}
                          className={`flex justify-center items-center w-11 h-11 rounded-lg border border-solid transition-all ${
                            page === currentPage
                              ? "bg-white border-zinc-800 text-neutral-900"
                              : "border-slate-200 hover:bg-gray-50"
                          } ${page === "..." ? "cursor-default" : ""}`}
                        >
                          {page}
                        </button>
                      ));
                    })()}

                    {/* Nút Next */}
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            p + 1,
                            Math.ceil(filteredReviews.length / itemsPerPage)
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredReviews.length / itemsPerPage)
                      }
                      className="flex justify-center items-center w-11 h-11 rounded-lg border border-slate-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                  </nav>
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

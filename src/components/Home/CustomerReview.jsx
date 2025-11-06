import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { getPublicReviews } from "@/service/contentService";
import { useTranslation } from "react-i18next";
const allReviews = [
  // --- Trang 1 ---
  [
    {
      id: 1,
      name: "Lê Thanh Thảo",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/96ba2f383644f5e9c4cf206089977d8164a0c1c2?placeholderIfAbsent=true",
      review:
        "Giày đi cực kỳ thoải mái, không bị đau chân dù mang cả ngày. Form dáng chuẩn và dễ phối đồ, phù hợp cả đi làm lẫn đi chơi. Dịch vụ chăm sóc khách hàng cũng rất nhiệt tình và chu đáo.",
      rating: 5,
    },
    {
      id: 2,
      name: "Trần Gia Huy",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/5936a2cb315cc4b977be6ec0d078e2cdacdd0dea?placeholderIfAbsent=true",
      review:
        "Mình đặt thử vì thấy mẫu mới, ai ngờ lại mê luôn. Giày mềm, đàn hồi tốt và không bị hầm chân. Từ nay chắc chỉ mua giày của hãng này thôi!",
      rating: 4.5,
    },
  ],
  // --- Trang 2 ---
  [
    {
      id: 3,
      name: "Nguyễn Phương Linh",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/96ba2f383644f5e9c4cf206089977d8164a0c1c2?placeholderIfAbsent=true",
      review:
        "Chất lượng tuyệt vời, giao hàng nhanh. Đôi giày mình nhận còn đẹp hơn cả hình. Rất đáng tiền!",
      rating: 4,
    },
    {
      id: 4,
      name: "Võ Quang Minh",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/96ba2f383644f5e9c4cf206089977d8164a0c1c2?placeholderIfAbsent=true",
      review:
        "Mua đôi thứ ba của hãng rồi, đôi nào cũng bền và dễ vệ sinh. Dịch vụ hỗ trợ cũng rất tốt.",
      rating: 4.5
    },
  ],
  // --- Trang 3 ---
  [
    {
      id: 5,
      name: "Phạm Mỹ Duyên",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/96ba2f383644f5e9c4cf206089977d8164a0c1c2?placeholderIfAbsent=true",
      review:
        "Form đẹp, đi êm chân. Mình thích kiểu thiết kế tối giản, dễ phối đồ. Sẽ tiếp tục ủng hộ!",
      rating: 5,
    },
    {
      id: 6,
      name: "Lưu Đức Thịnh",
      avatar:
        "https://api.builder.io/api/v1/image/assets/7e6ace8706ad423985a91f95c2918220/5936a2cb315cc4b977be6ec0d078e2cdacdd0dea?placeholderIfAbsent=true",
      review:
        "Chất lượng ổn định, đế giày dày và bám tốt. Mình thường mang đi làm cả ngày vẫn rất thoải mái.",
      rating: 4.8,
    },
  ],
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div
      className={`flex items-center gap-1 mt-2 mb-2 text-yellow-400`}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          // Sao đầy
          return (
            <svg
              key={index}
              viewBox="0 0 19 19"
              className="w-[1.5rem] h-[1.5rem]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.5 0L11.6329 6.5643H18.535L12.9511 10.6213L15.084 17.1857L9.5 13.1287L3.91604 17.1857L6.04892 10.6213L0.464963 6.5643H7.36712L9.5 0Z"
                fill="#FFB800"
              />
            </svg>
          );
        } else if (index === fullStars && hasHalfStar) {
          // Nửa sao
          return (
            //
            <svg
              key={index}
              viewBox="0 0 19 19"
              className="w-[1.5rem] h-[1.5rem]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`half-${index}`}>
                  <stop offset="50%" stopColor="#FFB800" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path
                d="M9.5 0L11.6329 6.5643H18.535L12.9511 10.6213L15.084 17.1857L9.5 13.1287L3.91604 17.1857L6.04892 10.6213L0.464963 6.5643H7.36712L9.5 0Z"
                fill={`url(#half-${index})`}
              />
            </svg>
          );
        } else {
          // Sao rỗng
          return (
            <svg
              key={index}
              viewBox="0 0 19 19"
              className="w-[1.5rem] h-[1.5rem]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9.5 0L11.6329 6.5643H18.535L12.9511 10.6213L15.084 17.1857L9.5 13.1287L3.91604 17.1857L6.04892 10.6213L0.464963 6.5643H7.36712L9.5 0Z"
                fill="#E5E7EB"
              />
            </svg>
          );
        }
      })}
    </div>
  );
};

const CustomerReviews = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 1-based UI pagination
  const PAGE_SIZE_UI = 2; // số review hiển thị mỗi trang trên UI
  const [allFetchedReviews, setAllFetchedReviews] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // Bước 1: lấy trang đầu để biết tổng số trang
      const firstRes = await getPublicReviews({ placement: "home", page: 1, page_size: 20 });
      if (!mounted) return;
      if (!firstRes?.success) {
        setAllFetchedReviews([]);
        setLoading(false);
        return;
      }

      const firstPayload = firstRes.data;
      const totalPages = firstPayload?.pagination?.total_pages || 1;

      const mapReviews = (list) => (Array.isArray(list) ? list : []).map((r) => ({
        id: r.id,
        name: r.author_name,
        avatar: r.author_avatar,
        review: r.content,
        rating: r.rating,
        createdAt: r.createdAt || r.created_at || null,
      }));

      const firstPageReviews = mapReviews(firstPayload?.data);

      // Bước 2: nếu còn trang, fetch song song các trang còn lại
      let restReviews = [];
      if (totalPages > 1) {
        const promises = [];
        for (let p = 2; p <= totalPages; p++) {
          promises.push(getPublicReviews({ placement: "home", page: p, page_size: 20 }));
        }
        const results = await Promise.all(promises);
        restReviews = results.flatMap((res) => mapReviews(res?.data?.data));
      }

      setAllFetchedReviews([...firstPageReviews, ...restReviews]);
      setLoading(false);
    })();
    return () => { mounted = false };
  }, []);

  if (loading) return null;
  if (!allFetchedReviews.length) return null;

  const totalPagesUI = Math.max(1, Math.ceil(allFetchedReviews.length / PAGE_SIZE_UI));
  const start = (currentPage - 1) * PAGE_SIZE_UI;
  const end = start + PAGE_SIZE_UI;
  const reviews = allFetchedReviews.slice(start, end);

  return (
    <section className="flex flex-col items-center self-center w-full px-10 md:px-20 mt-12 md:mt-20 bg-transparent max-md:max-w-full">
      <h2 className="text-[#0A1E33] flex items-center justify-center gap-5">
        <span className="font-semibold text-[2rem]">—</span>
        <span className="text-[2.5rem] font-semibold">
          {t('home.customerReviews.title')}
        </span>
        <span className="font-semibold text-[2rem]">—</span>
      </h2>
      <div className="grid grid-cols-2 justify-center gap-8 mt-10 mx-auto">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-[#D9D9D9]/80 text-[#333333] rounded-2xl shadow-md  flex-1 items-center p-8 min-h-[16.5rem]  border-2 border-solid bg-opacity-80 border-neutral-200 flex flex-col sm:flex-row gap-5"
          >
            {/* Avatar */}
              <img
                src={r.avatar}
                alt={r.name}
                className="relative shrink-0 rounded-xl shadow-2xl h-[11.25rem] w-[8.25rem] object-cover"
              />

            {/* Nội dung */}
            <div className="flex-1 text-left self-start text-[#333333]">
              <h3 className="text-[1.25rem] font-medium">{r.name}</h3>
              <StarRating rating={r.rating} />
              <p className="text-[#333333] text-[1.125rem] font-normal leading-relaxed">
                {r.review}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dấu tròn điều hướng */}
      <div className="flex justify-center mt-10 space-x-3">
        {Array.from({ length: totalPagesUI }).map((_, index) => {
          const pageIdx = index + 1;
          const isActive = pageIdx === currentPage;
          return (
            <button
              key={pageIdx}
              onClick={() => setCurrentPage(pageIdx)}
              className={`rounded-full cursor-pointer ${
                isActive
                  ? "bg-[#000000]/75 w-4 h-4 scale-115"
                  : "bg-[#000000]/30 w-4 h-4 hover:bg-[#000000]/60"
              }`}
              aria-label={`${t('home.customerReviews.pageLabel')} ${pageIdx}`}
            ></button>
          );
        })}
      </div>
    </section>
  );
};

export default CustomerReviews;

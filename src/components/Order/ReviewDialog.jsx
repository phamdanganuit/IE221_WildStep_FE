import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";

const MAX_IMAGE_FIELDS = 4;

const ReviewDialog = ({
  open,
  onOpenChange,
  item,
  mode = "create",
  onSubmit,
  loading = false,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([""]);
  const [formError, setFormError] = useState("");

  const headerTitle = mode === "edit" ? "Chỉnh sửa đánh giá" : "Viết đánh giá";

  useEffect(() => {
    if (!open) {
      setRating(5);
      setComment("");
      setImages([""]);
      setFormError("");
      return;
    }

    if (item?.existingReview) {
      setRating(item.existingReview.rating || 5);
      setComment(item.existingReview.comment || "");
      const mappedImages = Array.isArray(item.existingReview.images)
        ? item.existingReview.images.filter(Boolean)
        : [];
      setImages(
        mappedImages.length < MAX_IMAGE_FIELDS
          ? [...mappedImages, ""]
          : mappedImages.slice(0, MAX_IMAGE_FIELDS)
      );
    } else {
      setRating(5);
      setComment("");
      setImages([""]);
    }
    setFormError("");
  }, [open, item]);

  const canAddMoreImages = useMemo(
    () => images.length < MAX_IMAGE_FIELDS,
    [images.length]
  );

  const handleImageChange = (index, value) => {
    setImages((prev) => {
      const clone = [...prev];
      clone[index] = value;
      return clone;
    });
  };

  const handleAddImageField = () => {
    if (!canAddMoreImages) return;
    setImages((prev) => [...prev, ""]);
  };

  const handleSubmit = () => {
    if (!rating || rating < 1 || rating > 5) {
      setFormError("Vui lòng chọn số sao hợp lệ (1-5).");
      return;
    }

    if (!comment.trim()) {
      setFormError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    const filteredImages = images
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    onSubmit?.({
      rating,
      comment: comment.trim(),
      images: filteredImages,
    });
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{headerTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <img
              src={item.product_image}
              alt={item.product_name}
              className="w-20 h-20 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product_name}</p>
              <p className="text-sm text-gray-600">
                Màu: {item.color || "N/A"} • Size: {item.size || "N/A"}
              </p>
              <p className="text-xs text-gray-400">
                Đã mua {item.quantity || 1} sản phẩm
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Số sao</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="flex items-center justify-center"
                  onClick={() => setRating(star)}
                >
                  <FaStar
                    className={`w-7 h-7 ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-gray-600">{rating}/5</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nội dung</Label>
            <Textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Link ảnh (tùy chọn)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddImageField}
                disabled={!canAddMoreImages}
              >
                Thêm ảnh
              </Button>
            </div>
            <div className="space-y-2">
              {images.map((url, idx) => (
                <Input
                  key={`${idx}-${item.order_item_id}`}
                  value={url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="https://..."
                />
              ))}
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-500" role="alert">
              {formError}
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;


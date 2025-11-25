import { useEffect, useMemo, useRef, useState } from "react";
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
import { uploadReviewImages } from "@/service/reviewService";
import { useToast } from "@/contexts/ToastContext";

const MAX_IMAGE_FIELDS = 5;

const ReviewDialog = ({
  open,
  onOpenChange,
  item,
  mode = "create",
  onSubmit,
  loading = false,
}) => {
  const { addToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([""]);
  const [formError, setFormError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const headerTitle = mode === "edit" ? "Chỉnh sửa đánh giá" : "Viết đánh giá";

  useEffect(() => {
    if (!open) {
      setRating(5);
      setComment("");
      setImages([""]);
      setFormError("");
      setUploadError("");
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
    setUploadError("");
  }, [open, item]);

  const actualImages = useMemo(
    () => images.filter((url) => url.trim().length > 0),
    [images]
  );

  const canAddMoreImages = actualImages.length < MAX_IMAGE_FIELDS;

  const handleImageChange = (index, value) => {
    setImages((prev) => {
      const clone = [...prev];
      clone[index] = value;
      const filled = clone.filter((url) => url.trim().length > 0);
      if (
        filled.length < MAX_IMAGE_FIELDS &&
        clone.every((url) => url.trim().length > 0)
      ) {
        clone.push("");
      }
      if (filled.length === 0 && clone.length === 0) {
        return [""];
      }
      return clone;
    });
  };

  const handleAddImageField = () => {
    if (!canAddMoreImages) return;
    setImages((prev) => {
      const hasEmpty = prev.some((url) => !url || url.trim().length === 0);
      if (hasEmpty) return prev;
      return [...prev, ""].slice(0, MAX_IMAGE_FIELDS);
    });
  };

  const mergeUploadedImages = (newUrls = []) => {
    if (!Array.isArray(newUrls) || newUrls.length === 0) return;
    setImages((prev) => {
      let next = [...prev];
      for (const rawUrl of newUrls) {
        const normalized = String(rawUrl || "").trim();
        if (!normalized) continue;
        const alreadyExists = next.some(
          (value) => value.trim() === normalized
        );
        if (alreadyExists) continue;
        const emptyIndex = next.findIndex(
          (value) => !value || value.trim().length === 0
        );
        if (emptyIndex !== -1) {
          next[emptyIndex] = normalized;
          continue;
        }
        if (next.length < MAX_IMAGE_FIELDS) {
          next = [...next, normalized];
        }
      }

      const filled = next.filter((url) => url.trim().length > 0);
      if (
        filled.length < MAX_IMAGE_FIELDS &&
        next.every((url) => url.trim().length > 0)
      ) {
        next = [...next, ""];
      }
      const limited =
        next.length > MAX_IMAGE_FIELDS
          ? next.slice(0, MAX_IMAGE_FIELDS)
          : next;
      return limited.length === 0 ? [""] : limited;
    });
  };

  const handleTriggerUpload = () => {
    if (!canAddMoreImages) {
      setUploadError(`Chỉ được thêm tối đa ${MAX_IMAGE_FIELDS} ảnh.`);
      return;
    }
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGE_FIELDS - actualImages.length;
    if (remainingSlots <= 0) {
      setUploadError(`Chỉ được thêm tối đa ${MAX_IMAGE_FIELDS} ảnh.`);
      return;
    }

    const allowedFiles = files.slice(0, remainingSlots);
    setUploading(true);
    setUploadError("");

    const result = await uploadReviewImages(allowedFiles);

    setUploading(false);

    if (!result.success) {
      setUploadError(result.error || "Không thể tải ảnh, vui lòng thử lại.");
      return;
    }

    const uploadedUrls = Array.isArray(result.images)
      ? result.images
      : Array.isArray(result.data?.images)
        ? result.data.images
        : [];

    if (!uploadedUrls.length) {
      setUploadError("Hệ thống không trả về URL ảnh hợp lệ.");
      return;
    }

    mergeUploadedImages(uploadedUrls);
    addToast({
      type: "success",
      message: `Đã tải ${uploadedUrls.length} ảnh thành công.`,
    });
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

    const filteredImages = Array.from(
      new Set(
        images
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      )
    ).slice(0, MAX_IMAGE_FIELDS);

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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Ảnh đính kèm (tối đa {MAX_IMAGE_FIELDS})</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTriggerUpload}
                  disabled={!canAddMoreImages || uploading}
                >
                  {uploading ? "Đang tải..." : "Tải ảnh"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddImageField}
                  disabled={!canAddMoreImages}
                >
                  Thêm link
                </Button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFilesSelected}
            />
            {uploadError && (
              <p className="text-sm text-red-500" role="alert">
                {uploadError}
              </p>
            )}
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
            {actualImages.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {actualImages.map((url, idx) => (
                  <img
                    key={`${url}-${idx}`}
                    src={url}
                    alt="Ảnh đánh giá"
                    className="w-16 h-16 rounded-md object-cover border"
                  />
                ))}
              </div>
            )}
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


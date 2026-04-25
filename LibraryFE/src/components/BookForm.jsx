import { useMemo, useState } from "react";

const defaultValues = {
  title: "",
  author: "",
  category: "",
  publisher: "",
  publishedYear: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

function isValidHttpUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true;
  if (!/^https?:\/\//i.test(trimmed)) return false;

  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

function BookForm({
  initialValues,
  onSubmit,
  submitLabel,
  busy = false,
  serverErrors = {},
  clearServerError,
}) {
  const mergedInitialValues = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues]
  );

  const [formData, setFormData] = useState(mergedInitialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (clearServerError) {
      clearServerError(name);
    }
  };

  const validate = () => {
    const nextErrors = {};

    const title = formData.title.trim();
    const author = formData.author.trim();
    const category = formData.category.trim();
    const publisher = formData.publisher.trim();
    const description = formData.description.trim();

    if (!title) nextErrors.title = "Tên sách là bắt buộc";
    else if (title.length < 2) nextErrors.title = "Tên sách phải có ít nhất 2 ký tự";
    else if (title.length > 150) nextErrors.title = "Tên sách không được vượt quá 150 ký tự";

    if (!author) nextErrors.author = "Tác giả là bắt buộc";
    else if (author.length < 2) nextErrors.author = "Tác giả phải có ít nhất 2 ký tự";
    else if (author.length > 120) nextErrors.author = "Tác giả không được vượt quá 120 ký tự";

    if (!category) nextErrors.category = "Thể loại là bắt buộc";
    else if (category.length > 80) nextErrors.category = "Thể loại không được vượt quá 80 ký tự";

    if (!publisher) nextErrors.publisher = "Nhà xuất bản là bắt buộc";
    else if (publisher.length > 120) nextErrors.publisher = "Nhà xuất bản không được vượt quá 120 ký tự";

    const publishedYear = Number(formData.publishedYear);
    const yearText = String(formData.publishedYear ?? "").trim();
    const currentYear = new Date().getFullYear();
    if (!yearText || Number.isNaN(publishedYear) || !Number.isInteger(publishedYear)) {
      nextErrors.publishedYear = "Năm xuất bản phải là số nguyên";
    } else if (publishedYear < 1000 || publishedYear > currentYear + 1) {
      nextErrors.publishedYear = `Năm xuất bản phải trong khoảng 1000 - ${currentYear + 1}`;
    }

    const quantity = Number(formData.quantity);
    const quantityText = String(formData.quantity ?? "").trim();
    if (quantityText === "" || Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
      nextErrors.quantity = "Số lượng phải là số nguyên >= 0";
    }

    if (!description) nextErrors.description = "Mô tả là bắt buộc";
    else if (description.length < 10) nextErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    else if (description.length > 2000) nextErrors.description = "Mô tả không được vượt quá 2000 ký tự";

    if (!isValidHttpUrl(formData.imageUrl)) {
      nextErrors.imageUrl = "Đường dẫn ảnh phải là URL hợp lệ (http/https)";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const title = formData.title.trim();
    const author = formData.author.trim();
    const category = formData.category.trim();
    const publisher = formData.publisher.trim();
    const description = formData.description.trim();

    onSubmit({
      ...formData,
      publishedYear: Number(formData.publishedYear),
      quantity: Number(formData.quantity),
      title,
      author,
      category,
      publisher,
      description,
      imageUrl: formData.imageUrl.trim(),
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          <span>Tên sách</span>
          <input name="title" value={formData.title} onChange={handleChange} />
          {(errors.title || serverErrors.title) && <small>{errors.title || serverErrors.title}</small>}
        </label>

        <label>
          <span>Tác giả</span>
          <input name="author" value={formData.author} onChange={handleChange} />
          {(errors.author || serverErrors.author) && <small>{errors.author || serverErrors.author}</small>}
        </label>

        <label>
          <span>Thể loại</span>
          <input name="category" value={formData.category} onChange={handleChange} />
          {(errors.category || serverErrors.category) && <small>{errors.category || serverErrors.category}</small>}
        </label>

        <label>
          <span>Nhà xuất bản</span>
          <input name="publisher" value={formData.publisher} onChange={handleChange} />
          {(errors.publisher || serverErrors.publisher) && <small>{errors.publisher || serverErrors.publisher}</small>}
        </label>

        <label>
          <span>Năm xuất bản</span>
          <input
            name="publishedYear"
            type="number"
            min="0"
            value={formData.publishedYear}
            onChange={handleChange}
          />
          {(errors.publishedYear || serverErrors.publishedYear) && (
            <small>{errors.publishedYear || serverErrors.publishedYear}</small>
          )}
        </label>

        <label>
          <span>Số lượng</span>
          <input
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
          />
          {(errors.quantity || serverErrors.quantity) && <small>{errors.quantity || serverErrors.quantity}</small>}
        </label>

        <label className="full-width">
          <span>Đường dẫn ảnh</span>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          {(errors.imageUrl || serverErrors.imageUrl) && <small>{errors.imageUrl || serverErrors.imageUrl}</small>}
        </label>

        <label className="full-width">
          <span>Mô tả</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
          {(errors.description || serverErrors.description) && (
            <small>{errors.description || serverErrors.description}</small>
          )}
        </label>
      </div>

      <button className="btn primary" type="submit" disabled={busy}>
        {busy ? "Đang xử lý..." : submitLabel}
      </button>
    </form>
  );
}

export default BookForm;

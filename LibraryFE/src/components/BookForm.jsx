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

    if (!formData.title.trim()) nextErrors.title = "Tên sách là bắt buộc";
    if (!formData.author.trim()) nextErrors.author = "Tác giả là bắt buộc";
    if (!formData.category.trim()) nextErrors.category = "Thể loại là bắt buộc";
    if (!formData.publisher.trim()) nextErrors.publisher = "Nhà xuất bản là bắt buộc";

    const publishedYear = Number(formData.publishedYear);
    if (!formData.publishedYear || Number.isNaN(publishedYear)) {
      nextErrors.publishedYear = "Năm xuất bản không hợp lệ";
    }

    const quantity = Number(formData.quantity);
    if (formData.quantity === "" || Number.isNaN(quantity) || quantity < 0) {
      nextErrors.quantity = "Số lượng phải là số >= 0";
    }

    if (!formData.description.trim()) nextErrors.description = "Mô tả là bắt buộc";

    if (formData.imageUrl && !/^https?:\/\//i.test(formData.imageUrl.trim())) {
      nextErrors.imageUrl = "Đường dẫn ảnh phải bắt đầu bằng http:// hoặc https://";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      publishedYear: Number(formData.publishedYear),
      quantity: Number(formData.quantity),
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category.trim(),
      publisher: formData.publisher.trim(),
      description: formData.description.trim(),
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

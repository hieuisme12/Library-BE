const DEFAULT_ERROR_MESSAGE = "Có lỗi xảy ra. Vui lòng thử lại.";

function toCamelCase(key) {
    return key.replace(/[_-](\w)/g, (_, character) => character.toUpperCase());
}

function toFieldName(path = "") {
    if (typeof path !== "string") {
        return "";
    }

    const normalized = path
        .replace(/\[(\d+)\]/g, ".$1")
        .replace(/^\./, "")
        .trim();

    if (!normalized) {
        return "";
    }

    const lastSegment = normalized.split(".").filter(Boolean).pop() || normalized;
    return lastSegment;
}

export function normalizeFieldErrors(fieldErrors) {
    if (!fieldErrors) {
        return {};
    }

    if (Array.isArray(fieldErrors)) {
        return fieldErrors.reduce((result, item) => {
            if (!item || typeof item !== "object") {
                return result;
            }

            const rawField =
                item.field ??
                item.fieldName ??
                item.name ??
                item.path ??
                item.propertyPath ??
                item.param;
            const rawMessage =
                item.defaultMessage ??
                item.message ??
                item.error ??
                item.reason;

            const field = toCamelCase(toFieldName(String(rawField ?? "")));
            const message = typeof rawMessage === "string" ? rawMessage : "";

            if (field && message && !result[field]) {
                result[field] = message;
            }

            return result;
        }, {});
    }

    if (typeof fieldErrors !== "object") {
        return {};
    }

    return Object.entries(fieldErrors).reduce((result, [key, value]) => {
        result[toCamelCase(key)] = Array.isArray(value) ? value[0] : value;
        return result;
    }, {});
}

export function getApiErrorDetails(error) {
    const response = error ?.response;
    const data = response ?.data;
    const status = response ?.status;
    const fieldErrors = normalizeFieldErrors(
        data ?.fieldErrors ??
            data ?.errors ??
            data ?.violations ??
            data ?.validationErrors
    );

    let message = DEFAULT_ERROR_MESSAGE;

    if (typeof data === "string") {
        message = data;
    } else {
        message =
            data ?.message ||
            data ?.error_description ||
            data ?.error ||
            data ?.title ||
            data ?.detail ||
            error ?.message ||
            DEFAULT_ERROR_MESSAGE;
    }

    if (!data ?.message) {
        if (status === 400 && Object.keys(fieldErrors).length > 0) {
            message = "Vui lòng kiểm tra lại thông tin nhập.";
        } else if (status === 401) {
            message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (status === 403) {
            message = "Bạn không có quyền thực hiện thao tác này.";
        } else if (status === 404) {
            message = "Không tìm thấy dữ liệu.";
        }
    }

    return {
        status,
        message,
        fieldErrors,
    };
}

export function normalizeError(error) {
    return getApiErrorDetails(error).message;
}
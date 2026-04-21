const DEFAULT_ERROR_MESSAGE = "Có lỗi xảy ra. Vui lòng thử lại.";

function toCamelCase(key) {
    return key.replace(/[_-](\w)/g, (_, character) => character.toUpperCase());
}

export function normalizeFieldErrors(fieldErrors) {
    if (!fieldErrors || typeof fieldErrors !== "object") {
        return {};
    }

    return Object.entries(fieldErrors).reduce((result, [key, value]) => {
        result[toCamelCase(key)] = Array.isArray(value) ? value[0] : value;
        return result;
    }, {});
}

export function getApiErrorDetails(error) {
    const response = error ? .response;
    const data = response ? .data;
    const status = response ? .status;
    const fieldErrors = normalizeFieldErrors(data ? .fieldErrors ? ? data ? .errors);

    let message = data ? .message || error ? .message || DEFAULT_ERROR_MESSAGE;

    if (!data ? .message) {
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
/**
 * Formats a number with thousand separators.
 * Example: 1000000 -> "1.000.000"
 */
export const formatNumber = (value: number | string): string => {
  if (value === undefined || value === null || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parses a formatted string back to a number.
 * Example: "1.000.000" -> 1000000
 */
export const parseNumber = (value: string): number => {
  if (!value) return 0;
  const cleanValue = value.replace(/\./g, '').replace(/,/g, '.');
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num;
};

/**
 * Formats error responses from backend, translates validation errors.
 */
export const getErrorMessage = (error: any, t: any): string => {
  const message = error?.response?.data?.message || error?.message || 'Unknown error';
  
  const translateSingle = (msg: string): string => {
    if (typeof msg !== 'string') return String(msg);
    const key = `errors.${msg}`;
    const translated = t(key, msg);
    // If translation key is returned or it matches the key, fallback to direct translations or standard messages
    if (translated === key || translated === msg) {
      // Inline translations for fallback
      const standardErrors: Record<string, string> = {
        "email must be an email": t("errors.email_invalid", "Email không đúng định dạng"),
        "email must be a string": t("errors.email_string", "Email phải là chuỗi ký tự"),
        "name should not be empty": t("errors.name_empty", "Tên không được để trống"),
        "name must be a string": t("errors.name_string", "Tên phải là chuỗi ký tự"),
        "phone must be a phone number": t("errors.phone_invalid", "Số điện thoại không hợp lệ"),
        "phone should not be empty": t("errors.phone_empty", "Số điện thoại không được để trống"),
        "password must be longer than or equal to 6 characters": t("errors.password_length", "Mật khẩu phải từ 6 ký tự trở lên"),
        "Email already exists": t("errors.email_exists", "Email đã tồn tại"),
        "Branch not found": t("errors.branch_not_found", "Không tìm thấy chi nhánh"),
        "User not found": t("errors.user_not_found", "Không tìm thấy người dùng"),
        "Unauthorized": t("errors.unauthorized", "Không có quyền truy cập hoặc phiên đã hết hạn"),
        "Forbidden resource": t("errors.forbidden", "Bạn không có quyền thực hiện thao tác này"),
        "Internal server error": t("errors.internal_error", "Lỗi máy chủ nội bộ")
      };
      return standardErrors[msg] || msg;
    }
    return translated;
  };

  if (Array.isArray(message)) {
    return message.map(translateSingle).join('\n');
  }
  return translateSingle(message);
};


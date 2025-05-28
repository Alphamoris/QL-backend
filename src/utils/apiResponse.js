class ApiResponse {
  constructor(success, message, data = null, meta = {}) {
    this.success = success;
    this.message = message;
    if (data) this.data = data;
    if (Object.keys(meta).length > 0) this.meta = meta;
  }

  static success(message, data, meta = {}) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message, data = null, meta = {}) {
    return new ApiResponse(false, message, data, meta);
  }
}

module.exports = ApiResponse; 
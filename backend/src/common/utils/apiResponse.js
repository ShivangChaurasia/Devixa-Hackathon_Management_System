export class ApiResponse {
  static success(res, message = 'Operation successful', data = null, statusCode = 200, meta = null) {
    const payload = {
      success: true,
      statusCode,
      message,
      data,
    };
    if (meta) payload.meta = meta;
    return res.status(statusCode).json(payload);
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return this.success(res, message, data, 201);
  }

  static noContent(res) {
    return res.status(204).send();
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const payload = {
      success: false,
      statusCode,
      message,
    };
    if (errors) payload.errors = errors;
    return res.status(statusCode).json(payload);
  }
}

class ApiError extends Error {

  public code: string;

  constructor(code, ...args) {
    super(...args);
    this.code = code;
  }

}

export default ApiError;

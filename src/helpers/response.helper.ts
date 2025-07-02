interface ErrorResponse {
  code: string;
  message: string;
}

export const returnError = (
  statusCode: number,
  error: ErrorResponse = { code: '', message: '' },
  data: any = null
) => {
  return {
    statusCode,
    response: {
      status: statusCode,
      data,
      error,
    },
  };
};

export const returnSuccess = (statusCode: number, data: any = {}) => {
  return {
    statusCode,
    response: {
      status: statusCode,
      data,
      error: null,
    },
  };
};

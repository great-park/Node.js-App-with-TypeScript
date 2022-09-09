interface Response {
  isSuccess: boolean;
  code: number;
  message: string;
}

export const response = (
  { isSuccess, code, message }: Response,
  result: any
) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
    result: result,
  };
};

export const errResponse = ({ isSuccess, code, message }: Response) => {
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
  };
};

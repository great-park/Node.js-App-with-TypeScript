export const message = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: '성공' },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: 'token is empty',
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: 'Fail to verify token',
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1001,
    message: 'success to verify token',
  }, // ?

  //Request error
  SIGNUP_USER_ALREADY_EXISTS: {
    isSuccess: false,
    code: 2001,
    message: 'user already exists',
  },

  SIGNIN_EMAIL_NOT_EXISTS: {
    isSuccess: false,
    code: 2002,
    message: 'email does not exist',
  },

  SIGNIN_EMAIL_PASSWORD_INVALID: {
    isSuccess: false,
    code: 2003,
    message: 'invalid email or password',
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 4000, message: '데이터 베이스 에러' },
  SERVER_ERROR: { isSuccess: false, code: 4001, message: '서버 에러' },
};

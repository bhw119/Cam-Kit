import jwt from 'jsonwebtoken';

const TOKEN_EXPIRES_IN = '7d';

export const createAuthToken = (payload) => {
  const { JWT_SECRET = '' } = process.env;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
};

export const verifyAuthToken = (token) => {
  const { JWT_SECRET = '' } = process.env;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }

  return jwt.verify(token, JWT_SECRET);
};


import { verifyAuthToken } from '../utils/token.js';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '인증 정보가 없습니다.' });
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error('인증 실패:', error);
    return res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};


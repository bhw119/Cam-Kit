import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { createAuthToken } from '../utils/token.js';
import { isAdminUser } from '../utils/admin.js';

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
    }

    const user = await User.create({ name, email, password });
    const token = createAuthToken({ id: user._id });

    setAuthCookie(res, token);

    const isAdmin = isAdminUser(user.email);

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = createAuthToken({ id: user._id });
    setAuthCookie(res, token);

    const isAdmin = isAdminUser(user.email);

    return res.json({
      message: '로그인 성공',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    return res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('auth_token');
  return res.json({ message: '로그아웃되었습니다.' });
};

export const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: '인증되지 않은 요청입니다.' });
  }

  return res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      isAdmin: isAdminUser(req.user.email),
    },
  });
};


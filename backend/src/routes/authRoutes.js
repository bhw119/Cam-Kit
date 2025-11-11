import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('이름을 입력해주세요.'),
    body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('비밀번호는 최소 8자 이상이어야 합니다.'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  ],
  login
);

router.post('/logout', logout);
router.get('/me', requireAuth, getProfile);

export default router;


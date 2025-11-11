import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  listMyOrders,
  listAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('최소 1개 이상의 상품이 필요합니다.'),
    body('items.*.productId')
      .isMongoId()
      .withMessage('유효한 상품 ID가 필요합니다.'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('수량은 1 이상의 정수여야 합니다.'),
    body('pickupSlot')
      .optional()
      .isString()
      .withMessage('수령 시간대는 문자열이어야 합니다.'),
  ],
  createOrder
);

router.get('/me', requireAuth, listMyOrders);
router.get('/', requireAuth, requireAdmin, listAllOrders);

router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  [
    body('status')
      .isIn(['pending', 'ready', 'completed', 'cancelled'])
      .withMessage('유효한 상태가 아닙니다.'),
  ],
  updateOrderStatus
);

export default router;


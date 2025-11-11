import { Router } from 'express';
import { body } from 'express-validator';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);

router.post(
  '/',
  requireAuth,
  [
    body('name').notEmpty().withMessage('상품명을 입력해주세요.'),
    body('price').isNumeric().withMessage('가격은 숫자여야 합니다.'),
    body('quantity').isInt({ min: 0 }).withMessage('수량은 0 이상의 정수여야 합니다.'),
  ],
  createProduct
);

router.put(
  '/:id',
  requireAuth,
  [
    body('name').optional().notEmpty().withMessage('상품명을 입력해주세요.'),
    body('price')
      .optional()
      .isNumeric()
      .withMessage('가격은 숫자여야 합니다.'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('수량은 0 이상의 정수여야 합니다.'),
  ],
  updateProduct
);

router.delete('/:id', requireAuth, deleteProduct);

export default router;


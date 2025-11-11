import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, pickupSlot } = req.body;

    const populatedItems = await Promise.all(
      items.map(async ({ productId, quantity }) => {
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
          throw new Error(`상품을 찾을 수 없습니다: ${productId}`);
        }
        if (product.quantity < quantity) {
          throw new Error(`${product.name} 재고가 부족합니다.`);
        }

        product.quantity -= quantity;
        await product.save();

        return {
          product: product._id,
          quantity,
          price: product.price,
        };
      })
    );

    const totalPrice = populatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: populatedItems,
      totalPrice,
      pickupSlot,
    });

    const createdOrder = await order.populate([
      { path: 'items.product', select: 'name price' },
      { path: 'user', select: 'name email' },
    ]);

    return res.status(201).json({
      message: '주문이 생성되었습니다.',
      order: createdOrder,
    });
  } catch (error) {
    console.error('주문 생성 실패:', error);
    return res.status(400).json({ message: error.message || '주문 생성 중 오류가 발생했습니다.' });
  }
};

export const listMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (error) {
    console.error('주문 조회 실패:', error);
    return res.status(500).json({ message: '주문 목록을 불러오지 못했습니다.' });
  }
};

export const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (error) {
    console.error('전체 주문 조회 실패:', error);
    return res.status(500).json({ message: '주문 목록을 불러오지 못했습니다.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate([
      { path: 'items.product', select: 'name price' },
      { path: 'user', select: 'name email' },
    ]);

    if (!order) {
      return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
    }

    return res.json({ message: '주문 상태가 업데이트되었습니다.', order });
  } catch (error) {
    console.error('주문 상태 변경 실패:', error);
    return res.status(500).json({ message: '주문 상태 변경 중 오류가 발생했습니다.' });
  }
};


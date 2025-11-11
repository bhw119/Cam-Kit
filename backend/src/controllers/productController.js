import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ products });
  } catch (error) {
    console.error('상품 조회 실패:', error);
    return res.status(500).json({ message: '상품 목록을 불러오지 못했습니다.' });
  }
};

export const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: '상품이 등록되었습니다.', product });
  } catch (error) {
    console.error('상품 등록 실패:', error);
    return res.status(500).json({ message: '상품 등록 중 오류가 발생했습니다.' });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    return res.json({ message: '상품이 수정되었습니다.', product });
  } catch (error) {
    console.error('상품 수정 실패:', error);
    return res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    return res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    return res.status(500).json({ message: '상품 삭제 중 오류가 발생했습니다.' });
  }
};


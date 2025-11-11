import Product from '../models/Product.js';

export const seedDefaultProducts = async () => {
  const defaultProducts = [
    { name: '양파', price: 500, quantity: 10, description: '신선한 양파' },
    { name: '대파', price: 600, quantity: 12, description: '향이 좋은 대파' },
    { name: '감자', price: 700, quantity: 15, description: '강원도 감자' },
  ];

  const existing = await Product.countDocuments();
  if (existing > 0) {
    return;
  }

  await Product.insertMany(defaultProducts);
  console.log('기본 상품 데이터가 등록되었습니다.');
};


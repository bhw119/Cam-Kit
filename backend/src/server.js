import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDatabase from './config/database.js';
import { seedDefaultProducts } from './utils/seedProducts.js';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDatabase();

  if (process.env.SEED_PRODUCTS === 'true') {
    await seedDefaultProducts();
  }

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('서버 시작 실패:', error);
  process.exit(1);
});


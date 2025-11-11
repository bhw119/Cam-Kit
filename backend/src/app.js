import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';

const app = express();

const { CLIENT_URL = 'http://localhost:5173' } = process.env;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    message: 'CampusPick API',
    endpoints: ['/api/auth', '/api/products'],
  });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: '요청하신 경로를 찾을 수 없습니다.' });
});

app.use((err, req, res, next) => {
  console.error('서버 오류:', err);
  res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
});

export default app;


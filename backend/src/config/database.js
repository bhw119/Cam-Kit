import mongoose from 'mongoose';

const connectDatabase = async () => {
  const { MONGODB_URI = '', MONGODB_DB_NAME = '' } = process.env;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    const options = {};
    if (MONGODB_DB_NAME) {
      options.dbName = MONGODB_DB_NAME;
    }

    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

export default connectDatabase;


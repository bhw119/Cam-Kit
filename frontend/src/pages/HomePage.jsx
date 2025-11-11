import { Link } from 'react-router-dom';

const HomePage = () => (
  <section className="page">
    <div className="page__header">
      <h1>캠퍼스픽 공동구매 플랫폼</h1>
      <p className="page__subtitle">
        오늘의 공동구매 상품을 확인하고 빠르게 수령하세요. 로그인 후 바로 주문할 수 있습니다.
      </p>
    </div>
    <div className="card card--highlight">
      <h2>빠른 시작</h2>
      <ol className="feature-list">
        <li>회원가입 후 로그인</li>
        <li>상품 목록에서 원하는 상품을 장바구니에 담아 주문</li>
        <li>관리자 알림에 따라 스마트 보관함에서 수령</li>
      </ol>
      <div className="page__actions">
        <Link to="/products" className="button button--primary">
          상품 둘러보기
        </Link>
        <Link to="/register" className="button button--secondary">
          회원가입
        </Link>
      </div>
    </div>
  </section>
);

export default HomePage;


const Loader = ({ message = '로딩 중입니다...' }) => (
  <div className="status-message">
    <span className="loader" aria-hidden />
    <span>{message}</span>
  </div>
);

export default Loader;


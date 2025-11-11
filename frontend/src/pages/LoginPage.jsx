import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import ErrorAlert from '../components/ErrorAlert';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate('/products');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="page page--narrow">
      <div className="page__header">
        <h1>로그인</h1>
        <p className="page__subtitle">이메일과 비밀번호를 입력해주세요.</p>
      </div>

      <ErrorAlert message={error} />

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="page__footer-text">
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </p>
    </section>
  );
};

export default LoginPage;


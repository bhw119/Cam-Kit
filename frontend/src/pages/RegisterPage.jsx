import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import ErrorAlert from '../components/ErrorAlert';
import { register as registerApi } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await registerApi(form);
      setUser(user);
      navigate('/products');
    } catch (err) {
      const message = err.response?.data?.message || '회원가입에 실패했습니다.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page page--narrow">
      <div className="page__header">
        <h1>회원가입</h1>
        <p className="page__subtitle">
          캠퍼스 공동구매를 편리하게 이용하려면 기본 정보를 입력해주세요.
        </p>
      </div>

      <ErrorAlert message={error} />

      <form className="form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
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
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="button button--primary" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <p className="page__footer-text">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </section>
  );
};

export default RegisterPage;


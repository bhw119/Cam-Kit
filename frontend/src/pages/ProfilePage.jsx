import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { user, loadProfile, loading } = useAuthStore();

  useEffect(() => {
    if (!user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  if (loading && !user) {
    return <Loader />;
  }

  if (!user) {
    return <div className="status-message">사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <section className="page page--narrow">
      <div className="page__header">
        <h1>내 프로필</h1>
        <p className="page__subtitle">계정 정보를 확인하세요.</p>
      </div>

      <div className="panel">
        <div className="panel__header">
          <h2>기본 정보</h2>
        </div>
        <div className="panel__content">
          <dl className="description-list">
            <div>
              <dt>이름</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>이메일</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>권한</dt>
              <dd>{user.isAdmin ? '관리자' : '일반 사용자'}</dd>
            </div>
            <div>
              <dt>가입일</dt>
              <dd>{new Date(user.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;


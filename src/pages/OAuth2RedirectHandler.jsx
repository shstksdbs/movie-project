// src/pages/OAuth2RedirectHandler.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // 필요하다면 토큰으로 사용자 정보 조회
      navigate('/');
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>로그인 처리 중...</div>;
}
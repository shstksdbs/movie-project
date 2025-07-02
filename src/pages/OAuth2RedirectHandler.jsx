import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    console.log('OAuth2RedirectHandler 마운트됨', location.search);
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      // 소셜 로그인 후 현재 유저 정보 받아오기
      fetch('http://localhost:80/api/current-user', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          navigate('/');
        });
    } else {
      alert('로그인에 실패했습니다.');
      navigate('/login');
    }
  }, [location, navigate, setUser]);

  return <div>로그인 처리 중...</div>;
}
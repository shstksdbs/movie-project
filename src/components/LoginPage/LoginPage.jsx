import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';

import logo from '../../assets/logo_icon.png';
import googleIcon from '../../assets/google_logo.png';
import naverIcon from '../../assets/naver_logo.png';
import kakaoIcon from '../../assets/kakao_logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get('message');
    if (msg) {
      setErrorMessage(decodeURIComponent(msg));
      // 2초 후 메시지 사라지고 URL에서 쿼리스트링 제거
      setTimeout(() => {
        setErrorMessage('');
        navigate('/login', { replace: true });
      }, 2000);
    }
  }, [location, navigate]);

  const handleFilmerLogin = () => {
    // 자체 ID/PW 로그인 폼으로 이동
    navigate('/loginform');
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost/oauth2/authorization/${provider}`;
  };

  return (
    <div className={styles.outer}>
      <h2 className={styles.heading}>반가워요!<br></br>계정을선택해주세요.</h2>
      {/* 에러 메시지 표시 */}
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '16px', fontWeight: 'bold' }}>{errorMessage}</div>
      )}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={handleFilmerLogin}
        >
          <img src={logo} alt="" />
          <span className={styles.btnText}>Filmer ID로 시작하기</span>
        </button>

        <button
          type="button"
          className={styles.btnSocial}
          onClick={() => handleSocialLogin('google')}
        >
          <img src={googleIcon} alt="Google" />
          <span className={styles.btnText}>구글로 시작하기</span>
        </button>

        <button
          type="button"
          className={styles.btnSocial}
          onClick={() => handleSocialLogin('naver')}
        >
          <img src={naverIcon} alt="Naver" />
          <span className={styles.btnText}>네이버로 시작하기</span>

        </button>

        <button
          type="button"
          className={styles.btnSocial}
          onClick={() => handleSocialLogin('kakao')}
        >
          <img src={kakaoIcon} alt="Kakao" />
          <span className={styles.btnText}>카카오로 시작하기</span>

        </button>
      </div>

      <div className={styles.findRow}>
        <span>아이디/비밀번호를 잊으셨나요?</span>
        <Link to="/find-id" className={styles.findLink}>아이디 찾기</Link>
        <Link to="/find-password" className={styles.findLink}>비밀번호 찾기</Link>
      </div>
    </div>
  );
}

// src/components/FilmerLoginPage/FilmerLoginPage.jsx
import React, { useState } from 'react';
import styles from './FilmerLoginPage.module.css';
import eyeOpen from '../../assets/eye_icon.png';
import eyeClosed from '../../assets/closedeye_icon.png';
import checkFalse from '../../assets/check_false.png';
import checkTrue from '../../assets/check_true.png';
import { useNavigate } from 'react-router-dom';

export default function FilmerLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: 로그인 로직 연결
  };

  const handleLogin = () => {
    // 자체 ID/PW 로그인 폼으로 이동
    navigate('/login');
  };

  return (
    <div className={styles.outer}>
      <h1 className={styles.title}>Filmer ID 로그인</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            name="username"
            type="text"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            name="password"
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
            className={styles.input}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPw(v => !v)}
          >
            <img
              src={showPw ? eyeOpen : eyeClosed}
              alt={showPw ? "비밀번호 숨김" : "비밀번호 표시"}
              className={styles.eyeIcon}
            />
          </button>
        </div>

        <label
          className={styles.autoLogin}
          onClick={() => setAutoLogin(v => !v)}
        >
          <img
            src={autoLogin ? checkTrue : checkFalse}
            alt="자동 로그인"
            className={styles.checkIcon}
          />
          <span>자동 로그인</span>
        </label>

        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={!(form.username && form.password)}
        >
          로그인하기
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={handleLogin}>
          계정선택으로 돌아가기
        </button>
      </form>

      <div className={styles.links}>
        <a href="/find-id">아이디 찾기</a><span>|</span>
        <a href="/find-pw">비밀번호 찾기</a><span>|</span>
        <a href="/signup">회원가입</a>
      </div>

      <p className={styles.note}>
        이 사이트는 Google reCAPTCHA로 보호되며,<br></br>&nbsp;
        <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Google 개인정보 처리방침
        </a>
        와&nbsp;
        <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
          서비스 약관
        </a>이 적용됩니다.
      </p>
    </div >
  );
}

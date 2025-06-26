// src/components/SignupPage/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import styles from './SignupPage.module.css';
import eyeIcon from '../../assets/eye_icon.png';
import closedEyeIcon from '../../assets/closedeye_icon.png';
import checkTrue from '../../assets/check_true.png';
import checkFalse from '../../assets/check_false.png';
import checkTrue2 from '../../assets/check_true2.png';
import checkFalse2 from '../../assets/check_false2.png';
import nextIcon from '../../assets/next.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/custom-toast.css';

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
    code: '',
    agreeAll: false,
    age: false,
    agreeTerms: false,
    agreePrivacy: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState('');

  const isUsernameValid = /^[a-z0-9]{6,12}$/.test(form.username);
  const isNicknameValid = /^[a-zA-Z가-힣0-9]{2,8}$/.test(form.nickname);
  const isPasswordValid = /^[A-Za-z\d~!@#$%^&*]{8,15}$/.test(form.password);
  const isPasswordMatch = form.password === form.confirmPassword && form.confirmPassword !== '';

  useEffect(() => {
    const allChecked = form.age && form.agreeTerms && form.agreePrivacy;
    if (form.agreeAll !== allChecked) {
      setForm(prev => ({ ...prev, agreeAll: allChecked }));
    }
  }, [form.age, form.agreeTerms, form.agreePrivacy]);

  const isFormValid =
    isUsernameValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordMatch &&
    form.email.trim() &&
    isCodeValid &&
    form.agreeAll &&
    form.agreeTerms &&
    form.agreePrivacy;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/users/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginId: form.username,
        password: form.password,
        passwordConfirm: form.confirmPassword,
        nickname: form.nickname,
        email: form.email,
        verificationCode: '123456' // 실제로 인증이 되면 그 코드를 여기에 반영
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(`${data.nickname}님, 회원가입이 완료되었습니다!`);
      // 회원가입 완료 후 로그인 페이지로 이동 등 처리
      window.location.href = '/login';
    } else {
      toast.error(data.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    toast.error('서버 오류가 발생했습니다.');
  }
};

  const handleToggle = (key) => {
    if (key === 'agreeAll') {
      const newValue = !form.agreeAll;
      setForm(prev => ({
        ...prev,
        agreeAll: newValue,
        age: newValue,
        agreeTerms: newValue,
        agreePrivacy: newValue,
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleVerifyCode = () => {
    if (form.code === '123456') {
      toast.success('인증이 완료되었습니다!');
      setIsCodeValid(true);
      setForm(prev => ({
        ...prev,
        code: '',
      }));
      setShowCodeInput(false);
    } else {
      toast.error('인증번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className={styles.outer}>
      <h2 className={styles.title}>Filmer 회원가입</h2>
      <p className={styles.subtitle}>아이디와 이메일로 간편하게 Filmer를 시작하세요!</p>

      <div className={styles.inputGroup}>
        <input name="username" placeholder="아이디" className={styles.input} value={form.username} onChange={handleChange} />
        <p className={`${styles.inputDesc} ${form.username && !isUsernameValid ? styles.invalid : ''}`}>영문 소문자 또는 영문 소문자, 숫자 조합 6~12자리</p>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input name="nickname" placeholder="닉네임" className={styles.input} value={form.nickname} onChange={handleChange} />
          <button type="button" className={styles.button}>닉네임 추천</button>
        </div>
        <p className={`${styles.inputDesc} ${!isNicknameValid && form.nickname ? styles.invalid : ''}`}>닉네임은 영문 또는 한글 2~8자</p>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(prev => !prev)}
          >
            <img
              src={showPassword ? closedEyeIcon : eyeIcon}
              alt="비밀번호 보기"
              className={styles.eyeIcon}
            />
          </button>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            className={styles.input}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowConfirmPassword(prev => !prev)}
          >
            <img
              src={showConfirmPassword ? closedEyeIcon : eyeIcon}
              alt="비밀번호 확인 보기"
              className={styles.eyeIcon}
            />
          </button>
        </div>

        {/* 🔸 조건 설명 + 유효성 체크 */}
        <p className={`${styles.inputDesc} ${form.password && !isPasswordValid ? styles.invalid : ''}`}>
          영문, 숫자, 특수문자(~!@#$%^&*) 조합 8~15자리
        </p>

        {/* 🔸 비밀번호 불일치 경고 */}
        {form.confirmPassword && !isPasswordMatch && (
          <p className={`${styles.inputDesc} ${styles.invalid}`}>
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input
            name="email"
            placeholder="이메일"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
          />
          <button
            type="button"
            className={`${styles.button} ${form.email.trim() ? styles.button : styles.emailButtonInactive}`}
            disabled={!form.email.trim()}
            onClick={() => setShowCodeInput(true)}
          >
            인증번호 전송
          </button>
        </div>
      </div>

      {showCodeInput && (
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupRow}>
            <input name="code" placeholder="인증번호 6자리" className={styles.input} value={form.code} onChange={handleChange} />
            <button type="button" className={`${styles.button} ${form.code.trim().length === 6 ? styles.codeButtonActive : styles.codeButtonInactive}`} onClick={handleVerifyCode} disabled={form.code.trim().length !== 6}>인증</button>
          </div>
        </div>
      )}
      <div className={styles.checkboxGroup}>
        <div className={styles.checkboxRow} onClick={() => handleToggle('agreeAll')}>
          <img className={styles.bigCheckIcon} src={form.agreeAll ? checkTrue : checkFalse} alt="check" />
          <span>필수 및 선택 항목을 모두 포함하여 동의합니다.</span>
        </div>
        <div className={styles.checkboxRow} onClick={() => handleToggle('age')}>
          <img src={form.age ? checkTrue2 : checkFalse2} alt="check" />
          <span>만 14세 이상입니다.</span>
          <img className={styles.nextIcon} src={nextIcon} alt=">" />
        </div>
        <div className={styles.checkboxRow} onClick={() => handleToggle('agreeTerms')}>
          <img src={form.agreeTerms ? checkTrue2 : checkFalse2} alt="check" />
          <span>[필수] 서비스 이용약관 동의</span>
          <img className={styles.nextIcon} src={nextIcon} alt=">" />
        </div>
        <div className={styles.checkboxRow} onClick={() => handleToggle('agreePrivacy')}>
          <img src={form.agreePrivacy ? checkTrue2 : checkFalse2} alt="check" />
          <span>[필수] 개인정보 수집 및 이용 동의</span>
          <img className={styles.nextIcon} src={nextIcon} alt=">" />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} onClick={handleSubmit} disabled={!isFormValid}>
        가입하기
      </button>

      <p className={styles.loginLink}>
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </p>
    </div>
  );
}

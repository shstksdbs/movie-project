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
import { Scrollbar } from 'react-scrollbars-custom';
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
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const isUsernameValid = /^[a-z0-9]{6,12}$/.test(form.username);
  const isNicknameValid = /^[a-zA-Z가-힣0-9]{2,8}$/.test(form.nickname);
  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*])[A-Za-z\d~!@#$%^&*]{8,15}$/.test(form.password);
  const isPasswordMatch = form.password === form.confirmPassword && form.confirmPassword !== '';
  const [timer, setTimer] = useState(0); // 남은 시간(초)
  const [timerId, setTimerId] = useState(null); // setInterval ID

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
    if (name === "email") {
      setIsEmailChecked(false); // 이메일이 바뀌면 다시 중복확인 필요
    }
  };

  //회원가입 호출
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
          verificationCode: form.code
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${data.nickname}님, 회원가입이 완료되었습니다!`);
        // 회원가입 완료 후 로그인 페이지로 이동 등 처리
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        toast.error(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      toast.error('서버 오류가 발생했습니다.');
    }
  };

  //아이디 중복 확인 호출 
  const handleCheckLoginId = async () => {
    if (!form.username) {
      toast.error("아이디를 입력해 주세요.");
      return;
    }
    try {
      const response = await fetch(`/api/users/check-login-id?loginId=${encodeURIComponent(form.username)}`);
      const data = await response.json();
      if (data.available) {
        toast.success(data.message); // "사용 가능한 아이디입니다."
      } else {
        toast.error(data.message); // "이미 사용 중인 아이디입니다."
      }
    } catch (error) {
      toast.error("아이디 중복 확인 중 오류가 발생했습니다.");
    }
  };

  //닉네임 추천 호출
  const handleRecommendNickname = async () => {
    try {
      const response = await fetch('/api/users/recommend-nickname');
      const data = await response.json();
      if (data.nicknames && data.nicknames.length > 0) {
        // 예시: 첫 번째 추천 닉네임을 입력란에 자동으로 넣기
        setForm(prev => ({
          ...prev,
          nickname: data.nicknames[0]
        }));

      } else {
        toast.error("추천 닉네임을 가져오지 못했습니다.");
      }
    } catch (error) {
      toast.error("닉네임 추천 중 오류가 발생했습니다.");
    }
  };

  //이메일 중복 확인/인증번호 보내기
  const handleCheckEmail = async () => {
    if (!form.email.trim()) {
      toast.error("이메일을 입력해 주세요.");
      return;
    }
    try {
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(form.email)}`);
      const data = await response.json();
      if (data.available) {
        toast.success(data.message); // "사용 가능한 이메일입니다."
        setIsEmailChecked(true);     // 인증번호 전송 버튼으로 교체
      } else {
        toast.error(data.message);   // "이미 사용 중인 이메일입니다."
        setIsEmailChecked(false);
      }
    } catch (error) {
      toast.error("이메일 중복 확인 중 오류가 발생했습니다.");
      setIsEmailChecked(false);
    }
  };

  //이메일 전송
  const handleSendVerification = async () => {
    if (!form.email.trim()) {
      toast.error("이메일을 입력해 주세요.");
      return;
    }
    try {
      const response = await fetch('/api/mail/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("인증번호가 이메일로 발송되었습니다.");
        setShowCodeInput(true);

        // 타이머 3분(180초) 시작
        setTimer(180);
        if (timerId) clearInterval(timerId); // 기존 타이머 제거
        const id = setInterval(() => {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(id);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimerId(id);
      } else {
        toast.error(data.message || "인증번호 발송에 실패했습니다.");
      }
    } catch (error) {
      toast.error("인증번호 발송 중 오류가 발생했습니다.");
    }
  };

  //인증번호 확인
  const handleVerifyCode = async () => {
    if (form.code.trim().length !== 6) {
      toast.error("인증번호 6자리를 입력해 주세요.");
      return;
    }
    try {
      const response = await fetch('/api/mail/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          verificationCode: form.code
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("이메일 인증이 완료되었습니다!");
        setIsCodeValid(true); // 인증 성공 상태로 변경
        setShowCodeInput(false); // 인증 입력창 닫기 등
        setForm(prev => ({ ...prev, code: '' }));
      } else {
        toast.error(data.message || "인증번호가 올바르지 않습니다.");
      }
    } catch (error) {
      toast.error("인증번호 확인 중 오류가 발생했습니다.");
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

  return (
    <div className={styles.outer}>
      <h2 className={styles.title}>Filmer 회원가입</h2>
      <p className={styles.subtitle}>아이디와 이메일로 간편하게 Filmer를 시작하세요!</p>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input name="username" placeholder="아이디" className={styles.input} value={form.username} onChange={handleChange} />
          <button type="button" className={styles.button} onClick={handleCheckLoginId}>아이디 중복 확인</button>
        </div>
        <p className={`${styles.inputDesc} ${form.username && !isUsernameValid ? styles.invalid : ''}`}>영문 소문자 또는 영문 소문자, 숫자 조합 6~12자리</p>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputGroupRow}>
          <input name="nickname" placeholder="닉네임" className={styles.input} value={form.nickname} onChange={handleChange} />
          <button type="button" className={styles.button} onClick={handleRecommendNickname}>닉네임 추천</button>
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
          {!isEmailChecked ? (
            <button
              type="button"
              className={`${styles.button} ${form.email.trim() ? styles.button : styles.emailButtonInactive}`}
              disabled={!form.email.trim()}
              onClick={handleCheckEmail}
            >
              이메일 중복 확인
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.button} ${form.email.trim() ? styles.button : styles.emailButtonInactive}`}
              disabled={!form.email.trim()}
              onClick={handleSendVerification}
            >
              인증번호 전송
            </button>
          )}
        </div>
      </div>

      {showCodeInput && (
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupRow}>
            <input
              name="code"
              placeholder="인증번호 6자리"
              className={styles.input}
              value={form.code}
              onChange={handleChange}
            />
            <button
              type="button"
              className={`${styles.button} ${form.code.trim().length === 6 ? styles.codeButtonActive : styles.codeButtonInactive}`}
              onClick={handleVerifyCode}
              disabled={form.code.trim().length !== 6}
            >
              인증
            </button>
          </div>
          {/* 타이머 표시 */}
          {timer > 0 && (
            <p className={`${styles.inputDesc} ${styles.invalid}`}>
              남은 시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
          )}
          {timer === 0 && (
            <p className={`${styles.inputDesc} ${styles.invalid}`}>인증 시간이 만료되었습니다. 다시 시도해 주세요.</p>
          )}
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

        </div>
        <div className={styles.checkboxRow} onClick={() => handleToggle('agreeTerms')}>
          <img src={form.agreeTerms ? checkTrue2 : checkFalse2} alt="check" />
          <span>[필수] 서비스 이용약관 동의</span>
          <img
            className={styles.nextIcon}
            src={nextIcon}
            alt=">"
            style={{ cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation(); // 이벤트 버블링 방지!
              setShowTermsModal(true);
            }
            }
          />
        </div>
        <div className={styles.checkboxRow} onClick={() => handleToggle('agreePrivacy')}>
          <img src={form.agreePrivacy ? checkTrue2 : checkFalse2} alt="check" />
          <span>[필수] 개인정보 수집 및 이용 동의</span>
          <img
            className={styles.nextIcon}
            src={nextIcon}
            alt=">"
            style={{ cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation(); // 이벤트 버블링 방지
              setShowPrivacyModal(true);
            }}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} onClick={handleSubmit} disabled={!isFormValid}>
        가입하기
      </button>

      <p className={styles.loginLink}>
        이미 계정이 있으신가요? <a href="/login">로그인</a>
      </p>

      {/*서비스 이용약관 동의*/}
      {showTermsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowTermsModal(false)}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()} // 모달 내용 클릭 시 오버레이 닫힘 방지
          >
            <div className={styles.modalHeader}>
              <p>서비스 이용약관 동의</p>
              <span
                className={styles.closeIcon}
                onClick={() => setShowTermsModal(false)}
              >
                &#10005;
              </span>
            </div>
            {/* 여기! */}
            <Scrollbar
              style={{ height: '35vh', width: '100%' }}
              trackYProps={{
                style: {
                  left: '98.5%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '90%',
                  background: 'transparent',
                  position: 'absolute'
                }
              }}
              thumbYProps={{
                style: {
                  background: '#555',
                  borderRadius: '4px'
                }
              }}
            >
              <div classNmae={styles.termsScroll}>
                {/* 약관 내용 */}
                <div className={styles.modaltext}>
                  <p className={styles.modalbigtext}>제1장 총칙<br></br>제1조 (목적)</p>
                  <p>
                    이 약관은 주식회사 Filmer(이하 “회사”)이 PC 웹사이트와 모바일, 태블릿, TV 앱을 이용하여 온라인으로 제공하는 디지털콘텐츠(이하 "콘텐츠") 및 제반 서비스를 이용함에 있어 회사와 이용자의 권리,의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                  </p>
                </div>
                <div className={styles.modaltext}>
                  <p className={styles.modalbigtext}>제2조 [정의]</p>
                  <p>
                    이 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br></br>
                    1. "회사"라 함은 "콘텐츠" 산업과 관련된 경제활동을 영위하는 자로서 “콘텐츠” 제반 서비스를 제공하는 자이며, 이 약관에서는 주식회사 티빙을 말합니다.<br></br>
                    2. "이용자"라 함은 "회사"의 PC 웹사이트와 모바일, 태블릿, TV 앱 서비스에 접속하여 이 약관에 따라 "회사"가 제공하는 "콘텐츠" 제반 서비스를 이용하는 회원 및 비회원을 말합니다.<br></br>
                    3. "회원"이라 함은 "회사"와 이용계약을 체결하고 "이용자" 아이디(ID)를 부여 받은 "이용자"로서 "회사"의 정보를 지속적으로 제공받으며 "회사"가 제공하는 서비스를 지속적으로 이용할 수 있는 자를 말합니다.<br></br>
                    4. "비회원"이라 함은 "회원"이 아니면서 "회사"가 제공하는 서비스를 이용하는 자를 말합니다.<br></br>
                    5. “CJ ONE” 회원 : “CJ ONE” 서비스 운영에 동의하고 회원 ID를 부여받은 자 중 “회사”의 서비스 이용에 동의한 회원을 의미하며, “CJ ONE” 회원약관에 의해 운영 됩니다.<br></br>
                    6. "콘텐츠"라 함은 정보통신망이용촉진 및 정보보호 등에 관한 법률 제2조 제1항 제1호의 규정에 의한 정보통신망에서 사용되는 부호, 문자, 음성, 음향, 이미지 또는 영상 등으로 표현된 자료 또는 정보로서, 그 보존 및 이용에 있어서 효용을 높일 수 있도록 전자적 형태로 제작 또는 처리된 것을 말합니다.<br></br>
                    7. "아이디(ID)"라 함은 "회원"의 식별과 서비스이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자 또는 숫자의 조합을 말합니다.<br></br>
                    8. "비밀번호(PASSWORD)"라 함은 "회원"이 부여 받은 "아이디"와 일치되는 "회원"임을 확인하고 비밀보호를 위해 "회원" 자신이 정한 문자 또는 숫자의 조합을 말합니다.<br></br>
                    9. "유료 서비스"라 함은 서비스 이용을 위해 대금을 지불한 후에 이용할 수 있는 서비스를 말합니다.<br></br>
                    10. "무료 서비스"라 함은 서비스 이용을 위해 대금을 지불하지 않고 이용할 수 있는 서비스를 말합니다.<br></br>
                  </p>
                </div>
                <div className={styles.modaltext}>
                  <p className={styles.modalbigtext}>제3조 [신원정보 등의 제공]</p>
                  <p>
                    "회사"는 이 약관의 내용, 상호, 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호 등을 “이용자”가 쉽게 알 수 있도록 온라인 서비스초기화면에 게시합니다. 다만, 약관은 “이용자”가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.
                  </p>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      )}

      {showPrivacyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPrivacyModal(false)}>
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <p>개인정보 수집 및 이용 동의</p>
              <span
                className={styles.closeIcon}
                onClick={() => setShowPrivacyModal(false)}
              >
                &#10005;
              </span>
            </div>
            <Scrollbar
              style={{ height: '35vh', width: '100%' }}
              trackYProps={{
                style: {
                  left: '98.5%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '90%',
                  background: 'transparent',
                  position: 'absolute'
                }
              }}
              thumbYProps={{
                style: {
                  background: '#555',
                  borderRadius: '4px'
                }
              }}
            >
              <div classNmae={styles.termsScroll}>
                {/* 약관 내용 */}
                <div className={styles.modaltext}>
                  <p className={styles.modalbigtext}>[필수] 개인정보 수집 및 이용 동의 안내</p>

                </div>
                <div className={styles.privacyTableWrapper}>
                  <table className={styles.privacyTable}>
                    <colgroup>
                      <col style={{ width: '180px' }} />
                      <col style={{ width: '260px' }} />
                      <col style={{ width: '200px' }} /> {/* 보유 및 이용기간 열 넓게 */}
                    </colgroup>
                    <thead>
                      <tr>
                        <th>수집/이용 목적</th>
                        <th>수집 항목</th>
                        <th>보유 및 이용기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td >TVING ID 회원 가입<br />및 회원관리</td>
                        <td>
                          [회원가입 시]<br />
                          TVING ID, 이메일 주소, 비밀번호, 휴대폰 번호<br />
                          [추가정보 입력 시] 이름
                        </td>
                        <td >회원탈퇴 후 5일까지</td>
                      </tr>
                      <tr>
                        <td >SNS ID 회원 가입<br />및 회원관리</td>
                        <td>
                          Naver : 이름, 이메일 주소, 성별, 출생연도, 휴대폰 번호<br />
                          Kakao : 이름, 이메일 주소, 닉네임, 휴대폰 번호<br />
                          Facebook : 이름, 이메일 주소, 프로필 사진, 휴대폰 번호<br />
                          Twitter : 이름, 이메일 주소, 휴대폰 번호<br />
                          Apple : 이름, 이메일 주소, 휴대폰 번호
                        </td>
                        <td >회원탈퇴 후 5일까지</td>
                      </tr>
                      <tr>
                        <td >사용자 인증을 통한<br />
                          본인 및 연령 확인,<br />
                          사용자 인증에 따른<br />
                          서비스 제공 및 응대및 회원관리</td>
                        <td>
                          이름, CI, DI, 생년월일, 성별, 휴대폰 번호
                        </td>
                        <td >회원탈퇴 후 5일까지</td>
                      </tr>
                      <tr>
                        <td >제휴/광고/입점 문의 및 응대</td>
                        <td>
                          이름, 회사명, 이메일 주소, 휴대폰 번호
                          [추가정보 입력 시]
                          대표 전화번호
                        </td>
                        <td >접수 후 3년까지</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.modaltext}>
                  
                  <p>
                    ※ 이용자는 개인정보의 수집 및 이용 동의를 거부할 권리가 있습니다. 회원가입 시 수집하는 최소한의 개인정보, 즉, 필수 항목에 대한 수집 및 이용 동의를 거부하실 경우, 회원가입을 진행하실 수 없습니다.
                  </p>
                </div>
              </div>
            </Scrollbar>
          </div>
        </div>
      )}

    </div>
  );
}

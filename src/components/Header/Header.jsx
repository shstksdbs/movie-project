import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';
import { useUser } from '../../contexts/UserContext';
import searchIcon from '../../assets/search_icon.png';
import userProfile from '../../assets/user_profile.png';

export default function Header() {
  const { user, setUser } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuTimeout = useRef(null);
  
  useEffect(() => {
    setShowProfileMenu(false);
    setMenuVisible(false);
  }, [user]);

  //로그아웃
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // 세션/쿠키 인증 시 필요
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(null); // Context에서 유저 정보 제거(로그아웃)
        // 필요하다면 로그아웃 후 메인 페이지로 이동
        // navigate('/');
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('user');
        alert('로그아웃 성공(test).');
      } else {
        alert(data.message || '로그아웃에 실패했습니다.');
      }
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    }
  };

  const handleProfileEnter = () => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setShowProfileMenu(true);
    setMenuVisible(true);
    setTimeout(() => setMenuVisible(true), 10);
  };

  const handleProfileLeave = () => {
    menuTimeout.current = setTimeout(() => {
      setMenuVisible(false);
      setTimeout(() => setShowProfileMenu(false), 350);
    }, 100);
  };

  // 언마운트 시 타이머 정리
  React.useEffect(() => {
    return () => {
      if (menuTimeout.current) clearTimeout(menuTimeout.current);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="Filmer" />
        </Link>
        <nav className={styles.nav}>
          {user ? (
            <>
              <img src={searchIcon} alt="검색" className={styles.icon} />
              <div className={styles.profileWrapper} style={{ display: 'inline-block', position: 'relative' }}>
                <div
                  className={styles.profileInline}
                  onMouseEnter={handleProfileEnter}
                  onMouseLeave={handleProfileLeave}
                >
                  <img src={userProfile} alt="프로필" className={styles.profileImg} />
                  <span className={styles.nickname}>{user.nickname}</span>
                </div>
                {showProfileMenu && (
                  <div
                    className={`${styles.profileMenu} ${menuVisible ? styles.menuShow : styles.menuHide}`}
                    onMouseEnter={handleProfileEnter}
                    onMouseLeave={handleProfileLeave}
                  >
                    <div className={styles.profileTop}>
                      <img src={userProfile} alt="프로필" className={styles.menuProfileImg} />
                      <div>
                        <div className={styles.menuNickname}>{user.nickname}</div>
                        <div className={styles.menuSwitch}>프로필 전환 &gt;</div>
                      </div>
                    </div>
                    <div className={styles.menuDivider} />
                    <div className={styles.menuItem}>MY</div>
                    <div className={styles.menuItem}>이용권 구독</div>
                    <div className={styles.menuItem}>쿠폰등록</div>
                    <div className={styles.menuItem}>고객센터</div>
                    <div className={styles.menuItem} onClick={handleLogout}>로그아웃</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
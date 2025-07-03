import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/logo.png';
import { useUser } from '../../contexts/UserContext';
import searchIcon from '../../assets/search_icon.png';
import userProfile from '../../assets/user_profile.png';
import SearchModal from '../Modal/SearchModal';
import closeIcon from '../../assets/close_icon.png';

export default function Header() {
  const { user, setUser, isLoading } = useUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuTimeout = useRef(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const location = useLocation();

  // 디버깅: 사용자 상태와 로딩 상태 추적
  useEffect(() => {
    console.log('Header 렌더링 상태:', {
      isLoading,
      user: user ? `로그인됨 (${user.nickname})` : '로그아웃됨',
      showProfileMenu,
      menuVisible
    });
  }, [isLoading, user, showProfileMenu, menuVisible]);

  useEffect(() => {
    setShowProfileMenu(false);
    setMenuVisible(false);
  }, [user]);

  //로그아웃
  const handleLogout = async () => {
    console.log('로그아웃 시작');
    try {
      const response = await fetch('http://localhost:80/api/logout', {
        method: 'POST',
        credentials: 'include', // 세션/쿠키 인증 시 필요
      });
      const data = await response.json();
      console.log('로그아웃 응답:', data);
      if (response.ok && data.success) {
        console.log('로그아웃 성공, 사용자 상태 초기화');
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
      console.error('로그아웃 오류:', error);
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

  // 로딩 중에는 헤더를 렌더링하지 않음
  if (isLoading) {
    return null;
  }

  return (
    <header className={`${styles.stickyHeader} ${showSearchModal ? styles.activeSearch : ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}
            onClick={() => setShowSearchModal(false)}
          >
            <img src={logo} alt="Filmer" />
          </Link>
          <nav className={styles.nav}>
            {user ? (
              <>
                {(!location.pathname.startsWith('/search')) && (
                  showSearchModal ? (
                    <button className={styles.searchCloseBtn} onClick={() => setShowSearchModal(false)}>
                      <img src={closeIcon} alt="닫기" style={{ width: '100%', height: '100%' }} />
                    </button>
                  ) : (
                    <img src={searchIcon} alt="검색" className={styles.icon} onClick={() => setShowSearchModal(true)} />
                  )
                )}
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
      </div>
      {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} top={64} height={'80vh'} />}
    </header>
  );
}
import React, { useState, useEffect } from 'react';
import styles from './SearchModal.module.css';
import searchIcon from '../../assets/search_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';

const dummyPopular = [
  '진격의 거인',
  '월드 오브 스트릿 우먼 파이터',
  '지치고 볶는 여행',
  '내 아이의 사생활',
  '짱구는 못말려 24',
  '언니네 산지직송2',
  '성적을 부탁해 : 티처스 2',
  '미지의 서울',
  '뭉쳐야 찬다 4',
  '명탐정 코난 Part2 (더빙)'
];

export default function SearchModal({ onClose, top = 64, height = '80vh' }) {
  const [search, setSearch] = useState('');
  const recentSearches = [];
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 시간 포맷 함수
  function getKoreanTimeString() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    let hour = now.getHours();
    const min = String(now.getMinutes()).padStart(2, '0');
    const isPM = hour >= 12;
    const ampm = isPM ? '오후' : '오전';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return `${yyyy}.${MM}.${dd} ${ampm} ${String(hour).padStart(2, '0')}:${min} 기준`;
  }

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    if (location.pathname.startsWith('/search')) {
      onClose && onClose();
    }
  }, [location.pathname, onClose]);

  return (
    <div className={styles.overlay} style={{ top, height }}>
      <div className={styles.modal}>
       
        <div className={styles.searchBarWrap}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="제목, 인물명을 입력해보세요."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <img src={searchIcon} alt="검색" className={styles.searchIcon} onClick={handleSearch} />
        </div>
        <div className={styles.contentWrap}>
          <div className={styles.left}>
            <div className={styles.title}>최근 검색어</div>
            {recentSearches.length === 0 ? (
              <div className={styles.empty}>검색 내역이 없습니다.</div>
            ) : (
              <ul>
                {recentSearches.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
          <div className={styles.verticalDivider}></div>
          <div className={styles.right}>
            <div className={styles.title}>실시간 인기 검색어</div>
            <ol className={styles.popularList}>
              {dummyPopular.map((item, i) => (
                <li key={i}><span className={styles.rank}>{i+1}</span> {item}</li>
              ))}
            </ol>
            <div className={styles.timeStandard}>{getKoreanTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
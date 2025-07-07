import React, { useState, useEffect } from 'react';
import styles from './SearchModal.module.css';
import searchIcon from '../../assets/search_icon.png';
import closeIcon from '../../assets/close_icon.png';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SearchModal({ onClose, top = 64, height = '80vh' }) {
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // 최근 검색어 불러오기
  useEffect(() => {
    axios.get('http://localhost:80/api/search-history', { withCredentials: true })
      .then(res => setRecentSearches(res.data))
      .catch(() => setRecentSearches([]));
  }, []);

  // 인기 검색어 불러오기
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:80/api/popular-keywords', { withCredentials: true })
      .then(res => {
        setPopularKeywords(res.data);
        console.log('인기 검색어:', res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('인기 검색어 조회 실패:', err);
        setPopularKeywords([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      // 검색어 저장
      axios.post('http://localhost:80/api/search-history', null, {
        params: { keyword: search, searchResultCount: 0 },
        withCredentials: true
      }).then(() => {
        // 저장 후 최근 검색어 다시 불러오기
        return axios.get('http://localhost:80/api/search-history', { withCredentials: true });
      }).then(res => setRecentSearches(res.data))
        .catch(() => {});
      // 검색 결과 페이지로 이동
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 개별 검색어 삭제
  const handleDelete = (keyword) => {
    axios.delete('http://localhost:80/api/search-history', {
      params: { keyword },
      withCredentials: true
    })
      .then(() => setRecentSearches(prev => prev.filter(item => item.keyword !== keyword)))
      .catch(() => {});
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
                {recentSearches.map((item, i) => (
                  <li key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <span
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                        setSearch(item.keyword);
                        // 바로 검색 실행
                        axios.post('http://localhost:80/api/search-history', null, {
                          params: { keyword: item.keyword, searchResultCount: 0 },
                          withCredentials: true
                        }).then(() => {
                          return axios.get('http://localhost:80/api/search-history', { withCredentials: true });
                        }).then(res => setRecentSearches(res.data))
                          .catch(() => {});
                        navigate(`/search?query=${encodeURIComponent(item.keyword)}`);
                        onClose && onClose(); // 모달 닫기
                      }}
                    >
                      {item.keyword}
                    </span>
                    <button onClick={() => handleDelete(item.keyword)} className="deleteBtn" aria-label="검색어 삭제">
                      <img src={closeIcon} alt="삭제" className="deleteIcon" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.verticalDivider}></div>
          <div className={styles.right}>
            <div className={styles.title}>실시간 인기 검색어</div>
            {loading ? (
              <div className={styles.loading}>로딩 중...</div>
            ) : popularKeywords.length === 0 ? (
              <div className={styles.empty}>인기 검색어가 없습니다.</div>
            ) : (
              <ol className={styles.popularList}>
                {popularKeywords.map((item, i) => (
                  <li key={i}>
                    <span className={styles.rank}>{i+1}</span> 
                    <span 
                      style={{cursor: 'pointer'}}
                      onClick={() => {
                        setSearch(item.keyword);
                        // 바로 검색 실행
                        axios.post('http://localhost:80/api/search-history', null, {
                          params: { keyword: item.keyword, searchResultCount: 0 },
                          withCredentials: true
                        }).then(() => {
                          return axios.get('http://localhost:80/api/search-history', { withCredentials: true });
                        }).then(res => setRecentSearches(res.data))
                          .catch(() => {});
                        navigate(`/search?query=${encodeURIComponent(item.keyword)}`);
                      }}
                    >
                      {item.keyword}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <div className={styles.timeStandard}>{getKoreanTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
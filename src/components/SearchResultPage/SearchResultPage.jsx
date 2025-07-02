import React, { useState, useEffect } from 'react';
import styles from './SearchResultPage.module.css';
import searchIcon from '../../assets/search_icon.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieCard from '../MainPage/MovieCard';

function ActorCard({ actor }) {
  return (
    <div className={styles.actorCard}>
      <div className={styles.actorImg}></div>
      <div className={styles.actorName}>{actor.name}</div>
      <div className={styles.actorRole}>{actor.role}</div>
    </div>
  );
}

function ActorHorizontalSlider({ data }) {
  const [start, setStart] = useState(0);
  const visible = 7;
  const prev = () => setStart(Math.max(0, start - visible));
  const next = () => setStart(Math.min(data.length - visible, start + visible));
  return (
    <div className={styles.sliderWrapper}>
      {start > 0 && <button className={`${styles.navBtn} ${styles.left}`} onClick={prev}>{'<'}</button>}
      <div className={styles.slider}>
        {data.slice(start, start + visible).map((actor, idx) => (
          <ActorCard key={actor.name + actor.role} actor={actor} />
        ))}
      </div>
      {start + visible < data.length && <button className={`${styles.navBtn} ${styles.right}`} onClick={next}>{'>'}</button>}
    </div>
  );
}

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const [search, setSearch] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setSearch(initialQuery); }, [initialQuery]);

  useEffect(() => {
    if (!search) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:80/data/api/movie-detail-dto/search?keyword=${encodeURIComponent(search)}&page=0&size=20`)
      .then(res => {
        if (!res.ok) throw new Error('검색 실패');
        return res.json();
      })
      .then(data => {
        const movies = data.data || [];
        setMovies(movies);

        // 인물 추출
        const peopleMap = {};
        const peopleList = [];
        movies.forEach(movie => {
          (movie.directors || []).forEach(dir => {
            if (dir.peopleNm && !peopleMap[dir.peopleNm]) {
              peopleMap[dir.peopleNm] = true;
              peopleList.push({ name: dir.peopleNm, role: '감독' });
            }
          });
          (movie.actors || []).forEach(actor => {
            if (actor.peopleNm && !peopleMap[actor.peopleNm]) {
              peopleMap[actor.peopleNm] = true;
              peopleList.push({ name: actor.peopleNm, role: '배우' });
            }
          });
        });
        setPeople(peopleList);
        console.log('영화:', movies);   // ← 여기 추가
        console.log('인물:', peopleList); // ← 여기 추가
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search]);

  const navigate = useNavigate();
  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchBarWrap}>
        <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
        <img src={searchIcon} alt="검색" className={styles.searchIcon} onClick={handleSearch} />
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>영화</h2>
        {loading && <div>로딩중...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {(!loading && movies.length === 0) && <div>검색 결과가 없습니다.</div>}
        <div className={styles.cardList}>
          {movies.map((movie, idx) => (
            <MovieCard key={movie.movieCd || idx} movie={movie} index={idx + 1} showOpenDt={false} />
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>인물</h2>
        {people.length > 7 ? (
          <ActorHorizontalSlider data={people} />
        ) : (
          <div className={styles.cardList}>
            {people.map(actor => (
              <ActorCard key={actor.name + actor.role} actor={actor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import styles from './SearchResultPage.module.css';
import searchIcon from '../../assets/search_icon.png';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieCard from '../MainPage/MovieCard';

function ActorCard({ actor }) {
  return (
    <div className={styles.actorCard}>
      <div 
        className={styles.actorImg}
        style={{
          backgroundImage: actor.photoUrl ? `url(${actor.photoUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
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
  const [input, setInput] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [movies, setMovies] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { 
    setInput(initialQuery);
    setSearch(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!search) return;
    setLoading(true);
    setError(null);
    
    // 영화 검색과 인물 검색을 병렬로 실행
    Promise.all([
      fetch(`http://localhost:80/data/api/movie-detail-dto/search?keyword=${encodeURIComponent(search)}&page=0&size=20`),
      fetch(`http://localhost:80/data/api/search-person?keyword=${encodeURIComponent(search)}`)
    ])
      .then(responses => {
        if (!responses[0].ok) throw new Error('영화 검색 실패');
        if (!responses[1].ok) throw new Error('인물 검색 실패');
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([movieData, personData]) => {
        const movies = movieData.data || [];
        setMovies(movies);

        // 인물 데이터 처리
        const peopleList = [];
        const peopleMap = {};
        
        // 배우 데이터 추가
        (personData.actors || []).forEach(actor => {
          if (actor.name && !peopleMap[actor.name]) {
            peopleMap[actor.name] = true;
            peopleList.push({ 
              name: actor.name, 
              role: '배우',
              photoUrl: actor.photoUrl,
              id: actor.id
            });
          }
        });
        
        // 감독 데이터 추가
        (personData.directors || []).forEach(director => {
          if (director.name && !peopleMap[director.name]) {
            peopleMap[director.name] = true;
            peopleList.push({ 
              name: director.name, 
              role: '감독',
              photoUrl: director.photoUrl,
              id: director.id
            });
          }
        });
        
        setPeople(peopleList);
        // console.log('영화:', movies);
        // console.log('인물:', peopleList);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search]);

  const navigate = useNavigate();
  const handleSearch = () => {
    if (input.trim()) {
      setSearch(input);
      navigate(`/search?query=${encodeURIComponent(input)}`);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchBarWrap}>
        <input className={styles.searchInput} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} />
        <img src={searchIcon} alt="검색" className={styles.searchIcon} onClick={handleSearch} />
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>영화</h2>
        {/* {loading && <div>로딩중...</div>} */}
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
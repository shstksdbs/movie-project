import React, { useState, useEffect } from 'react';
import MovieHorizontalSlider from '../MainPage/MovieHorizontalSlider';
import styles from './SearchResultPage.module.css';
import searchIcon from '../../assets/search_icon.png';
import { useNavigate, useSearchParams } from 'react-router-dom';

const dummyMovies = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: `영화 제목${i+1}`,
  year: 2025,
  country: '미국',
  rating: 5.0,
  audience: '24만',
}));

const dummyActors = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  name: `이름${i+1}`,
  role: '배우',
}));

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
          <ActorCard key={actor.id} actor={actor} />
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
  useEffect(() => { setSearch(initialQuery); }, [initialQuery]);
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
        {dummyMovies.length > 7 ? (
          <MovieHorizontalSlider data={dummyMovies} />
        ) : (
          <div className={styles.cardList}>
            {dummyMovies.map(movie => (
              <div key={movie.id} className={styles.movieCardDummy}>영화 제목</div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>인물</h2>
        {dummyActors.length > 7 ? (
          <ActorHorizontalSlider data={dummyActors} />
        ) : (
          <div className={styles.cardList}>
            {dummyActors.map(actor => (
              <ActorCard key={actor.id} actor={actor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
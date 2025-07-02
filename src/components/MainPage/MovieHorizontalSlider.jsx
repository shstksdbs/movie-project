import React from 'react';
import styles from './MovieHorizontalSlider.module.css';
import MovieCard from './MovieCard';
import previousIcon from '../../assets/previous_icon.png';
import nextIcon from '../../assets/next_icon.png';

const dummyMovies = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `영화 제목`,
  year: 2025,
  country: '미국',
  rating: 5.0,
  audience: '24만',
}));

export default function MovieHorizontalSlider({ data, sectionKey, ratings, actorInfo }) {
  function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const [start, setStart] = React.useState(0);
  const rootStyle = getComputedStyle(document.documentElement);
  const cardWidth = parseFloat(rootStyle.getPropertyValue('--card-width')) || 240;
  const cardGapRem = parseFloat(rootStyle.getPropertyValue('--card-gap')) || 0.9;
  const cardGap = remToPx(cardGapRem);
  const visible = 7;

  // data 사용, 아니면 더미데이터 사용
  const movies = data && data.length > 0 ? data : dummyMovies;

  const prev = () => setStart(Math.max(0, start - visible));
  const next = () => setStart(Math.min(movies.length - visible, start + visible));

  return (
    <div className={styles.sliderWrapper}>
      {start > 0 && (
        <button
          className={`${styles.navBtn} ${styles.left}`}
          onClick={prev}
        >
          <img src={previousIcon} alt="이전" />
        </button>
      )}
      <div
        className={`${styles.slider} ${start === 0 ? styles.first : ''}`}
        style={{
          transform: `translateX(-${start * (cardWidth + cardGap) - (start === 0 ? 0 : 70)}px)`,
          transition: 'transform 0.4s'
        }}
      >
        {movies.map((movie, idx) => (
          <MovieCard
            key={movie.movieCd || movie.id || idx}
            movie={{ ...movie, averageRating: ratings?.[movie.movieCd] }}
            index={idx + 1}
            sectionKey={sectionKey}
            actorInfo={sectionKey === 'actor' ? actorInfo : undefined}
          />
        ))}
      </div>
      {start + visible < movies.length && (
        <button
          className={`${styles.navBtn} ${styles.right}`}
          onClick={next}
        >
          <img src={nextIcon} alt="다음" />
        </button>
      )}
    </div>
  );
} 
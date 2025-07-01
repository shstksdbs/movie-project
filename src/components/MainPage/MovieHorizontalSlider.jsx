import React, { useState } from 'react';
import styles from './MovieHorizontalSlider.module.css';
import MovieCard from './MovieCard';

const dummyMovies = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  title: `영화 제목`,
  rating: 5.0,
}));

export default function MovieHorizontalSlider() {
  const [start, setStart] = useState(0);
  const visible = 7;

  const prev = () => setStart(Math.max(0, start - visible));
  const next = () => setStart(Math.min(dummyMovies.length - visible, start + visible));

  return (
    <div className={styles.sliderWrapper}>
      {start > 0 && <button className={styles.arrow} onClick={prev}>&lt;</button>}
      <div className={styles.slider}>
        {dummyMovies.slice(start, start + visible).map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {start + visible < dummyMovies.length && (
        <button className={styles.arrow} onClick={next}>&gt;</button>
      )}
    </div>
  );
} 
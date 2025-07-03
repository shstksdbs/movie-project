import React from 'react';
import MovieDetailHeader from './MovieDetailHeader';
import MovieDetailBody from './MovieDetailBody';
import styles from './MovieDetailPage.module.css';

export default function MovieDetailPage({ movieId }) {
  // 추후 movieId로 데이터 fetch 등 가능
  return (
    <div className={styles.outer}>
      <MovieDetailHeader movieId={movieId} />
      <MovieDetailBody movieId={movieId} />
    </div>
  );
} 
import React from 'react';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie }) {
  return (
    <div className={styles.card}>
      <div className={styles.poster}>포스터</div>
      <div className={styles.title}>{movie.title}</div>
      <div className={styles.rating}>⭐ {movie.rating}</div>
    </div>
  );
}
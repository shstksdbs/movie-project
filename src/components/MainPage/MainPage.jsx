import React from 'react';
import styles from './MainPage.module.css';
import BannerSlider from './BannerSlider';
import MovieHorizontalSlider from './MovieHorizontalSlider';

const sections = [
  { title: 'Filmer HOT랭킹', key: 'hot' },
  { title: '추천 영화', key: 'recommend' },
  { title: '평판 영화', key: 'reputation' },
  { title: '감독 영화', key: 'director' },
  { title: '배우 출연 영화', key: 'actor' },
  { title: '개봉 공개 예정작', key: 'upcoming' },
  { title: '박스오피스 순위', key: 'boxoffice' },
];

export default function MainPage() {
  return (
    <div className={styles.main}>
      <BannerSlider />
      {sections.map(section => (
        <div key={section.key} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <MovieHorizontalSlider />
        </div>
      ))}
    </div>
  );
}
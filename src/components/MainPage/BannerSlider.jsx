import React, { useState } from 'react';
import styles from './BannerSlider.module.css';
import banners from './banners';

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const total = banners.length;

  const prevSlide = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  };

  const nextSlide = () => {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.sliderWrapper}>
      {current > 0 && (
        <button
          className={`${styles.navBtn} ${styles.left}`}
          onClick={prevSlide}
        >
          ❮
        </button>
      )}

      <div className={styles.slider}>
        {banners.map((banner, index) => {
          let position = 'hidden';
          if (index === current) {
            position = 'active';
          } else if (index === current - 1) {
            position = 'prev';
          } else if (index === current + 1) {
            position = 'next';
          }

          return (
            <div
              key={banner.id}
              className={`
                ${styles.slide}
                ${styles[position]}
                ${banner.id === 1 ? styles.firstBanner : ''}
               `}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className={styles.title}>{banner.title}</div>
            </div>
          );
        })}
      </div>

      {current < total - 1 && (
        <button
          className={`${styles.navBtn} ${styles.right}`}
          onClick={nextSlide}
        >
          ❯
        </button>
      )}
    </div>
  );
}

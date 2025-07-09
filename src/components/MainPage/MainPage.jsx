import React, { useEffect, useState } from 'react';
import styles from './MainPage.module.css';
import BannerSlider from './BannerSlider';
import MovieHorizontalSlider from './MovieHorizontalSlider';
import { useUser } from '../../contexts/UserContext';

export default function MainPage() {
  const { user } = useUser();
  const nickname = user?.nickname || user?.name || '';
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularRatings, setPopularRatings] = useState({});
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [comingSoonRatings, setComingSoonRatings] = useState({});
  const [boxOfficeData, setBoxOfficeData] = useState([]);
  const [ratings, setRatings] = useState({});
  const [actorMovies, setActorMovies] = useState([]);
  const [actorInfo, setActorInfo] = useState(null);
  const [directorMovies, setDirectorMovies] = useState([]);
  const [directorInfo, setDirectorInfo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:80/data/api/box-office-dto?page=0&size=20')
      .then(res => res.json())
      .then(data => {
        const movies = data.data || [];
        console.log('박스오피스 데이터:', movies);
        setBoxOfficeData(movies);
      });

    // 평점 높은 영화 fetch
    fetch('http://localhost:80/data/api/ratings/top-rated?limit=5')
      .then(res => res.json())
      .then(data => {
        console.log('평점 높은 영화:', data);
        setTopRatedMovies(data);
      });

    // 인기 영화 fetch
    fetch('http://localhost:80/data/api/popular-movies?limit=10')
      .then(res => res.json())
      .then(data => {
        console.log('인기 영화:', data);
        setPopularMovies(data.data || []);
      });

    fetch('http://localhost:80/data/api/movies/coming-soon?page=0&size=20')
      .then(res => res.json())
      .then(data => {
        const movies = data.data || [];
        setComingSoonMovies(movies);
        //console.log('개봉예정작 API 응답:', data);

      });

    fetch('http://localhost:80/api/person/recommended-actor')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setActorInfo(data.data.actor); // 배우 정보
          const movies = data.data.topMovies || [];
          
          // 배우 추천 영화에 필요한 정보 추가
          const enrichedMovies = movies.map(movie => ({
            ...movie,
            averageRating: movie.averageRating || 0.0,
            description: movie.description || '',
            showTm: movie.showTm || 0,
            companyNm: movie.companyNm || '',
            directorName: movie.directorName || ''
          }));
          
          setActorMovies(enrichedMovies);
        }
      });

    fetch('http://localhost:80/api/person/recommended-director')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setDirectorInfo(data.data.director); // 감독 정보
          const movies = data.data.topMovies || [];
          
          // 감독 추천 영화에 필요한 정보 추가
          const enrichedMovies = movies.map(movie => ({
            ...movie,
            averageRating: movie.averageRating || 0.0,
            description: movie.description || '',
            showTm: movie.showTm || 0,
            companyNm: movie.companyNm || '',
            directorName: movie.directorName || ''
          }));
          
          setDirectorMovies(enrichedMovies);
        }
      });

  }, []);



  const sections = [
    { title: '평점 높은 영화', key: 'toprated', data: topRatedMovies },
    { title: '인기 영화', key: 'popular', data: popularMovies },
    { title: '박스오피스 순위', key: 'boxoffice', data: boxOfficeData, ratings },
    { title: '개봉 예정작', key: 'upcoming', data: comingSoonMovies },
    ...(user ? [{ title: `${nickname}님이 좋아하실 영화`, key: 'like' }] : []),
    { title: directorInfo && directorInfo.name ? `${directorInfo.name} 감독 영화` : '감독 영화', key: 'director', data: directorMovies, directorInfo },
    { title: actorInfo && actorInfo.name ? `${actorInfo.name} 출연 영화` : '배우 출연 영화', key: 'actor', data: actorMovies, actorInfo },
  ];

  return (
    <div className={styles.main}>
      <BannerSlider />
      {sections.map(section => (
        <div key={section.key} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <MovieHorizontalSlider
            data={section.data}
            sectionKey={section.key}
            ratings={section.ratings}
            actorInfo={section.key === 'actor' ? section.actorInfo : undefined}
          />
        </div>
      ))}
    </div>
  );
}
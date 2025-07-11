import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [recommendedMovies, setRecommendedMovies] = useState({}); // 기존
  const [socialRecommendedMovies, setSocialRecommendedMovies] = useState([]); // 기존
  const [socialRecommender, setSocialRecommender] = useState(null); // 추가
  const [mainSocialRecommendedMovies, setMainSocialRecommendedMovies] = useState([]); // 추가
  const [mainSocialRecommender, setMainSocialRecommender] = useState(null); // 추가
  const [newGenreRecommendations, setNewGenreRecommendations] = useState([]); // 추가

  useEffect(() => {
    fetch('http://localhost:80/data/api/box-office-dto?page=0&size=20')
      .then(res => res.json())
      .then(data => {
        const movies = data.data || [];
        //console.log('박스오피스 데이터:', movies);
        setBoxOfficeData(movies);
      });

    // 평점 높은 영화 fetch
    fetch('http://localhost:80/data/api/ratings/top-rated?limit=5')
      .then(res => res.json())
      .then(data => {
        //console.log('평점 높은 영화:', data);
        setTopRatedMovies(data);
      });

    // 인기 영화 fetch
    fetch('http://localhost:80/data/api/popular-movies?limit=10')
      .then(res => res.json())
      .then(data => {
        //console.log('인기 영화:', data);
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

  // user가 있을 때 추천 영화 fetch
  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:80/api/users/${user.id}/recommended-movies`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          
          setRecommendedMovies(data);
        });
      // 소셜 추천 영화 fetch
      fetch(`http://localhost:80/api/users/${user.id}/daily-social-recommendation`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          //console.log("소셜 추천 영화 API 응답:", data.movies);
          setSocialRecommendedMovies(Array.isArray(data.movies) ? data.movies : []);
          setSocialRecommender(data.recommender || null); // 추가
        });
      // 새로운 장르 추천 fetch
      fetch(`http://localhost:80/api/users/${user.id}/new-genre-recommendation`, {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => {
          console.log("새로운 장르 추천 API 응답:", data);
          setNewGenreRecommendations(Array.isArray(data.genres) ? data.genres : []);
        });
    } else {
      setRecommendedMovies({});
      setSocialRecommendedMovies([]);
      setMainSocialRecommendedMovies([]);
      setMainSocialRecommender(null);
      setNewGenreRecommendations([]);
    }
  }, [user]);


  // 새로운 장르 추천 영화(장르별 1개 + pool에서 2개 랜덤) 추출
  const genreOneMovies = newGenreRecommendations
    .map(genreObj => (Array.isArray(genreObj.movies) && genreObj.movies.length > 0 ? genreObj.movies[0] : null))
    .filter(Boolean);
  const allMoviesPool = newGenreRecommendations.flatMap(genreObj => Array.isArray(genreObj.movies) ? genreObj.movies : []);
  const usedMovieCds = new Set(genreOneMovies.map(m => m.movieCd));
  const extraMovies = allMoviesPool
    .filter(m => !usedMovieCds.has(m.movieCd))
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const finalNewGenreMovies = [...genreOneMovies, ...extraMovies].slice(0, 20);

  const sections = [
    { title: '평점 높은 영화', key: 'toprated', data: topRatedMovies },
    { title: '인기 영화', key: 'popular', data: popularMovies },
    { title: '박스오피스 순위', key: 'boxoffice', data: boxOfficeData, ratings },
    { title: '개봉 예정작', key: 'upcoming', data: comingSoonMovies },
    // 선호 태그별 추천 영화 섹션 추가
    ...(user && Object.keys(recommendedMovies).length > 0
      ? Object.entries(recommendedMovies).map(([tag, movies]) => ({
        title: `${tag} 영화`,
        key: `like-${tag}`,
        data: Array.isArray(movies) ? movies : [],
      }))
      : []
    ),
    // 소셜 추천 영화 섹션 추가
    ...(user && socialRecommendedMovies.length > 0
      ? [{
          title: (
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              {socialRecommender?.profileImageUrl && (
                <img
                  src={socialRecommender.profileImageUrl}
                  alt="프로필"
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <span style={{fontWeight: 600}}>
                {socialRecommender?.nickname || '친구'}
              </span>
              <span>님이 추천한 영화</span>
            </span>
          ),
          key: 'social-recommend',
          data: socialRecommendedMovies,
        }]
      : []
    ),
    // 새로운 장르 추천 섹션(하나만)
    ...(user && finalNewGenreMovies.length > 0
      ? [{
          title: '새로운 장르 추천',
          key: 'new-genre-recommend',
          data: finalNewGenreMovies,
        }]
      : []
    ),
    { title: directorInfo && directorInfo.name ? `${directorInfo.name} 감독 영화` : '감독 영화', key: 'director', data: directorMovies, directorInfo },
    { title: actorInfo && actorInfo.name ? `${actorInfo.name} 출연 영화` : '배우 출연 영화', key: 'actor', data: actorMovies, actorInfo },
  ];

  const [visibleSectionCount, setVisibleSectionCount] = useState(3);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const handleIntersect = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setVisibleSectionCount((prev) => prev + 3);
    }
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current && observerRef.current.disconnect();
  }, [handleIntersect, loadMoreRef, sections]);

  return (
    <div className={styles.main}>
      <BannerSlider />
      {sections.slice(0, visibleSectionCount).map(section => (
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
      {/* 무한스크롤 트리거용 div */}
      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
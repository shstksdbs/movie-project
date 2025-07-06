// MovieDetailPage.jsx (상위 컴포넌트)
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MovieDetailHeader from './MovieDetailHeader';
import MovieDetailBody from './MovieDetailBody';
import styles from './MovieDetailPage.module.css';


export default function MovieDetailPage() {
  const { movieCd } = useParams();
  const location = useLocation();
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('movieCd:', movieCd);
    if (!movieCd) return;
    // 페이지 진입 시 스크롤 맨 위로
    window.scrollTo(0, 0);
    // location state에서 영화 데이터 확인
    const { movieData, sectionKey } = location.state || {};

    // 영화 데이터가 있는 경우 API 호출 생략
    if (movieData) {
      console.log('영화 데이터 사용:', movieData, '섹션:', sectionKey);
      setLoading(false);

      // 감독/배우 정보가 있으면 그대로 사용, 없으면 기존 방식
      const transformedData = {
        movieCd: movieData.movieCd,
        movieNm: movieData.movieNm,
        movieNmEn: movieData.movieNmEn,
        openDt: movieData.openDt,
        genreNm: movieData.genreNm,
        nationNm: movieData.nationNm,
        rank: movieData.rank,
        reservationRate: movieData.reservationRate,
        watchGradeNm: movieData.watchGradeNm,
        posterUrl: movieData.posterUrl,
        status: movieData.status,
        description: movieData.description || '',
        showTm: movieData.showTm || 0,
        companyNm: movieData.companyNm || '',
        averageRating: movieData.averageRating || 0.0,
        audienceCount: movieData.audienceCount || 0,
        // 감독/배우 정보 우선 사용
        directors: movieData.directors
          ? movieData.directors
          : (movieData.directorName
            ? [{ id: 'director', peopleNm: movieData.directorName, photoUrl: movieData.directorPhotoUrl }]
            : []),
        actors: movieData.actors || (sectionKey === 'actor' || sectionKey === 'director' ? [] : []),
        stillcuts: movieData.stillcuts || []
      };
      setMovieDetail(transformedData);
      return;
    }

    // 데이터가 없는 경우 (직접 URL 입력 등) 에러 처리
    setError('영화 정보를 찾을 수 없습니다. 메인 페이지에서 영화를 선택해주세요.');
    setLoading(false);
  }, [movieCd, location.state]);

  if (loading) return <div className={styles.loading}>로딩중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!movieDetail) return null;

  return (
    <div className={styles.outer}>
      <MovieDetailHeader movieDetail={movieDetail} />
      <MovieDetailBody
        actors={movieDetail.actors}
        directors={movieDetail.directors}
        stillcuts={movieDetail.stillcuts}
      />
    </div>
  );
}
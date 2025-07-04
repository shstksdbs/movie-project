// MovieDetailPage.jsx (상위 컴포넌트)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // 추가!
import MovieDetailHeader from './MovieDetailHeader';
import MovieDetailBody from './MovieDetailBody';
import axios from 'axios';
import styles from './MovieDetailPage.module.css';


export default function MovieDetailPage() {
  const { movieCd } = useParams(); // 여기서 직접 꺼냄!
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('movieCd:', movieCd);
    if (!movieCd) return;
    setLoading(true);
    axios.get(`http://localhost:80/api/movies/${movieCd}`, { credentials: 'include' })
        .then(res => {
            console.log('API 응답:', res.data);
            setMovieDetail(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error('API 에러:', err);
            setError('영화 정보를 불러오지 못했습니다.');
            setLoading(false);
        });
  }, [movieCd]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
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
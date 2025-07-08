import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './DirectorDetailPage.module.css';
import likeIcon from '../../assets/like_icon.png';
import likeIconTrue from '../../assets/like_icon_true.png';
import MovieHorizontalSlider from '../MainPage/MovieHorizontalSlider';

export default function DirectorDetailPage() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchActorDetail() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:80/api/person/director/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('감독 정보를 불러오지 못했습니다.');
        const data = await res.json();
        console.log(data);
        setPerson(data.person);
        setMovies(data.movies);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchActorDetail();
  }, [id]);

  if (error) return <div>에러: {error}</div>;
  if (!person) return <div>감독 정보를 찾을 수 없습니다.</div>;

  function DirectorCard({ director }) {
    return (
      <div className={styles.actorCard}>
        <div
          className={styles.actorImg}
          style={{
            backgroundImage: director.photoUrl ? `url(${director.photoUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className={styles.actorName}>{director.name}</div>
        <div className={styles.actorRole}>{director.role}</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.profileSection}>
        <DirectorCard director={{
          name: person.name,
          role: '감독',
          photoUrl: person.photoUrl
        }} />
      </div>

      <hr className={styles.divider} />
      <div className={styles.sliderSection}>
        <h2 className={styles.sectionTitle}>제작</h2>
        <MovieHorizontalSlider
          data={movies.filter(m => m && m.movieCd)}
          sectionKey="actor"
        />
      </div>
    </div>
  );
} 
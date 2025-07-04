import React, { useState } from 'react';
import styles from './MovieDetailBody.module.css';
// assets 이미지 import
import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';
import banner4 from '../../assets/banner4.jpg';
import userIcon from '../../assets/user_icon.png';
import userProfile from '../../assets/user_profile.png';
import previousIcon from '../../assets/previous_icon.png';
import nextIcon from '../../assets/next_icon.png';
import MovieHorizontalSlider from '../MainPage/MovieHorizontalSlider';


const dummySimilar = [
  { id: 1, title: '비슷한 영화 1', posterUrl: banner1 },
  { id: 2, title: '비슷한 영화 2', posterUrl: banner2 },
  { id: 3, title: '비슷한 영화 3', posterUrl: banner3 },
  { id: 4, title: '비슷한 영화 4', posterUrl: banner4 },
  { id: 5, title: '비슷한 영화 5', posterUrl: banner1 },
  { id: 6, title: '비슷한 영화 6', posterUrl: banner2 },
  { id: 7, title: '비슷한 영화 4', posterUrl: banner4 },
  { id: 8, title: '비슷한 영화 5', posterUrl: banner1 },
  { id: 9, title: '비슷한 영화 6', posterUrl: banner2 },
];


function CommentCard({ comment }) {
  return (
    <div className={styles.commentCard}>
      <div className={styles.commentUser}>{comment.user}</div>
      <div className={styles.commentContent}>{comment.content}</div>
      <div className={styles.commentDate}>{comment.date}</div>
    </div>
  );
}
function SimilarMovieCard({ movie }) {
  return (
    <div className={styles.similarMovieCard}>
      <img src={movie.posterUrl} alt={movie.title} className={styles.similarPoster} />
      <div className={styles.similarTitle}>{movie.title}</div>
    </div>
  );
}
function StillcutCard({ still }) {
  return (
    <div className={styles.stillcutCard}>
      <img src={still.imageUrl} alt="스틸컷" className={styles.stillcutImg} />
    </div>
  );
}

// (코멘트 데이터 예시, 실제 데이터로 대체)
const commentList = [
  { user: 'hooniss', content: '스포일러가 있어요!!보기', date: '2023-01-01' },
  { user: '우진', content: '감독이 역겨운 선민의식에 휩싸여 있다...', date: '2023-01-02' },
  { user: '난춘', content: '보는 내내 "아니?" "굳이?" "왜?"를 반복하게 만든다.', date: '2023-01-03' },
  { user: '캡틴부메랑', content: '그러니까 내가 돈이 너무 많은데 인생이 재미가 없어서...', date: '2023-01-04' },
  { user: '19', content: '스포일러가 있어요!!보기', date: '2023-01-05' },
  { user: '김민재', content: '산산조각 난 아이디어, 오징어처럼 흐물흐물해진 완성도.', date: '2023-01-06' },
  { user: '현석2', content: '우리 오징어게임 그정도 아닙니다.', date: '2023-01-07' },
  { user: '강도인', content: '전편보다 낫다는 이야기를 듣고 보았다. 그렇지 않았다.', date: '2023-01-08' },
];
const displayedComments = commentList.slice(0, 8);

export default function MovieDetailBody({ actors, directors, stillcuts }) {

  const [castPage, setCastPage] = useState(0);

  const directorList = (directors || []).map(d => ({
    id: d.id,
    peopleNm: d.peopleNm,
    photoUrl: d.photoUrl && d.photoUrl.trim() !== '' ? d.photoUrl : userIcon,
    cast: '감독',
  }));
  const actorList = (actors || []).map(a => ({
    id: a.id,
    peopleNm: a.peopleNm,
    photoUrl: a.photoUrl && a.photoUrl.trim() !== '' ? a.photoUrl : userIcon,
    cast: '출연',
  }));
  const castList = [...directorList, ...actorList];

  // 슬라이더 세팅
  const castPerPage = 12; // 4x3
  const castTotalPage = Math.ceil(castList.length / castPerPage);
  const castPages = [];
  for (let i = 0; i < castTotalPage; i++) {
    castPages.push(castList.slice(i * castPerPage, (i + 1) * castPerPage));
  }

  const [stillStart, setStillStart] = useState(0);
  const stillVisible = 1; // 한 번에 1장씩
  const stillcutsData = stillcuts || [];
  const stillCardWidth = 1280; // 원하는 카드 width(px)로 맞추세요
  const stillCardGap = 20;    // 카드 사이 gap(px)로 맞추세요

  const handlePrev = () => setStillStart(Math.max(0, stillStart - 1));
  const handleNext = () => setStillStart(Math.min(stillcutsData.length - stillVisible, stillStart + 1));

  return (
    <div className={styles.detailBody}>
      <section>
        <h2>출연/제작</h2>
        <div className={styles.castSliderWrapper}>
          {castPage > 0 && (
            <button className={`${styles.castNavBtn} ${styles.left}`} onClick={() => setCastPage(castPage - 1)}>
              <img src={previousIcon} alt="이전" />
            </button>
          )}
          <div
            className={styles.castSliderTrack}
            style={{ transform: `translateX(-${castPage * 100}%)`, transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {castPages.map((pageList, pageIdx) => (
              <div className={`${styles.castGrid} ${pageIdx === 0 ? styles.firstCastGrid : ''}`} key={pageIdx}>
                {pageList.map((person, idx) => {
                  const rowIdx = Math.floor(idx / 4);
                  const isFirstOrSecondRow = rowIdx === 0 || rowIdx === 1;
                  return (
                    <div
                      className={styles.castCard}
                      key={person.id || idx}
                    >
                      <img src={person.photoUrl} alt={person.peopleNm} className={styles.castImg} />
                      <div className={
                        styles.castInfo +
                        (isFirstOrSecondRow ? ' ' + styles.castInfoWithBorder : '')
                      }>
                        <div className={styles.castName}>{person.peopleNm}</div>
                        <div className={styles.castRole}>{person.cast}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {castPage < castTotalPage - 1 && (
            <button className={`${styles.castNavBtn} ${styles.right}`} onClick={() => setCastPage(castPage + 1)}>
              <img src={nextIcon} alt="다음" />
            </button>
          )}
        </div>
      </section>
      <section>
        <h2>코멘트</h2>
        <div className={styles.commentGrid}>
          {displayedComments.map((comment, idx) => (
            <div className={styles.commentCard} key={idx}>
              <div className={styles.commentUser}>{comment.user}</div>
              <div className={styles.commentContent}>{comment.content}</div>
              <div className={styles.commentDate}>{comment.date}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>비슷한 장르의 영화</h2>
        <MovieHorizontalSlider
          data={dummySimilar}
          sectionKey="similar"
          CardComponent={SimilarMovieCard}
        />
      </section>
      <section>
        <h2>스틸컷</h2>
        <div className={styles.StillsliderWrapper}>
          {stillStart > 0 && (
            <button
              className={`${styles.navBtn} ${styles.left}`}
              onClick={handlePrev}
            >
              <img src={previousIcon} alt="이전" />
            </button>
          )}
          <div
            className={styles.slider}
            style={{
              display: 'flex',
              transition: 'transform 0.4s',
              transform: `translateX(-${stillStart * (stillCardWidth + stillCardGap)}px)`
            }}
          >
            {stillcutsData.map((still, idx) => (
              <div
                className={styles.stillcutCard}
                key={still.id || idx}
                style={{
                  flex: `0 0 ${stillCardWidth}px`,
                  marginRight: idx !== stillcutsData.length - 1 ? `${stillCardGap}px` : 0
                }}
              >
                <img src={still.imageUrl} alt="스틸컷" className={styles.stillcutImg} />
              </div>
            ))}
          </div>
          {stillStart + stillVisible < stillcutsData.length && (
            <button
              className={`${styles.navBtn} ${styles.right}`}
              onClick={handleNext}
            >
              <img src={nextIcon} alt="다음" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
} 
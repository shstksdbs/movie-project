import React, { useState } from 'react';
import MovieHorizontalSlider from '../MainPage/MovieHorizontalSlider';
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

const castList = [
  { name: "이정재", role: "출연 | 성기훈", img: userIcon },
  { name: "위하준", role: "출연 | 준호", img: userIcon },
  { name: "박성훈", role: "출연 | 현주", img: userIcon },
  { name: "송영창", role: "출연 | 백억남", img: userIcon },
  { name: "이병헌", role: "출연 | 프론트맨", img: userIcon },
  { name: "박규영", role: "출연 | 노을", img: userIcon },
  { name: "양동근", role: "출연 | 웅식", img: userIcon },
  { name: "이다윗", role: "출연 | 민수", img: userIcon },
  { name: "임시완", role: "출연 | 명기", img: userIcon },
  { name: "이진욱", role: "출연 | 경석", img: userIcon },
  { name: "강애심", role: "출연 | 금자", img: userIcon },
  { name: "노재원", role: "출연 | 남규", img: userIcon },
  { name: "이정재", role: "출연 | 성기훈", img: userIcon },
  { name: "위하준", role: "출연 | 준호", img: userIcon },
  { name: "박성훈", role: "출연 | 현주", img: userIcon },
  { name: "송영창", role: "출연 | 백억남", img: userIcon },
  { name: "이병헌", role: "출연 | 프론트맨", img: userIcon },
  { name: "박규영", role: "출연 | 노을", img: userIcon },
  { name: "양동근", role: "출연 | 웅식", img: userIcon },
  { name: "이다윗", role: "출연 | 민수", img: userIcon },
  { name: "임시완", role: "출연 | 명기", img: userIcon },
  { name: "이진욱", role: "출연 | 경석", img: userIcon },
  { name: "강애심", role: "출연 | 금자", img: userIcon },
  { name: "노재원", role: "출연 | 남규", img: userIcon }
];

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
const dummyStills = [
  { id: 1, imageUrl: banner1 },
  { id: 2, imageUrl: banner2 },
  { id: 3, imageUrl: banner3 },
  { id: 4, imageUrl: banner4 },
  { id: 5, imageUrl: banner1 },
  { id: 6, imageUrl: banner1 },
  { id: 7, imageUrl: banner1 },
  { id: 8, imageUrl: banner1 },
];

// 카드 컴포넌트들 (실제 파일 분리 가능)
function PersonCard({ person }) {
  return (
    <div className={styles.personCard}>
      <img src={person.photo} alt={person.name} className={styles.personPhoto} />
      <div className={styles.personName}>{person.name}</div>
      <div className={styles.personRole}>{person.role}</div>
    </div>
  );
}
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

export default function MovieDetailBody() {
  // 슬라이더 상태 추가
  const [castPage, setCastPage] = useState(0);
  const castPerPage = 12; // 4x3
  const castTotalPage = Math.ceil(castList.length / castPerPage);
  const castStartIdx = castPage * castPerPage;
  const castEndIdx = castStartIdx + castPerPage;
  const currentCastList = castList.slice(castStartIdx, castEndIdx);

  // castList를 12명씩 페이지로 나누기
  const castPages = [];
  for (let i = 0; i < castTotalPage; i++) {
    castPages.push(castList.slice(i * castPerPage, (i + 1) * castPerPage));
  }

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
                      className={
                        styles.castCard
                      }
                      key={idx}
                    >
                      <img src={person.img} alt={person.name} className={styles.castImg} />
                      <div className={
                        styles.castInfo +
                        (isFirstOrSecondRow ? ' ' + styles.castInfoWithBorder : '')
                      }>
                        <div className={styles.castName}>{person.name}</div>
                        <div className={styles.castRole}>{person.role}</div>
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
            <CommentCard comment={comment} key={idx} />
          ))}
        </div>
      </section>
      <section>
        <h2>비슷한 작품</h2>
        <MovieHorizontalSlider
          data={dummySimilar}
          sectionKey="similar"
          ratings={null}
          actorInfo={null}
          CardComponent={SimilarMovieCard}
        />
      </section>
      <section>
        <h2>스틸컷</h2>
        <MovieHorizontalSlider
          data={dummyStills}
          sectionKey="stillcut"
          ratings={null}
          actorInfo={null}
          CardComponent={StillcutCard}
        />
      </section>
    </div>
  );
} 
import React, { useState, useRef, useEffect } from 'react';
import styles from './MovieDetailHeader.module.css';


// 아이콘 경로
import plusIcon from '../../assets/plus_icon.png';
import commentIcon from '../../assets/comment_icon.png';
import shareIcon from '../../assets/share_icon.png';
import moreIcon from '../../assets/more_icon.png';
import plusIcon_hover from '../../assets/plus_icon_hover.png';
import commentIcon_hover from '../../assets/comment_icon_hover.png';
import shareIcon_hover from '../../assets/share_icon_hover.png';
import posterImg from '../../assets/banner1.jpg'; // 임시 포스터 이미지
import starFull from '../../assets/star_full.svg';
import starHalf from '../../assets/star_half.svg';
import starEmpty from '../../assets/star_empty.svg';
import CommentModal from '../Modal/CommentModal';


const MovieDetailHeader = ({ movieDetail, onCommentSaved }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [plusHover, setPlusHover] = useState(false);
    const [commentHover, setCommentHover] = useState(false);
    const [shareHover, setShareHover] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const summaryRef = useRef(null);

    useEffect(() => {
        if (summaryRef.current) {
            // 실제로 3줄을 넘는지 체크
            const el = summaryRef.current;
            setIsOverflow(el.scrollHeight > el.clientHeight + 1); // 약간의 오차 허용
        }
    }, [movieDetail?.description]);

    const handleCommentClick = () => {
        if (userRating === 0) {
            alert('별점을 먼저 입력해주세요.');
            return;
        }
        setCommentModalOpen(true);
    };
    const handleCommentSave = (comment) => {
        // TODO: 저장 로직 구현
        alert('코멘트가 저장되었습니다!\n' + comment);
        setCommentModalOpen(false);
        if (onCommentSaved) onCommentSaved();
    };

    return (
        <>
            <div className={styles.headerWrap}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>
                        {movieDetail.movieNm} <span className={styles.rating}>★ {movieDetail.averageRating}</span>
                    </h1>
                    <div className={styles.info}>
                        <span>{movieDetail.openDt}</span> · <span>{movieDetail.genreNm}</span>
                    </div>
                    <div className={styles.meta}>
                        <span>{movieDetail.showTm}분</span> · <span>{movieDetail.watchGradeNm}</span>
                    </div>
                    <div className={styles.stats}>
                        <span>예매 순위 {movieDetail.rank || movieDetail.reservationRank}위</span><span>({movieDetail.reservationRate})</span> · <span>누적 관객 {movieDetail.audienceCount || movieDetail.totalAudience}</span>
                    </div>
                    <div className={styles.userRating}>
                        <span>평가하기</span>
                        {[...Array(5)].map((_, i) => {
                            const value = i + 1;
                            let starImg = starEmpty;
                            if ((hoverRating ? hoverRating : userRating) >= value) {
                                starImg = starFull;
                            } else if ((hoverRating ? hoverRating : userRating) >= value - 0.5) {
                                starImg = starHalf;
                            }
                            return (
                                <img
                                    key={i}
                                    src={starImg}
                                    alt={`${value}점`}
                                    onClick={e => {
                                        const rect = e.target.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        if (x < rect.width / 2) {
                                            setUserRating(value - 0.5);
                                        } else {
                                            setUserRating(value);
                                        }
                                    }}
                                    onMouseMove={e => {
                                        const rect = e.target.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        if (x < rect.width / 2) {
                                            setHoverRating(value - 0.5);
                                        } else {
                                            setHoverRating(value);
                                        }
                                    }}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={styles.starImg}
                                    role="button"
                                    aria-label={`${value}점 주기`}
                                    
                                />
                            );
                        })}
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.actionItem}>
                            <button
                                className={styles.iconBtn}
                                onMouseEnter={() => setPlusHover(true)}
                                onMouseLeave={() => setPlusHover(false)}
                            >
                                <img src={plusHover ? plusIcon_hover : plusIcon} alt="찜하기" />
                            </button>
                            <div className={styles.actionLabel}>찜</div>
                        </div>
                        <div className={styles.actionItem}>
                            <button
                                className={styles.iconBtn}
                                onMouseEnter={() => setCommentHover(true)}
                                onMouseLeave={() => setCommentHover(false)}
                                onClick={handleCommentClick}
                            >
                                <img src={commentHover ? commentIcon_hover : commentIcon} alt="코멘트" />
                            </button>
                            <div className={styles.actionLabel}>코멘트</div>
                        </div>
                        <div className={styles.actionItem}>
                            <button
                                className={styles.iconBtn}
                                onMouseEnter={() => setShareHover(true)}
                                onMouseLeave={() => setShareHover(false)}
                            >
                                <img src={shareHover ? shareIcon_hover : shareIcon} alt="공유하기" />
                            </button>
                            <div className={styles.actionLabel}>공유</div>
                        </div>
                    </div>
                    <div className={styles.summaryWrap}>
                        {/* showMore가 false일 때만 미리보기(3줄) */}
                        {!showMore && (
                            <span
                                className={styles.summaryPreview}
                                ref={summaryRef}
                            >
                                {movieDetail.description}
                            </span>
                        )}
                        {/* 더보기 버튼: 3줄 초과 + showMore가 false일 때만 */}
                        {isOverflow && !showMore && (
                            <button className={styles.moreBtn} onClick={() => setShowMore(true)}>
                                더보기
                                <img src={moreIcon} alt="더보기 화살표" className={styles.moreIcon} />
                            </button>
                        )}
                        {/* showMore가 true일 때 전체 설명 */}
                        {showMore && (
                            <>
                                <span className={styles.summaryMore}>
                                    {movieDetail.description}
                                </span>
                                <button className={styles.closeBtn} onClick={() => setShowMore(false)}>
                                    닫기
                                    <img src={moreIcon} alt="닫기" className={styles.closeIcon} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <img src={movieDetail.posterUrl || posterImg} alt="영화 포스터" className={styles.posterImg} />
                </div>
            </div>
            <hr className={styles.detailDivider} />
            <CommentModal
                open={commentModalOpen}
                onClose={() => setCommentModalOpen(false)}
                onSave={handleCommentSave}
                movieTitle={movieDetail.movieNm}
                userRating={userRating}
                movieCd={movieDetail.movieCd}
            />
        </>
    );
};

export default MovieDetailHeader; 
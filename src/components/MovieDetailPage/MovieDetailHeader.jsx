import React, { useState } from 'react';
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


const summaryText = `수백년간 전설로 이어져온 바이킹과 드래곤의 전쟁! 드래곤을 죽여야만 진정한 전사가 될 수 있다는 신념을 가진 '히컵'은 어느 날 숲 속에서 총에 맞아 추락한 이빨도 없는 검은 드래곤과 운명적으로 만나게 되는데...
수백년간 전설로 이어져온 바이킹과 드래곤의 전쟁! 드래곤을 죽여야만 진정한 전사가 될 수 있다는 신념을 가진 '히컵'은 어느 날 숲 속에서 총에 맞아 추락한 이빨도 없는 검은 드래곤과 운명적으로 만나게 되는데...
수백년간 전설로 이어져온 바이킹과 드래곤의 전쟁! 드래곤을 죽여야만 진정한 전사가 될 수 있다는 신념을 가진 '히컵'은 어느 날 숲 속에서 총에 맞아 추락한 이빨도 없는 검은 드래곤과 운명적으로 만나게 되는데...`;

const MovieDetailHeader = () => {
    const [showMore, setShowMore] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [plusHover, setPlusHover] = useState(false);
    const [commentHover, setCommentHover] = useState(false);
    const [shareHover, setShareHover] = useState(false);

    // 줄거리 전체 반환 (CSS로 3줄 제한)
    const getSummary = () => summaryText;

    return (
        <>
            <div className={styles.headerWrap}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>
                        드래곤 길들이기 <span className={styles.rating}>★ 3.8</span>
                    </h1>
                    <div className={styles.info}>
                        <span>2025</span> · <span>모험/판타지/애니메이션</span> · <span>미국, 영국</span>
                    </div>
                    <div className={styles.meta}>
                        <span>125분</span> · <span>전체 이용가</span>
                    </div>
                    <div className={styles.stats}>
                        <span>예매 순위 2위(4.6%)</span> · <span>누적 관객 130.8만명</span>
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
                        <span className={styles.summaryPreview}>
                            {summaryText.slice(0, 120)}
                            {summaryText.length > 120 && '...'}
                        </span>
                        {summaryText.length > 120 && showMore && (
                            <span className={styles.summaryMore}>
                                {summaryText.slice(120)}
                            </span>
                        )}
                        {summaryText.length > 120 && !showMore && (
                            <button className={styles.moreBtn} onClick={() => setShowMore(true)}>
                                더보기
                                <img src={moreIcon} alt="더보기 화살표" className={styles.moreIcon} />
                            </button>
                        )}
                        {summaryText.length > 120 && showMore && (
                            <button className={styles.closeBtn} onClick={() => setShowMore(false)}>
                                닫기
                                <img src={moreIcon} alt="닫기" className={styles.closeIcon} />
                            </button>
                        )}
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <img src={posterImg} alt="영화 포스터" className={styles.posterImg} />
                </div>
            </div>
            <hr className={styles.detailDivider} />

        </>
    );
};

export default MovieDetailHeader; 
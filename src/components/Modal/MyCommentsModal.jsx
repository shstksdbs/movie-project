import React from 'react';
import styles from './LikedCommentsModal.module.css';
import userIcon from '../../assets/user_icon.png';

export default function MyCommentsModal({ open, onClose, myComments = [], onCommentClick }) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.headerRow}>
          <span className={styles.title}>내가 작성한 코멘트 전체보기</span>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <div className={styles.countRow}>{myComments.length}개의 코멘트</div>
        <div className={styles.commentList}>
          {myComments.length === 0 ? (
            <div className={styles.empty}>아직 작성한 코멘트가 없습니다.</div>
          ) : (
            myComments.map((comment, idx) => (
              <div
                className={styles.commentCard}
                key={comment.id || idx}
                onClick={() => onCommentClick && onCommentClick(comment)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.commentHeader}>
                  <div className={styles.commentHeaderLeft}>
                    <img
                      src={comment.authorProfileImageUrl || comment.userProfileImageUrl || userIcon}
                      alt="프로필"
                      className={styles.commentUserProfileImage}
                    />
                    <span className={styles.commentUser}>{comment.authorNickname || comment.userNickname || '익명'}</span>
                    <span className={styles.commentDate}>{comment.updatedAt ? new Date(comment.updatedAt).toLocaleDateString('ko-KR') : ''}</span>
                  </div>
                  <span className={styles.commentRating}>★ {comment.rating ? comment.rating.toFixed(1) : '-'}</span>
                </div>
                <div className={styles.commentDivider}></div>
                <div className={styles.commentContent}>{comment.content}</div>
                <div className={styles.commentDivider}></div>
                <div className={styles.commentFooter}>
                  <span>좋아요 {comment.likeCount ?? 0}</span>
                  <span>댓글 {comment.commentCount ?? 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
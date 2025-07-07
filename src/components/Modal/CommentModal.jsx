import React, { useState, useEffect } from 'react';
import styles from './CommentModal.module.css';
import starFull from '../../assets/star_full.svg';
import starHalf from '../../assets/star_half.svg';
import starEmpty from '../../assets/star_empty.svg';

const CommentModal = ({
  open,
  onClose,
  movieTitle,
  movieCd,
  userRating,
  onSave,
  // 수정 모드 관련 props
  editMode = false,
  initialContent = '',
  initialRating = 0,
  onEditSave,
  reviewId
}) => {
  const [comment, setComment] = useState(initialContent);
  const [rating, setRating] = useState(editMode ? initialRating : userRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const maxLength = 10000;

  useEffect(() => {
    if (editMode) {
      setComment(initialContent);
      setRating(initialRating);
    } else {
      setComment('');
      setRating(userRating);
    }
  }, [open, editMode, initialContent, initialRating, userRating]);

  if (!open) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editMode) {
        // PUT 요청 (수정)
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            content: comment,
            rating: rating,
          }),
        });
        const data = await response.json();
        if (data.success) {
          alert('리뷰가 수정되었습니다!');
          if (onEditSave) onEditSave(comment, rating);
          onClose();
        } else {
          alert(data.message || '리뷰 수정에 실패했습니다.');
        }
      } else {
        // POST 요청 (작성)
        const response = await fetch('http://localhost:80/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieCd,
            content: comment,
            rating: rating,
          }),
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          alert('리뷰가 작성되었습니다!');
          if (onSave) onSave(comment, rating);
          onClose();
        } else {
          alert(data.message || '리뷰 작성에 실패했습니다.');
        }
      }
    } catch (e) {
      alert('리뷰 저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <span className={styles.title}>{movieTitle} <span className={styles.star}>★ {rating}</span></span>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        <hr className={styles.divider} />
        <textarea
          className={styles.textarea}
          placeholder="이 작품에 대한 생각을 자유롭게 표현해주세요."
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={maxLength}
          disabled={loading}
        />
        
        <hr className={styles.divider} />
        <div className={styles.footer}>
        {editMode && (
          <div className={styles.starInputRow}>
            <label className={styles.starInputLabel}>평가하기 </label>
            <div className={styles.starInputIcons}>
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                let starImg = starEmpty;
                if ((hoverRating ? hoverRating : rating) >= value) {
                  starImg = starFull;
                } else if ((hoverRating ? hoverRating : rating) >= value - 0.5) {
                  starImg = starHalf;
                }
                return (
                  <img
                    key={i}
                    src={starImg}
                    alt={`${value}점`}
                    onClick={e => {
                      if (loading) return;
                      const rect = e.target.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      if (x < rect.width / 2) {
                        setRating(value - 0.5);
                      } else {
                        setRating(value);
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
                    className={`${styles.starIcon}${loading ? ' ' + styles.disabled : ''}`}
                    role="button"
                    aria-label={`${value}점 주기`}
                  />
                );
              })}
            </div>
          </div>
        )}
          <span className={styles.length}>{comment.length}/{maxLength}</span>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={comment.length === 0 || loading}
          >
            {loading ? (editMode ? '수정 중...' : '저장 중...') : (editMode ? '수정' : '저장')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal; 
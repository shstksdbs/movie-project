import React, { useEffect, useState } from 'react';
import styles from './CommentDetailModal.module.css';
import likeIcon from '../../assets/like_icon.png';
import likeIconTrue from '../../assets/like_icon_true.png';
import userIcon from '../../assets/user_icon.png';

import commentIcon2 from '../../assets/comment_icon2.png';
import ReplyModal from './ReplyModal';
import { useUser } from '../../contexts/UserContext';

// 대댓글(Reply) 카드 컴포넌트
function ReplyCard({ reply, userId, onEdit, onDelete }) {
  const isMine = userId && (reply.userId === userId);
  return (
    <div className={styles.replyCard}>

      <div className={styles.replyContentWrap}>
        <div className={styles.replyHeader}>
          <img src={userIcon} alt="프로필" className={styles.replyUserIcon} />
          <span className={styles.replyUser}>{reply.userNickname || reply.user || '익명'}</span>
          <span className={styles.replyDate}>{getRelativeDate(reply.updatedAt || reply.createdDate)}</span>
          <div className={styles.replyBtnGroup}>
            {isMine && (
              <>
                <button className={styles.replyEditBtn} onClick={onEdit}>수정</button>
                <button className={styles.replyDeleteBtn} onClick={onDelete}>삭제</button>
              </>
            )}
          </div>
        </div>
        <div className={styles.replyContent}>{reply.content}</div>
        <div className={styles.replyFooter}>
          <img src={likeIcon} alt="좋아요" className={styles.replyLikeIcon} />
          <span>{reply.likeCount ?? 0}</span>
          
        </div>
        <hr className={styles.replyDivider} />
      </div>
    </div>
  );
}

function getRelativeDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  // 오늘 날짜(연, 월, 일)만 비교
  const dateYMD = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  const nowYMD = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();

  if (dateYMD === nowYMD) return '오늘';

  // 며칠 전 계산
  const diffTime = now.setHours(0,0,0,0) - date.setHours(0,0,0,0);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays}일 전`;
}
// 코멘트 상세 + 대댓글 리스트 모달
const CommentDetailModal = ({ open, onClose, comment, reviewId, fetchComments }) => {
  const { user } = useUser();
  const myUserId = user?.id;
  const [localComment, setLocalComment] = useState(comment);
  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [editReplyModalOpen, setEditReplyModalOpen] = useState(false);
  const [editTargetReply, setEditTargetReply] = useState(null);

  // 대댓글 목록 불러오기 함수 분리
  const fetchReplies = () => {
    if (!open || !reviewId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:80/api/comments/review/${reviewId}/all`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReplies(data.data || []);
          console.log(data.data);
        } else {
          setError(data.message || '대댓글 불러오기 실패');
        }
      })
      .catch(() => setError('대댓글 불러오기 실패'))
      .finally(() => setLoading(false));
  };

  // 좋아요 클릭 핸들러
  const handleLike = async () => {
    if (!reviewId) return;
    try {
      let res;
      if (localComment?.likedByMe) {
        // 좋아요 취소 (DELETE)
        res = await fetch(`http://localhost:80/api/reviews/dto/${reviewId}/like`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
        // 좋아요 (POST)
        res = await fetch(`http://localhost:80/api/reviews/dto/${reviewId}/like`, {
          method: 'POST',
          credentials: 'include',
        });
      }
      if (res.ok) {
        // 상태 즉시 반영
        setLocalComment(prev => ({
          ...prev,
          likedByMe: !prev.likedByMe,
          likeCount: prev.likedByMe
            ? (prev.likeCount ?? 1) - 1
            : (prev.likeCount ?? 0) + 1,
        }));
        if (fetchComments) fetchComments();
        fetchReplies();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
      } else {
        alert('좋아요 처리 실패');
      }
    } catch (e) {
      alert('네트워크 오류');
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEditReply = (reply) => {
    setEditTargetReply(reply);
    setEditReplyModalOpen(true);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteReply = async (reply) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`http://localhost:80/api/comments/${reply.id}?userId=${myUserId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        alert('댓글이 삭제되었습니다.');
        fetchReplies();
        if (fetchComments) fetchComments();
        setLocalComment(prev => ({
          ...prev,
          commentCount: Math.max((prev?.commentCount ?? 1) - 1, 0)
        }));
      } else {
        alert(data.message || '삭제 실패');
      }
    } catch (e) {
      alert('네트워크 오류');
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [open, reviewId]);

  if (!open || !comment) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* 상단: 코멘트 카드 (MovieDetailBody 스타일 재사용) */}
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <div className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentUser}>{comment.userNickname || comment.user || '익명'}</span>
            <span className={styles.commentRating}>★ {comment.rating ? comment.rating.toFixed(1) : '-'}</span>
          </div>
          <hr className={styles.commentDivider} />
          <div className={styles.commentContent}>{comment.content}</div>
          <hr className={styles.commentFooterDivider} />
          <div className={styles.commentFooter}>
            <span>좋아요 {localComment?.likeCount ?? 0}</span>
            <span>댓글 {localComment?.commentCount ?? 0}</span>
            <span className={styles.commentDate}>{localComment?.createdDate || localComment?.date}</span>
          </div>
          <div className={styles.commentIconRow}>
            <img
              src={localComment?.likedByMe ? likeIconTrue : likeIcon}
              alt="좋아요"
              className={styles.commentIcon}
              onClick={handleLike}
              style={{ cursor: 'pointer' }}
            />
            <img
              src={commentIcon2}
              alt="댓글"
              className={styles.commentIcon}
              style={{ cursor: 'pointer' }}
              onClick={() => setReplyModalOpen(true)}
            />
          </div>
          {/* 대댓글 작성 모달 */}
          <ReplyModal
            open={replyModalOpen}
            onClose={() => setReplyModalOpen(false)}
            reviewId={reviewId}
            parentId={null}
            isReply={true}
            onSave={() => {
              setReplyModalOpen(false);
              fetchReplies();
              if (fetchComments) fetchComments();
              setLocalComment(prev => ({
                ...prev,
                commentCount: (prev?.commentCount ?? 0) + 1
              }));
            }}
          />
        </div>

        {/* 하단: 대댓글 리스트 */}
        <div className={styles.replySection}>

          {loading && <div>로딩 중...</div>}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {!loading && !error && replies.length === 0 && <div>아직 댓글이 없습니다.</div>}
          <div className={styles.replyList}>
            {replies.map((reply, idx) => (
              <ReplyCard
                reply={reply}
                userId={myUserId}
                key={reply.id || idx}
                onEdit={() => handleEditReply(reply)}
                onDelete={() => handleDeleteReply(reply)}
              />
            ))}
          </div>
        </div>
        {/* 대댓글 수정 모달 */}
        <ReplyModal
          open={editReplyModalOpen}
          onClose={() => setEditReplyModalOpen(false)}
          reviewId={reviewId}
          parentId={null}
          isReply={true}
          editMode={true}
          editTarget={editTargetReply}
          onUpdate={() => {
            setEditReplyModalOpen(false);
            fetchReplies();
            if (fetchComments) fetchComments();
          }}
        />
      </div>
    </div>
  );
};

export default CommentDetailModal; 
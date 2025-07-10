import React, { useState, useEffect } from "react";
import styles from "./MyPageHeader.module.css";
import userProfile from "../../assets/user_icon.png";
import pencilIcon from "../../assets/pencil_icon.png";
import { useUser } from "../../contexts/UserContext";
import TagEditModal from "./TagEditModal";
import { useNavigate } from 'react-router-dom';
import ProfileImageUploadModal from '../Modal/ProfileImageUploadModal';

const MyPageHeader = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  console.log("MyPageHeader 유저 정보:", user); // 디버깅용

  // 태그 모달 상태 및 태그 상태 관리
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 사용자의 선호 태그 가져오기
  useEffect(() => {
    const fetchUserPreferredGenres = async () => {
      if (!user || !user.id) {
        console.log('사용자 정보가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:80/api/users/${user.id}/preferred-genres`, {
          credentials: 'include',
        });
        if (response.ok) {
          const preferredGenres = await response.json();
          console.log('사용자 선호 태그:', preferredGenres);
          setTags(preferredGenres);
        } else {
          console.error('사용자 선호 태그를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('사용자 선호 태그를 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferredGenres();
  }, [user]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:80/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(null);
        localStorage.removeItem("autoLogin");
        localStorage.removeItem("user");
        alert("로그아웃 성공(test).");
        window.location.href = "http://localhost:3000/login";
      } else {
        alert(data.message || "로그아웃에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 태그 수정 저장
  const handleSaveTags = (selectedTags) => {
    setTags(selectedTags);
    setIsTagModalOpen(false);
  };

  const profileImageUrl = user && user.profileImageUrl ? user.profileImageUrl : userProfile;

  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.profileSection}>
          <div className={styles.infoSection}>
            <div className={styles.loadingMessage}>사용자 정보를 불러오는 중...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.profileSection}>
        <div className={styles.infoSection}>
          <div className={styles.leftSection}>
            <div className={styles.profileImgWrapper}>
              <img src={profileImageUrl} alt="프로필" className={styles.profileImg} />
              <span
                className={styles.profileImgSettingIcon}
                onClick={() => setIsProfileModalOpen(true)}
                title="프로필 사진 변경"
                style={{
                  backgroundImage: `url(${require('../../assets/setting_icon.png')})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.nicknameRow}>
                <span className={styles.nickname}>{user ? user.nickname : "닉네임"}</span>
                <img src={pencilIcon} alt="닉네임 수정" className={styles.pencilIcon} style={{cursor: 'pointer'}} onClick={() => navigate('/profile-edit')} />
              </div>
              <div className={styles.followStats}>
                팔로워 0명 · 팔로잉 0명
              </div>
            </div>
          </div>
          <div className={styles.middleSection}>
            <div className={styles.tagRow}>
              <span className={styles.tagLabel}>선호 태그</span>
              <img
                src={pencilIcon}
                alt="태그 수정"
                className={styles.pencilIconTag}
                onClick={() => setIsTagModalOpen(true)}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className={styles.tagsWrapper}>
              {tags.length > 0 ? (
                tags.map((tag, idx) => (
                  <span className={styles.tag} key={tag + idx}>
                    #{tag}
                    
                  </span>
                ))
              ) : (
                <span className={styles.noTagsMessage}>설정된 선호 태그가 없습니다.
                 </span>

              )}
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.actionSection}>
              <button className={styles.settingBtn}>
                <span className={styles.settingIcon} />회원정보 수정
              </button>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <span className={styles.logoutIcon} />로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
      {isTagModalOpen && (
        <TagEditModal
          initialSelected={tags}
          onClose={() => setIsTagModalOpen(false)}
          onSave={handleSaveTags}
        />
      )}
      {/* 프로필 이미지 변경 모달 */}
      {isProfileModalOpen && (
        <ProfileImageUploadModal
          currentImageUrl={profileImageUrl}
          onImageUpdate={() => window.location.reload()}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </header>
  );
};

export default MyPageHeader; 
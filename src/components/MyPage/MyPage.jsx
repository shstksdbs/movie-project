import React, { useEffect } from "react";
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import MyPageFooter from "./MyPageFooter";
import styles from "./MyPage.module.css";

const MyPage = () => {
  useEffect(() => {
    // 항상 맨 위로 이동
    window.scrollTo(0, 0);
    // 모든 모달 닫기(커스텀 이벤트 활용)
    window.dispatchEvent(new Event('closeAllModals'));
  }, []);

  return (
    <div className={styles.container}>
      <MyPageHeader />
      <MyPageBody />
      <MyPageFooter />
    </div>
  );
};

export default MyPage; 
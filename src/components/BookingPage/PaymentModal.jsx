import React, { useState } from "react";
import styles from "./payment.module.css";
import BookingSummary from "./BookingSummary";
import { Scrollbar } from "react-scrollbars-custom";

const PaymentModal = ({ isOpen, onClose, bookingInfo, onPay }) => {
  const [selectedMethod, setSelectedMethod] = useState("naverpay");
  const [agreed, setAgreed] = useState(false);

  // 임시 더미 영화 정보
  const dummyMovieInfo = {
    title: "영화 제목",
    poster: "/path/to/poster.jpg",
    duration: "120분",
    rating: "12세 이상",
    genre: "액션/드라마"
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePay = () => {
    if (agreed) {
      onPay();
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.paymentPage}>
        <h3 className={styles.paymentTitle}>결제정보 입력</h3>
        <div className={styles.paymentSubTitle}>
          영화예매 결제에 사용할 결제정보를 입력해주세요.
        </div>

        <Scrollbar
          style={{ height: '60vh', width: '100%' }}
          trackYProps={{
            style: {
              left: '102.5%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '90%',
              background: 'transparent',
              position: 'absolute'
            }
          }}
          thumbYProps={{
            style: {
              background: '#555',
              borderRadius: '4px'
            }
          }}
        >
          {/* 예매 정보 요약 */}
          <div className={styles.paymentSummaryBox}>
            <BookingSummary
              movieInfo={bookingInfo.movieInfo || dummyMovieInfo}
              selectedTheater={bookingInfo.theater}
              selectedDate={bookingInfo.date}
              selectedTime={bookingInfo.time}
              selectedSeats={bookingInfo.seats}
            />
            <div className={styles.paymentSummaryRow}>
              <span>결제금액</span>
              <span className={styles.paymentPrice}>7,900원 <span className={styles.paymentPeriod}>(월 정기결제)</span></span>
            </div>
          </div>

          {/* 결제수단 선택 */}
          <div className={styles.paymentSectionTitle}>결제수단 선택</div>
          <div className={styles.paymentMethodList}>
            <button
              className={`${styles.paymentMethodBtn} ${selectedMethod === "naverpay" ? styles.selected : ""}`}
              onClick={() => setSelectedMethod("naverpay")}
            >N pay</button>
            <button
              className={`${styles.paymentMethodBtn} ${selectedMethod === "kakaopay" ? styles.selected : ""}`}
              onClick={() => setSelectedMethod("kakaopay")}
            >카카오 pay</button>
            <button
              className={`${styles.paymentMethodBtn} ${selectedMethod === "tosspay" ? styles.selected : ""}`}
              onClick={() => setSelectedMethod("tosspay")}
            >toss pay</button>
            <button
              className={`${styles.paymentMethodBtn} ${selectedMethod === "card" ? styles.selected : ""}`}
              onClick={() => setSelectedMethod("card")}
            >신용카드</button>
          </div>

          {/* 약관 동의 */}
          <div className={styles.paymentAgreement}>
            <label>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              모두 동의합니다.
            </label>
            <ul className={styles.paymentAgreementList}>
              <li>매월 자동결제 및 유의사항 안내</li>
              <li>특정기기전환 제한정책 고지 (TVING → Wave)</li>
              <li>특정기기전환 제한정책 고지 (Wave → TVING)</li>
            </ul>
          </div>

          {/* 안내문구 */}
          <div className={styles.paymentNotice}>
            <p>본 제품 상품은 매월 정기 결제가 이루어지며, 다음 달에 자동 결제됩니다.</p>
            <p>- 만 14세 이상만 구매가 가능합니다.</p>
            <p>- 미성년자의 경우 "본인 사전동의"의 동의를 받아야 하며, 동의를 받지 않은 경우 법정대리인이 이용을 취소할 수 있습니다.</p>
            <p>- 결제된 상품 반납이 어렵습니다. 예매와 다른 결제가 추가 구성되어도 이용이 불가합니다.</p>
            <p>- 신용카드 결제 시, 결제카드 정보가 저장되어 매월 동일 카드로 결제됩니다.</p>
            <p>- 결제일 기준 24시간 이전에 해지 신청 시 다음 달 결제는 자동 정지됩니다.</p>
            <p>- 결제 후 환불은 불가합니다.</p>
            <p>- 기타 자세한 사항은 별도 이용정책 및 구매 페이지를 참고해 주세요.</p>
          </div>
        </Scrollbar>

        {/* 하단 버튼 */}
        <div className={styles.paymentButtonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>이전</button>
          <button
            className={styles.bookingButton}
            onClick={handlePay}
            disabled={!agreed}
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 
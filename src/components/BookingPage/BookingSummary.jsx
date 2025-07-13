import React from "react";
import styles from "./BookingPage.module.css";

const BookingSummary = ({
  movieInfo,
  selectedTheater,
  selectedDate,
  selectedTime,
  selectedSeats,
}) => {
  if (!movieInfo) return null;

  // 날짜 라벨 변환
  const dateLabelMap = {
    "2024-01-15": "1월 15일 (월)",
    "2024-01-16": "1월 16일 (화)",
    "2024-01-17": "1월 17일 (수)",
    "2024-01-18": "1월 18일 (목)",
    "2024-01-19": "1월 19일 (금)",
  };

  return (
    <div className={styles.bookingSummary}>
      <div className={styles.summaryPoster}>
        <img src={movieInfo.poster} alt={movieInfo.title} />
      </div>
      <div className={styles.summaryInfo}>
        <div className={styles.summaryTitle}>{movieInfo.title}</div>
        <div className={styles.summaryMeta}>
          <span>{movieInfo.duration}</span>
          <span>{movieInfo.rating}</span>
          <span>{movieInfo.genre}</span>
        </div>
        <div className={styles.summaryDetail}>
          <div>
            <b>극장</b> {selectedTheater || "-"}
          </div>
          <div>
            <b>일시</b> {dateLabelMap[selectedDate] || "-"} {selectedTime || ""}
          </div>
          <div>
            <b>좌석</b> {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BookingPage.module.css';
import BookingSummary from "./BookingSummary";
import PaymentModal from "./PaymentModal";

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movieInfo, setMovieInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // 영화 정보 가져오기 (실제 API 호출로 대체 필요)
  useEffect(() => {
    // 임시 영화 데이터
    const mockMovieData = {
      id: movieId,
      title: '영화 제목',
      poster: '/path/to/poster.jpg',
      duration: '120분',
      rating: '12세 이상',
      genre: '액션/드라마'
    };
    setMovieInfo(mockMovieData);
    setLoading(false);
  }, [movieId]);

  // 상영관 목록
  const theaters = [
    { id: 1, name: 'CGV 강남', location: '서울 강남구' },
    { id: 2, name: 'CGV 홍대', location: '서울 마포구' },
    { id: 3, name: 'CGV 명동', location: '서울 중구' }
  ];

  // 날짜 옵션
  const dateOptions = [
    { value: '2024-01-15', label: '1월 15일 (월)' },
    { value: '2024-01-16', label: '1월 16일 (화)' },
    { value: '2024-01-17', label: '1월 17일 (수)' },
    { value: '2024-01-18', label: '1월 18일 (목)' },
    { value: '2024-01-19', label: '1월 19일 (금)' }
  ];

  // 시간 옵션
  const timeOptions = [
    { value: '10:00', label: '10:00' },
    { value: '12:30', label: '12:30' },
    { value: '15:00', label: '15:00' },
    { value: '17:30', label: '17:30' },
    { value: '20:00', label: '20:00' },
    { value: '22:30', label: '22:30' }
  ];

  // 좌석 선택 처리
  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // 좌석 상태 랜덤 예시 함수
  const getSeatStatus = (row, col) => {
    if (row === 0 && col === 0) return 'reserved'; // 예매 완료
    if (row === 0 && col === 1) return 'disabled'; // 선택불가
    if ((row === 2 && col === 5) || (row === 4 && col === 7)) return 'reserved';
    if ((row === 3 && col === 2) || (row === 6 && col === 10)) return 'disabled';
    return 'available';
  };

  // 예매 진행
  const handleBooking = () => {
    if (!selectedTheater || !selectedDate || !selectedTime || selectedSeats.length === 0) {
      alert('모든 항목을 선택해주세요.');
      return;
    }
    
    // 예매 로직 구현
    console.log('예매 정보:', {
      movieId,
      theater: selectedTheater,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats
    });
    
    // 결제 모달 열기
    setIsPaymentModalOpen(true);
  };

  // 결제 처리
  const handlePayment = () => {
    console.log('결제 처리 중...');
    // 실제 결제 로직 구현
    alert('결제가 완료되었습니다!');
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.bookingPage}>
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          {/* <button 
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            ← 뒤로가기
          </button> */}
          <h1 className={styles.title}>영화 예매</h1>
        </div>

        {/* 영화 정보 */}
        <div className={styles.movieInfo}>
          <div className={styles.poster}>
            <img src={movieInfo?.poster} alt={movieInfo?.title} />
          </div>
          <div className={styles.movieDetails}>
            <h2 className={styles.movieTitle}>{movieInfo?.title}</h2>
            <div className={styles.movieMeta}>
              <span>{movieInfo?.duration}</span>
              <span>{movieInfo?.rating}</span>
              <span>{movieInfo?.genre}</span>
            </div>
          </div>
        </div>

        {/* 상영관 선택 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>상영관 선택</h3>
          <div className={styles.theaterList}>
            {theaters.map(theater => (
              <button
                key={theater.id}
                className={`${styles.theaterButton} ${selectedTheater === theater.name ? styles.selected : ''}`}
                onClick={() => setSelectedTheater(theater.name)}
              >
                <div className={styles.theaterName}>{theater.name}</div>
                <div className={styles.theaterLocation}>{theater.location}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 날짜 선택 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>날짜 선택</h3>
          <div className={styles.dateList}>
            {dateOptions.map(date => (
              <button
                key={date.value}
                className={`${styles.dateButton} ${selectedDate === date.value ? styles.selected : ''}`}
                onClick={() => setSelectedDate(date.value)}
              >
                {date.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 선택 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>시간 선택</h3>
          <div className={styles.timeList}>
            {timeOptions.map(time => (
              <button
                key={time.value}
                className={`${styles.timeButton} ${selectedTime === time.value ? styles.selected : ''}`}
                onClick={() => setSelectedTime(time.value)}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        {/* 좌석 선택 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>좌석 선택</h3>
          <div className={styles.seatMap}>
            <div className={styles.screen}>SCREEN</div>
            <div className={styles.seats}>
              {Array.from({ length: 8 }, (_, row) => (
                <div key={row} className={styles.seatRow}>
                  {Array.from({ length: 12 }, (_, col) => {
                    const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
                    const seatStatus = getSeatStatus(row, col);
                    return (
                      <button
                        key={seatId}
                        className={
                          `${styles.seat} ` +
                          (selectedSeats.includes(seatId) && seatStatus === 'available' ? styles.selected + ' ' : '') +
                          (seatStatus === 'reserved' ? styles.reserved + ' ' : '') +
                          (seatStatus === 'disabled' ? styles.disabled + ' ' : '')
                        }
                        onClick={() => seatStatus === 'available' && handleSeatClick(seatId)}
                        disabled={seatStatus !== 'available'}
                      >
                        {seatStatus === 'disabled' ? '✕' : seatId}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* 좌석 상태 legend */}
          <div className={styles.seatLegend}>
            <div><span className={`${styles.seat} ${styles.selected}`}></span> 선택</div>
            <div><span className={`${styles.seat} ${styles.reserved}`}></span> 예매 완료</div>
            <div><span className={`${styles.seat} ${styles.disabled}`}>✕</span> 선택불가</div>
          </div>
        </div>

        {/* 선택된 좌석 표시 */}
        {selectedSeats.length > 0 && (
          <div className={styles.selectedSeats}>
            <h4>선택된 좌석: {selectedSeats.join(', ')}</h4>
          </div>
        )}

        {/* 예매 정보 요약 박스 */}
        <BookingSummary
          movieInfo={movieInfo}
          selectedTheater={selectedTheater}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedSeats={selectedSeats}
        />

        {/* 예매/취소 버튼 */}
        <div className={styles.bookingButtonContainer}>
          <button
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
            style={{marginRight: '16px'}}
          >
            취소
          </button>
          <button 
            className={styles.bookingButton}
            onClick={handleBooking}
            disabled={!selectedTheater || !selectedDate || !selectedTime || selectedSeats.length === 0}
          >
            예매하기
          </button>
        </div>
      </div>

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingInfo={{
          movieId,
          theater: selectedTheater,
          date: selectedDate,
          time: selectedTime,
          seats: selectedSeats
        }}
        onPay={handlePayment}
      />
    </div>
  );
};

export default BookingPage; 
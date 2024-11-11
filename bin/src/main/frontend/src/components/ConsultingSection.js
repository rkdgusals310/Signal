import React, { useState } from 'react';
import './ConsultingSection.css';

const consultants = [
  { id: 1, name: 'OOO 상담사', image: '/img/homeCategory1.png' },
  { id: 2, name: 'OOO 상담사', image: '/img/homeCategory2.png' },
  { id: 3, name: 'OOO 상담사', image: '/img/homeCategory3.png' },
  { id: 4, name: 'OOO 상담사', image: '/img/homeCategory4.png' },
  { id: 5, name: 'OOO 상담사', image: '/img/homeCategory5.png' },
];

const ConsultingSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 순환
  const getVisibleSlides = () => {
    let visibleSlides = [];
    for (let i = 0; i < 4; i++) {
      visibleSlides.push(consultants[(currentIndex + i) % consultants.length]);
    }
    return visibleSlides;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % consultants.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? consultants.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="consulting-slider-wrapper">
      <h2 className="consulting-title">전문가와의 상담</h2>
      <div className="consulting-slider-container">
        <button className="prev-arrow" onClick={prevSlide}>
          &#10094;
        </button>
        <div className="consulting-section">
          {getVisibleSlides().map((consultant) => (
            <div key={consultant.id} className="consultant">
              <img src={consultant.image} alt={consultant.name} />
              <span>{consultant.name}</span>
            </div>
          ))}
        </div>
        <button className="next-arrow" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default ConsultingSection;

/* 
// 프로필을 로드하는 방식 (회원가입 후 프로필을 불러올 때 사용)
useEffect(() => {
  fetch('/api/profiles') // 백엔드에서 프로필 API를 통해 프로필 리스트를 가져옴
    .then(response => response.json())
    .then(data => {
      setConsultants(data); // API에서 가져온 데이터를 상태에 저장
    })
    .catch(error => console.error('프로필 로드 중 오류 발생:', error));
}, []);
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConsultingSection.css';

const ConsultingSection = () => {
  const [consultants, setConsultants] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch('/api/common/consultant?page=1&size=20');
        if (response.ok) {
          const data = await response.json();
          setConsultants(data.contents[0]?.topConsultants || []);
        } else {
          console.error('Failed to fetch consultants');
        }
      } catch (error) {
        console.error('Error fetching consultants:', error);
      }
    };

    fetchConsultants();
  }, []);

  const getVisibleSlides = () => {
    if (!consultants.length) return [];
    let visibleSlides = [];
    const maxSlides = Math.min(consultants.length, 4);
    for (let i = 0; i < maxSlides; i++) {
      visibleSlides.push(consultants[(currentIndex + i) % consultants.length]);
    }
    return visibleSlides;
  };

  const handleConsultantClick = (consultantId) => {
    navigate(`/consultant/${consultantId}`); // 상담사 프로필 페이지로 이동
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
      <h2 className="consulting-title">전문가 한눈에 보기</h2>
      {consultants.length > 0 ? (
        consultants.length <= 3 ? (
          <div className="consulting-section">
            {consultants.map((consultant) => (
              <div
                key={consultant.id}
                className="consultant"
                onClick={() => handleConsultantClick(consultant.id)}
              >
                <img
                  src={
                    consultant.image ||
                    `${process.env.PUBLIC_URL}/img/userDefaultImg.png`
                  }
                  alt={consultant.name}
                />
                <span>{consultant.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="consulting-slider-container">
            <button className="prev-arrow" onClick={prevSlide}>
              &#10094;
            </button>
            <div className="consulting-section">
              {getVisibleSlides().map((consultant) => (
                <div
                  key={consultant.id}
                  className="consultant"
                  onClick={() => handleConsultantClick(consultant.id)}
                >
                  <img
                    src={
                      consultant.image ||
                      `${process.env.PUBLIC_URL}/img/userDefaultImg.png`
                    }
                    alt={consultant.name}
                  />
                  <span>{consultant.name}</span>
                </div>
              ))}
            </div>
            <button className="next-arrow" onClick={nextSlide}>
              &#10095;
            </button>
          </div>
        )
      ) : (
        <p>상담사를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default ConsultingSection;

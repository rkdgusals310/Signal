import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/common/home/recommend-article');
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        } else {
          console.error('슬라이드 데이터를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('네트워크 오류 발생:', error);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="hero-slider-container">
      <div
        className="hero-slider"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            onClick={() => navigate(`/article/${slide.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={slide.thumbnail} alt={`배너 ${slide.title}`} />
          </div>
        ))}
      </div>

      <button className="prev-arrow" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next-arrow" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default HeroSlider;

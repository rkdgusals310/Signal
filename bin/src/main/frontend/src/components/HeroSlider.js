import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/img/homeCategory1.png',
    '/img/homeCategory2.png',
    '/img/homeCategory3.png',
    '/img/homeCategory4.png',
    '/img/homeCategory5.png',
    '/img/homeCategory6.png'
  ];

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
  }, []);

  return (
    <div className="hero-slider-container">
      <div
        className="hero-slider"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="slide"
          >
            <img src={slide} alt={`배너 ${index + 1}`} />
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

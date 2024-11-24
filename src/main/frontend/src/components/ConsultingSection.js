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

// import React, { useState, useEffect } from 'react';
// import './ConsultingSection.css';

// const ConsultingSection = () => {
//   const [consultants, setConsultants] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // API 호출
//   useEffect(() => {
//     const fetchConsultants = async () => {
//       try {
//         const response = await fetch('/api/common/consultant?page=1&size=20');
//         if (response.ok) {
//           const data = await response.json();
//           setConsultants(data.contents?.topConsultants || []);
//         } else {
//           console.error('Failed to fetch consultants');
//         }
//       } catch (error) {
//         console.error('Error fetching consultants:', error);
//       }
//     };

//     fetchConsultants();
//   }, []);

//   // 이미지 순환 로직
//   const getVisibleSlides = () => {
//     let visibleSlides = [];
//     for (let i = 0; i < 4; i++) {
//       visibleSlides.push(consultants[(currentIndex + i) % consultants.length]);
//     }
//     return visibleSlides;
//   };

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % consultants.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? consultants.length - 1 : prevIndex - 1
//     );
//   };

//   return (
//     <div className="consulting-slider-wrapper">
//       <h2 className="consulting-title">전문가와의 상담</h2>
//       <div className="consulting-slider-container">
//         <button className="prev-arrow" onClick={prevSlide}>
//           &#10094;
//         </button>
//         <div className="consulting-section">
//           {getVisibleSlides().map((consultant) => (
//             <div key={consultant.id} className="consultant">
//               <img src={consultant.image || '/img/userDefaultImg.png'} alt={consultant.name} />
//               <span>{consultant.name}</span>
//             </div>
//           ))}
//         </div>
//         <button className="next-arrow" onClick={nextSlide}>
//           &#10095;
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConsultingSection;
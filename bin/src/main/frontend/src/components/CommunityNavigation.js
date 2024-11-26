// src/components/CommunityNavigation.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CommunityNavigation.css';

const CommunityNavigation = () => {
  const [isGominOpen, setIsGominOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // 클릭된 세부 카테고리 상태 관리

  //열리고 닫히는 부분 약간 오류 수정해야할 듯
//   useEffect(() => {
//     if (location.pathname.includes('/community/gomin')) {
//       setIsGominOpen(true);
//     } else if (location.pathname.includes('/community/info')) {
//       setIsInfoOpen(true);
//     } else {
//       setIsGominOpen(false);
//       setIsInfoOpen(false);
//     }
//   }, [location.pathname]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // 클릭된 세부 카테고리 설정
  };

  return (
    <div className="community-navigation">
      {/* 고민 카테고리 */}
      <div className="category">
        <div className="category-header" onClick={() => setIsGominOpen(!isGominOpen)}>
          고민
          <span className={isGominOpen ? 'arrow-up' : 'arrow-down'}></span>  {/* 화살표 클래스 사용 */}
        </div>
        {isGominOpen && (
          <ul className="category-list">
            <li>
              <Link 
                to="/community/gomin/10" 
                className={activeCategory === 'gomin-10' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-10')}
              >
                • 10대 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/20" 
                className={activeCategory === 'gomin-20' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-20')}
              >
                • 20대 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/30" 
                className={activeCategory === 'gomin-30' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-30')}
              >
                • 30대 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/40" 
                className={activeCategory === 'gomin-40' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-40')}
              >
                • 40대 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/gomsin" 
                className={activeCategory === 'gomin-gomsin' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-gomsin')}
              >
                • 곰신 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/cc" 
                className={activeCategory === 'gomin-cc' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-cc')}
              >
                • CC 고민
              </Link>
            </li>
            <li>
              <Link 
                to="/community/gomin/office" 
                className={activeCategory === 'gomin-office' ? 'active' : ''} 
                onClick={() => handleCategoryClick('gomin-office')}
              >
                • 사내연애 고민
              </Link>
            </li>
          </ul>
        )}
      </div>

      {/* 정보 카테고리 */}
      <div className="category">
        <div className="category-header" onClick={() => setIsInfoOpen(!isInfoOpen)}>
          정보
          <span className={isInfoOpen ? 'arrow-up' : 'arrow-down'}></span>  {/* 화살표 클래스 사용 */}
        </div>
        {isInfoOpen && (
          <ul className="category-list">
            <li>
              <Link 
                to="/community/info/date-places" 
                className={activeCategory === 'info-date' ? 'active' : ''} 
                onClick={() => handleCategoryClick('info-date')}
              >
                • 데이트 장소 추천
              </Link>
            </li>
            <li>
              <Link 
                to="/community/info/gifts" 
                className={activeCategory === 'info-gifts' ? 'active' : ''} 
                onClick={() => handleCategoryClick('info-gifts')}
              >
                • 기념일 선물 추천
              </Link>
            </li>
            <li>
              <Link 
                to="/community/info/travel" 
                className={activeCategory === 'info-travel' ? 'active' : ''} 
                onClick={() => handleCategoryClick('info-travel')}
              >
                • 커플 여행지 추천
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CommunityNavigation;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryMenu.css';

const categories = [
  { id: '10', name: '10대 연애 고민', image: 'img/homeCategory1.png' },
  { id: '20', name: '20대 연애 고민', image: 'img/homeCategory4.png' },
  { id: '30', name: '30대 연애 고민', image: 'img/homeCategory3.png' },
  { id: 'travel', name: '커플 여행지 추천', image: 'img/homeCategory6.png' },
  { id: 'date-places', name: '데이트 장소 추천', image: 'img/homeCategory2.png' },
  { id: 'gifts', name: '기념일 선물 추천', image: 'img/homeCategory5.png' },
];

const CategoryMenu = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (id) => {
    navigate(`/community/gomin/${id}`);
  };

  return (
    <div className="category-menu">
        <h2 className="category-title">Categories
        <button className="more-button" onClick={() => navigate('/community')}>
          더 보기 &gt;
        </button>
        </h2>
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category.id)}
          >
            <img src={category.image} alt={category.name} />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;

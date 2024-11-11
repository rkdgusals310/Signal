import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import SearchBar from '../components/SearchBar';
import CategoryMenu from '../components/CategoryMenu';
import HotPosts from '../components/HotPosts';
import ConsultingSection from '../components/ConsultingSection';
import './HomePage.css';

const HomePage = () => {
  const [hotPosts, setHotPosts] = useState([]);

  // useEffect(() => {
  //   // 예제 API 호출
  //   fetch('http://localhost:8080/api/common/post?size=2')
  //     .then((response) => response.json())
  //     .then((data) => setHotPosts(data.content.posts))
  //     .catch((error) => console.error('게시글을 불러오는 중 오류:', error));
  // }, []);

  return (
    <div className="home-page">
      <HeroSlider />
      <SearchBar />
      <CategoryMenu />
      <HotPosts posts={hotPosts} />
      <ConsultingSection />
    </div>
  );
};

export default HomePage;

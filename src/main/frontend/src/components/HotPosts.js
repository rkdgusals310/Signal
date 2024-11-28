import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HotPosts.css';

const HotPosts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const response = await fetch('/api/common/home/hot-post');
        if (response.ok) {
          const data = await response.json();
          // 최대 2개만 보여줌
          setPosts(data.slice(0, 2));
        } else {
          console.error('핫 게시글 데이터를 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('네트워크 오류 발생:', error);
      }
    };

    fetchHotPosts();
  }, []);

  return (
    <div className="hot-posts-header">
      <div className="hot-post-header">
        <h2 className="hot-post-title">Hot 게시글</h2>
      </div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="hot-post"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h3>{post.title}</h3>
          <p className="hot-post-content">{post.contents}</p>
        </div>
      ))}
    </div>
  );
};

export default HotPosts;

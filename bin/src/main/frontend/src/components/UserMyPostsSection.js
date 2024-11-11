import React, { useState, useEffect } from 'react';
import './UserMyPostsSection.css';

const UserMyPostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage]);

  const fetchMyPosts = async (page) => {
    try {
      const response = await fetch(`/api/user/my-post?page=${page}&size=5`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.content.myPost);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="user-my-posts-section">
      <h3>내가 작성한 게시글 보기</h3>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성일시</th>
            <th>좋아요</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} onClick={() => window.location.href = `/post/${post.id}`}>
              <td>{post.title}</td>
              <td>{post.createdAt}</td>
              <td>{post.likesCount}</td>
              <td>{post.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserMyPostsSection;

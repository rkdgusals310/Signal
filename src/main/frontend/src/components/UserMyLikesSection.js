import React, { useState, useEffect } from 'react';
import './UserMyLikesSection.css';

const UserMyLikesSection = () => {
  const [likes, setLikes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyLikes(currentPage);
  }, [currentPage]);

  const fetchMyLikes = async (page) => {
    try {
      const response = await fetch(`/api/common/my-like?page=${page}&size=5`);
      if (response.ok) {
        const data = await response.json();
        setLikes(data.content.myLikes);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  return (
    <div className="user-my-likes-section">
      <h3>내가 좋아요한 게시글, 아티클 보기</h3>
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
          {likes.map((like) => (
            <tr key={like.id} onClick={() => window.location.href = `/${like.type.toLowerCase()}/${like.id}`}>
              <td>{like.title}</td>
              <td>{like.createdAt}</td>
              <td>{like.likesCount}</td>
              <td>{like.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserMyLikesSection;

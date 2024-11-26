import React, { useState, useEffect } from 'react';
import './UserMyCommentsSection.css';

const UserMyCommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyComments(currentPage);
  }, [currentPage]);

  const fetchMyComments = async (page) => {
    try {
      const response = await fetch(`/api/common/my-comment?page=${page}&size=5`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.content.myComment);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <div className="user-my-comments-section">
      <h3>내가 작성한 댓글 보기</h3>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>내용</th>
            <th>카테고리</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.title}</td>
              <td>{comment.content}</td>
              <td>{comment.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserMyCommentsSection;

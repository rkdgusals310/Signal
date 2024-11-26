import React, { useState, useEffect } from 'react';
import './UserMyCommentsSection.css';

const UserMyCommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyComments(currentPage);
  }, [currentPage]);

  const fetchMyComments = async (page) => {
    try {
      const response = await fetch(`/api/common/my-comment?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('서버 응답 데이터:', data);
        if (data.contents && data.contents.length > 0 && data.contents[0].myComment) {
          setComments(data.contents[0].myComment);
          setTotalPages(data.totalPages);
        } else {
          console.error('서버 응답 데이터 구조가 예상과 다릅니다:', data);
          setComments([]);
        }
      } else {
        console.error('HTTP 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('내 댓글을 불러오는 중 오류 발생:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
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
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt; 이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index ? 'active' : ''}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default UserMyCommentsSection;

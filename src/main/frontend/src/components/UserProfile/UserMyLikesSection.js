import React, { useState, useEffect } from 'react';
import './UserMyLikesSection.css';

const UserMyLikesSection = () => {
  const [likes, setLikes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyLikes(currentPage);
  }, [currentPage]);

  const fetchMyLikes = async (page) => {
    try {
      const response = await fetch(`/api/common/my-like?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('서버 응답 데이터:', data);
        if (data.contents && data.contents.length > 0 && data.contents[0].myLikes) {
          setLikes(data.contents[0].myLikes);
          setTotalPages(data.totalPages);
        } else {
          console.error('서버 응답 데이터 구조가 예상과 다릅니다:', data);
          setLikes([]);
        }
      } else {
        console.error('HTTP 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('내 좋아요를 불러오는 중 오류 발생:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <tr
              key={like.id}
              onClick={() => window.location.href = `/${like.type.toLowerCase()}/${like.id}`}
            >
              <td>{like.title}</td>
              <td>{like.createdAt.split('T')[0]}</td>
              <td>{like.likesCount}</td>
              <td>{like.viewCount}</td>
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

export default UserMyLikesSection;

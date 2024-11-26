import React, { useState, useEffect } from 'react';
import './ConsultantMyLikesSection.css';

const ConsultantMyLikesSection = () => {
  const [likes, setLikes] = useState([]); // 빈 배열로 초기값 설정
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLikes(currentPage);
  }, [currentPage]);

  const fetchLikes = async (page) => {
    try {
      const response = await fetch(`/api/common/my-like?page=${page}&size=10`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const myLikes = data.contents?.[0]?.myLikes || [];
        setLikes(myLikes);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('좋아요한 게시글 조회 실패:', response.status);
        setLikes([]);
      }
    } catch (error) {
      console.error('좋아요한 게시글을 불러오는 중 오류 발생:', error);
      setLikes([]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="consultant-my-likes-section">
      <h3>내가 좋아요한 게시글</h3>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성일</th>
            <th>좋아요</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {likes.length > 0 ? (
            likes.map((like) => (
              <tr key={like.id} onClick={() => (window.location.href = `/post/${like.id}`)}>
                <td>{like.title}</td>
                <td>{like.createdAt?.split('T')[0]}</td>
                <td>{like.likesCount}</td>
                <td>{like.viewCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">좋아요한 게시글이 없습니다.</td>
            </tr>
          )}
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

export default ConsultantMyLikesSection;

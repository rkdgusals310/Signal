import React, { useState, useEffect } from 'react';
import './ConsultantMyCommentsSection.css';

const ConsultantMyCommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  const fetchComments = async (page) => {
    try {
      const response = await fetch(`/api/common/my-comment?page=${page}&size=10`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const myComments = data.contents?.[0]?.myComment || [];
        setComments(myComments);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('내 댓글 조회 실패:', response.status);
        setComments([]);
      }
    } catch (error) {
      console.error('내 댓글을 불러오는 중 오류 발생:', error);
      setComments([]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="consultant-my-comments-section">
      <h3>내가 작성한 댓글 보기</h3>
      <table>
        <thead>
          <tr>
            <th>내용</th>
            <th>게시글</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <tr
                key={comment.id}
                onClick={() => (window.location.href = `/post/${comment.id}`)}
              >
                <td>{comment.content}</td>
                <td>{comment.title}</td>
                <td>{comment.createdAt?.split('T')[0]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">작성한 댓글이 없습니다.</td>
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

export default ConsultantMyCommentsSection;

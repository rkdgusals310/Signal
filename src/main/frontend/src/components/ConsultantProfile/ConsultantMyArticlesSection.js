import React, { useState, useEffect } from 'react';
import './ConsultantMyArticlesSection.css';

const ConsultantMyArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyArticles(currentPage);
  }, [currentPage]);

  const fetchMyArticles = async (page) => {
    try {
      const response = await fetch(`/api/consultant/my-article?page=${page}&size=10`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.contents[0]?.articles || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('게시글 불러오기 실패:', response.status);
      }
    } catch (error) {
      console.error('내 게시글을 불러오는 중 오류 발생:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="consultant-my-articles-section">
      <h3>내가 작성한 아티클</h3>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성일</th>
            <th>좋아요</th>
            <th>댓글 수</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} onClick={() => window.location.href = `/article/${article.id}`}>
              <td>{article.title}</td>
              <td>{article.createAt.split('T')[0]}</td>
              <td>{article.likesCount}</td>
              <td>{article.commentCount}</td>
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

export default ConsultantMyArticlesSection;

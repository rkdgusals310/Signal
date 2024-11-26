// ArticlePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticlePage.css';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    try {
      const response = await fetch(`/api/common/article?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.content);
        setTotalPages(data.totalPages);
      } else {
        console.error("Error fetching articles");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };

  const handleCreateArticle = () => {
    navigate('/article/create'); // 작성 페이지로 이동
  };

  return (
    <div className="article-page">
      <div className="article-list">
        {articles.map((article) => (
          <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
            <img src={article.thumbnail || '/default-thumbnail.jpg'} alt={article.title} className="article-image" />
            <div className="article-content">
              <h2>{article.title}</h2>
              <p>
                <span>{article.createAt} • {article.commentCount} Comments • {article.consultantName}</span>
              </p>
              <p>{article.contents}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt; 이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} className={currentPage === index ? 'active' : ''} onClick={() => handlePageChange(index)}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage + 1 === totalPages}>
          다음 &gt;
        </button>
      </div>
      <button onClick={handleCreateArticle} className="create-article-button">전문가글 작성하기</button>
    </div>
  );
};

export default ArticlePage;

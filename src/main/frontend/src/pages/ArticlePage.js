import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticlePage.css';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/common/article?page=${page}&size=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.content)) {
          setArticles(data.content);
        } else {
          console.error("content가 배열이 아닙니다. 받은 데이터:", data.content);
          setArticles([]);
        }
        setTotalPages(data.totalPages);
      } else {
        console.error("게시글을 불러오는 중 오류가 발생했습니다.");
        setArticles([]);
      }
    } catch (error) {
      console.error("게시글을 불러오는 중 오류 발생:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleArticleClick = (id) => {
    navigate(`/article/${id}`);
  };

  const handleCreateArticle = () => {
    navigate('/article/create');
  };

  return (
    <div className="article-page">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="article-list">
          {articles.length > 0 ? (
            articles.map((article) => (
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
            ))
          ) : (
            <p>No articles available</p>
          )}
        </div>
      )}
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

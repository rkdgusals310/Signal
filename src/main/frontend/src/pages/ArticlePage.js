import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticlePage.css';

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
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

        if (data.contents && data.contents.length > 0) {
          const articlesData = data.contents[0].articles || [];
          setArticles(articlesData);
          setTotalPages(data.totalPages || 1);
        } else {
          console.error('응답 데이터가 예상과 다릅니다:', data);
          setArticles([]);
        }
      } else {
        console.error('게시글 데이터를 가져오는 데 실패했습니다.');
        setArticles([]);
      }
    } catch (error) {
      console.error('게시글 데이터를 가져오는 중 오류가 발생했습니다:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
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
            <p>첫 아티클을 등록해보세요!</p>
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

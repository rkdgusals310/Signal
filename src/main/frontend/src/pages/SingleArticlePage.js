import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SingleArticlePage.css';
import ArticleComment from '../components/ArticleComment';

const SingleArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticleDetails();
  }, [articleId]);

  const fetchArticleDetails = async () => {
    try {
      const response = await fetch(`/api/common/article/${articleId}`, {
        method: 'GET',
        headers: {
        //   'Authorization': `Bearer ${sessionId}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else if (response.status === 404) {
        const errorData = await response.json();
        setError(errorData.message);
      } else {
        console.error("Error fetching article details");
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-article-page">
      <button onClick={() => navigate(-1)} className="back-button">
        &lt; Back to Article List
      </button>
      <div className="article-header">
        <img src={article.thumbnail || '/default-thumbnail.jpg'} alt={article.title} className="article-image" />
        <div className="article-info">
          <h1>{article.title}</h1>
          <p>
            <span>{article.createAt}</span> • <span>{article.commentCount} Comments</span> • <span>{article.userName}</span>
            {article.modified_at && <span> • 수정됨: {article.modified_at}</span>}
          </p>
        </div>
      </div>
      <div className="article-content">
        <p dangerouslySetInnerHTML={{ __html: article.contents }} />
      </div>
      <div className="comment-section-page">
        <ArticleComment articleId={articleId} />
      </div>
    </div>
  );
};

export default SingleArticlePage;

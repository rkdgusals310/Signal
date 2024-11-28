import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SingleArticlePage.css';
import ArticleComment from '../components/ArticleComment';

const SingleArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const userRole = sessionStorage.getItem('role');

  useEffect(() => {
    fetchArticleDetails();
  }, [articleId]);

  const fetchArticleDetails = async () => {
    try {
      const response = await fetch(`/api/common/article/${articleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setThumbnail(data.thumbnail);
        setTitle(data.title);
        setContents(data.contents);
      } else if (response.status === 404) {
        const errorData = await response.json();
        setError(errorData.message);
      } else {
        console.error('Error fetching article details');
      }
    } catch (error) {
      console.error('Error fetching article details:', error);
    }
  };

  const handleThumbnailUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'signal_Article');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcz3lwdqk/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnail(data.secure_url);
      } else {
        console.error('Error uploading thumbnail');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleThumbnailUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleEditSubmit = async () => {
    const confirmEdit = window.confirm('수정하시겠습니까?');
    if (!confirmEdit) return;

    try {
      const response = await fetch(`/api/consultant/article/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, contents, thumbnail }),
      });

      if (response.ok) {
        alert('아티클이 수정되었습니다.');
        setEditing(false);
        fetchArticleDetails();
      } else {
        console.error('Error updating article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('아티클을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/consultant/article/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('아티클이 삭제되었습니다.');
        navigate('/article-list');
      } else {
        console.error('Error deleting article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
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
      <button onClick={() => navigate(-1)} className="single-article-back-button">
        &lt; Back to Article List
      </button>
      {editing ? (
        <div className="single-article-edit">
          <div
            className="single-article-thumbnail-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail Preview" className="single-article-thumbnail-preview" />
            ) : (
              <p>이미지를 여기에 드래그 앤 드롭하세요</p>
            )}
            {uploading && <p>이미지 업로드 중...</p>}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="single-article-edit-title"
            placeholder="제목을 입력하세요"
          />
          <textarea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className="single-article-edit-content"
            placeholder="내용을 입력하세요"
          />
          <button onClick={handleEditSubmit} className="single-article-confirm-edit">
            수정 확인
          </button>
        </div>
      ) : (
        <>
          <div className="single-article-header">
            <img
              src={article.thumbnail || '/default-thumbnail.jpg'}
              alt={article.title}
              className="single-article-image"
            />
            <div className="single-article-info">
              <h1>{article.title}</h1>
              <p>
                <span>{article.createAt}</span> • <span>{article.commentCount} Comments</span> •{' '}
                <span>{article.userName}</span>
                {article.modified_at && <span> • 수정됨: {article.modified_at}</span>}
              </p>
            </div>
          </div>
          <div className="single-article-content">
            <p dangerouslySetInnerHTML={{ __html: article.contents }} />
          </div>
          {!editing && (
            <div className="single-article-comment-section">
              <ArticleComment articleId={articleId} />
            </div>
          )}
          {!editing && userRole !== 'USER' && (
            <div className="single-article-button-group">
              <button onClick={() => setEditing(true)} className="single-article-edit-button">
                아티클 수정
              </button>
              <button onClick={handleDelete} className="single-article-delete-button">
                아티클 삭제
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SingleArticlePage;

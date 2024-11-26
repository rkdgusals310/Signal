import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticleCreatePage.css';

const ArticleCreatePage = () => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 상태 추가
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'signal_Article');
    formData.append('cloud_name', 'dcz3lwdqk');

    setUploading(true);
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcz3lwdqk/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setThumbnailUrl(data.secure_url); // Cloudinary
        setError(null);
      } else {
        setError('이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
      setError('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !contents) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (window.confirm('게시글을 작성하시겠습니까?')) {
      // 버튼 비활성화
      setIsButtonDisabled(true);

      const requestData = {
        title,
        contents,
        thumbnail: thumbnailUrl,
      };

      try {
        const response = await fetch('/api/consultant/article', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include',
        });

        if (response.ok) {
          setSuccessMessage('게시글이 성공적으로 작성되었습니다.');
          setError(null);
          setTitle('');
          setContents('');
          setThumbnailUrl('');
          setTimeout(() => navigate('/article'), 2000);
        } else {
          const data = await response.json();
          setError(`${data.error}: ${data.message}`);
        }
      } catch (error) {
        console.error('Error submitting article:', error);
        setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        // 3초 후 버튼 활성화
        setTimeout(() => setIsButtonDisabled(false), 3000);
      }
    }
  };

  return (
    <div className="article-create-page">
      <button onClick={() => window.history.back()} className="back-button">
        &lt; Back to Article list
      </button>
      <form className="create-article-form" onSubmit={handleSubmit}>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />

        <div
          className="thumbnail-upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="Thumbnail Preview" className="thumbnail-preview" />
          ) : (
            <div className="thumbnail-placeholder">
              <p>이미지를 여기에<br />드래그 앤 드롭하세요</p>
            </div>
          )}
        </div>
        {uploading && <p className="uploading-text">이미지 업로드 중...</p>}

        <textarea
          id="contents"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder="내용을 입력하세요"
          required
        />

        <button type="submit" className="submit-button" disabled={isButtonDisabled}>
          {isButtonDisabled ? '작성 중...' : '작성하기'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ArticleCreatePage;

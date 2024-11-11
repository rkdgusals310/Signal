import React, { useState } from 'react';
import './ArticleCreatePage.css';

const ArticleCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file)); // 썸네일 미리보기 설정
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 작성 확인 모달
    if (window.confirm('게시글을 작성하시겠습니까?')) {
      // API 호출 및 작성 처리
      console.log('Article submitted:', { title, content, thumbnail });
    }
  };

  return (
    <div className="article-create-page">
      <button onClick={() => window.history.back()} className="back-button">
        &lt; Back to User Experience
      </button>
      <form className="create-article-form" onSubmit={handleSubmit}>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요" // 제목 placeholder 추가
        />

        <input
          id="thumbnail"
          type="file"
          onChange={handleThumbnailChange}
          accept="image/*"
        />
        {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="thumbnail-preview" />}

        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요" // 내용 placeholder 추가
        />

        <button type="submit" className="submit-button">작성하기</button>
      </form>
    </div>
  );
};

export default ArticleCreatePage;

import React, { useState } from 'react';
import './ArticleCreatePage.css';

const ArticleCreatePage = () => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState(''); // 썸네일 URL 상태
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 글 작성 요청 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !contents) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 작성 확인 모달
    if (window.confirm('게시글을 작성하시겠습니까?')) {
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
            'accept': 'application/json',
          },
          body: JSON.stringify(requestData),
          credentials: 'include', // 세션 쿠키를 포함하여 인증
        });

        if (response.ok) {
          setSuccessMessage('게시글이 성공적으로 작성되었습니다.');
          setError(null);
          setTitle('');
          setContents('');
          setThumbnailUrl('');
        } else {
          const data = await response.json();
          setError(`${data.error}: ${data.message}`);
        }
      } catch (error) {
        console.error('Error submitting article:', error);
        setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="article-create-page">
      <button onClick={() => window.history.back()} className="back-button">
        &lt; 뒤로가기
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

        <input
          id="thumbnailUrl"
          type="text"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="썸네일 이미지 URL을 입력하세요" //이거 추후에 서버 API로 이미지 올리고 URL받아오는 형태 취해야됨
        />
        
        <textarea
          id="contents"
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder="내용을 입력하세요"
          required
        />

        <button type="submit" className="submit-button">작성하기</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ArticleCreatePage;

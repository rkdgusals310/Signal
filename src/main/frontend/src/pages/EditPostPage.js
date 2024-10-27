import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommunityNavigation from '../components/CommunityNavigation'; // 네비게이션 바 추가
import './EditPostPage.css';

const EditPostPage = () => {
  const { postId } = useParams(); // URL에서 postId 파라미터 가져오기
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [invalidSentences, setInvalidSentences] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 불러오기
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/common/post/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.contents);
          setCategory(data.category);
        } else {
          console.error('Error fetching post data');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      title: title,
      contents: content,
      category: mapCategoryToBackendFormat(category),
    };

    try {
      const response = await fetch(`/api/user/post/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const result = await response.json();

      // ChatGPT 필터링 결과 처리
      if (result.filtered !== undefined) {
        if (result.filtered) {
          console.log("필터링된 문장:", result.invalidSentences);
          setInvalidSentences(result.invalidSentences);
          setFiltered(true);
          setIsSubmitted(false);
          return; // 필터링되었으므로 페이지 이동 막음
        } else {
          console.log('게시글 수정 성공!');
          setIsSubmitted(true);
          setFiltered(false);
          setInvalidSentences(null);
          
          // 게시글 수정 후 성공 메시지 표시 후 이동
          setTimeout(() => {
            navigate(`/post/${postId}`);
          }, 2000);
        }
      } else {
        console.error('필터링 결과가 응답에 없습니다.');
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error('서버와의 통신 중 오류 발생:', error);
    }
  };

  const mapCategoryToBackendFormat = (category) => {
    switch (category) {
      case '_10S':
        return '_10S';
      case '_20S':
        return '_20S';
      case '_30S':
        return '_30S';
      case '_40S':
        return '_40S';
      case 'MILITARY':
        return 'MILITARY';
      case 'CC':
        return 'CC';
      case 'OFFICE':
        return 'OFFICE';
      case 'DATE_LOCATION':
        return 'DATE_LOCATION';
      case 'ANNIVERSARY_GIFT':
        return 'ANNIVERSARY_GIFT';
      case 'TRAVEL_LOCATION':
        return 'TRAVEL_LOCATION';
      default:
        return category;
    }
  };

  return (
    <div className="edit-post-page">
      <CommunityNavigation /> {/* 네비게이션 바 추가 */}
      <div className="write-form-container">
        <form className="write-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              &larr;
            </button>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              <option value="_10S">10대 고민</option>
              <option value="_20S">20대 고민</option>
              <option value="_30S">30대 고민</option>
              <option value="_40S">40대 고민</option>
              <option value="MILITARY">곰신 고민</option>
              <option value="CC">CC 고민</option>
              <option value="OFFICE">사내연애 고민</option>
              <option value="DATE_LOCATION">데이트 장소 추천</option>
              <option value="ANNIVERSARY_GIFT">기념일 선물 추천</option>
              <option value="TRAVEL_LOCATION">커플 여행지 추천</option>
            </select>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              placeholder="제목"
            />
          </div>

          <textarea
            className={`content-textarea ${filtered ? 'error-content' : isSubmitted ? 'success-content' : ''}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
            spellCheck="false"
          ></textarea>

          {filtered && invalidSentences && (
            <div className="error-message">
              <p>다음 문장을 수정해주세요:</p>
              <div className="invalid-sentences">
                {invalidSentences.map((sentence, index) => (
                  <p key={index}>{sentence}</p>
                ))}
              </div>
            </div>
          )}

          {isSubmitted && !filtered && (
            <div className="success-message">
              <p>게시글 수정이 완료되었습니다!</p>
            </div>
          )}

          <div className="form-footer">
            <button type="submit" className="submit-button">
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;

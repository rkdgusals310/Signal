// src/pages/CommunityWriteForm.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CommunityWriteForm.css';

const CommunityWriteForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 수정: state에서 category 받아오기
  const [category, setCategory] = useState(location.state?.category || '30');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [invalidSentences, setInvalidSentences] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    const requestBody = {
      title: title,
      contents: content,
      category: mapCategoryToBackendFormat(category),
    };

    try {
      const response = await fetch('/api/user/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Result:', result);

      if (result.filtered !== undefined) {
        if (result.filtered) {
          setInvalidSentences(result.invalidSentences);
          setFiltered(true);
          setIsSubmitted(false);
        } else {
          setIsSubmitted(true);
          setFiltered(false);
          setInvalidSentences(null);

          setTimeout(() => {
            navigate(`/community/gomin/${category}`);
          }, 2000);
        }
      } else {
        console.error('isFiltered 값이 응답에 없습니다.');
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error('서버와의 통신 중 오류 발생:', error);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 3000);
    }
  };

  const mapCategoryToBackendFormat = (category) => {
    switch (category) {
      case '10':
        return '_10S';
      case '20':
        return '_20S';
      case '30':
        return '_30S';
      case '40':
        return '_40S';
      case 'gomsin':
        return 'MILITARY';
      case 'CC':
        return 'CC';
      case 'office':
        return 'OFFICE';
      case 'date-places':
        return 'DATE_LOCATION';
      case 'gifts':
        return 'ANNIVERSARY_GIFT';
      case 'travel':
        return 'TRAVEL_LOCATION';
      default:
        return category;
    }
  };

  return (
    <form className="write-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <button className="writeform-back-button" onClick={() => window.history.back()}>
          &larr;
        </button>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="10">10대 고민</option>
          <option value="20">20대 고민</option>
          <option value="30">30대 고민</option>
          <option value="40">40대 고민</option>
          <option value="gomsin">곰신 고민</option>
          <option value="CC">CC 고민</option>
          <option value="office">사내연애 고민</option>
          <option value="date-places">데이트 장소 추천</option>
          <option value="gifts">기념일 선물 추천</option>
          <option value="travel">커플 여행지 추천</option>
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
          <p>게시글 작성이 완료되었습니다!</p>
        </div>
      )}

      <div className="form-footer">
        <button type="submit" className="submit-button" disabled={isButtonDisabled}>
          {isButtonDisabled ? '작성 중...' : '작성하기'}
        </button>
      </div>
    </form>
  );
};

export default CommunityWriteForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommunityWriteForm.css';

const CommunityWriteForm = () => {
  const [category, setCategory] = useState('30');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [invalidSentences, setInvalidSentences] = useState(null);
  const [filtered, setfiltered] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);  // 게시글 작성 완료 상태 추가

  const navigate = useNavigate();  //페이지 이동 훅

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

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
          'accept': '*/*',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const result = await response.json();

      console.log("Result:", result);

      // ChatGPT 필터링 결과 처리
      if (result.filtered !== undefined) {
        if (result.filtered) {
          console.log("필터링된 문장:", result.invalidSentences);
          setInvalidSentences(result.invalidSentences);
          setfiltered(true);
          setIsSubmitted(false); // 필터링 시 성공 메시지 비활성화
          return; // 필터링되었으므로 페이지 이동 막음
        } else {
          console.log('게시글 작성 성공!');
          setIsSubmitted(true);  // 성공 시 상태 true로 설정
          setfiltered(false);    // 필터링이 없으므로 false로 설정
          setInvalidSentences(null);
          
          // 게시글 작성 후 바로 이동 대신 성공 메시지를 띄우고 일정 시간 후 페이지 이동
          setTimeout(() => {
            navigate(`/community/gomin/${category}`);
          }, 2000);  // 2초 후 페이지 이동
        }
      } else {
        console.error('isFiltered 값이 응답에 없습니다.');
        setIsSubmitted(false);
      }
    } catch (error) {
      console.error('서버와의 통신 중 오류 발생:', error);
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
        <button className="back-button" onClick={() => window.history.back()}>
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
        className={`content-textarea ${filtered ? 'error-content' : isSubmitted ? 'success-content' : ''}`}  // 성공 시 초록색 테두리
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
              <p key={index}>{sentence}</p>  // 줄바꿈
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
        <button type="submit" className="submit-button">
          작성하기
        </button>
      </div>
    </form>
  );
};

export default CommunityWriteForm;

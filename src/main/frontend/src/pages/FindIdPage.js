import React, { useState } from 'react';
import './FindIdPage.css';

const FindIdPage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState(null);
  const [creationDate, setCreationDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const sendVerificationCode = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('/api/auth/register/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setSuccessMessage('인증번호가 이메일로 발송되었습니다.');
      } else {
        const data = await response.json();
        setError(data.message || '인증번호 요청 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const verifyEmailCode = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('/api/auth/register/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (response.ok) {
        setIsVerified(true);
        setSuccessMessage('이메일 인증이 완료되었습니다.');
      } else {
        const data = await response.json();
        setError(data.message || '인증번호 확인 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const findId = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('/api/auth/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setFoundId(data.userId);
        setCreationDate(data.creationDate);
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || '아이디 찾기 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className="find-id-page">
      <img
        src="/img/loginLogo.png"
        alt="Logo"
        className="find-id-page-logo"
        onClick={() => (window.location.href = '/')}
      />
      {foundId ? (
        <div className="find-id-result-section">
          <h2>아이디 찾기 결과</h2>
          <p>고객님의 정보와 일치하는 아이디입니다.</p>
          <div className="find-id-result">
            <span>{foundId}</span>
            <span>{creationDate} 생성</span>
          </div>
          <button onClick={() => (window.location.href = '/login')}>로그인 이동</button>
        </div>
      ) : (
        <div className="find-id-form-section">
          <h2>아이디 찾기</h2>
          <div className="find-id-input-group">
            <input
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendVerificationCode} disabled={isCodeSent}>
              인증번호 받기
            </button>
          </div>
          {isCodeSent && (
            <div className="find-id-input-group">
              <input
                type="text"
                placeholder="인증번호 6자리를 입력해주세요."
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button onClick={verifyEmailCode}>인증 확인</button>
            </div>
          )}
          {isVerified && (
            <button onClick={findId} className="find-id-submit-button">
              아이디 찾기
            </button>
          )}
          {error && <p className="find-id-error-message">{error}</p>}
          {successMessage && <p className="find-id-success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default FindIdPage;

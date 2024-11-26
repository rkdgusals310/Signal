import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPasswordPage.css';

const FindPasswordPage = () => {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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
        setShowPasswordReset(true);
      } else {
        const data = await response.json();
        setError(data.message || '인증번호 확인 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, newPassword }),
      });

      if (response.ok) {
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || '비밀번호 변경 실패');
      }
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="find-password-page">
      <div className="find-password-page-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="/img/loginLogo.png" alt="Logo" />
      </div>
      {showPasswordReset ? (
        <div className="find-password-reset-form">
          <h2>비밀번호 재설정</h2>
          <p>비밀번호를 변경해주세요.</p>
          <input
            type="text"
            placeholder="아이디를 입력해주세요."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            placeholder="새 비밀번호를 입력해주세요."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호를 다시 입력해주세요."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={resetPassword}>확인</button>
        </div>
      ) : (
        <div className="find-password-page-form">
          <h2>비밀번호 찾기</h2>
          <input
            type="text"
            placeholder="아이디를 입력해주세요."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isCodeSent && (
            <input
              type="text"
              placeholder="인증번호를 입력해주세요."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          )}
          {!isCodeSent ? (
            <button onClick={sendVerificationCode}>인증번호 받기</button>
          ) : (
            <button onClick={verifyEmailCode}>인증하기</button>
          )}
        </div>
      )}
      {error && <p className="find-password-page-error-message">{error}</p>}
      {successMessage && <p className="find-password-page-success-message">{successMessage}</p>}
      {!showPasswordReset && (
        <p className="find-password-page-id-link">
          아이디가 기억나지 않는다면?{' '}
          <span onClick={() => navigate('/find-id')}>아이디 찾기</span>
        </p>
      )}
    </div>
  );
};

export default FindPasswordPage;

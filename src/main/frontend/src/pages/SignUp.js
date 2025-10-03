import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    email: '',
    emailCode: '',
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 여부

  // 추가: 비밀번호 일치 여부 상태
  const [passwordMatch, setPasswordMatch] = useState(null);

  // useNavigate 훅 사용
  const navigate = useNavigate();

  // 로고 클릭 시 홈으로 이동하는 함수
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 비밀번호 / 비밀번호 재확인 입력 시 일치 여부 체크
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setPasswordMatch(false);
        } else if (formData.confirmPassword && value === formData.confirmPassword) {
          setPasswordMatch(true);
        } else {
          setPasswordMatch(null);
        }
      } else if (name === 'confirmPassword') {
        if (formData.password && value !== formData.password) {
          setPasswordMatch(false);
        } else if (formData.password && value === formData.password) {
          setPasswordMatch(true);
        } else {
          setPasswordMatch(null);
        }
      }
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 생년월일 형식을 "YYYY-MM-DD"로 변환
    const birthday = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;

    // 성별을 서버에서 요구하는 형식으로 변환
    const gender = formData.gender === 'male' ? 'MALE' : 'FEMALE';

    // 비밀번호 확인 일치 여부 확인
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 이메일 인증 여부 확인
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    const dataToSend = {
      userId: formData.userId,
      password: formData.password,
      nickname: formData.nickname,
      birthday: birthday,
      gender: gender,
      email: formData.email,
    };

    try {
        const response = await fetch('/api/auth/user-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // 세션 쿠키 포함
          body: JSON.stringify(dataToSend),
        });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message || '서버 오류'}`);
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  // 이메일 인증 코드 발송
  const handleEmailVerification = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register/send-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        alert('인증 코드가 발송되었습니다.');
        setEmailSent(true);
      } else {
        alert('인증 코드 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  // 이메일 인증 코드 검증
  const handleEmailCodeVerification = async () => {
    if (!formData.emailCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register/verify-email-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.emailCode,
        }),
      });

      if (response.ok) {
        alert('이메일 인증이 완료되었습니다.');
        setIsEmailVerified(true);
      } else {
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 코드 인증 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup-container">
      {/* 로고 클릭 시 홈으로 이동 */}
      <div className="logo" onClick={handleLogoClick}>
        <img src="/img/loginLogo.png" alt="Signal Logo" style={{ cursor: 'pointer' }} />
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="userId">아이디</label>
        <input
          type="text"
          name="userId"
          id="userId"
          placeholder="아이디를 입력해주세요."
          value={formData.userId}
          onChange={handleChange}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="비밀번호를 입력해주세요."
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">비밀번호 재확인</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="비밀번호를 다시 한 번 입력해주세요."
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {/* 비밀번호 인증 여부 추가 */}
        {passwordMatch === false && (
          <p style={{ color: 'red', fontSize: '24px', marginTop: '-40px', marginBottom: '30px' }}>
            비밀번호가 일치하지 않습니다.
          </p>
        )}
        {passwordMatch === true && (
          <p style={{ color: 'green', fontSize: '24px', marginTop: '-40px', marginBottom: '30px' }}>
            비밀번호가 일치합니다.
          </p>
        )}

        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          name="nickname"
          id="nickname"
          placeholder="닉네임을 입력해주세요."
          value={formData.nickname}
          onChange={handleChange}
        />

        <label>생년월일</label>
        <div className="birthdate-section">
          <select
            name="birthYear"
            value={formData.birthYear}
            onChange={handleChange}
          >
            <option value="">연도</option>
            {[...Array(100)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <select
            name="birthMonth"
            value={formData.birthMonth}
            onChange={handleChange}
          >
            <option value="">월</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
          >
            <option value="">일</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <label>성별</label>
        <div className="gender-section">
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">성별</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <label>본인 확인 이메일</label>
        <div className="email-verify-wrapper">
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력해주세요."
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="button"
            className="email-verify-button"
            onClick={handleEmailVerification}
            disabled={emailSent}
          >
            {emailSent ? '전송됨' : '인증'}
          </button>
        </div>

        <label>이메일 인증 번호</label>
        <div className="email-code-wrapper">
          <input
            type="text"
            name="emailCode"
            placeholder="인증 번호를 입력해주세요."
            value={formData.emailCode}
            onChange={handleChange}
            disabled={!emailSent}
          />
          <button
            type="button"
            className="email-code-verify-button"
            onClick={handleEmailCodeVerification}
            disabled={isEmailVerified}
          >
            {isEmailVerified ? '인증 완료' : '인증 확인'}
          </button>
        </div>

        <button type="submit" className="signup-button">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;

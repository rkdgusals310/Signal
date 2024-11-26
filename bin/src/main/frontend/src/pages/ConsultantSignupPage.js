// ConsultantSignupPage.js
import React, { useState } from 'react';
import './ConsultantSignupPage.css';
import { useNavigate } from 'react-router-dom';

const ConsultantSignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [consultantForm, setConsultantForm] = useState({
    consultantId: '',
    consultantPassword: '',
    consultantConfirmPassword: '',
    consultantNickname: '',
    consultantBirthYear: '',
    consultantBirthMonth: '',
    consultantBirthDay: '',
    consultantGender: '',
    consultantEmail: '',
    consultantEmailCode: '',
    consultantImage: '',
    consultantKeyword: '',
    consultantStyle: '',
    consultantProfile: '',
    consultantQualification: '',
    consultantExperience: '',
    consultantAvailableDays: 'WEEKDAYS',
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultantForm({
      ...consultantForm,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConsultantForm({ ...consultantForm, consultantImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendEmailVerification = async () => {
    if (!consultantForm.consultantEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: consultantForm.consultantEmail }),
      });

      if (response.ok) {
        alert('인증 코드가 발송되었습니다.');
        setEmailCodeSent(true);
      } else {
        alert('인증 코드 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const verifyEmailCode = async () => {
    if (!consultantForm.consultantEmailCode) {
      alert('인증 코드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: consultantForm.consultantEmail,
          verificationCode: consultantForm.consultantEmailCode,
        }),
      });

      if (response.ok) {
        alert('이메일 인증이 완료되었습니다.');
        setEmailVerified(true);
      } else {
        alert('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 코드 인증 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (consultantForm.consultantPassword !== consultantForm.consultantConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!emailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    setCurrentStep(2);
  };

  const submitSignUp = async () => {
    const birthday = `${consultantForm.consultantBirthYear}-${consultantForm.consultantBirthMonth.padStart(2, '0')}-${consultantForm.consultantBirthDay.padStart(2, '0')}`;
    const gender = consultantForm.consultantGender === 'male' ? 'MALE' : 'FEMALE';

    const dataToSend = {
        userId: consultantForm.consultantId,
        password: consultantForm.consultantPassword,
        nickname: consultantForm.consultantNickname,
        birthday: birthday,
        gender: gender,
        email: consultantForm.consultantEmail,
        image: consultantForm.consultantImage,
        keyword: consultantForm.consultantKeyword,
        style: consultantForm.consultantStyle,
        profile: consultantForm.consultantProfile,
        certifiedQualification: consultantForm.consultantQualification,
        experience: consultantForm.consultantExperience,
        availableDays: consultantForm.consultantAvailableDays,
      };

    try {
      const response = await fetch('/api/auth/consultant-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error);
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="consultant-signup-container">
      <h2>전문가 회원가입</h2>
      <form className="consultant-signup-form" onSubmit={currentStep === 1 ? handleNextStep : submitSignUp}>
        {currentStep === 1 ? (
          <>
            <label htmlFor="consultantId">아이디</label>
            <input
              type="text"
              name="consultantId"
              id="consultantId"
              placeholder="아이디를 입력해주세요."
              value={consultantForm.consultantId}
              onChange={handleInputChange}
            />
            <label htmlFor="consultantPassword">비밀번호</label>
            <input
              type="password"
              name="consultantPassword"
              id="consultantPassword"
              placeholder="비밀번호를 입력해주세요."
              value={consultantForm.consultantPassword}
              onChange={handleInputChange}
            />
            <label htmlFor="consultantConfirmPassword">비밀번호 확인</label>
            <input
              type="password"
              name="consultantConfirmPassword"
              id="consultantConfirmPassword"
              placeholder="비밀번호를 다시 입력해주세요."
              value={consultantForm.consultantConfirmPassword}
              onChange={handleInputChange}
            />
            <label htmlFor="consultantNickname">닉네임</label>
            <input
              type="text"
              name="consultantNickname"
              id="consultantNickname"
              placeholder="닉네임을 입력해주세요."
              value={consultantForm.consultantNickname}
              onChange={handleInputChange}
            />
            <label>생년월일</label>
            <div className="birthdate-section">
              <select name="consultantBirthYear" value={consultantForm.consultantBirthYear} onChange={handleInputChange}>
                <option value="">연도</option>
                {[...Array(100)].map((_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
              <select name="consultantBirthMonth" value={consultantForm.consultantBirthMonth} onChange={handleInputChange}>
                <option value="">월</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select name="consultantBirthDay" value={consultantForm.consultantBirthDay} onChange={handleInputChange}>
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
              <select name="consultantGender" value={consultantForm.consultantGender} onChange={handleInputChange}>
                <option value="">성별</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <label>본인 확인 이메일</label>
            <div className="email-verify-wrapper">
              <input
                type="email"
                name="consultantEmail"
                placeholder="이메일을 입력해주세요."
                value={consultantForm.consultantEmail}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="email-verify-button"
                onClick={sendEmailVerification}
                disabled={emailCodeSent}
              >
                {emailCodeSent ? '발송 완료' : '인증'}
              </button>
            </div>
            <label>이메일 인증 번호</label>
            <div className="email-code-wrapper">
              <input
                type="text"
                name="consultantEmailCode"
                placeholder="인증 번호를 입력해주세요."
                value={consultantForm.consultantEmailCode}
                onChange={handleInputChange}
                disabled={!emailCodeSent}
              />
              <button
                type="button"
                className="email-code-verify-button"
                onClick={verifyEmailCode}
                disabled={emailVerified}
              >
                {emailVerified ? '인증 완료' : '인증 확인'}
              </button>
            </div>
            <button type="submit" className="consultant-signup-button">
              다음
            </button>
          </>
        ) : (
          <>
            <div className="profile-image-wrapper">
              {consultantForm.consultantImage ? (
                <img src={consultantForm.consultantImage} alt="프로필 미리보기" className="profile-image-preview" />
              ) : (
                <div className="default-image-icon">이미지 없음</div>
              )}
              <label htmlFor="consultantImageUpload" className="image-upload-label">
                이미지 변경
              </label>
              <input
                type="file"
                id="consultantImageUpload"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <label htmlFor="consultantProfile">상담사 소개</label>
            <textarea
              name="consultantProfile"
              id="consultantProfile"
              placeholder="상담사님의 소개를 작성해주세요."
              value={consultantForm.consultantProfile}
              onChange={handleInputChange}
            />

            <label htmlFor="consultantQualification">공인 자격 및 경력</label>
            <textarea
              name="consultantQualification"
              id="consultantQualification"
              placeholder="공인된 자격 및 경력을 작성해주세요."
              value={consultantForm.consultantQualification}
              onChange={handleInputChange}
            />

            <label htmlFor="consultantExperience">기타 경력</label>
            <textarea
              name="consultantExperience"
              id="consultantExperience"
              placeholder="기타 경력을 작성해주세요."
              value={consultantForm.consultantExperience}
              onChange={handleInputChange}
            />

            <label htmlFor="consultantKeyword">대표 키워드</label>
            <input
              type="text"
              name="consultantKeyword"
              id="consultantKeyword"
              placeholder="대표 키워드를 작성해주세요."
              value={consultantForm.consultantKeyword}
              onChange={handleInputChange}
            />

            <label htmlFor="consultantStyle">상담 스타일</label>
            <input
              type="text"
              name="consultantStyle"
              id="consultantStyle"
              placeholder="상담 스타일을 작성해주세요."
              value={consultantForm.consultantStyle}
              onChange={handleInputChange}
            />

            <label>상담 가능 요일</label>
            <div className="availability-options">
              <label>
                <input
                  type="radio"
                  name="consultantAvailableDays"
                  value="WEEKDAYS"
                  checked={consultantForm.consultantAvailableDays === 'WEEKDAYS'}
                  onChange={handleInputChange}
                />
                평일
              </label>
              <label>
                <input
                  type="radio"
                  name="consultantAvailableDays"
                  value="WEEKENDS"
                  checked={consultantForm.consultantAvailableDays === 'WEEKENDS'}
                  onChange={handleInputChange}
                />
                주말
              </label>
            </div>

            <button type="submit" className="consultant-signup-button">
              회원가입
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ConsultantSignupPage;

import React, { useEffect, useState } from 'react';
import './ConsultantProfileSection.css';

const ConsultantProfileSection = () => {
  const [profile, setProfile] = useState({
    image: '',
    userId: '',
    email: '',
    nickname: '',
    sex: '',
  });
  const [editing, setEditing] = useState(false);
  const [step, setStep] = useState(1);
  const [newImage, setNewImage] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [uploading, setUploading] = useState(false);

  const [details, setDetails] = useState({
    keyword: '',
    profile: '',
    certifiedQualification: '',
    experience: '',
    availableDays: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/consultant/my-information', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setNewNickname(data.nickname);
        } else {
          console.error('프로필 정보를 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error('프로필 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchProfile();
  }, []);

  const fetchConsultantDetails = async () => {
    try {
      const response = await fetch(`/api/common/consultant/${profile.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDetails({
          keyword: data.keyword,
          profile: data.profile,
          certifiedQualification: data.certifiedQualification,
          experience: data.experience,
          availableDays: data.availableDays.split(','),
        });
      } else {
        console.error('상담사 세부 정보를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('상담사 세부 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const handleThumbnailUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'signal_profile');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dcz3lwdqk/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNewImage(data.secure_url);
      } else {
        console.error('이미지 업로드 중 오류 발생');
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류 발생:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleCheckboxChange = (day) => {
    setDetails((prev) => {
      const updatedDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updatedDays };
    });
  };

  const handleSaveDetails = async () => {
    const confirmEdit = window.confirm('회원 정보를 변경하시겠습니까?');
    if (!confirmEdit) return;

    try {
      const response = await fetch('/api/auth/consultant/edit/my-information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: details.keyword,
          profileImage: newImage || profile.image,
          profile: details.profile,
          availableDays: details.availableDays.join(','),
          certifiedQualification: details.certifiedQualification,
          experience: details.experience,
          nickname: newNickname,
        }),
      });

      if (response.ok) {
        alert('회원 정보가 변경되었습니다.');
        setStep(1);
        setEditing(false);
        setProfile((prev) => ({
          ...prev,
          nickname: newNickname,
          image: newImage || prev.image,
        }));
      } else {
        console.error('프로필 업데이트 중 오류 발생');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생:', error);
    }
  };

  return (
    <div className="consultant-profile-section">
      {step === 1 && !editing ? (
        <>
          <div className="profile-image">
            <img
              src={profile.image || `${process.env.PUBLIC_URL}/img/userDefaultImg.png`}
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <p>ID: {profile.userId}</p>
            <p>Email: {profile.email}</p>
            <p>Name: {profile.nickname}</p>
            <button onClick={() => setEditing(true)} className="edit-info-button">
              정보 수정하기
            </button>
          </div>
        </>
      ) : step === 1 && editing ? (
        <>
          <div
            className="profile-image-edit"
            onDrop={(e) => {
              e.preventDefault();
              handleThumbnailUpload(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {newImage || profile.image ? (
              <img src={newImage || profile.image} alt="Profile Preview" />
            ) : (
              <p>이미지를 여기에 드래그 앤 드롭하세요</p>
            )}
            {uploading && <p>이미지 업로드 중...</p>}
          </div>
          <div className="profile-info-edit">
            <p>ID: {profile.userId}</p>
            <p>Email: {profile.email}</p>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="nickname-input"
              placeholder="닉네임을 입력하세요"
            />
            <button
              onClick={() => {
                setStep(2);
                fetchConsultantDetails();
              }}
              className="next-step-button"
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <div className="edit-details">
          <div className="edit-section">
            <label>상담사 소개</label>
            <textarea
              value={details.profile}
              onChange={(e) => setDetails((prev) => ({ ...prev, profile: e.target.value }))}
            />
          </div>
          <div className="edit-section">
            <label>공인 자격 및 경력</label>
            <textarea
              value={details.certifiedQualification}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, certifiedQualification: e.target.value }))
              }
            />
          </div>
          <div className="edit-section">
            <label>기타 경력</label>
            <textarea
              value={details.experience}
              onChange={(e) => setDetails((prev) => ({ ...prev, experience: e.target.value }))}
            />
          </div>
          <div className="edit-section">
            <label>대표키워드</label>
            <input
              type="text"
              value={details.keyword}
              onChange={(e) => setDetails((prev) => ({ ...prev, keyword: e.target.value }))}
            />
          </div>
          <div className="edit-section">
            <label>상담 가능 요일:</label>
            <div className="checkbox-group">
              {['WEEKDAYS', 'WEEKENDS'].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={details.availableDays.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
          <button onClick={handleSaveDetails} className="save-info-button">
            수정 확인
          </button>
        </div>
      )}
    </div>
  );
};

export default ConsultantProfileSection;

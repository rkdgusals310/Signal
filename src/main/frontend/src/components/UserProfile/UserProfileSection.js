import React, { useEffect, useState } from 'react';
import './UserProfileSection.css';

const UserProfileSection = () => {
  const [profile, setProfile] = useState({
    image: '',
    userId: '',
    email: '',
    nickname: '',
    sex: '',
  });
  const [editing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/user/my-information', {
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
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, []);

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
        console.error('Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleThumbnailUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSave = async () => {
    const confirmEdit = window.confirm('회원정보를 변경하시겠습니까?');
    if (!confirmEdit) return;

    try {
      const response = await fetch('/api/auth/edit/my-information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: newNickname, image: newImage }),
      });

      if (response.ok) {
        alert('회원정보가 변경되었습니다.');
        setEditing(false);
        setProfile((prev) => ({
          ...prev,
          nickname: newNickname,
          image: newImage || prev.image,
        }));
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="user-profile-section">
      {editing ? (
        <>
          <div
            className="profile-image-edit"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
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
            <button onClick={handleSave} className="save-info-button">
              변경 확인
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="profile-image">
            <img src={profile.image || '/img/userDefaultImg.png'} alt="Profile" />
          </div>
          <div className="profile-info">
            <p>ID: {profile.userId}</p>
            <p>Email: {profile.email}</p>
            <p>Nickname: {profile.nickname}</p>
            <button onClick={() => setEditing(true)} className="edit-info-button">
              정보 수정하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileSection;

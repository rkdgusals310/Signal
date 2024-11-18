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
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="user-profile-section">
      <div className="profile-image">
        <img src={profile.image || '/img/userDefaultImg.png'} alt="Profile" />
      </div>
      <div className="profile-info">
        <p>ID: {profile.userId}</p>
        <p>Email: {profile.email}</p>
        <p>Nickname: {profile.nickname}</p>
        <button className="edit-info-button">정보 수정하기</button>
      </div>
    </div>
  );
};

export default UserProfileSection;

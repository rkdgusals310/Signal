import React, { useState, useEffect } from 'react';
import './UserMyChattingSection.css';

const UserMyChattingSection = () => {
  const [chatting, setChatting] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMyChatting(currentPage);
  }, [currentPage]);

  const fetchMyChatting = async (page) => {
    try {
      const response = await fetch(`/api/user/my-chatting?page=${page}&size=5`);
      if (response.ok) {
        const data = await response.json();
        setChatting(data.content.myChatting);
      }
    } catch (error) {
      console.error('Error fetching chatting:', error);
    }
  };

  return (
    <div className="user-my-chatting-section">
      <h3>전문가 상담 내역 확인</h3>
      <table>
        <thead>
          <tr>
            <th>상담사 이름</th>
            <th>상담일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {chatting.map((chat) => (
            <tr key={chat.id}>
              <td>{chat.consultant}</td>
              <td>{chat.createdAt.split('T')[0]}</td>
              <td>{chat.status === 'completed' ? <button>리뷰 보기</button> : '상담 진행중'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserMyChattingSection;

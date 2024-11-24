import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ChatRoomPage.css';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const consultantName = location.state?.consultantName || '상담사';
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [cursor]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/auth/chat/room/${roomId}/details?size=10&cursor=${cursor || ''}&role=USER`
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...data.messages, ...prev]);
        setCursor(data.nextCursor);
        setHasNext(data.hasNext);
      } else {
        setError('메시지를 불러오지 못했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('/api/auth/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          senderId: 1, // 로그인된 유저 ID로 대체 필요
          message: messageInput,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setMessageInput('');
      }
    } catch (err) {
      alert('메시지를 전송할 수 없습니다.');
    }
  };

  return (
    <div className="chat-room">
      <h1>{consultantName}와의 상담</h1>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.messageId} className="chat-message">
            <strong>{msg.senderName}</strong>: {msg.message} <small>{msg.sentAt}</small>
          </div>
        ))}
        {hasNext && <button onClick={() => fetchMessages()}>더 불러오기</button>}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="메시지를 입력하세요."
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;

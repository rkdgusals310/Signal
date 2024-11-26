import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ChatRoomPage.css';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const consultantName = location.state?.consultantName || '상담사';
  const userRole = sessionStorage.getItem('role');

  const welcomeMessage = {
    messageId: 'welcome',
    senderName: consultantName,
    message: '상담을 원하시는 내용을 입력해주세요. 가능한 빨리 답변 드리도록 하겠습니다.',
    sentAt: new Date().toISOString(),
    senderType: 'CONSULTANT',
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [messageInput, setMessageInput] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    if (didMount) {
      fetchMessages();
    }
  }, [cursor, didMount]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/auth/chat/room/${roomId}/details?size=10&cursor=${cursor || ''}&role=${userRole}`
      );

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [welcomeMessage, ...data.messages, ...prev.filter((m) => m.messageId !== 'welcome')]);
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
    if (!messageInput.trim()) return;
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await fetch('/api/auth/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          senderId: userId,
          message: messageInput,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [welcomeMessage, ...prev.filter((m) => m.messageId !== 'welcome'), newMessage]);
        setMessageInput('');
      } else {
        alert('메시지를 전송할 수 없습니다.');
      }
    } catch (err) {
      alert('메시지를 전송할 수 없습니다.');
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button className="chatroomback-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h1>{consultantName}와의 상담</h1>
      </div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={`chat-message ${msg.senderType === userRole ? 'user-message' : 'consultant-message'}`}
          >
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
          onKeyDown={handleEnterPress} // Enter 키 이벤트 추가
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage;

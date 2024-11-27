import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './ChatRoomPage.css';

const ChatRoomPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const consultantName = location.state?.consultantName || '상담사';
  const userId = Number(sessionStorage.getItem('userId'));
  const userRole = sessionStorage.getItem('role');

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);
  const [didMount, setDidMount] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    if (didMount) {
      fetchMessages();
    }
  }, [cursor, didMount]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/auth/chat/room/${roomId}/details?size=30&cursor=${cursor || ''}&role=${userRole}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('API Response Messages:', data.messages);
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };
  

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
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
        setMessages((prev) => [newMessage, ...prev]);
        setMessageInput('');
        window.location.reload();
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
        {messages.map((msg, index) => {
          const isUserMessage = Number(msg.senderId) === userId;
          console.log('Message Object:', msg);
          console.log('Current userId:', userId);
          console.log('isUserMessage:', isUserMessage);
          return (
            <div
              key={msg.messageId || `msg-${index}`}
              className={`chat-message ${isUserMessage ? 'user-message' : 'consultant-message'}`}
            >
              <strong>{msg.senderName}</strong>: {msg.message} <small>{formatDate(msg.sentAt)}</small>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
        {hasNext && <button onClick={() => setCursor(cursor)}>더 불러오기</button>}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="메시지를 입력하세요."
          onKeyDown={handleEnterPress}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ChatRoomPage;

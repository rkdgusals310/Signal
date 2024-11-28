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

  const defaultWelcomeMessage = {
    messageId: 'welcome',
    senderName: consultantName,
    message: '상담을 원하시는 내용을 입력해주세요. 가능한 빨리 답변 드리도록 하겠습니다. 상담종료: /종료하기',
    sentAt: new Date().toISOString(),
    senderId: null,
  };

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    intervalRef.current = setInterval(fetchMessages, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/auth/chat/room/${roomId}/details?size=30&cursor=${cursor || ''}&role=${userRole}`
      );
      if (response.ok) {
        const data = await response.json();
  
        const newMessages = data.messages.filter(
          (msg) => !messages.some((existing) => existing.messageId === msg.messageId)
        );
  
        setMessages((prev) => {
          const updatedMessages = [...prev, ...newMessages];
          const uniqueMessages = Array.from(new Set(updatedMessages.map((msg) => msg.messageId))).map((id) =>
            updatedMessages.find((msg) => msg.messageId === id)
          );
  
          if (!uniqueMessages.some((msg) => msg.messageId === defaultWelcomeMessage.messageId)) {
            uniqueMessages.unshift(defaultWelcomeMessage);
          }
  
          return uniqueMessages;
        });
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
  
    if (messageInput.trim() === '/종료하기') {
      clearInterval(intervalRef.current);
      const endMessages = [
        {
          messageId: 'end-system-1',
          senderName: 'System',
          message: '일정시간동안 채팅이 이어지지 않아 상담을 종료합니다.',
          sentAt: new Date().toISOString(),
          senderId: null,
        },
        {
          messageId: 'end-system-2',
          senderName: 'System',
          message: '상담 내용이 마음에 드셨다면 리뷰를 남겨주세요. Signal의 발전에 큰 도움이 됩니다.',
          sentAt: new Date().toISOString(),
          senderId: null,
        },
        {
          messageId: 'end-button',
          senderName: 'System',
          message: (
            <button onClick={handleEndChat} className="review-button">
              리뷰 작성하기
            </button>
          ),
          sentAt: new Date().toISOString(),
          senderId: null,
        },
      ];
  
      setMessages((prev) => [...prev, ...endMessages]);
      setMessageInput('');
      return;
    }
  
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
        setMessages((prev) => [...prev, newMessage]);
        setMessageInput('');
        scrollToBottom();
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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };
  

  const handleEndChat = async () => {
    try {
      const response = await fetch(`/api/auth/chat/room/${roomId}/status`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('상담이 종료되었습니다.');
        navigate(`/review/${roomId}`);
      } else {
        alert('상담 종료 요청이 실패했습니다.');
      }
    } catch (err) {
      alert('상담 종료 요청 중 오류가 발생했습니다.');
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
          return (
            <div
              key={msg.messageId || `msg-${index}`}
              className={`chat-message ${isUserMessage ? 'user-message' : 'consultant-message'}`}
            >
              <strong>{msg.senderName}</strong>{' '}
              {typeof msg.message === 'string' ? msg.message : msg.message} <small>{formatDate(msg.sentAt)}</small>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
        {hasNext && <button onClick={fetchMessages}>더 불러오기</button>}
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

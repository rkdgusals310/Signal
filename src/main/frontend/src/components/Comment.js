import React, { useState, useEffect } from 'react';
import './Comment.css';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/common/post/${postId}/comments`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data); // 서버에서 받은 댓글 데이터를 상태에 저장
      } else {
        throw new Error('Error fetching comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    try {
      const response = await fetch(`/api/common/post/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: 1, // 임시로 1
          contents: newComment,
        }),
      });

      if (response.ok) {
        setNewComment(''); // 댓글 입력란 초기화
        fetchComments(); // 댓글 목록 다시 불러오기
      } else {
        throw new Error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>댓글</h3>
        <span className="comment-count">{comments.length}개</span>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>{comment.contents}</p>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="댓글을 작성해 주세요."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">등록하기</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Comment;

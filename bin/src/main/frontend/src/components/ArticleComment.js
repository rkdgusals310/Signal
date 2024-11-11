import React, { useState, useEffect } from 'react';
import './ArticleComment.css';

const ArticleComment = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/consultant/article/${articleId}/comment`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
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
      const response = await fetch(`/api/consultant/article/${articleId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          id: 101, // 사용자 ID, 예시로 101을 사용
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>댓글</h3>
        <span className="comment-count">{comments.length}개</span>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p><strong>{comment.sex}</strong></p> {/* 성별 표시 */}
            <p>{comment.content}</p>
            <p className="comment-date">{comment.created_at}</p>
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

export default ArticleComment;

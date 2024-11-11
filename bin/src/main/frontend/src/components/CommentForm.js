import React, { useState } from 'react';

///수정필요
///댓글 조회뺴고 다 됨

const CommentForm = ({ postId }) => {
  const [comment, setComment] = useState(''); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') {
      setError('댓글을 입력하세요.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      const result = await response.json();
      console.log('댓글 작성 성공:', result);

      setComment('');
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다:', error);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-form">
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={handleInputChange}
          placeholder="댓글을 입력하세요."
          rows="4"
          cols="50"
          disabled={loading}
        ></textarea>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? '댓글 작성 중...' : '댓글 작성'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;

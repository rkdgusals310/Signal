import React, { useState, useEffect } from 'react';
import './Comment.css';
import maleIcon from '../assets/male-icon.png';
import femaleIcon from '../assets/female-icon.png';
import deleteIcon from '../assets/delete-post.png';
import updateIcon from '../assets/update-post.png';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = async (reset = false) => {
    if (!hasNext && !reset) return;

    try {
      const url = cursorId
        ? `/api/common/post/${postId}/comment?cursorId=${cursorId}&size=10`
        : `/api/common/post/${postId}/comment?size=1`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { accept: '*/*' },
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => (reset ? data.comments : [...prevComments, ...data.comments]));
        setCursorId(data.nextCursorId);
        setHasNext(data.hasNext);
        setTotalComments(data.repliesCount);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          contents: newComment,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleLoadMore = () => {
    fetchComments();
  };

  useEffect(() => {
    fetchComments(true);
  }, [postId]);

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>댓글</h3>
        <span className="comment-count">{totalComments}개</span>
      </div>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img
              src={comment.gender === 'MALE' ? maleIcon : femaleIcon}
              alt={comment.gender}
              className="comment-gender-icon"
            />
            <span className="comment-content">{comment.contents}</span>
            <div className="comment-actions">
              <img
                src={updateIcon}
                alt="Edit"
                className="comment-action-icon"
                onClick={() => console.log('Edit', comment.id)}
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className="comment-action-icon"
                onClick={() => console.log('Delete', comment.id)}
              />
            </div>
          </div>
        ))}
      </div>
      {hasNext && (
        <button onClick={handleLoadMore} className="load-more">
          댓글 더 보기
        </button>
      )}
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

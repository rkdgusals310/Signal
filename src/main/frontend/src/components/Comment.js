import React, { useState, useEffect } from 'react';
import './Comment.css';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [totalComments, setTotalComments] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false); // 전체 댓글 표시 여부

  const fetchComments = async (reset = false) => {
    if (!hasNext && !reset) return;

    try {
      const url = cursorId
        ? `/api/common/post/${postId}/comment?cursorId=${cursorId}&size=50`
        : `/api/common/post/${postId}/comment?size=50`;

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
        setNewComment('');
        setCursorId(null); // 새로고침을 위해 cursorId 초기화
        setHasNext(true);
        setShowAllComments(false); // 처음 두 개만 표시
        fetchComments(true); // 댓글 목록 새로고침
      } else {
        throw new Error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleEditComment = async (id, currentContent) => {
    const newContent = prompt('댓글을 수정하세요:', currentContent);
    if (newContent && newContent !== currentContent) {
      try {
        const response = await fetch(`/api/common/post/${postId}/comment/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: newContent }),
        });

        if (response.ok) {
          fetchComments(true);
        } else {
          throw new Error('Error updating comment');
        }
      } catch (error) {
        console.error('Error updating comment:', error);
        setError('댓글 수정 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteComment = async (id) => {
    const confirmDelete = window.confirm('댓글을 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/common/post/${postId}/comment/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setComments([]);
          setCursorId(null);
          setHasNext(true);
          fetchComments(true);
          setTotalComments((prevCount) => prevCount - 1);
        } else {
          throw new Error('Error deleting comment');
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        setError('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
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
      <div className="comment-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {comments.slice(0, showAllComments ? comments.length : 2).map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>{comment.contents}</p>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <div className="comment-actions">
              <button onClick={() => handleEditComment(comment.id, comment.contents)}>수정</button>
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            </div>
          </div>
        ))}
        {!showAllComments && comments.length > 2 && (
          <button onClick={() => setShowAllComments(true)} className="load-more">
            ---더보기---
          </button>
        )}
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

import React, { useState, useEffect } from 'react';
import './Comment.css';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [totalComments, setTotalComments] = useState(0);

  const fetchComments = async () => {
    if (!hasNext) return;

    try {
      const url = cursorId
        ? `/api/common/post/${postId}/comment?cursorId=${cursorId}&size=10`
        : `/api/common/post/${postId}/comment?size=10`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'accept': '*/*' },
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prevComments) => [...prevComments, ...data.comments]);
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
          userId: 1,
          contents: newComment,
        }),
      });

      if (response.ok) {
        setNewComment('');
        setComments([]);
        setCursorId(null);
        setHasNext(true);
        fetchComments();
      } else {
        throw new Error('Error submitting comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('댓글 등록 중 오류가 발생했습니다.');
    }
  };

  const handleEditComment = async (id, currentContent) => {
    const newContent = prompt("댓글을 수정하세요:", currentContent);
    if (newContent && newContent !== currentContent) {
      try {
        const response = await fetch(`/api/common/post/${postId}/comment/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: newContent }),
        });

        if (response.ok) {
          fetchComments();
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
    const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/common/post/${postId}/comment/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          // 댓글 목록을 다시 불러와서 갱신
          setComments([]);
          setCursorId(null);
          setHasNext(true);
          fetchComments();
          setTotalComments((prevCount) => prevCount - 1); // 총 댓글 수 업데이트
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
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>댓글</h3>
        <span className="comment-count">{totalComments}개</span>
      </div>
      <div className="comment-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p>{comment.contents}</p>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <div className="comment-actions">
              <button onClick={() => handleEditComment(comment.id, comment.contents)}>수정</button>
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
      {hasNext && (
        <button onClick={fetchComments} className="load-more">
          더 불러오기
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

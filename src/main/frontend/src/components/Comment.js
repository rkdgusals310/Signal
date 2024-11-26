import React, { useState, useEffect } from 'react';
import './Comment.css';
import maleIcon from '../assets/male-icon.png';
import femaleIcon from '../assets/female-icon.png';
import deleteIcon from '../assets/delete-post.png';
import updateIcon from '../assets/update-post.png';

const Comment = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [error, setError] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [totalComments, setTotalComments] = useState(0);

  const currentUserId = sessionStorage.getItem('userId');

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
        setError(null); // 오류 메시지 초기화
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

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  const confirmEditComment = async () => {
    if (editingContent.trim() === '') return;

    const confirmEdit = window.confirm('댓글을 수정하시겠습니까?');
    if (confirmEdit) {
      try {
        const response = await fetch(`/api/common/post/${postId}/comment/${editingCommentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: editingContent }),
        });

        if (response.ok) {
          alert('댓글이 수정되었습니다.');
          window.location.reload();
        } else {
          throw new Error('Error updating comment');
        }
      } catch (error) {
        console.error('Error updating comment:', error);
        setError('댓글 수정 중 오류가 발생했습니다.');
      } finally {
        setEditingCommentId(null);
        setEditingContent('');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = window.confirm('댓글을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      const response = await fetch(
        `/api/common/post/${postId}/comment/${commentId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        alert('댓글이 삭제되었습니다.');
        window.location.reload();
      } else {
        throw new Error('Error deleting comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('댓글 삭제 중 오류가 발생했습니다.');
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
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img
                src={comment.gender === 'MALE' ? maleIcon : femaleIcon}
                alt={comment.gender}
                className="comment-gender-icon"
              />
              {editingCommentId === comment.id ? (
                <div className="editing-comment">
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button onClick={confirmEditComment}>수정 확인</button>
                </div>
              ) : (
                <span className="comment-content">{comment.contents}</span>
              )}

              {comment.userId === Number(currentUserId) && (
                <div className="comment-actions">
                  <img
                    src={updateIcon}
                    alt="Edit"
                    className="comment-action-icon"
                    onClick={() => handleEditComment(comment.id, comment.contents)}
                  />
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="comment-action-icon"
                    onClick={() => handleDeleteComment(comment.id)}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-comments-message">작성된 댓글이 없습니다.</p>
        )}
      </div>
      {hasNext && comments.length > 0 && (
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

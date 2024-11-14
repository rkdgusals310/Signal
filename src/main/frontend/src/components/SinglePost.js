import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import './SinglePost.css';
import likeBefore from '../assets/like-before.png'; // 좋아요 전 아이콘
import likeAfter from '../assets/like-after.png'; // 좋아요 후 아이콘
import viewIcon from '../assets/view-state.png'; // 조회수 아이콘
import likeStateIcon from '../assets/like-state.png'; // 좋아요 수 아이콘
import updateIcon from '../assets/update-post.png'; // 수정 아이콘
import deleteIcon from '../assets/delete-post.png'; // 삭제 아이콘

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false); // 좋아요 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 상태
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/common/post/${postId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setLiked(data.liked); // 서버에서 좋아요 상태 받아오기 (예시)
      } else {
        console.error('Error fetching post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const response = await fetch(`/api/user/post/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLiked(!liked);
        setPost((prevPost) => ({
          ...prevPost,
          likeCount: liked ? prevPost.likeCount - 1 : prevPost.likeCount + 1,
        }));
      } else {
        console.error('Error toggling like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/post/edit/${post.id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/user/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        navigate('/community'); // 삭제 후 커뮤니티 페이지로 이동
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setShowDeleteModal(false); // 모달 닫기
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="single-post-container">
      <div className="post-header">
        <button className="back-button" onClick={() => navigate(-1)}>{'<'}</button>
        <img
          src={liked ? likeAfter : likeBefore}
          alt="Like"
          className="like-icon"
          onClick={handleLikeToggle}
        />
        <h2 className="post-title">{post.title}</h2>
        <div className="post-actions">
          <img src={updateIcon} alt="Edit" className="action-icon" onClick={handleEdit} />
          <img src={deleteIcon} alt="Delete" className="action-icon" onClick={openDeleteModal} />
        </div>
      </div>
      <hr className="divider" />
      <div className="post-meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <div className="meta-icons">
          <img src={viewIcon} alt="Views" />
          <span>{post.viewCount}</span>
          <img src={likeStateIcon} alt="Likes" />
          <span>{post.likeCount}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.contents}</p>
      </div>
      <hr className="divider" />
      <Comment postId={postId} />

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>게시글을 삭제하겠습니까?</p>
            <button className="confirm-button" onClick={handleDelete}>예</button>
            <button className="cancel-button" onClick={closeDeleteModal}>아니오</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;

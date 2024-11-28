import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import './SinglePost.css';
import likeBefore from '../assets/like-before.png';
import likeAfter from '../assets/like-after.png';
import viewIcon from '../assets/view-state.png';
import likeStateIcon from '../assets/like-state.png';
import updateIcon from '../assets/update-post.png';
import deleteIcon from '../assets/delete-post.png';

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [didMount, setDidMount] = useState(false);
  const navigate = useNavigate();

  const currentUserId = sessionStorage.getItem('userId');

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/common/post/${postId}`, {
        method: 'GET',
        headers: {
          accept: '*/*',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data);
        setLiked(data.liked);
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
      const response = await fetch(`/api/common/post/${postId}/like`, {
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
        navigate('/community');
      } else {
        console.error('Error deleting post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    setDidMount(true);
  }, []);

  useEffect(() => {
    if (didMount) {
      fetchPost();
    }
  }, [didMount]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="single-post-container">
      <div className="single-post-header">
        <button className="single-post-back-button" onClick={() => navigate(-1)}>
          {'<'}
        </button>
        <img
          src={liked ? likeBefore : likeAfter}
          alt="Like"
          className="single-post-like-icon"
          onClick={handleLikeToggle}
        />
        <div className="single-post-title">{post.title}</div>

        {post.userId === Number(currentUserId) && (
          <div className="single-post-actions">
            <img src={updateIcon} alt="Edit" className="single-post-action-icon" onClick={handleEdit} />
            <img src={deleteIcon} alt="Delete" className="single-post-action-icon" onClick={openDeleteModal} />
          </div>
        )}
      </div>
      <hr className="single-post-divider" />
      <div className="single-post-meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <div className="single-post-meta-icons">
          <img src={viewIcon} alt="Views" />
          <span>{post.viewCount}</span>
          <img src={likeStateIcon} alt="Likes" />
          <span>{post.likeCount}</span>
        </div>
      </div>
      <div className="single-post-content">
        <p>{post.contents}</p>
      </div>
      <hr className="single-post-divider" />
      <Comment postId={postId} />

      {showDeleteModal && (
        <div className="single-post-modal-overlay">
          <div className="single-post-modal-content">
            <p>게시글을 삭제하겠습니까?</p>
            <button className="single-post-confirm-button" onClick={handleDelete}>
              예
            </button>
            <button className="single-post-cancel-button" onClick={closeDeleteModal}>
              아니오
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;

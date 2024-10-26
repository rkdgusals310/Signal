import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import './SinglePost.css';

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } else {
        console.error('Error fetching post');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="single-post-container">
      <div className="post-header">
        <button onClick={() => navigate(-1)}>{'<'}</button>
        <span className="like-button">❤️</span>
        <h2>{post.title}</h2>
        <div className="post-actions">
          <span className="edit-button">✏️</span>
          <span className="delete-button">🗑️</span>
        </div>
      </div>
      <hr className="divider" />
      <div className="post-meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>조회수: {post.viewCount}</span>
        <span>좋아요수: {post.likeCount}</span>
      </div>
      <div className="post-content">
        <p>{post.contents}</p>
      </div>
      <hr className="divider" />
      <Comment postId={postId} /> {/* 댓글 컴포넌트 추가 */}
    </div>
  );
};

export default SinglePost;

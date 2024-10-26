import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommunityNavigation from '../components/CommunityNavigation';
import './GominDetailPage.css';

const GominDetailPage = () => {
  const { category } = useParams(); // URL에서 카테고리 파라미터 가져오기
  const [posts, setPosts] = useState([]);
  const [hotPost, setHotPost] = useState(null);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 0 });
  const [pageSize] = useState(10); // 한 페이지당 표시할 게시글 수
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleWritePost = () => {
    navigate('/community/write');
  };

  const mapCategoryToBackendFormat = (category) => {
    switch (category) {
      case '10':
        return '_10S';
      case '20':
        return '_20S';
      case '30':
        return '_30S';
      case '40':
        return '_40S';
      case 'gomsin':
        return 'MILITARY';
      case 'CC':
        return 'CC';
      case 'office':
        return 'OFFICE';
      case 'date-places':
        return 'DATE_LOCATION';
      case 'gifts':
        return 'ANNIVERSARY_GIFT';
      case 'travel':
        return 'TRAVEL_LOCATION';
      default:
        return category;
    }
  };

  const fetchPosts = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const formattedCategory = mapCategoryToBackendFormat(category);
      const response = await fetch(
        `/api/common/post?category=${formattedCategory}&page=${page}&size=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('전체 응답 데이터:', data);

      if (data && data.contents && data.contents.length > 0) {
        setPosts(data.contents[0].posts || []);  // 서버 응답의 구조에 맞게 posts 설정
        setHotPost(data.contents[0].hotPost || null);  // 서버 응답의 구조에 맞게 hotPost 설정
        setPagination({
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 0,
        });
      } else {
        setPosts([]);
        setHotPost(null);
      }
    } catch (error) {
      console.error('게시글을 불러오는 중 오류가 발생했습니다:', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // 초기 로딩 시 첫 페이지 데이터 가져오기
  }, [category]);

  const handlePageChange = (newPage) => {
    fetchPosts(newPage); // 페이지 변경 시 새로운 페이지 데이터 가져오기
  };

  return (
    <div className="gomin-detail-page">
      <CommunityNavigation />

      <div className="gomin-content">
        <h2>고민 / {category} 대</h2>

        {loading && <p>로딩 중...</p>}
        {error && <p>{error}</p>}

        <table className="post-list-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성일시</th>
              <th>조회수</th>
              <th>좋아요</th>
            </tr>
          </thead>

          <tbody>
            {hotPost && (
              <tr className="hot-post" onClick={() => handlePostClick(hotPost.id)}>
                <td>{hotPost.title}</td>
                <td>{hotPost.createdAt}</td>
                <td>{hotPost.viewCount}</td>
                <td>{hotPost.likesCount}</td>
              </tr>
            )}

            {posts.length === 0 ? (
              <tr>
                <td colSpan="4">게시글이 없습니다.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} onClick={() => handlePostClick(post.id)}>
                  <td>{post.title}</td>
                  <td>{post.createdAt}</td>
                  <td>{post.viewCount}</td>
                  <td>{post.likesCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="write-post-container">
          <button className="write-post-button" onClick={handleWritePost}>
            작성하기
          </button>
        </div>

        <div className="pagination-container">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={pagination.currentPage === index ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GominDetailPage;

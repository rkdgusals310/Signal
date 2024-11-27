import React, { useState, useEffect } from 'react';
import './UserMyPostsSection.css';

const UserMyPostsSection = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMyPosts(currentPage);
  }, [currentPage]);

  const fetchMyPosts = async (page) => {
    try {
      const response = await fetch(`/api/user/my-post?page=${page}&size=10`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('서버 응답 데이터:', data);
        if (data.contents && data.contents.length > 0 && data.contents[0].myPost) {
          setPosts(data.contents[0].myPost);
          setTotalPages(data.totalPages);
        } else {
          console.error('서버 응답 데이터 구조가 예상과 다릅니다:', data);
          setPosts([]);
        }
      } else {
        console.error('HTTP 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('내 게시글을 불러오는 중 오류 발생:', error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="user-my-posts-section">
      <h3>내가 작성한 게시글 보기</h3>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>작성일시</th>
            <th>좋아요</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} onClick={() => window.location.href = `/post/${post.id}`}>
              <td>{post.title}</td>
              <td>{post.createdAt.split('T')[0]}</td>
              <td>{post.likesCount}</td>
              <td>{post.viewCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
          &lt; 이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index ? 'active' : ''}
            onClick={() => handlePageChange(index)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          다음 &gt;
        </button>
      </div>
    </div>
  );
};

export default UserMyPostsSection;

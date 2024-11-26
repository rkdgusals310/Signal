import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HotPosts.css';

const HotPosts = () => {
  const navigate = useNavigate();

  // 목데이터
  const posts = [
    {
      id: 1,
      title: '장거리 연애의 현실',
      content:
        '우리는 몸이 멀어지면 마음도 멀어진다는 말을 익히 잘 알고 있지만, 장거리 연애를 경험하는 사람도 꽤 많고, 본인은 아닌 것이라 믿는 사람도 많다. 그렇다면, 실제로 장거리 연애는 어떨까? 장거리 연애 유형별 커플 사례들과 함께 장거리 연애의 특징을 함께 살펴보자.',
      createdAt: '2024-10-16',
    },
    {
      id: 2,
      title: '장거리 연애의 극복 방법',
      content:
        '우리는 연애를 시작할 때 생각보다 많은 요소를 따지게 된다. 상대방의 외모는 물론이고 성격, 경제력, 유머코드 등 나름의 조건을 가지고 연애를 시작한다. 그 중에서도 장거리는 꽤나 큰 리스크리 중 하나이다.',
      createdAt: '2024-10-15',
    },
    // 2개까지만 할 것
  ];

  return (
    <div className="hot-posts-header">
      <div className='hot-post-header'>
        <h2 className="hot-post-title">Hot 게시글</h2>
      </div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="hot-post"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <h3>{post.title}</h3>
          <p className="hot-post-content">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default HotPosts;

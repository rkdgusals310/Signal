import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FooterLogin from './components/FooterLogin';
import CommunityPage from './pages/CommunityPage';
import GominDetailPage from './pages/GominDetailPage';
import InfoDetailPage from './pages/InfoDetailPage';
import WritePage from './pages/WritePage';
import PostDetailPage from './pages/PostDetailPage';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserTypeSelection from './pages/UserTypeSelection'; // 사용자 유형 선택 페이지 추가
import ConsultantSignupPage from './pages/ConsultantSignupPage';
import EditPostPage from './pages/EditPostPage';
import './App.css';

// 별도의 컴포넌트로 useLocation을 포함한 내부 로직 처리
function Layout() {
  const location = useLocation(); // Router 내부에서 호출
  // 로그인 페이지 또는 회원가입 페이지에서는 헤더를 제외
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/select-user-type' ||
    location.pathname === '/consultant-signup' ||
    location.pathname.startsWith('/consultant-signup');

  return (
    <div className="app-container">
      {/* 로그인 및 회원가입 페이지가 아닐 때만 Header를 렌더링 */}
      {!isAuthPage && <Header />}

      <main className="content">
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<HomePage />} />

          {/* 커뮤니티 관련 경로 */}
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/gomin/:category" element={<GominDetailPage />} />
          <Route path="/community/info/:category" element={<InfoDetailPage />} />
          <Route path="/community/write" element={<WritePage />} />

          {/* 게시글 상세 페이지 */}
          <Route path="/post/:postId" element={<PostDetailPage />} />

          {/* 로그인 페이지 경로 */}
          <Route path="/login" element={<Login />} />

          <Route path="/post/edit/:postId" element={<EditPostPage />} />

          {/* 회원가입 페이지 경로 추가 */}
          <Route path="/signup" element={<SignUp />} /> {/* 일반 사용자 회원가입 경로 */}

          {/* 사용자 유형 선택 페이지 경로 */}
          <Route path="/select-user-type" element={<UserTypeSelection />} /> {/* 일반 사용자 / 전문가 선택 경로 */}

          <Route path="/consultant-signup" element={<ConsultantSignupPage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </main>

      {/* 로그인 및 회원가입 페이지면 FooterLogin, 그 외에는 일반 Footer를 렌더링 */}
      {isAuthPage ? <FooterLogin /> : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout /> {/* Layout 컴포넌트 내에서 useLocation 사용 */}
    </Router>
  );
}

export default App;

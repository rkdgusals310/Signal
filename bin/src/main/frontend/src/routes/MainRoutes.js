import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ArticlePage from '../pages/ArticlePage';
import MyPage from '../pages/MyPage';
import ConsultingPage from '../pages/ConsultingPage';
import Login from "../pages/Login";
import CommunityRoutes from './CommunityRoutes'; // CommunityRoutes 임포트

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/article" element={<ArticlePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/consulting" element={<ConsultingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/community/*" element={<CommunityRoutes />} /> 

    </Routes>
  );
};

export default MainRoutes;

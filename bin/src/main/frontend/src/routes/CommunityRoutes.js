// src/routes/CommunityRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CommunityPage from '../pages/CommunityPage';
import GominDetailPage from '../pages/GominDetailPage';
import InfoDetailPage from '../pages/InfoDetailPage';
import WritePage from '../pages/WritePage';

const CommunityRoutes = () => {
  return (
    <Routes>
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/gomin/:category" element={<GominDetailPage />} />
      <Route path="/community/info/:category" element={<InfoDetailPage />} />
      <Route path="/community/write" element={<WritePage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />
    </Routes>
  );
};

export default CommunityRoutes;

// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import ReportPage from './pages/ReportPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/reports/:id" element={<ReportPage />} />
        {/* fallback */}
        <Route path="*" element={<div className="p-6">404 — Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

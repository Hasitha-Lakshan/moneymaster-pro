import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Auth } from '../auth/Auth';
import { CategoriesPage } from '../pages/CategoriesPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { SourcesPage } from '../pages/SourcesPage';
import { TransactionsPage } from '../pages/TransactionsPage';

const AppRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Auth />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/sources" element={<SourcesPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

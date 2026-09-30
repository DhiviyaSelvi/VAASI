import React from 'react';
import { Route, createRoutesFromElements } from 'react-router-dom';
import PageShell from './components/layout/PageShell';
import Browse from './pages/Browse';
import Login from './pages/Login';
import BookDetail from './pages/BookDetail';
import Sell from './pages/Sell';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

/**
 * Central Route Table for Vaasi Web App
 */
export const routes = createRoutesFromElements(
  <Route path="/" element={<PageShell />}>
    <Route index element={<Browse />} />
    <Route path="login" element={<Login />} />
    <Route path="book/:id" element={<BookDetail />} />
    <Route path="sell" element={<Sell />} />
    <Route path="chat" element={<Chat />} />
    <Route path="chat/:conversationId" element={<Chat />} />
    <Route path="profile" element={<Profile />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);

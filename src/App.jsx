import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import FilmerLoginPage from './components/FilmerLoginPage/FilmerLoginPage';
import FilmerExtraInfoPage from './components/LoginPage/SocialJoinComplete';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './contexts/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import FindIdPage from './components/LoginPage/FindIdPage';
import FindIdResultPage from './components/LoginPage/FindIdResultPage';
import FindPasswordPage from './components/LoginPage/FindPasswordPage';
import ResetPasswordPage from './components/LoginPage/ResetPasswordPage';
import MainPage from './components/MainPage/MainPage';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={2000} />
        <DefaultLayout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/loginform" element={<FilmerLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/social-join" element={<FilmerExtraInfoPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route path="/find-id" element={<FindIdPage />} />
            <Route path="/find-id-result" element={<FindIdResultPage />} />
            <Route path="/find-password" element={<FindPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<MainPage />} />
          </Routes>
        </DefaultLayout>
      </BrowserRouter>
    </UserProvider>
  );
}

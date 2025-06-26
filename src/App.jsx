import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import FilmerLoginPage from './components/FilmerLoginPage/FilmerLoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="top-center" autoClose={2000} />
      <DefaultLayout>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/loginform" element={<FilmerLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
        </Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

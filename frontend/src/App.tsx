import React from "react";
import { Route, Routes } from "react-router";
import IndexPage from "./pages/index";
import DashboardPage from "./pages/dashboard";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import PrivacyPage from "./pages/privacy";
import SharedLinksPage from "./pages/shared-links";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="shared-links" element={<SharedLinksPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="privacy" element={<PrivacyPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Routes>
  );
};

export default App;

import { useEffect } from "react";
import { Route, Routes } from "react-router";
import IndexPage from "./pages/index";
import DashboardPage from "./pages/dashboard";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import PrivacyPage from "./pages/privacy";
import SharedLinksPage from "./pages/shared-links";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import SharedContentPage from "./pages/shared-content";
import ContentDetailPage from "./pages/content-detail";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";
import { RequireAuth } from "./components/RequireAuth";
import { useAppDispatch } from "./store/hooks";
import { restoreSession } from "./store/slices/authSlice";
import MainLayout from "./layout/MainLayout";
const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => { dispatch(restoreSession()); }, [dispatch]);
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="s/:sharedId" element={<SharedContentPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="contact" element={<ContactPage />} />

        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="content/:contentId" element={<ContentDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="shared-links" element={<SharedLinksPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;

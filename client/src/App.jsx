import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout.jsx';
import HomePage from '@pages/HomePage.jsx';
import OurStoryPage from '@pages/OurStoryPage.jsx';
import MenuPage from '@pages/MenuPage.jsx';
import PackagesPage from '@pages/PackagesPage.jsx';
import CartPage from '@pages/CartPage.jsx';
import CheckoutPage from '@pages/CheckoutPage.jsx';
import NotFoundPage from '@pages/NotFoundPage.jsx';
import AdminLayout from '@components/admin/AdminLayout.jsx';
import AdminLoginPage from '@pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from '@pages/admin/AdminDashboardPage.jsx';
import AdminOrdersPage from '@pages/admin/AdminOrdersPage.jsx';
import AdminMenuPage from '@pages/admin/AdminMenuPage.jsx';
import PackagesAdminPage from '@pages/admin/PackagesAdminPage.jsx';
import CustomersAdminPage from '@pages/admin/CustomersAdminPage.jsx';
import ProtectedRoute from '@components/auth/ProtectedRoute.jsx';
import ContactPage from '@pages/ContactPage.jsx';
import SiteContentAdminPage from '@pages/admin/SiteContentAdminPage.jsx';
import ContactMessagesAdminPage from '@pages/admin/ContactMessagesAdminPage.jsx';
import ForgotPasswordPage from '@pages/admin/ForgotPasswordPage.jsx';
import ResetPasswordPage  from '@pages/admin/ResetPasswordPage.jsx';
import FAQPage      from '@pages/FAQPage.jsx';
import PoliciesPage from '@pages/PoliciesPage.jsx';
import PrivacyPage  from '@pages/PrivacyPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq"      element={<FAQPage />} />
        <Route path="/policies" element={<PoliciesPage />} />
        <Route path="/privacy"  element={<PrivacyPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/reset-password"  element={<ResetPasswordPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="packages" element={<PackagesAdminPage />} />
        <Route path="customers" element={<CustomersAdminPage />} />
        <Route path="site-content" element={<SiteContentAdminPage />} />
        <Route path="messages" element={<ContactMessagesAdminPage />} />
      </Route>
    </Routes>
  );
}

import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home/Home";

import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";

import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import Setting from "../Pages/Dashboard/Setting/Setting.jsx";

// import OrderDetails from "../Pages/Dashboard/OrderDetails/OrderDetails.jsx";

import ReturnPolicy from "../Pages/Dashboard/Policy/ReturnPolicy.jsx";
import PrivacyPolicy from "../Pages/Dashboard/Policy/PrivacyPolicy.jsx";
import ProductList from "../Pages/Dashboard/ProductList/ProductList.jsx";

import Notifications from "../Pages/Dashboard/Notification/Notifications.jsx";
import MainCategory from "../Pages/Dashboard/ManageCategory/MainCategory/MainCategory.jsx";
import SubCategory from "../Pages/Dashboard/ManageCategory/SubCategory/SubCategory.jsx";

import TermsAndCondition from "../Pages/Dashboard/Policy/TermsAndCondition.jsx";
import AboutUs from "../Pages/Dashboard/Policy/AboutUs.jsx";
import Faq from "../Pages/Dashboard/Faq/Faq.jsx";
import Brands from "../Pages/Dashboard/Brands/Brands.jsx";
import Inquiry from "../Pages/Dashboard/Inquiry/Inquiry.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Contact from "../Pages/Dashboard/Contact/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/main-category",
        element: <MainCategory />,
      },
      {
        path: "/sub-category",
        element: <SubCategory />,
      },
      {
        path: "/products",
        element: <ProductList />,
      },

      {
        path: "/inquiry",
        element: <Inquiry />,
      },
      {
        path: "/return-policy",
        element: <ReturnPolicy />,
      },
      {
        path: "/terms-and-conditons",
        element: <TermsAndCondition />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/all-brands",
        element: <Brands />,
      },

      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

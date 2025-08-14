import { createBrowserRouter } from "react-router-dom";
import ScrollToTop from "./src/components/ScrollToTop";
import Layout from "./src/layout/Layout";
import Home from "./src/pages/Home/Home";
import Signup from "./src/pages/Signup/Signup";
import Login from "./src/pages/Login/Login";
import NotFoundPage from "./src/components/NotFoundPage";
import React from "react";
import Forgot_Password from "./src/pages/Forgot-Password/Forgot_Password";
import VerifyPage from "./src/pages/verifyPage/VerifyPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Layout />
      </>
    ),

    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "forgot-password",
    element: <Forgot_Password />,
  },
  {
    path: "verify-page",
    element: <VerifyPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
export { router };

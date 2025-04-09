import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/ui/navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/register/login", "/register/signup"];

  return (
    <div>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
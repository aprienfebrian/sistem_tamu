import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Layout from "./Layout.jsx";

import App from "./pages/App.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import NewEntri from "./pages/components/NewEntri.jsx";
import MyEntri from "./pages/components/MyEntri.jsx";
import AllEntri from "./pages/components/AllEntri.jsx";
import Users from "./pages/components/Users.jsx";
import Settings from "./pages/components/Settings.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes tanpa layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes dengan layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="new-entri" element={<NewEntri />} />
          <Route path="my-entri" element={<MyEntri />} />
          <Route path="all-entri" element={<AllEntri />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

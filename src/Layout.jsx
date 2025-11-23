import { Outlet } from "react-router-dom";
import Header from "./pages/layout/Header"; // kalau ada
// import Sidebar from "../components/Sidebar"; // opsional

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}

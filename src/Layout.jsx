import { Outlet } from "react-router-dom";
import Header from "./pages/layout/Header"; // kalau ada

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

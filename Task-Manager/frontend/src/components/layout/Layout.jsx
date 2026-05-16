import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <div className="min-h-screen bg-surface-base">
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;

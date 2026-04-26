import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_90%_90%,rgba(13,148,136,0.16),transparent_35%)]" />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

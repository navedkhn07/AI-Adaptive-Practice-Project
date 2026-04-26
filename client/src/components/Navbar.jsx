import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-cyan-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-3 py-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="group flex min-w-0 items-center gap-3" onClick={() => setMenuOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-sm font-bold text-white shadow-md shadow-cyan-200/80">
              AP
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">AdaptivePractice</span>
              <span className="hidden text-[11px] uppercase tracking-[0.18em] text-cyan-700 sm:block">AI Smart Question Generator</span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-700 shadow-sm transition hover:bg-cyan-50 sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex sm:gap-3">
              <p className="hidden rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700 sm:block">
                {user.name} ({user.role})
              </p>
              {user.role === "student" ? (
                <>
                  <Link to="/student/home" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                    Practice
                  </Link>
                  <Link to="/student/dashboard" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link to="/teacher/dashboard" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                  Teacher Panel
                </Link>
              )}
              <button type="button" className="btn-primary" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex sm:gap-3">
              <Link to="/login" className="btn-ghost" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>

        <div
          id="mobile-nav-menu"
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-out ${
            menuOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {isAuthenticated ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-cyan-100 bg-white/95 p-3 shadow-sm backdrop-blur-md">
              <p className="rounded-xl bg-cyan-50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                {user.name} ({user.role})
              </p>
              {user.role === "student" ? (
                <>
                  <Link to="/student/home" className="btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                    Practice
                  </Link>
                  <Link to="/student/dashboard" className="btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link to="/teacher/dashboard" className="btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                  Teacher Panel
                </Link>
              )}
              <button type="button" className="btn-primary w-full" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-2xl border border-cyan-100 bg-white/95 p-3 shadow-sm backdrop-blur-md">
              <Link to="/login" className="btn-ghost w-full" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="rounded-2xl border border-cyan-100 bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="btn-primary mt-5 inline-flex">
        Go Home
      </Link>
    </section>
  );
};

export default NotFoundPage;

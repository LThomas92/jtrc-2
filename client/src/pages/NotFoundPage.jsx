import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="not-found__folio">Page 404 — Page Not Found</div>
      <h1 className="not-found__title">
        Lost in the <em>kitchen</em>
      </h1>
      <p className="not-found__sub">
        The page you're looking for isn't on the menu.
      </p>
      <Link to="/" className="btn-primary">
        Back Home <span className="btn-primary__arrow">→</span>
      </Link>
    </section>
  );
}

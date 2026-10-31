import { Link } from '@tanstack/react-router';

export default function Header() {
  return (
    <header className="w-full bg-muted-background px-4 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <a href="/" className="text-xl font-bold">
          roveniq<span className="text-accent-700 text-xl">.</span>
        </a>
        <p className="text-neutral-900">
          <Link to={'/about'}>About us</Link>
        </p>
        <p className="text-neutral-900">
          Venues
          <Link to={'/venues'}>Venues</Link>
        </p>
        <p className="text-neutral-900">
          <Link to={'/login'}>Login</Link>
        </p>
        <p className="text-neutral-900">
          <Link to={'/register'}>Register</Link>
        </p>
      </nav>
    </header>
  );
}

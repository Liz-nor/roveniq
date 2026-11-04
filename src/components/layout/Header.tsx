import { Link, useNavigate } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../lib/authStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate({ to: '/login' });
  };

  return (
    <header className="w-full bg-muted-background px-4 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between text-sm font-medium text-neutral-700">
        <a href="/" className="text-xl font-bold text-neutral-900">
          roveniq<span className="text-accent-700 text-xl">.</span>
        </a>
        {/* Customized hamburger menu button for mobile view */}
        <button
          type="button"
          className="rounded-md p-2 text-neutral-900 md:hidden"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <XIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12 L13.5 12" />
              <path d="M4 5h16" />
            </svg>
          )}
        </button>

        <div className="hidden items-center md:flex divide-x divide-neutral-500">
          <p className="text-neutral-900 px-4">
            <Link to={'/about'}>About us</Link>
          </p>
          <p className="text-neutral-900 px-4">
            <Link to={'/venues'}>Venues</Link>
          </p>
          {isLoggedIn ? (
            <>
              <p className="text-neutral-900 px-4">
                <Link to={'/profile'}>Profile</Link>
              </p>
              <p className="text-neutral-900 px-4">
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="text-neutral-900 px-4">
                <Link to={'/login'}>Login</Link>
              </p>
              <p className="text-neutral-900 px-4">
                <Link to={'/register'}>Register</Link>
              </p>
            </>
          )}
        </div>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-nav"
          className="mx-auto mt-3 flex max-w-6xl flex-col gap-3 border-t border-neutral-300 pt-3 text-sm font-medium text-neutral-900 md:hidden"
        >
          <Link to={'/about'} onClick={closeMenu}>
            About us
          </Link>
          <Link to={'/venues'} onClick={closeMenu}>
            Venues
          </Link>
          {isLoggedIn ? (
            <>
              <Link to={'/profile'} onClick={closeMenu}>
                Profile
              </Link>
              <button type="button" onClick={handleLogout} className="text-left">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={'/login'} onClick={closeMenu}>
                Login
              </Link>
              <Link to={'/register'} onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

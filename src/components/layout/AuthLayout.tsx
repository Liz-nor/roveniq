import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import LoginForm from '../../pages/login/page';
import RegisterForm from '../../pages/register/page';

export default function AuthLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRegister = pathname.startsWith('/register');

  return (
    <main className="min-h-screen flex items-center justify-center bg-color-background p-4">
      <div className="relative grid w-full max-w-5xl grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl">
        <LoginForm active={!isRegister} />
        <RegisterForm active={isRegister} />

        <div
          className={`absolute top-0 left-0 z-10 h-full w-1/2 transition-transform duration-700 ease-in-out ${
            isRegister ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <img
            src="/images/suitcase.png"
            alt="Suitcase on an airport"
            className="h-full w-full object-cover opacity-80"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25">
            <h1 className="text-heading mb-4">
              roveniq<span className="text-terracotta-500">.</span>
            </h1>
            <p className="text-heading">Find your somewhere.</p>

            <Link
              to={isRegister ? '/login' : '/register'}
              className="m-4 buttonSecondary"
            >
              {isRegister ? 'Login' : 'Register'}
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </main>
  );
}

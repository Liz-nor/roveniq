import { Link } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const [isLogin] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-color-background p-4">
      <div className="relative grid w-full max-w-5xl grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Login form */}
        <section
          className={`col-start-1 row-start-1 p-10 transition-opacity duration-500 ${
            isLogin ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={isLogin}
          inert={isLogin}
        >
          <Link to="/login">Welcome back</Link>
          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="rounded border p-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="rounded border p-3"
            />
            <button className="rounded bg-[#315C60] p-3 text-white">
              Login
            </button>
          </form>
        </section>

        {/* Sliding image */}
        <div
          className={`absolute top-0 left-1/2 z-10 h-full w-1/2
            transition-transform duration-700 ease-in-out
            ${isLogin ? '-translate-x-full' : 'translate-x-0'}`}
        >
          <img
            src="/public/images/13.png"
            alt="Sca"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25">
            <h1 className="text-4xl font-semibold">roveniq.</h1>
            <p>Find your somewhere.</p>

            <button
              type="button"
              onClick={() => {}}
              className="mt-8 rounded-full border border-white px-6 py-2 hover:bg-white/20"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

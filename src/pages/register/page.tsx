import { Link } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const [isRegister] = useState(true);

  return (
    <main className="min-h-screen flex items-center justify-center bg-color-background p-4">
      <div className="relative grid w-full max-w-5xl grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl">
        <section
          className={`col-start-2 row-start-1 p-10 transition-opacity duration-500 ${
            isRegister ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!isRegister}
          inert={!isRegister}
        >
          <Link to="/register">Create account</Link>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="rounded border p-3"
            />
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
              Register
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

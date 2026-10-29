import ValidatedInput from '../../components/features/ValidatedInput';
import { emailSchema, passwordSchema } from '../../lib/validation';

export default function LoginForm({ active }: { active: boolean }) {
  return (
    <section
      className={`col-start-1 row-start-1 p-10 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      <h1 className="text-text mb-4">Welcome back</h1>
      <form className="flex flex-col gap-4">
        <ValidatedInput
          type="email"
          placeholder="Email"
          schema={emailSchema}
        />
        <ValidatedInput
          type="password"
          placeholder="Password"
          schema={passwordSchema}
        />
        <button className="buttonPrimary">Login</button>
      </form>
    </section>
  );
}

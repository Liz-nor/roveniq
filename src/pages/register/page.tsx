import ValidatedInput from '../../components/features/ValidatedInput';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '../../lib/validation';

export default function RegisterForm({ active }: { active: boolean }) {
  return (
    <section
      className={`col-start-2 row-start-1 p-10 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      <h1 className="text-text mb-4">Create account</h1>
      <form className="flex flex-col gap-4">
        <ValidatedInput
          type="text"
          placeholder="Name"
          schema={nameSchema}
        />
        <ValidatedInput
          type="email"
          placeholder="Email"
          schema={emailSchema}
        />
        <ValidatedInput
          type="password"
          placeholder="Password (min 8 characters)"
          schema={passwordSchema}
        />
        <button className="buttonPrimary">Register</button>
      </form>
    </section>
  );
}

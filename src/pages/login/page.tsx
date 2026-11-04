import ValidatedInput from '../../components/features/ValidatedInput';
import { emailSchema, passwordSchema } from '../../lib/validation';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import type { FormEvent, ReactNode } from 'react';
import { LoaderCircle, Mail, Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { login } from '../../api/auth';
import { useAuthStore } from '../../lib/authStore';

interface SocialButtonProps {
  provider: string;
  icon: ReactNode;
  onClick?: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

type ProviderName = 'Google' | 'Facebook';

// Set enabled: false to hide a provider entirely.
const providerIcons: {
  name: ProviderName;
  icon: ReactNode;
  enabled: boolean;
}[] = [
  {
    name: 'Google',
    icon: <FaGoogle className="size-7 text-basil-500" aria-hidden="true" />,
    enabled: true,
  },
  {
    name: 'Facebook',
    icon: <FaFacebook className="size-7 text-basil-500" aria-hidden="true" />,
    enabled: true,
  },
];

export function SocialAuthButton({
  provider,
  icon,
  onClick,
  isLoading = false,
  disabled = false,
}: SocialButtonProps) {
  // A button without a handler has no provider configured behind it.
  const isUnavailable = disabled || !onClick;
  const label = isUnavailable
    ? `Continue with ${provider} (not available yet)`
    : `Continue with ${provider}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isUnavailable || isLoading}
      aria-label={label}
      title={label}
      aria-busy={isLoading}
      className="
        flex flex-1 items-center justify-center
        px-2 py-3
        rounded-xl border border-oat-500 bg-salt-300
        transition-colors
        enabled:hover:bg-salt-500
        disabled:cursor-not-allowed
      "
    >
      {isLoading ? (
        <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
    </button>
  );
}

interface AlternativeAuthProps {
  mode: 'login' | 'register';
  providerHandlers?: Partial<Record<ProviderName, () => void | Promise<void>>>;
}

export function AlternativeAuth({
  mode,
  providerHandlers = {},
}: AlternativeAuthProps) {
  const isLogin = mode === 'login';
  const visibleProviders = providerIcons.filter((provider) => provider.enabled);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-black" />
        <span className="text-sm leading-none m-4 text-black">
          Or {isLogin ? 'login' : 'register'} with
        </span>
        <div className="h-px flex-1 bg-black" />
      </div>
      <div className="flex gap-4">
        {visibleProviders.map((provider) => (
          <SocialAuthButton
            key={provider.name}
            provider={provider.name}
            icon={provider.icon}
            onClick={providerHandlers[provider.name]}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoginForm({ active }: { active: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!emailSchema.safeParse(email).success) {
      setError('Please enter a valid stud.noroff.no email.');
      return;
    }
    if (!passwordSchema.safeParse(password).success) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken);
      navigate({ to: '/profile' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={`col-start-1 row-start-1 p-10 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      <h1 className="text-text mb-4">Welcome back</h1>
      <p className="text-text mb-4">Please login to your account</p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <ValidatedInput
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          iconPosition="right"
          icon={<Mail className="size-5" aria-hidden="true" />}
          schema={emailSchema}
        />
        <ValidatedInput
          type={showPassword ? 'text' : 'password'}
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          iconPosition="right"
          icon={
            <button
              type="button"
              className="pointer-events-auto cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeClosed className="size-5" aria-hidden="true" />
              ) : (
                <Eye className="size-5" aria-hidden="true" />
              )}
            </button>
          }
          schema={passwordSchema}
        />
        <AlternativeAuth mode="login" />
        <p className="text-text mb-4 hover:underline cursor-pointer hover:text-terracotta-500">
          Forgot password?
        </p>
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          className="buttonPrimary flex items-center justify-center gap-2"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          )}
          Login
        </button>
      </form>
    </section>
  );
}

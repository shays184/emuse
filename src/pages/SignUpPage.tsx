import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface SignUpPageProps {
  onBack: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUpPage({ onBack, onSwitchToSignIn }: SignUpPageProps) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await signUp(
        email.trim(),
        password,
        username.trim(),
      );
      if (err) {
        setError(err.message);
        return;
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl bg-surface-light p-6 text-center shadow-lg dark:bg-surface-dark">
          <p className="mb-4 text-lg font-medium text-text-light dark:text-text-dark">
            Check your email to confirm your account.
          </p>
          <button
            onClick={onSwitchToSignIn}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-medium text-white dark:bg-primary-light dark:text-bg-dark"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-12">
      <button
        onClick={onBack}
        className="mb-6 self-start rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-2xl font-bold text-text-light dark:text-text-dark">
        Create account
      </h1>
      <p className="mb-8 text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Save your favorites across devices and personalize your experience.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={2}
          className="rounded-xl border border-gray-300 bg-surface-light px-4 py-3 text-text-light placeholder:text-gray-400 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-surface-dark dark:text-text-dark dark:focus:border-primary-light"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border border-gray-300 bg-surface-light px-4 py-3 text-text-light placeholder:text-gray-400 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-surface-dark dark:text-text-dark dark:focus:border-primary-light"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="rounded-xl border border-gray-300 bg-surface-light px-4 py-3 text-text-light placeholder:text-gray-400 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-surface-dark dark:text-text-dark dark:focus:border-primary-light"
        />
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50 dark:bg-primary-light dark:text-bg-dark"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Already have an account?{" "}
        <button
          onClick={onSwitchToSignIn}
          className="font-medium text-primary hover:underline dark:text-primary-light"
        >
          Sign in
        </button>
      </p>
    </main>
  );
}

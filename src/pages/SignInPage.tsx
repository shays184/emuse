import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface SignInPageProps {
  onBack: () => void;
  onSwitchToSignUp: () => void;
}

export function SignInPage({ onBack, onSwitchToSignUp }: SignInPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await signIn(email.trim(), password);
      if (err) {
        setError(err.message);
        return;
      }
      onBack();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-12">
      <button
        onClick={onBack}
        className="mb-6 self-start rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <h1 className="mb-8 text-2xl font-bold text-text-light dark:text-text-dark">
        Sign in
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-text-secondary-light dark:text-text-secondary-dark">
        Don&apos;t have an account?{" "}
        <button
          onClick={onSwitchToSignUp}
          className="font-medium text-primary hover:underline dark:text-primary-light"
        >
          Sign up
        </button>
      </p>
    </main>
  );
}

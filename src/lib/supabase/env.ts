/**
 * Reads Supabase connection details from environment variables.
 *
 * These must be set in `.env.local` (see `.env.example`) and are never
 * hardcoded. `NEXT_PUBLIC_*` vars are safe to expose to the browser — the
 * anon key is designed for client-side use and is protected by Supabase's
 * Row Level Security policies, not by secrecy.
 *
 * IMPORTANT: Next.js inlines `NEXT_PUBLIC_*` vars into the browser bundle by
 * statically replacing each literal `process.env.NEXT_PUBLIC_FOO` expression
 * at build time. That only works for direct static access — reading via a
 * dynamic key like `process.env[name]` is invisible to that step, so it
 * silently returns `undefined` in the browser. Each var below must therefore
 * be accessed with its own literal `process.env.NEXT_PUBLIC_...` line.
 */
function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Did you create a .env.local file? See .env.example for the required keys.`,
    );
  }
  return value;
}

export const supabaseUrl = () =>
  requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = () =>
  requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

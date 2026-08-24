/**
 * Reads Supabase connection details from environment variables.
 *
 * These must be set in `.env.local` (see `.env.example`) and are never
 * hardcoded. `NEXT_PUBLIC_*` vars are safe to expose to the browser — the
 * anon key is designed for client-side use and is protected by Supabase's
 * Row Level Security policies, not by secrecy.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Did you create a .env.local file? See .env.example for the required keys.`,
    );
  }
  return value;
}

export const supabaseUrl = () => requireEnv("NEXT_PUBLIC_SUPABASE_URL");
export const supabaseAnonKey = () =>
  requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

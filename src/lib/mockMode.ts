// When no Supabase credentials are configured (e.g. a UI-only preview deploy),
// the app runs against in-memory sample data instead of a real backend.
export const isMockMode = !import.meta.env.VITE_SUPABASE_URL;

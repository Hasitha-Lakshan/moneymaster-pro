import type { User as AppUser } from '../types/auth';
import type { User as SupabaseUser } from '@supabase/auth-js';

export function mapSupabaseUserToAppUser(supabaseUser: SupabaseUser): AppUser {
  if (!supabaseUser.email) {
    throw new Error('User email is missing');
  }
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    // map other required properties explicitly
  };
}

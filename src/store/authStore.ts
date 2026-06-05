import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  isDemo: boolean;
  
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  fetchProfile: () => Promise<void>;
  setDemoMode: () => void;
}

const demoProfile: Profile = {
  id: 'demo-user-id',
  full_name: 'Alex Johnson',
  email: 'alex@interviewbuddy.ai',
  created_at: new Date().toISOString(),
};

const demoUser = {
  id: 'demo-user-id',
  email: 'alex@interviewbuddy.ai',
  app_metadata: {},
  user_metadata: { full_name: 'Alex Johnson' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as unknown as User;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  initialized: false,
  isDemo: false,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      set({ loading: false, initialized: true });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user, session, loading: false, initialized: true });
        get().fetchProfile();
      } else {
        set({ loading: false, initialized: true });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, session });
        if (session?.user) {
          get().fetchProfile();
        } else {
          set({ profile: null });
        }
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  signUp: async (email, password, fullName) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase not configured. Using demo mode.' };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    
    if (error) return { error: error.message };
    
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email,
        created_at: new Date().toISOString()
      });
    }
    
    return { error: null };
  },

  signIn: async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase not configured. Using demo mode.' };
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    if (get().isDemo) {
      set({ user: null, session: null, profile: null, isDemo: false });
      return;
    }
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  resetPassword: async (email) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Supabase not configured.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return { error: null };
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user || !isSupabaseConfigured()) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data) set({ profile: data });
  },

  setDemoMode: () => {
    set({
      user: demoUser,
      profile: demoProfile,
      isDemo: true,
      loading: false,
      initialized: true,
    });
  },
}));

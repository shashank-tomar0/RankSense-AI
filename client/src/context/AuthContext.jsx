/**
 * AuthContext — Clerk-backed wrapper
 *
 * Exposes the same {user, loading, logout, hydrated} interface
 * as before so existing components (Navbar, Upload, etc.) need
 * zero changes.
 *
 * "user" shape:
 *   { id, name, email, avatar, plan, imageUrl }
 *
 * "plan" comes from Clerk publicMetadata set by the backend
 * via the Clerk backend API after a billing event.
 */
import { createContext, useContext, useMemo } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { setClerkTokenGetter } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const { getToken } = useClerkAuth();

  // Register token getter so api.js can attach Bearer token to every request
  setClerkTokenGetter(getToken);

  // Map Clerk user → our app user shape
  const user = useMemo(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return null;
    const email = clerkUser.primaryEmailAddress?.emailAddress ?? '';
    const name  = clerkUser.fullName || clerkUser.firstName || email.split('@')[0];
    return {
      id:       clerkUser.id,
      name,
      email,
      avatar:   name[0]?.toUpperCase() ?? '?',
      imageUrl: clerkUser.imageUrl,
      // plan stored in Clerk publicMetadata by your backend (Clerk Admin API)
      plan:     (clerkUser.publicMetadata?.plan ?? 'Free'),
    };
  }, [clerkUser, isLoaded, isSignedIn]);

  const logout = async () => {
    sessionStorage.removeItem('rs_batch');
    await signOut();
  };

  // Convenience: open Clerk's hosted modals
  const login  = () => openSignIn();
  const signup = () => openSignUp();

  return (
    <AuthContext.Provider value={{
      user,
      loading:   !isLoaded,
      hydrated:  isLoaded,
      error:     '',
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

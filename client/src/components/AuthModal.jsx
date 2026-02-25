/**
 * AuthModal — now a thin wrapper around Clerk's hosted UI.
 *
 * Clerk renders its own Sign-In / Sign-Up modal (with Google,
 * GitHub, and email built-in). We just overlay a backdrop so
 * it blends with the cyberpunk theme.
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useClerk } from '@clerk/clerk-react';
import './AuthModal.css';

export default function AuthModal({ mode, onClose }) {
  const { openSignIn, openSignUp } = useClerk();

  useEffect(() => {
    if (mode === 'login') {
      openSignIn({ afterSignInUrl: window.location.pathname });
    } else {
      openSignUp({ afterSignUpUrl: window.location.pathname });
    }
    // Close our overlay after Clerk modal opens
    onClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Brief flash overlay while Clerk modal loads
  return (
    <motion.div
      className="auth-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
      onClick={onClose}
    />
  );
}

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithGoogle } from '../services/authService';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      console.time('[Auth Timing] Click to Popup open');
      console.time('[Auth Timing] Popup resolve to Redirect completion');
      
      await signInWithGoogle();
      
      console.timeEnd('[Auth Timing] Popup resolve to Redirect completion');
      const fromPath = location.state?.from?.pathname || '/';
      navigate(fromPath, { replace: true });
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-shell">
        <span className="lg-masthead">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M3 10l9-6 9 6v10H3z"/>
          </svg>
          Town Hall · Peelamedu · RS Puram
        </span>

        <h1 className="lg-title">Books pass from hand to hand on Coimbatore streets.</h1>
        <p className="lg-lede">
          Buy and sell used textbooks, novels, and rare finds directly with readers in Gandhipuram, RS Puram, Peelamedu, and across the city. No middleman.
        </p>

        <div className="lg-card">
          <div className="lg-eyebrow">Sign in to continue</div>
          <button 
            className="lg-google-btn" 
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            type="button"
          >
            {isSigningIn ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <svg width="19" height="19" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.6 0-14.1 4.3-17.4 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 34.9 27 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.8 39.6 16.4 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C40.9 36.6 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          <p className="lg-fine-print">
            By continuing, you agree to fair-trade terms on Covai book exchanges and our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
          </p>
        </div>

        <div className="lg-why-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 11v5M12 8h.01"/>
          </svg>
          <span>
            We use your Google account only to identify you to other readers — your email is never shown publicly. You'll add your name and pickup area after signing in.
          </span>
        </div>

        <p className="lg-pickup-note">Local pickups at bus stops, college gates, and tea stalls across Covai</p>
        <div className="lg-pickup-chips">
          <span className="lg-chip">Peelamedu</span>
          <span className="lg-chip">RS Puram</span>
          <span className="lg-chip">Gandhipuram</span>
          <span className="lg-chip">Ukkadam</span>
          <span className="lg-chip">Town Hall</span>
        </div>
      </div>
    </div>
  );
}

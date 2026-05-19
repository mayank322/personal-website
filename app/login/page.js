'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CORRECT_PASSWORD = 'Karuna@72';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem('auth', 'true');
        router.push('/dashboard');
      } else {
        setError(true);
        setLoading(false);
        setPassword('');
      }
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#1a1714', fontWeight: 400, marginBottom: '8px' }}>Private area</h1>
          <p style={{ fontSize: '14px', color: '#7a7670' }}>Enter your password to continue.</p>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '12px', padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#7a7670', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              autoFocus
              style={{ width: '100%', height: '40px', background: '#faf9f7', border: `0.5px solid ${error ? '#E24B4A' : '#e5e2d9'}`, borderRadius: '8px', padding: '0 14px', fontSize: '14px', color: '#1a1714', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
            />
            {error && (
              <p style={{ fontSize: '12px', color: '#E24B4A', marginTop: '6px' }}>Incorrect password. Try again.</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            style={{ width: '100%', height: '40px', background: password && !loading ? '#4338A0' : '#c8c4ba', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: password && !loading ? 'pointer' : 'not-allowed', transition: 'background 0.15s', fontFamily: 'inherit' }}>
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
          <a href="/" style={{ color: '#7a7670', textDecoration: 'none' }}>← Back to site</a>
        </p>
      </div>
    </div>
  );
}
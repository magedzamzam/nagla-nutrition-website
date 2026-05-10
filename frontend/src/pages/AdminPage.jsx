import { useEffect, useState } from 'react';
import { api, setToken } from '../lib/api.js';
import AdminLogin from '../components/admin/AdminLogin.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import '../styles/admin.css';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    document.title = 'Admin — Dr. Nagla ElSalawy';
    // Mark page noindex
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    // Check existing token
    api.me()
      .then(() => setLoggedIn(true))
      .catch(() => { setToken(null); setLoggedIn(false); })
      .finally(() => setChecking(false));

    return () => meta.remove();
  }, []);

  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => {
    setToken(null);
    setLoggedIn(false);
  };

  if (checking) {
    return (
      <div className="admin-shell">
        <div className="admin-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {loggedIn
        ? <AdminDashboard onLogout={handleLogout} />
        : <AdminLogin onLogin={handleLogin} />}
    </div>
  );
}

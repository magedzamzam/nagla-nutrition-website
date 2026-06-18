import { useState } from 'react';
import MediaManager from './MediaManager.jsx';
import SettingsPanel from './SettingsPanel.jsx';

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('media');

  return (
    <>
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-logo">N</div>
          <div className="admin-brand-text">Dr. Nagla<small>ADMIN PANEL</small></div>
        </div>
        <button className="admin-btn ghost" onClick={onLogout}>Sign Out</button>
      </header>

      <nav className="admin-tabs">
        <button className={`admin-tab ${tab === 'media' ? 'active' : ''}`} onClick={() => setTab('media')}>Media Gallery</button>
        <button className={`admin-tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>Settings</button>
      </nav>

      <main className="admin-main">
        {tab === 'media' && <MediaManager />}
        {tab === 'settings' && <SettingsPanel />}
      </main>
    </>
  );
}

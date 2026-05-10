import { useState } from 'react';
import { api } from '../../lib/api.js';

export default function SettingsPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ type: null, text: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: null, text: '' });
    if (next.length < 8) return setMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
    if (next !== confirm) return setMsg({ type: 'error', text: 'New passwords do not match.' });
    setSubmitting(true);
    try {
      await api.changePassword(current, next);
      setMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="admin-section-head">
        <div>
          <h2>Account <em>Settings</em></h2>
          <p>Change your admin password.</p>
        </div>
      </div>

      <div style={{maxWidth:'480px',background:'#161c18',padding:'32px',border:'1px solid #2a342d',borderRadius:'6px'}}>
        <form className="admin-form" onSubmit={submit}>
          <div>
            <label>Current Password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" />
          </div>
          <div>
            <label>New Password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} autoComplete="new-password" />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
          </div>
          {msg.type && <div className={msg.type === 'success' ? 'admin-success' : 'admin-error'}>{msg.text}</div>}
          <button className="admin-btn" type="submit" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      <div style={{marginTop:'48px',padding:'24px',background:'#161c18',border:'1px solid #2a342d',borderRadius:'6px',maxWidth:'720px'}}>
        <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:'22px',fontWeight:400,marginBottom:'12px'}}>Coming soon</h3>
        <p style={{color:'#7a8a82',fontSize:'13px',lineHeight:1.6,marginBottom:'12px'}}>
          The following features have backend hooks already wired and can be enabled in a future release:
        </p>
        <ul style={{color:'#c8ccc4',fontSize:'13px',lineHeight:1.8,paddingLeft:'20px'}}>
          <li><strong>Live appointment booking</strong> — calendar UI with real-time availability across clinics</li>
          <li><strong>Availability schedule editor</strong> — set Dr. Nagla's hours per location, per day</li>
          <li><strong>Patient meal plans</strong> — write, store, and share meal plans through the secure portal</li>
          <li><strong>Database migration</strong> — promote SQLite to Oracle Autonomous DB or PostgreSQL</li>
          <li><strong>OCI Object Storage</strong> — move uploaded media from local disk to OCI Object Storage</li>
        </ul>
      </div>
    </>
  );
}

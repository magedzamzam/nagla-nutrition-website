import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

const STATUSES = ['new', 'contacted', 'scheduled', 'closed'];

export default function InquiriesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await api.listInquiries();
      setItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.updateInquiry(id, { status });
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const formatDate = (ts) => new Date(ts).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const newCount = items.filter(i => i.status === 'new').length;

  return (
    <>
      <div className="admin-section-head">
        <div>
          <h2>Patient <em>Inquiries</em></h2>
          <p>{newCount > 0 ? `${newCount} new inquiry${newCount > 1 ? 'ies' : ''} awaiting response.` : 'All inquiries handled.'}</p>
        </div>
        <button className="admin-btn ghost" onClick={load}>Refresh</button>
      </div>

      {loading && <div className="media-empty">Loading…</div>}
      {!loading && items.length === 0 && (
        <div className="media-empty">No inquiries yet. New requests from the website will appear here.</div>
      )}
      {!loading && items.length > 0 && (
        <div style={{overflowX:'auto'}}>
          <table className="inquiries-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Patient</th>
                <th>Contact</th>
                <th>Reason / Location</th>
                <th>Message</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <select
                      className="inq-status-select"
                      value={i.status}
                      onChange={(e) => updateStatus(i.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div style={{marginTop:'4px'}}><span className={`inq-status ${i.status}`}>{i.status}</span></div>
                  </td>
                  <td><strong>{i.name}</strong></td>
                  <td>
                    <a href={`tel:${i.phone}`} style={{color:'#a88654',display:'block',fontSize:'12px'}}>{i.phone}</a>
                    {i.email && <a href={`mailto:${i.email}`} style={{color:'#7a8a82',display:'block',fontSize:'11px'}}>{i.email}</a>}
                    <a href={`https://wa.me/${i.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener" style={{color:'#0d9460',display:'block',fontSize:'11px',marginTop:'4px'}}>WhatsApp →</a>
                  </td>
                  <td>
                    {i.reason && <div className="inq-meta">{i.reason}</div>}
                    {i.preferred_location && <div className="inq-meta">@ {i.preferred_location}</div>}
                    {i.preferred_time && <div className="inq-meta">{i.preferred_time}</div>}
                  </td>
                  <td className="inq-msg">{i.message || <em style={{color:'#4a5a52'}}>—</em>}</td>
                  <td className="inq-meta">{formatDate(i.created_at)}</td>
                  <td>
                    <button className="admin-btn danger" style={{padding:'6px 10px',fontSize:'10px'}} onClick={() => remove(i.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

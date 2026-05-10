import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

const LOCATIONS = [
  { value: '', label: 'Preferred location (optional)' },
  { value: 'twin-towers', label: 'Twin Towers — Sheikh Zayed' },
  { value: 'kargo-mall', label: 'Kargo Mall — Sheikh Zayed' },
  { value: 'cleopatra-sky', label: 'Cleopatra Sky — New Cairo' },
  { value: 'telehealth', label: 'Telehealth (Online)' },
];

const REASONS = [
  { value: '', label: 'Reason for visit (optional)' },
  { value: 'diabetes', label: 'Diabetes / Blood Sugar' },
  { value: 'weight', label: 'Weight Management' },
  { value: 'gi', label: 'Gastrointestinal / Liver' },
  { value: 'renal', label: 'Renal / Endocrine' },
  { value: 'pregnancy', label: 'Pregnancy / Lactation' },
  { value: 'pediatric', label: 'Pediatric Nutrition' },
  { value: 'post-bariatric', label: 'Post-Bariatric' },
  { value: 'other', label: 'Other' },
];

export default function Booking() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    preferred_location: '', preferred_time: '', reason: '', message: '',
    hp: '', // honeypot
  });
  const [status, setStatus] = useState({ type: null, msg: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setStatus({ type: 'error', msg: 'Please provide your name and phone number.' });
      return;
    }
    setSubmitting(true);
    setStatus({ type: null, msg: '' });
    try {
      await api.submitInquiry(form);
      setStatus({
        type: 'success',
        msg: 'Thank you. The clinic secretary has received your request and will contact you within 24 hours.',
      });
      setForm({ name: '', phone: '', email: '', preferred_location: '', preferred_time: '', reason: '', message: '', hp: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Something went wrong. Please call us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container section" id="book" aria-label="Book a consultation">
      <div className="section-label"><span>05 — BOOK A CONSULTATION</span></div>
      <h2 className="section-title">Two <em>paths</em> to the same chair.</h2>
      <p className="section-intro">Whether you prefer a personal touch or instant scheduling, we've made it simple.</p>

      <div className="booking-magazine">
        <div className="book-option">
          <div className="book-tag">PATH ONE · BY REQUEST</div>
          <h3>Send an <em>inquiry</em></h3>
          <p>Fill out a brief form. The clinic secretary reviews your case and contacts you within 24 hours to find the right time and location.</p>

          <form className="inquiry-form" onSubmit={submit} noValidate>
            <input type="text" placeholder="Full name *" value={form.name} onChange={update('name')} required maxLength={100} aria-label="Full name" />
            <div className="form-row">
              <input type="tel" placeholder="Phone (e.g. 01018410465) *" value={form.phone} onChange={update('phone')} required maxLength={30} aria-label="Phone" />
              <input type="email" placeholder="Email (optional)" value={form.email} onChange={update('email')} maxLength={100} aria-label="Email" />
            </div>
            <div className="form-row">
              <select value={form.preferred_location} onChange={update('preferred_location')} aria-label="Preferred location">
                {LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <select value={form.reason} onChange={update('reason')} aria-label="Reason for visit">
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <input type="text" placeholder="Preferred day/time (optional)" value={form.preferred_time} onChange={update('preferred_time')} maxLength={50} aria-label="Preferred time" />
            <textarea placeholder="Anything else we should know?" value={form.message} onChange={update('message')} maxLength={1000} aria-label="Additional message" />
            {/* honeypot */}
            <input type="text" className="hp-field" tabIndex="-1" autoComplete="off" value={form.hp} onChange={update('hp')} aria-hidden="true" />
            <button type="submit" className="book-cta" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Inquiry →'}
            </button>
            {status.type && <div className={`form-message ${status.type}`}>{status.msg}</div>}
          </form>
        </div>

        <div className="book-option featured">
          <div className="book-tag">PATH TWO · INSTANT</div>
          <h3>Book a <em>slot</em> live</h3>
          <p>See real-time availability across all three clinic locations and telehealth. Pick your time, confirm, done. Reminders are automatic.</p>
          <ul>
            <li>Live calendar across 3 locations</li>
            <li>In-clinic or telehealth, your choice</li>
            <li>Automated SMS + email reminders</li>
            <li>Instant confirmation</li>
          </ul>
          <Link to="/booking" className="book-cta">Open Live Calendar →</Link>
        </div>
      </div>
    </section>
  );
}

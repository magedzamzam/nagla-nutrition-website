// Direct contact section — no forms, no inquiries.
// Two clear paths: WhatsApp (primary) and phone call.

const PHONE_DISPLAY = '+20 101 841 0465';
const PHONE_TEL = '+201018410465';
const WHATSAPP_URL = 'https://wa.me/201018410465';

export default function Contact() {
  return (
    <section className="container section" id="contact" aria-label="Contact the clinic">
      <div className="section-label"><span>05 — GET IN TOUCH</span></div>
      <h2 className="section-title">A <em>direct line</em> to the clinic.</h2>
      <p className="section-intro">No forms, no waiting. Reach Dr. Nagla's team on WhatsApp or by phone — they'll help you find the right time and location.</p>

      <div className="contact-grid">
        <a
          className="contact-card primary"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
        >
          <div className="contact-card-tag">PREFERRED</div>
          <div className="contact-card-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <h3>WhatsApp <em>the clinic</em></h3>
          <p>Quick replies during clinic hours. Share your situation, get a time. The team responds in Arabic or English.</p>
          <div className="contact-cta">Open WhatsApp →</div>
        </a>

        <a
          className="contact-card"
          href={`tel:${PHONE_TEL}`}
          aria-label="Call the clinic"
        >
          <div className="contact-card-tag">DIRECT CALL</div>
          <div className="contact-card-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <h3>Call the <em>clinic</em></h3>
          <p className="phone-number">{PHONE_DISPLAY}</p>
          <p className="contact-hours">Sunday – Thursday · 10:00 – 20:00 (Cairo time)</p>
          <div className="contact-cta">Tap to call →</div>
        </a>
      </div>
    </section>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Ribbon from '../components/Ribbon.jsx';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';

export default function BookingComingSoon() {
  useEffect(() => {
    document.title = 'Live Booking — Coming Soon | Dr. Nagla ElSalawy';
    // Tell crawlers this is a transient page
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, follow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <>
      <Ribbon />
      <Nav />
      <main className="container" style={{padding:'120px 48px',textAlign:'center',minHeight:'70vh',display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <div style={{fontSize:'11px',letterSpacing:'.35em',textTransform:'uppercase',color:'var(--gold)',fontWeight:600,marginBottom:'24px'}}>
            — Live Booking · Coming Soon
          </div>
          <h1 style={{
            fontFamily:'var(--serif-display)',
            fontSize:'clamp(48px,7vw,96px)',
            lineHeight:'.95',letterSpacing:'-.02em',fontWeight:400,marginBottom:'32px'
          }}>
            The live calendar is <em style={{color:'var(--emerald)'}}>almost ready</em>.
          </h1>
          <p style={{
            fontFamily:'var(--serif-body)',fontSize:'22px',lineHeight:'1.55',
            color:'var(--ink-soft)',marginBottom:'48px'
          }}>
            Real-time slot booking across all three clinic locations and telehealth is launching soon. In the meantime, please send your enquiry — Dr. Nagla's secretary will contact you within 24 hours to schedule your visit.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/#book" className="book-cta" style={{
              padding:'18px 32px',background:'var(--emerald)',color:'var(--cream)',
              fontSize:'12px',letterSpacing:'.25em',textTransform:'uppercase',fontWeight:600,
              textDecoration:'none',display:'inline-block'
            }}>
              Send an Enquiry →
            </Link>
            <a href="https://wa.me/+201018410465" target="_blank" rel="noopener noreferrer" style={{
              padding:'18px 32px',background:'transparent',border:'1px solid var(--ink)',color:'var(--ink)',
              fontSize:'12px',letterSpacing:'.25em',textTransform:'uppercase',fontWeight:600,
              textDecoration:'none',display:'inline-block'
            }}>
              WhatsApp the Clinic
            </a>
          </div>
          <div style={{marginTop:'80px',padding:'32px',background:'rgba(13,79,60,.04)',borderLeft:'3px solid var(--emerald)',textAlign:'left',fontFamily:'var(--serif-body)',fontStyle:'italic',fontSize:'18px',color:'var(--ink-soft)'}}>
            <strong style={{fontStyle:'normal',color:'var(--emerald)',fontWeight:600,letterSpacing:'.1em',fontSize:'11px',textTransform:'uppercase',display:'block',marginBottom:'12px'}}>
              Direct contact
            </strong>
            Phone: <a href="tel:+201018410465" style={{color:'var(--emerald)',fontStyle:'normal'}}>+20 101 841 0465</a> ·
            WhatsApp: <a href="https://wa.me/+201018410465" target="_blank" rel="noopener noreferrer" style={{color:'var(--emerald)',fontStyle:'normal'}}>wa.me/+201018410465</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

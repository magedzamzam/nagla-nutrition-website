export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <footer aria-label="Site footer">
      <div className="container">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="brand-name">Dr. Nagla <em>ElSalawy</em></div>
            <div className="brand-sub">Nutrition · Clinical Pathology</div>
            <p>Evidence-based, lab-informed nutrition care for adults and children. Cairo, Egypt — and across borders via telehealth.</p>
          </div>
          <div>
            <h5>Contact</h5>
            <a href="tel:+201018410465">+20 101 841 0465</a>
            <a href="https://wa.me/201018410465" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div>
            <h5>Clinics</h5>
            <a href="https://maps.app.goo.gl/rXpHtRPY4pw25eo2A" target="_blank" rel="noopener noreferrer">Twin Towers</a>
            <a href="https://maps.app.goo.gl/m8A2ziA196QY1ssN8" target="_blank" rel="noopener noreferrer">Kargo Mall</a>
            <a href="https://maps.google.com/?q=Cleopatra+Tagamoa+Hospital+New+Cairo" target="_blank" rel="noopener noreferrer">Cleopatra Sky</a>
          </div>
          <div>
            <h5>Explore</h5>
            <a href="#about" onClick={scrollTo('about')}>About</a>
            <a href="#practice" onClick={scrollTo('practice')}>Practice</a>
            <a href="#gallery" onClick={scrollTo('gallery')}>Gallery</a>
            <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} Dr. Nagla F. ElSalawy</span>
          <span>Editorial Wellness</span>
        </div>
      </div>
    </footer>
  );
}

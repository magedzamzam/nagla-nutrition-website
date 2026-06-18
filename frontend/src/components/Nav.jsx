export default function Nav() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <div className="nav-left">
        <a href="#about" onClick={scrollTo('about')}>About</a>
        <a href="#practice" onClick={scrollTo('practice')}>Practice</a>
        <a href="#stories" onClick={scrollTo('stories')}>Stories</a>
        <a href="#gallery" onClick={scrollTo('gallery')}>Gallery</a>
      </div>
      <div className="brand">
        <div className="brand-name">Dr. Nagla <em>ElSalawy</em></div>
        <div className="brand-sub">Nutrition · Clinical Pathology</div>
      </div>
      <div className="nav-right">
        <a href="tel:+201018410465" aria-label="Call clinic">+20 101 841 0465</a>
        <a
          className="book-btn"
          href="https://wa.me/201018410465"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
        >
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

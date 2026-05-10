const LOCATIONS = [
  {
    num: 'i.', name: 'Twin', em: 'Towers',
    addr: ['Twin Tower', 'Sheikh Zayed, Egypt'],
    map: 'https://maps.app.goo.gl/rXpHtRPY4pw25eo2A',
  },
  {
    num: 'ii.', name: 'Kargo', em: 'Mall',
    addr: ['Kargo Mall', 'Sheikh Zayed, Egypt'],
    map: 'https://maps.app.goo.gl/m8A2ziA196QY1ssN8',
  },
  {
    num: 'iii.', name: 'Cleopatra', em: 'Sky',
    addr: ['Cleopatra Tagamoa Hospital', 'New Cairo · 19668'],
    map: 'https://maps.google.com/?q=Cleopatra+Tagamoa+Hospital+New+Cairo',
  },
];

export default function Locations() {
  return (
    <section className="container" aria-label="Clinic locations" style={{paddingTop:'40px',paddingBottom:'120px'}}>
      <div className="loc-grid">
        {LOCATIONS.map((l) => (
          <article className="loc-card" key={l.num}>
            <div className="loc-num">{l.num}</div>
            <h4>{l.name} <em>{l.em}</em></h4>
            <address className="addr">{l.addr.map((line, i) => (<span key={i}>{line}<br/></span>))}</address>
            <a href={l.map} target="_blank" rel="noopener noreferrer">View on Map →</a>
          </article>
        ))}
      </div>
    </section>
  );
}

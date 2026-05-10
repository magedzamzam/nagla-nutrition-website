import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'conference', label: 'Conferences' },
  { id: 'clinic', label: 'Clinic' },
  { id: 'tv', label: 'Television' },
  { id: 'lecture', label: 'Lectures' },
  { id: 'research', label: 'Research' },
  { id: 'video', label: 'Videos' },
];

// Layout pattern for visual rhythm
const LAYOUT_PATTERN = ['tall', '', '', 'wide', '', ''];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    const cat = filter === 'video' ? 'all' : filter;
    api.listMedia(cat)
      .then(({ items }) => {
        const filtered = filter === 'video' ? items.filter(i => i.type === 'video') : items;
        setItems(filtered);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <section className="container section" id="gallery" aria-label="Media gallery">
      <div className="section-label"><span>04 — GALLERY & PRESS</span></div>
      <h2 className="section-title">A practice <em>in</em> public.</h2>
      <p className="section-intro">Lectures, clinic life, conferences, television features, educational videos — the visual archive of an active practice.</p>

      <div className="gallery-filters" role="tablist">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`gallery-filter ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
            role="tab"
            aria-selected={filter === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="gallery-mag">
        {loading && <div className="gallery-empty">Loading gallery…</div>}
        {!loading && items.length === 0 && (
          <div className="gallery-empty">
            No items yet — check back soon for clinic photos, conference talks, and educational videos.
          </div>
        )}
        {!loading && items.map((item, idx) => {
          const layout = LAYOUT_PATTERN[idx % LAYOUT_PATTERN.length];
          const src = `/uploads/${item.filename}`;
          const thumbSrc = item.thumbnail ? `/uploads/${item.thumbnail}` : src;
          return (
            <article
              key={item.id}
              className={`g-item ${layout}`}
              onClick={() => setLightboxItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setLightboxItem(item)}
              aria-label={item.title}
            >
              {item.type === 'video' ? (
                <>
                  <video src={src} muted preload="metadata" playsInline />
                  <div className="video-badge">▶ Video</div>
                </>
              ) : (
                <img src={thumbSrc} alt={item.title} loading="lazy" />
              )}
              <div className="g-info">
                <div className="g-info-meta">{item.category}</div>
                <div className="g-info-title">{item.title}</div>
              </div>
            </article>
          );
        })}
      </div>

      {lightboxItem && (
        <div className="lightbox" onClick={() => setLightboxItem(null)} role="dialog" aria-modal="true" aria-label={lightboxItem.title}>
          <button className="lightbox-close" onClick={() => setLightboxItem(null)} aria-label="Close">×</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.type === 'video' ? (
              <video src={`/uploads/${lightboxItem.filename}`} controls autoPlay playsInline />
            ) : (
              <img src={`/uploads/${lightboxItem.filename}`} alt={lightboxItem.title} />
            )}
            {lightboxItem.caption && <p className="lightbox-caption">{lightboxItem.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}

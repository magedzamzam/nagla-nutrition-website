export default function Masthead() {
  return (
    <section className="container masthead" aria-label="Introduction">
      <div className="issue-line">
        <span>The Health & Wellness Edition</span>
        <span>— A practice built on evidence —</span>
        <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
      </div>

      <h1 className="hero-title">
        The science <em>of feeling</em><br />
        <span className="swash">well</span> again.
      </h1>

      <div className="hero-grid">
        <aside className="hero-side">
          <div className="meta">— THE PHILOSOPHY</div>
          <h4>Nutrition, read from your blood.</h4>
          <p>Twenty years in clinical pathology means I don't guess at your body — I read it. Your labs, your history, your goals: that's where the plan starts.</p>
        </aside>
        <div>
          <div className="hero-image" role="img" aria-label="Dr. Nagla F. ElSalawy portrait" />
          <p className="image-caption"><strong>Dr. Nagla F. ElSalawy</strong> — photographed in Cairo, 2026</p>
        </div>
        <aside className="hero-side">
          <div className="meta">— THE PRACTICE</div>
          <h4>1,200+ patients, three clinics.</h4>
          <p>From Sheikh Zayed to New Cairo, in-person and via telehealth. Adults, children, complex metabolic cases, post-bariatric care — every plan is its own.</p>
        </aside>
      </div>
    </section>
  );
}

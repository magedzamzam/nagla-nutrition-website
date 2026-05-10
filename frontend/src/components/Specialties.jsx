const SPECIALTIES = [
  { num: 'i.', title: 'Therapeutic', em: 'nutrition', desc: 'Lab-guided protocols for diabetes, hypertension, dyslipidemia, and metabolic syndrome.', tag: 'EVIDENCE-BASED' },
  { num: 'ii.', title: 'Weight', em: 'management', desc: 'Sustainable individualized programs for obesity, with full post-bariatric support.', tag: 'LONG-TERM' },
  { num: 'iii.', title: 'GI &', em: 'hepatic care', desc: 'Nutrition strategies for IBS, IBD, fatty liver, and chronic gastrointestinal disorders.', tag: 'DIGESTIVE' },
  { num: 'iv.', title: 'Renal &', em: 'endocrine', desc: 'Stage-appropriate dietary care for kidney disease, thyroid, and hormonal disorders.', tag: 'SYSTEMIC' },
  { num: 'v.', title: 'Maternal &', em: 'pediatric', desc: 'Pregnancy, lactation, and pediatric nutrition — building healthy foundations early.', tag: 'FAMILY' },
  { num: 'vi.', title: 'Telehealth', em: 'programs', desc: 'Remote consultations with the same depth, structure, and follow-up as in-clinic care.', tag: 'REMOTE' },
];

export default function Specialties() {
  return (
    <section className="container section" id="practice" aria-label="Areas of practice">
      <div className="section-label"><span>02 — AREAS OF PRACTICE</span></div>
      <h2 className="section-title">Six <em>specializations</em>,<br />one careful method.</h2>
      <p className="section-intro">Each program is built from your laboratory profile, medical history, and lifestyle — not a template.</p>

      <div className="specialty-grid">
        {SPECIALTIES.map((s) => (
          <article className="spec-row" key={s.num}>
            <div className="spec-num">{s.num}</div>
            <div className="spec-content">
              <h4>{s.title} <em>{s.em}</em></h4>
              <p>{s.desc}</p>
            </div>
            <div className="spec-tag">{s.tag}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

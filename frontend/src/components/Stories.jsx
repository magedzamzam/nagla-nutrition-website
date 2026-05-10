const STORIES = [
  {
    num: '01', tag: 'DIABETES · 11 MONTHS',
    title: '"My A1c <em>fell</em> from 8.4 to 5.9."',
    text: 'After years of failed diets, Dr. Nagla looked at my actual blood work and built a plan around it. I lost 18kg and my numbers came down without crash dieting. She is the first doctor who treated me like a person, not a chart.',
    name: 'Mariam H.', role: 'Type 2 Diabetes', avatar: 'M',
  },
  {
    num: '02', tag: 'HEPATIC · 8 MONTHS',
    title: '"Fatty liver markers — <em>now normal</em>."',
    text: "She doesn't just hand you a meal plan. She explains the why behind every choice. My liver enzymes are within range for the first time in five years and my energy is back. I tell every friend in Cairo about her.",
    name: 'Ahmed K.', role: 'NAFLD', avatar: 'A',
  },
  {
    num: '03', tag: 'POST-BARIATRIC · 14 MONTHS',
    title: '"She protected my <em>muscle</em> through it all."',
    text: 'Post-bariatric I was lost — every meal felt like a math problem. Dr. Nagla rebuilt my relationship with food and made sure I lost fat, not muscle. The structure she gave me was honestly life-saving.',
    name: 'Sara M.', role: 'Post-Bariatric Care', avatar: 'S',
  },
  {
    num: '04', tag: 'PEDIATRIC · 6 MONTHS',
    title: '"Calm. <em>Scientific.</em> Kind."',
    text: "My daughter's pediatric nutrition was a complete unknown to me. Dr. Nagla turned it into a roadmap that the whole family could follow. She listens twice as much as she speaks — rare in a doctor.",
    name: 'Nour A.', role: 'Pediatric Nutrition', avatar: 'N',
  },
];

export default function Stories() {
  return (
    <section className="container section" id="stories" aria-label="Patient stories">
      <div className="section-label"><span>03 — PATIENT STORIES</span></div>
      <h2 className="section-title">In their <em>own</em> words.</h2>
      <p className="section-intro">Names changed; outcomes verified through clinic records.</p>

      <div className="feature-stories">
        {STORIES.map((s) => (
          <article className="story" key={s.num}>
            <div className="story-num">{s.num}</div>
            <div className="story-tag">{s.tag}</div>
            <h3 className="story-title" dangerouslySetInnerHTML={{ __html: s.title }} />
            <p className="story-text">{s.text}</p>
            <div className="story-byline">
              <div className="story-avatar" aria-hidden="true">{s.avatar}</div>
              <div className="story-byline-text">
                <strong>{s.name}</strong>
                <span>{s.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

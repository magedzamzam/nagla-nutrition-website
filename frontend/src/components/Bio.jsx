export default function Bio() {
  return (
    <section className="container section" id="about" aria-label="Biography">
      <div className="section-label"><span>01 — THE BIOGRAPHY</span></div>
      <h2 className="section-title">A doctor at the <em>intersection</em><br />of pathology & care.</h2>

      <article className="bio-article">
        <aside className="bio-aside" aria-label="Quick facts">
          <h5>FILE</h5>
          <div className="bio-fact"><div className="bio-fact-key">Title</div><div className="bio-fact-val">Asst. Professor<em> Cairo Univ.</em></div></div>
          <div className="bio-fact"><div className="bio-fact-key">Practice</div><div className="bio-fact-val">Optimum <em>Nutrition</em></div></div>
          <div className="bio-fact"><div className="bio-fact-key">Founded</div><div className="bio-fact-val">2020</div></div>
          <div className="bio-fact"><div className="bio-fact-key">Patients</div><div className="bio-fact-val">1,200+</div></div>
          <div className="bio-fact"><div className="bio-fact-key">Languages</div><div className="bio-fact-val"><em>Arabic</em>, English</div></div>
          <div className="bio-fact"><div className="bio-fact-key">Modalities</div><div className="bio-fact-val">In-clinic + <em>Telehealth</em></div></div>
        </aside>

        <div className="bio-prose">
          <p className="lead">Dr. Nagla F. ElSalawy is a certified <em>Nutrition Consultant</em> and Assistant Professor of Clinical Pathology — combining over twenty years of diagnostic medicine with evidence-based nutritional care.</p>
          <p>Her practice specializes in therapeutic nutrition, weight management, metabolic health, and personalized dietary planning for adults and children alike. As Founder and Manager of Optimum Nutrition Clinic in Egypt since 2020, she has guided more than 1,200 patients through programs tailored for diabetes, obesity, gastrointestinal disorders, renal and hepatic diseases, endocrine disorders, pregnancy and lactation, and post-bariatric care.</p>
          <p>She also offers telehealth nutrition consultations, helping patients across regions achieve measurable improvements in weight control, glycemic balance, and overall wellness — without ever stepping into a clinic.</p>
          <blockquote>"My laboratory training is what makes my plans different. I am not interpreting symptoms. I am reading the body."</blockquote>
          <p>In addition to her clinical practice, Dr. ElSalawy serves as an Assistant Professor at the Faculty of Medicine, Cairo University, where she contributes to medical education, research, and curriculum development. Her unique background in clinical pathology allows her to integrate laboratory data and medical diagnostics into comprehensive nutrition strategies that address the root causes of health conditions.</p>
          <p>Dr. ElSalawy earned her Diploma in Nutritional Medicine from the National Institute of Nutrition and regularly participates in national and international nutrition conferences. Her published research focuses on nutrition, metabolic disorders, liver disease, vitamin deficiencies, and chronic disease management.</p>
        </div>
      </article>
    </section>
  );
}

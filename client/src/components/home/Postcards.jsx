const CARDS = [
  {
    postmark: { city: 'Atlanta', date: 'Mar 12', year: 'Ga · 2025' },
    emoji: '🎓',
    text: "JT's catered my daughter's graduation and everyone couldn't stop raving about the mac and cheese. The setup was absolutely flawless — from the presentation to the service.",
    author: 'Monique T.', event: 'Graduation Party', city: 'Atlanta',
  },
  {
    postmark: { city: 'Decatur', date: 'Feb 04', year: 'Ga · 2025' },
    emoji: '💼',
    text: "Professional, punctual, and the food tasted like it came straight out of grandma's kitchen. Our whole office is still talking about those buffalo wontons.",
    author: 'Darius W.', event: 'Corporate Event', city: 'Decatur',
  },
  {
    postmark: { city: 'Stone Mtn', date: 'Jul 19', year: 'Ga · 2024' },
    emoji: '👨‍👩‍👧',
    text: "Three family reunions with JT's. The baked ziti and tilapia tacos are absolute must-haves — we genuinely wouldn't go anywhere else.",
    author: 'Sandra & Roy B.', event: 'Family Reunion', city: 'Stone Mtn',
  },
  {
    postmark: { city: 'Atlanta', date: 'Oct 28', year: 'Ga · 2024' },
    emoji: '💍',
    text: "Booked the Grand Feast for my wedding reception. Every single guest asked for the caterer's card. Worth every penny and so much more.",
    author: 'Aaliyah J.', event: 'Wedding Reception', city: 'Atlanta',
  },
  {
    postmark: { city: 'Marietta', date: 'Dec 14', year: 'Ga · 2024' },
    emoji: '🎄',
    text: "The fried mac balls disappeared in minutes flat. Our holiday party was a complete hit and JT's is exactly why. Already re-booked for next year.",
    author: 'Kevin M.', event: 'Holiday Party', city: 'Marietta',
  },
  {
    postmark: { city: 'Atlanta', date: 'Aug 07', year: 'Ga · 2024' },
    emoji: '🎂',
    text: 'Every single dish felt like it had been prepared with real care. Our guests are still talking about the shrimp skewers three whole months later.',
    author: 'Tasha R.', event: 'Birthday Party', city: 'Atlanta',
  },
];

export default function Postcards() {
  return (
    <section className="postcards">
      <div className="postcards__header">
        <div className="postcards__folio">
          <strong>Ch. 06</strong>
          <span>Postcards from Guests</span>
        </div>
        <h2 className="postcards__heading">
          Kind words,<br />
          from <em>our</em> <span className="postcards__script">guests</span>
        </h2>
      </div>

      <div className="postcards__grid">
        {CARDS.map((c, i) => {
          const rotMod = `postcard--rot-${(i % 6) + 1}`;
          const bgMod = `postcard__head--${(i % 6) + 1}`;
          return (
            <article key={i} className={`postcard ${rotMod}`}>
              <div className={`postcard__head ${bgMod}`}>
                <div className="postcard__postmark">
                  <div className="postcard__postmark-circle">
                    <span>{c.postmark.city}</span>
                    <span className="postcard__postmark-center">
                      {c.postmark.date}
                    </span>
                    <span>{c.postmark.year}</span>
                  </div>
                </div>

                <div className="postcard__stamp">
                  <div className="postcard__stamp-inner">
                    <div className="postcard__stamp-value">★★★★★</div>
                    <div className="postcard__stamp-sub">5/5</div>
                  </div>
                </div>

                <div className="postcard__head-emoji">{c.emoji}</div>
              </div>

              <div className="postcard__body">
                <div className="postcard__quote-mark">"</div>
                <div className="postcard__stars">★★★★★</div>
                <p className="postcard__text">{c.text}</p>
                <div className="postcard__rule" />
                <div className="postcard__footer">
                  <div>
                    <div className="postcard__author">— {c.author}</div>
                    <div className="postcard__event">{c.event}</div>
                  </div>
                  <div className="postcard__date">
                    <strong>{c.city}</strong>
                    Georgia, USA
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

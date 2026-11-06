/* BookWithConfidence.jsx — the answers a foreign buyer wants before booking,
   next to the departure dates: cancellation, deposit credit, group size,
   safety and (where we know them) the costs on the ground. Foreign sites only
   (owner, 6 Nov 2026: "do everything to build trust and raise conversion").

   Every line comes from something already published: the cancellation lines
   from the Terms (section 8), the oxygen line only where the trip's own
   inclusions list emergency oxygen, the on-the-ground costs from the trip's
   own not-included list. Nothing here promises what the trip page doesn't. */
import { tx } from '../../website/lang.js';

/* Costs paid on the ground, per trip, in USD — from each trip's not-included list. */
const ON_THE_GROUND = {
  kilimanjaro:        { tips: 350, visa: 50, visaUs: 100, govIns: 44 },
  'kilimanjaro-kosher': { tips: 300, visa: 50, visaUs: 100, govIns: 44 },
};

const Icon = ({ d }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d={d} />
  </svg>
);

export default function BookWithConfidence({ exp, isMobile }) {
  const inc = (exp.includedEn || []).join(' ');
  const hasOxygen = /oxygen/i.test(inc);
  const g = ON_THE_GROUND[exp.slug];
  const items = [
    { d: 'M20 6 9 17l-5-5', title: tx('Free cancellation for 14 days'), text: tx('Cancel within 14 days of booking at no cost, as long as departure is more than 7 business days away.') },
    { d: 'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5', title: tx('Plans changed? Keep your deposit'), text: tx('You can keep your deposit as credit for a future trip, with no cancellation fee.') },
    exp.groupCapacity ? { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', title: tx('Small groups'), text: tx('At most {0} climbers per group, guided in English, with travelers from around the world.', [exp.groupCapacity]) } : null,
    hasOxygen ? { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10', title: tx('Safety first'), text: tx('A first-aid kit with emergency oxygen goes up with every group, and the guide decides on the day whether it is safe to go on.') } : null,
    g ? { d: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6', title: tx('No surprises on the ground'), text: tx('On top of the trip price, plan for about ${0} in cash: crew tips ${1}, Tanzania visa ${2} (${3} for US citizens) and the local government insurance ${4}. Flights and travel insurance are separate.', [g.tips + g.visa + g.govIns, g.tips, g.visa, g.visaUs, g.govIns]) } : null,
  ].filter(Boolean);

  return (
    <section aria-label={tx('Book with confidence')} style={{ padding: isMobile ? '8px 0 40px' : '8px 0 56px' }}>
      <div style={{ background: '#F7F5FF', border: '1px solid #E4DEFA', borderRadius: '24px', padding: isMobile ? '24px 20px' : '32px 36px' }}>
        <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: '#0A0818', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
          {tx('Book with confidence')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '18px' : '22px 36px' }}>
          {items.map(it => (
            <div key={it.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Icon d={it.d} />
              <div>
                <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '16px', fontWeight: 700, color: '#1E1B4B', marginBottom: '4px' }}>{it.title}</div>
                <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14.5px', color: '#4B4868', lineHeight: 1.55 }}>{it.text}</div>
              </div>
            </div>
          ))}
        </div>
        <a href="/terms" style={{ display: 'inline-block', marginTop: '20px', fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 600, color: '#6D28D9' }}>
          {tx('Full cancellation terms')} →
        </a>
      </div>
    </section>
  );
}

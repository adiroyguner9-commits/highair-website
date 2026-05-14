import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../../website/usePageMeta.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { COLOR, RADIUS, FS, EASING } from '../../website/theme.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import PhoneField, { formatFullPhone, validatePhone as checkPhone } from './PhoneField.jsx';

const COMPANY = {
 phone: '+972 55-563-6975',
 phoneLink: '+972555636975',
 email: 'info@highair-expeditions.com',
 whatsapp: '972555636975',
};

function IconWA() {
 return (
 <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
 </svg>
 );
}
function IconMail() {
 return (
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
 <polyline points="22,6 12,13 2,6"/>
 </svg>
 );
}
function IconPhone() {
 return (
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 13a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 2.22h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 9.91a16 16 0 006.06 6.06l.95-.95a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
 </svg>
 );
}

function Field({ label, id, type = 'text', value, onChange, placeholder, multiline, required, error, errorMsg }) {
 const [focused, setFocused] = useState(false);
 const borderColor = error ? '#DC2626' : focused ? COLOR.primary : '#DDD9F3';
 const base = {
 width: '100%',
 fontFamily: "'Ploni', sans-serif",
 fontSize: '15px',
 fontWeight: 400,
 color: '#0A0818',
 background: '#FFFFFF',
 border: `1.5px solid ${borderColor}`,
 borderRadius: '12px',
 padding: '13px 16px',
 outline: 'none',
 boxSizing: 'border-box',
 transition: `border-color 0.18s ${EASING.out}`,
 resize: multiline ? 'vertical' : undefined,
 minHeight: multiline ? '120px' : undefined,
 };
 return (
 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
 <label htmlFor={id} style={{
 fontFamily: "'Ploni', sans-serif",
 fontSize: '13px',
 fontWeight: 600,
 color: '#4B4869',
 letterSpacing:'0.02em',
 }}>
 {label}{required && <span style={{ color: COLOR.primary }}> *</span>}
 </label>
 {multiline
 ? <textarea id={id} value={value} onChange={onChange} placeholder={placeholder}
 onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
 style={base} />
 : <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
 onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
 style={base} />
 }
 {error && errorMsg && (
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '12px', color: '#DC2626', margin: 0 }}>
 {errorMsg}
 </p>
 )}
 </div>
 );
}

export default function ContactPage() {
 const { i18n } = useTranslation();
 const isEn = i18n.language === 'en';
 const dir = isEn ? 'ltr' : 'rtl';
 const { isMobile } = useBreakpoint();

 const [form, setForm] = useState({ name: '', dial: '+972', phone: '', email: '', message: '' });
 const [phoneError, setPhoneError] = useState('');
 const [nameError, setNameError] = useState('');
 const [sent, setSent] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const [serverError, setServerError] = useState('');
 const [btnHov, setBtnHov] = useState(false);

 usePageMeta({
 title: isEn ? 'Contact Us | HighAir Expeditions' : 'יצירת קשר | HighAir Expeditions',
 description: isEn
 ? 'Reach the HighAir Expeditions team by WhatsApp, email or phone. We respond within 24 hours.'
 : 'צרו קשר עם צוות HighAir Expeditions — וואטסאפ, מייל או טלפון. מענה תוך 24 שעות.',
 canonicalPath: '/contact',
 });

 const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

 function validatePhoneField(val) {
 const ok = checkPhone(form.dial, val);
 setPhoneError(ok ? '' : (isEn ? 'Please enter a valid phone number' : 'מספר הטלפון אינו תקין'));
 return ok;
 }

 async function handleSubmit(e) {
 e.preventDefault();
 setServerError('');

 const nameOk = form.name.trim().length >= 2;
 const phoneOk = checkPhone(form.dial, form.phone);

 if (!nameOk) setNameError(isEn ? 'Please enter your name' : 'נא להזין שם');
 if (!phoneOk) setPhoneError(isEn ? 'Please enter a valid phone number' : 'מספר הטלפון אינו תקין');
 if (!nameOk || !phoneOk) return;

 setSubmitting(true);
 try {
 const res = await fetch('/api/submit-lead', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 fields: {
 Name: form.name.trim(),
 Phone: formatFullPhone(form.dial, form.phone),
 Email: form.email.trim(),
 Message: form.message.trim(),
 Source: 'Contact Form',
 Submitted: new Date().toISOString(),
 },
 }),
 });
 if (!res.ok) throw new Error(await res.text());
 setSent(true);
 } catch (err) {
 console.error('[contact] submit error:', err);
 setServerError(isEn ? 'Something went wrong. Please try again.' : 'שגיאה בשליחה — נסו שוב.');
 } finally {
 setSubmitting(false);
 }
 }

 const T = {
 heroTitle: isEn ? "Let's Talk" : 'דברו איתנו',
 heroSub: isEn
 ? 'Whether you\'re planning your first summit or your tenth — we\'re here for every question, big or small.'
 : 'בין אם אתם מתכננים את הפסגה הראשונה שלכם ובין אם העשירית, אנחנו כאן לכל שאלה, גדולה כקטנה.',
 infoTitle: isEn ? 'Reach us directly' : 'דרכים ליצור קשר',
 infoBody: isEn
 ? 'The fastest way to reach us is WhatsApp — we usually respond within minutes during business hours. You can also email us and we\'ll get back to you within 24 hours.'
 : 'הדרך המהירה ביותר להגיע אלינו היא וואטסאפ. בדרך כלל אנחנו עונים תוך דקות בשעות העסקים. אפשר גם לשלוח מייל ואנחנו נחזור אליכם תוך 24 שעות.',
 formTitle: isEn ? 'Send us a message' : 'שלחו לנו הודעה',
 formSub: isEn ? 'Fill in your details and we\'ll respond within 24 hours.' : 'מלאו פרטים ונחזור אליכם תוך 24 שעות.',
 name: isEn ? 'Full name' : 'שם מלא',
 phone: isEn ? 'Phone number' : 'מספר טלפון',
 email: isEn ? 'Email address' : 'כתובת מייל',
 message: isEn ? 'Your message' : 'ספרו לנו על החלום שלכם',
 namePH: isEn ? 'Your name' : 'השם שלכם',
 phonePH: isEn ? '+972...' : '05x-xxxxxxx',
 emailPH: isEn ? 'you@example.com' : 'כתובת המייל שלכם',
 messagePH: isEn ? 'Which expedition are you interested in? Any dates in mind?' : 'איזו משלחת מעניינת אתכם? יש לכם תאריכים? כל פרט שתוסיפו יעזור לנו לתת לכם מענה טוב יותר.',
 submit: isEn ? 'Send Message' : 'שלח הודעה',
 sentTitle: isEn ? 'Message sent!' : 'ההודעה נשלחה!',
 sentBody: isEn ? 'We got your message and will get back to you within 24 hours.' : 'קיבלנו את הפנייה שלכם ונחזור אליכם תוך 24 שעות.',
 another: isEn ? 'Send another message' : 'שלח הודעה נוספת',
 };

 /* contact method row */
 const Method = ({ icon, label, value, href, external }) => {
 const [hov, setHov] = useState(false);
 const inner = (
 <div
 onMouseEnter={() => href && setHov(true)}
 onMouseLeave={() => setHov(false)}
 style={{
 display: 'flex',
 alignItems: 'center',
 gap: '14px',
 padding: '18px 20px',
 background: hov ? '#F3F0FF' : '#FAFAF8',
 border: `1px solid ${hov ? '#C4B5FD' : '#ECEAF8'}`,
 borderRadius: '14px',
 transition: `all 0.18s ${EASING.out}`,
 cursor: href ? 'pointer' : 'default',
 }}
 >
 <div style={{
 width: '44px', height: '44px', borderRadius: '12px',
 background: hov ? COLOR.primary : '#EDE9FF',
 color: hov ? '#fff' : COLOR.primary,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 flexShrink: 0, transition: `all 0.18s ${EASING.out}`,
 }}>
 {icon}
 </div>
 <div>
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '12px', fontWeight: 700,
 color: '#9591B0', margin: '0 0 3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
 {label}
 </p>
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600,
 color: href ? COLOR.primary : '#0A0818', margin: 0, direction: 'ltr', textAlign: 'start' }}>
 {value}
 </p>
 </div>
 </div>
 );
 if (!href) return inner;
 return (
 <a href={href} target={external ? '_blank' : undefined}
 rel={external ? 'noopener noreferrer' : undefined}
 style={{ textDecoration: 'none', display: 'block' }}>
 {inner}
 </a>
 );
 };

 return (
 <>
 <Header />
 <main id="main-content" style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: '80px', direction: dir }}>

 <div style={{
 background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #2d1b69 100%)',
 padding: isMobile ? '52px 6% 48px' : '72px 8% 64px',
 textAlign: 'center',
 position: 'relative',
 overflow: 'hidden',
 }}>
 {/* decorative blobs */}
 <div style={{ position:'absolute', top:'-60px', left:'-60px', width:'280px', height:'280px',
 borderRadius:'50%', background:'rgba(109,40,217,0.18)', filter:'blur(60px)', pointerEvents:'none' }} />
 <div style={{ position:'absolute', bottom:'-40px', right:'-40px', width:'220px', height:'220px',
 borderRadius:'50%', background:'rgba(139,92,246,0.14)', filter:'blur(50px)', pointerEvents:'none' }} />

 <h1 style={{
 fontFamily: "'Ploni', sans-serif",
 fontSize: isMobile ? '36px' : '56px',
 fontWeight: 700,
 color: '#FFFFFF',
 margin: '0 0 16px',
 letterSpacing: '-0.03em',
 lineHeight: 1.1,
 position: 'relative',
 }}>
 {T.heroTitle}
 </h1>
 <p style={{
 fontFamily: "'Ploni', sans-serif",
 fontSize: isMobile ? '16px' : '18px',
 fontWeight: 300,
 color: 'rgba(255,255,255,0.72)',
 margin: '0 auto',
 lineHeight: 1.75,
 maxWidth: '580px',
 position: 'relative',
 }}>
 {T.heroSub}
 </p>
 </div>

 <div style={{ maxWidth: '1160px', margin: '0 auto', padding: isMobile ? '36px 5% 64px' : '60px 5% 80px' }}>
 <div style={{
 display: 'grid',
 gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr',
 gap: isMobile ? '28px' : '40px',
 alignItems: 'start',
 }}>

 <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
 <div>
 <h2 style={{
 fontFamily: "'Ploni', sans-serif",
 fontSize: isMobile ? '22px' : '26px',
 fontWeight: 700,
 color: '#0A0818',
 margin: '0 0 12px',
 letterSpacing: '-0.02em',
 }}>
 {T.infoTitle}
 </h2>
 <p style={{
 fontFamily: "'Ploni', sans-serif",
 fontSize: '15px',
 fontWeight: 300,
 color: '#6B6B8A',
 lineHeight: 1.8,
 margin: 0,
 }}>
 {T.infoBody}
 </p>
 </div>

 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
 <Method
 icon={<IconWA />}
 label="WhatsApp"
 value={COMPANY.phone}
 href={`https://wa.me/${COMPANY.whatsapp}`}
 external
 />
 <Method
 icon={<IconMail />}
 label={isEn ? 'Email' : 'מייל'}
 value={COMPANY.email}
 href={`mailto:${COMPANY.email}`}
 />
 <Method
 icon={<IconPhone />}
 label={isEn ? 'Phone' : 'טלפון'}
 value={COMPANY.phone}
 href={`tel:${COMPANY.phoneLink}`}
 />
 </div>
 </div>

 <div style={{
 background: '#FFFFFF',
 border: '1px solid #ECEAF8',
 borderRadius: RADIUS.xl,
 padding: isMobile ? '28px 22px' : '40px 36px',
 boxShadow: '0 4px 24px rgba(15,15,40,0.06)',
 }}>
 {sent ? (
 <div style={{ textAlign: 'center', padding: '24px 0' }}>
 <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
 <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '22px', fontWeight: 700,
 color: '#0A0818', margin: '0 0 10px' }}>
 {T.sentTitle}
 </h3>
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 300,
 color: '#6B6B8A', lineHeight: 1.7, margin: '0 0 24px' }}>
 {T.sentBody}
 </p>
 <button onClick={() => { setSent(false); setForm({ name:'', dial:'+972', phone:'', email:'', message:'' }); setServerError(''); setNameError(''); setPhoneError(''); }}
 style={{
 fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 600,
 color: COLOR.primary, background: 'none', border: `1.5px solid ${COLOR.primary}`,
 borderRadius: '999px', padding: '10px 24px', cursor: 'pointer',
 }}>
 {T.another}
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
 <div>
 <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '22px', fontWeight: 700,
 color: '#0A0818', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
 {T.formTitle}
 </h2>
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 300,
 color: '#9591B0', margin: 0 }}>
 {T.formSub}
 </p>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
 <Field id="name" label={T.name} value={form.name}
 onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (nameError) setNameError(''); }}
 placeholder={T.namePH} required error={!!nameError} errorMsg={nameError} />

 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
 <PhoneField
 label={<>{T.phone}<span style={{ color: COLOR.primary }}> *</span></>}
 dial={form.dial}
 onDialChange={v => setForm(f => ({ ...f, dial: v }))}
 local={form.phone}
 onLocalChange={v => { setForm(f => ({ ...f, phone: v })); if (phoneError) validatePhoneField(v); }}
 error={!!phoneError}
 errorMsg={phoneError}
 />
 </div>
 </div>

 <Field id="email" label={T.email} type="email" value={form.email} onChange={set('email')}
 placeholder={T.emailPH} />

 <Field id="message" label={T.message} value={form.message} onChange={set('message')}
 placeholder={T.messagePH} multiline />

 {serverError && (
 <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626',
 margin: 0, textAlign: 'center' }}>
 {serverError}
 </p>
 )}

 <button
 type="submit"
 disabled={submitting}
 onMouseEnter={() => setBtnHov(true)}
 onMouseLeave={() => setBtnHov(false)}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '10px',
 padding: '15px 28px',
 borderRadius: '999px',
 background: submitting ? '#9B8EC4' : btnHov ? '#5B21B6' : COLOR.primary,
 color: '#FFFFFF',
 fontFamily: "'Ploni', sans-serif",
 fontSize: '16px',
 fontWeight: 700,
 border: 'none',
 cursor: submitting ? 'not-allowed' : 'pointer',
 boxShadow: btnHov && !submitting ? '0 8px 28px rgba(109,40,217,0.45)' : '0 4px 16px rgba(109,40,217,0.3)',
 transform: btnHov && !submitting ? 'translateY(-1px)' : 'none',
 transition: `all 0.18s ${EASING.out}`,
 letterSpacing: '0.01em',
 }}
 >
 <IconMail />
 {submitting ? (isEn ? 'Sending…' : 'שולח…') : T.submit}
 </button>
 </form>
 )}
 </div>

 </div>
 </div>

 </main>
 <SiteFooter />
 </>
 );
}

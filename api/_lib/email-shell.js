/* The one customer email. It stays a letter: one white sheet on the lilac page,
 * a header, plain paragraphs, one button, a signature. What makes it ours is the
 * contour header, the logo disc, the fonts and the colours, not portal screens.
 *
 * Email clients are not browsers: everything is inline, layout is tables, and the
 * header sits on a plain colour because Outlook drops background images.
 *
 * Fonts: only Apple Mail, Samsung Email and Thunderbird load @font-face. Gmail,
 * Yahoo and Outlook.com skip to the next name in FONT, so that list is the design
 * for most readers. Classic Outlook on Windows falls to Times New Roman when it
 * meets a web font, so it never sees one: the rule is hidden from it and the mso
 * block sets its font outright. It also ignores max-width, hence the fixed table.
 *
 * Gmail drops the html and body tags, so direction and font live on the tables too.
 *
 * Dark mode: Apple Mail, Samsung Email and the Outlook apps take the designed dark
 * version, the DARK block below, on the ha- classes. Gmail reads no media query and
 * recolours the letter itself in its apps. That darkens the sheet well, but it would
 * also flip the white title and button text, so a gradient keeps their colour (Gmail
 * leaves background images alone) and keepWhite holds the text. Do not declare
 * "light only": Gmail would then show a bright letter to everyone in dark mode.
 *
 * The two repos share no code: this file exists in both, keep them identical.
 */
export const APP_URL = 'https://app.highair-expeditions.com';
export const WA_URL  = 'https://wa.me/972555636975';
const ASSETS = `${APP_URL}/email`;

const FONT = "'PloniHe','Mazzard','Segoe UI',Arial,sans-serif";
const INK = '#1E1B4B', TEXT = '#3F3B5C', MUTED = '#6B7280', LINE = '#EDE9FE', PAGE = '#F8F7FF';
/* One step deeper than the buttons' purple: flipped by Gmail, #6D28D9 lands mid-grey on the dark sheet. */
const ACCENT = '#5B21B6';
const gradient = 'background-color:#4C1D95;background-image:linear-gradient(135deg,#6D28D9,#4C1D95);';
const TABLE = 'cellpadding="0" cellspacing="0" role="presentation" dir="rtl"';

const fontFace = (family, file, weight, range = '') => `@font-face{font-family:'${family}';src:url('${APP_URL}/${file}') format('truetype');font-weight:${weight};${range}}`;
const HEBREW = 'unicode-range:U+0590-05FF,U+FB1D-FB4F,U+200F-200F,U+20AA-20AA;';
/* The portal's dark tokens (src/styles/global.css). */
const DARK_RULES = `
.ha-page{background-color:#0C0B16 !important;}
.ha-card{background-color:#17152A !important;border-color:#2A2643 !important;}
.ha-block{background-color:#24213A !important;border-color:#2A2643 !important;}
.ha-warn{background-color:#2A1F0E !important;border-color:#5C4516 !important;}
.ha-tile{background-color:#2E2654 !important;}`;
const DARK_TEXT = `
.ha-t{color:#D6D3EA !important;}
.ha-i{color:#EEEBFF !important;}
.ha-m{color:#A3A3B8 !important;}
.ha-a{color:#A78BFA !important;}
.ha-w{color:#FBD38D !important;}
.ha-l{border-color:#2A2643 !important;}
.ha-lw{border-color:#5C4516 !important;}`;
const scoped = (rules, prefix) => rules.replace(/^\./gm, `${prefix} .`);
const DARK = `:root{color-scheme:light dark;supported-color-schemes:light dark;}
@media (prefers-color-scheme:dark){${DARK_RULES}${DARK_TEXT}}
${scoped(DARK_RULES, '[data-ogsb]')}
${scoped(DARK_TEXT, '[data-ogsc]')}`;

/* Gmail only, it writes <u> in place of the doctype. Each block has its own tag:
   Gmail drops a whole tag over a rule it dislikes. */
const GMAIL = `u + .body .ha-gs{background:#000;mix-blend-mode:screen;}
u + .body .ha-gd{background:#000;mix-blend-mode:difference;}`;
const keepWhite = t => `<span class="ha-gs" style="display:block;"><span class="ha-gd" style="display:block;">${t}</span></span>`;

const FONTS = [
  fontFace('PloniHe', 'Ploni-Regular-AAA.ttf', 400, HEBREW),
  fontFace('PloniHe', 'Ploni-Medium-AAA.ttf', 500, HEBREW),
  fontFace('PloniHe', 'Ploni-Bold-AAA.ttf', '700 900', HEBREW),
  fontFace('Mazzard', 'MazzardH-Regular.ttf', 400),
  fontFace('Mazzard', 'MazzardH-Bold.ttf', '700 900'),
].join('');

export const p = (html, gap = 18) =>
  `<p class="ha-t" style="margin:0 0 ${gap}px;font-size:15px;color:${TEXT};line-height:1.7;">${html}</p>`;

export const strong = t => `<strong class="ha-i" style="color:${INK};">${t}</strong>`;

/* A quiet centred line under a button. */
export const small = t =>
  `<p class="ha-m" style="margin:-10px 0 0;font-size:13px;color:${MUTED};line-height:1.6;text-align:center;">${t}</p>`;

export const heading = t =>
  `<p class="ha-i" style="margin:26px 0 8px;font-size:15px;font-weight:800;color:${INK};">${t}</p>`;

export const link = (href, t) =>
  `<a class="ha-a" href="${href}" target="_blank" style="color:${ACCENT};font-weight:700;text-decoration:underline;">${t}</a>`;

const block = (bg, border, inner, cls = 'ha-block') =>
  `<table class="${cls}" width="100%" ${TABLE} bgcolor="${bg}" style="background-color:${bg};border:1px solid ${border};border-radius:14px;border-collapse:separate;margin-bottom:18px;"><tr><td style="padding:6px 18px;">${inner}</td></tr></table>`;

/* Label and value rows: the booking details. */
export const details = rows => block(PAGE, LINE, `
  <table width="100%" ${TABLE}>
    ${rows.map(([l, v], i) => { const line = i < rows.length - 1 ? `border-bottom:1px solid ${LINE};` : ''; return `
    <tr>
      <td class="ha-m ha-l" width="112" style="padding:10px 0;font-size:14px;color:${MUTED};width:112px;${line}">${l}</td>
      <td class="ha-i ha-l" style="padding:10px 0;font-size:14px;font-weight:700;color:${INK};word-break:break-word;${line}">${v}</td>
    </tr>`; }).join('')}
  </table>`);

/* The trip documents, one link to a row. */
export const files = items => block(PAGE, LINE, `
  <table width="100%" ${TABLE}>
    ${items.map(([t, href], i) => `<tr><td class="ha-l" style="padding:10px 0;font-size:14px;line-height:1.5;${i < items.length - 1 ? `border-bottom:1px solid ${LINE};` : ''}">${link(href, t)}</td></tr>`).join('')}
  </table>`);

/* What the customer still has to do. */
export const todo = items => block('#FFF8EE', '#F6E3C5', `
  <table width="100%" ${TABLE}>
    ${items.map((t, i) => `<tr><td class="ha-w ha-lw" style="padding:10px 0;font-size:14px;color:#7C4A0E;line-height:1.6;${i < items.length - 1 ? 'border-bottom:1px solid #F6E3C5;' : ''}">${t}</td></tr>`).join('')}
  </table>`, 'ha-warn');

export const numbered = items => `
  <table width="100%" ${TABLE} style="margin-bottom:6px;">
    ${items.map((t, i) => `<tr>
      <td class="ha-a" width="24" valign="top" style="width:24px;padding:3px 0 9px;font-size:15px;font-weight:800;color:${ACCENT};line-height:1.6;">${i + 1}.</td>
      <td class="ha-t" style="padding:3px 0 9px;font-size:15px;color:${TEXT};line-height:1.6;">${t}</td>
    </tr>`).join('')}
  </table>`;

/* The app's date tile beside the date and the hour. */
export const when = ({ day, month, date, time, note }) => block(PAGE, LINE, `
  <table width="100%" ${TABLE} style="margin:10px 0;"><tr>
    <td width="46" valign="middle" style="width:46px;">
      <table ${TABLE}><tr><td class="ha-tile" width="46" height="46" align="center" valign="middle" bgcolor="${LINE}" style="width:46px;height:46px;background-color:${LINE};border-radius:14px;">
        <div class="ha-a" style="font-size:17px;font-weight:800;color:${ACCENT};line-height:18px;">${day}</div>
        <div class="ha-a" style="font-size:10px;font-weight:700;color:${ACCENT};line-height:12px;margin-top:1px;">${month}</div>
      </td></tr></table>
    </td>
    <td width="14" style="width:14px;font-size:0;line-height:0;">&nbsp;</td>
    <td valign="middle">
      <div class="ha-i" style="font-size:15px;font-weight:800;color:${INK};line-height:1.4;">${date}</div>
      <div class="ha-a" style="font-size:15px;font-weight:800;color:${ACCENT};line-height:1.4;">${time}</div>
      ${note ? `<div class="ha-m" style="font-size:13px;color:${MUTED};line-height:1.5;margin-top:2px;">${note}</div>` : ''}
    </td>
  </tr></table>`);

export const button = (href, label) => `
  <table ${TABLE} align="center" style="margin:24px auto 24px;"><tr><td align="center" bgcolor="#4C1D95" style="${gradient}border-radius:14px;mso-padding-alt:14px 36px;">
    <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:800;color:#FFFFFF;text-decoration:none;border-radius:14px;">${keepWhite(label)}</a>
  </td></tr></table>`;

/* The same button on a web page that posts a form. */
export const formButton = label =>
  `<form method="POST" style="margin:22px 0 0;"><button type="submit" style="width:100%;padding:14px;border:0;border-radius:14px;${gradient}font-family:inherit;font-size:15px;font-weight:800;color:#FFFFFF;cursor:pointer;">${label}</button></form>`;

export const codeBlock = c =>
  `<table class="ha-block" width="100%" ${TABLE} bgcolor="${PAGE}" style="background-color:${PAGE};border:1px solid ${LINE};border-radius:14px;border-collapse:separate;margin-bottom:18px;"><tr><td class="ha-a" align="center" dir="ltr" style="padding:18px 8px;font-size:34px;font-weight:900;letter-spacing:8px;color:${ACCENT};">${c}</td></tr></table>`;

/* The close of every letter. */
export const signoff = (word, note) => `
  ${note ? `<p class="ha-m ha-l" style="margin:24px 0 0;padding-top:18px;border-top:1px solid ${LINE};font-size:14px;color:${MUTED};line-height:1.7;">${note}</p>` : ''}
  <p class="ha-t" style="margin:18px 0 0;font-size:15px;color:${TEXT};line-height:1.6;">${word ? `${word}<br>` : ''}<strong class="ha-i" style="color:${INK};">צוות HighAir Expeditions</strong></p>`;

export const whatsapp = t => link(WA_URL, t);

/* The one closing line of the letters that take questions. */
export const HELP = `יש שאלה? אפשר לכתוב לנו ב${whatsapp('וואטסאפ')} ונשמח לעזור.`;

/* A name is only ever greeted in Hebrew (owner's rule): Latin gets a plain "שלום,".
   Pass it already escaped. */
export const greeting = name => {
  const first = String(name || '').trim().split(/\s+/)[0];
  return /[\u0590-\u05FF]/.test(first) ? `שלום ${first},` : 'שלום,';
};

export const SITE = 'https://www.highair-expeditions.com';

/* A staff email in English. Only the frame and the helpers' direction flip: a
   report's own columns keep the alignment they were written with. */
const flipFrame = html => html
  .replaceAll('dir="rtl"', 'dir="ltr"').replaceAll('lang="he"', 'lang="en"')
  .replaceAll('text-align:right', 'text-align:left').replaceAll('align="right"', 'align="left"')
  .replaceAll('direction:rtl', 'direction:ltr').replaceAll('padding-right:12px', 'padding-left:12px');

/* `hero` swaps the contour for the trip's photo under our purple; Outlook on
   Windows shows the plain purple either way. `footer` is a second, smaller line.
   `lang: 'en'` is the left-to-right staff letter, `width` a wider sheet for a
   report. `dark: false` keeps the letter light for a report whose tables carry
   their own colours, which the dark rules below cannot reach. */
export function emailShell({ title, subtitle, preheader, body, footer = '', hero = '', lang = 'he', width = 560, dark = true }) {
  if (lang === 'en') {
    const mark = '<!--ha-body-->';
    return flipFrame(emailShell({ title, subtitle, preheader, body: mark, footer, hero, width, dark }))
      .replace(mark, body.replaceAll('dir="rtl"', 'dir="ltr"'));
  }
  const headerImage = `${ASSETS}/${hero || 'header.jpg'}`;
  const headerPad = hero ? '64px 26px 22px' : '24px 26px';
  const scheme = dark ? 'light dark' : 'light';
  return `<!DOCTYPE html>
<html lang="he" dir="rtl" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="${scheme}"><meta name="supported-color-schemes" content="${scheme}">
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><style>body,table,td,p,a,div,span,strong{font-family:'Segoe UI',Arial,sans-serif !important;}</style><![endif]-->
<!--[if !mso]><!--><style>${FONTS}</style>${dark ? `<style>${DARK}</style>` : ''}<style>${GMAIL}</style><!--<![endif]-->
</head>
<body class="body ha-page" style="margin:0;padding:0;background-color:${PAGE};font-family:${FONT};" dir="rtl">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>` : ''}
<table class="ha-page" width="100%" ${TABLE} bgcolor="${PAGE}" style="background-color:${PAGE};"><tr><td align="center" style="padding:24px 12px 28px;direction:rtl;font-family:${FONT};">
  <!--[if mso]><table width="${width}" align="center" ${TABLE}><tr><td><![endif]-->
  <table class="ha-card" ${TABLE} bgcolor="#FFFFFF" style="width:100%;max-width:${width}px;background-color:#FFFFFF;border:1px solid ${LINE};border-radius:18px;border-collapse:separate;box-shadow:0 3px 12px rgba(109,40,217,0.07);direction:rtl;font-family:${FONT};">
    <tr><td bgcolor="#4C1D95" background="${headerImage}" style="background-color:#4C1D95;background-image:url('${headerImage}');background-size:cover;background-position:right top;border-radius:17px 17px 0 0;padding:${headerPad};">
      <table width="100%" ${TABLE}><tr>
        <td valign="${hero ? 'bottom' : 'middle'}" align="right" style="text-align:right;">
          <div style="font-size:23px;font-weight:900;line-height:29px;color:#FFFFFF;">${keepWhite(title)}</div>
          ${subtitle ? `<div style="font-size:13px;line-height:18px;color:#DDD6FE;margin-top:2px;">${keepWhite(subtitle)}</div>` : ''}
        </td>
        <td width="48" valign="${hero ? 'bottom' : 'middle'}" style="width:48px;padding-right:12px;"><img src="${ASSETS}/logo-disc.png" alt="HighAir" width="48" height="48" style="display:block;width:48px;height:48px;border:0;" /></td>
      </tr></table>
    </td></tr>
    <tr><td align="right" style="padding:26px 26px 28px;text-align:right;">${body}</td></tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
  <p class="ha-m" style="margin:14px 0 0;font-size:12px;color:${MUTED};line-height:1.6;text-align:center;"><a class="ha-m" href="${SITE}" target="_blank" style="color:${MUTED};text-decoration:none;">HighAir Expeditions</a>${footer ? `<br>${footer}` : ''}</p>
</td></tr></table>
</body></html>`;
}

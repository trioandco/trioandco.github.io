var ASSETS={"billboard": "billboard.jpg", "stickers": "stickers.jpg", "website": "website.jpg", "cards": "cards.jpg", "merch": "merch.jpg", "hoodie": "hoodie.jpg", "insta": "insta.jpg", "pink": "pink.jpg", "blue": "blue.jpg", "collage": "collage.jpg", "phone": "phone.jpg"};
/* ---------- SVG artwork generator (brand palette). Part 1: helpers + social posts ---------- */
var C = { ink:'#0B0B0B', paper:'#F5F5F0', blue:'#0066FF', acid:'#BBFF00', pink:'#FF2D9B', purple:'#6B3DFF', orange:'#FF7A00' };
var FD = "Archivo,'Helvetica Neue',Arial,sans-serif", FM = "'Permanent Marker',cursive", FK = "'Courier Prime','Courier New',monospace";
var UID = 0;
function uid() { return 'u' + (++UID); }
function svgWrap(w, h, inner) {
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
}
function R(x, y, w, h, f, ex) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${ex || ''}/>`; }
function O(x, y, r, f, ex) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${ex || ''}/>`; }
function T(x, y, s, size, fill, o) {
  o = o || {};
  var rot = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : '';
  return `<text x="${x}" y="${y}" font-family="${o.f || FD}" font-weight="${o.w || 900}" font-size="${size}" fill="${fill}" text-anchor="${o.a || 'start'}" letter-spacing="${o.ls == null ? -2 : o.ls}"${rot}${o.fit ? ` data-max="${o.fit}"` : ''} ${o.ex || ''}>${s}</text>`;
}
function halftone(c, r, gap, x, y, w, h, op) {
  var id = uid();
  return `<defs><pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse"><circle cx="${gap / 2}" cy="${gap / 2}" r="${r}" fill="${c}"/></pattern></defs>` + R(x, y, w, h, `url(#${id})`, `opacity="${op == null ? 1 : op}"`);
}
function stripes(c, x, y, w, h, gap, op) {
  var id = uid();
  return `<defs><pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="${gap / 2}" height="${gap}" fill="${c}"/></pattern></defs>` + R(x, y, w, h, `url(#${id})`, `opacity="${op == null ? 1 : op}"`);
}
function star(cx, cy, r, f, rot) {
  var p = [];
  for (var i = 0; i < 10; i++) {
    var rad = i % 2 ? r * 0.42 : r, a = (i * 36 - 90 + (rot || 0)) * Math.PI / 180;
    p.push((cx + rad * Math.cos(a)).toFixed(1) + ',' + (cy + rad * Math.sin(a)).toFixed(1));
  }
  return `<polygon points="${p.join(' ')}" fill="${f}"/>`;
}
function smile(cx, cy, r, bg, fg) {
  return O(cx, cy, r, bg) + T(cx, cy + r * 0.2, ':)', r * 0.78, fg, { a: 'middle', w: 700, ls: 0, f: FK });
}
function sticker(cx, cy, w, h, rot, f, lines, tc, fs) {
  var lh = fs * 1.02, y0 = cy - ((lines.length - 1) * lh) / 2 + fs * 0.34;
  return `<g transform="rotate(${rot} ${cx} ${cy})">${R(cx - w / 2, cy - h / 2, w, h, f, 'rx="16"')}` +
    lines.map(function (l, i) { return T(cx, y0 + i * lh, l, fs, tc, { a: 'middle', ls: -0.5, fit: w - 44 }); }).join('') + '</g>';
}
function crown(x, y, s, st, sw) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${st}" stroke-width="${sw || 5}" stroke-linecap="round" stroke-linejoin="round"><path d="M4,56 L10,8 L34,34 L52,0 L70,34 L94,8 L100,56 Z"/><path d="M8,66 L96,66"/></g>`;
}
function squig(x, y, w, st, sw) {
  var n = Math.round(w / 40), d = 'M' + x + ',' + y;
  for (var i = 0; i < n; i++) d += ` q10,-14 20,0 t20,0`;
  return `<path d="${d}" fill="none" stroke="${st}" stroke-width="${sw || 7}" stroke-linecap="round"/>`;
}
function figure(cx, cy, s, hair, rim) {
  var hr = {
    cap: `<path d="M-44,-14 C-44,-66 44,-66 44,-14 Z" fill="${C.ink}" stroke="${rim}" stroke-width="3"/><path d="M-46,-14 L62,-8 L60,3 L-46,-2 Z" fill="${C.ink}" stroke="${rim}" stroke-width="3"/>`,
    curls: [-34, -18, 0, 18, 34, -26, 26].map(function (x, i) { return `<circle cx="${x}" cy="${-34 - (i > 4 ? -8 : Math.abs(x) < 20 ? 14 : 0)}" r="19" fill="${C.ink}" stroke="${rim}" stroke-width="3"/>`; }).join(''),
    bun: `<circle cx="0" cy="-70" r="21" fill="${C.ink}" stroke="${rim}" stroke-width="3"/><path d="M-41,-8 C-44,-62 44,-62 41,-8 C28,-30 -28,-30 -41,-8 Z" fill="${C.ink}" stroke="${rim}" stroke-width="3"/>`,
    none: ''
  }[hair || 'none'];
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
    <path d="M-112,175 C-112,96 -56,72 -26,62 L26,62 C56,72 112,96 112,175 Z" fill="${C.ink}" stroke="${rim}" stroke-width="3"/>
    <rect x="-16" y="28" width="32" height="42" fill="${C.ink}"/>
    <ellipse cx="0" cy="0" rx="38" ry="48" fill="#161616" stroke="${rim}" stroke-width="3"/>
    ${hr}
    <rect x="-35" y="-8" width="29" height="21" rx="8" fill="${C.ink}" stroke="${C.paper}" stroke-width="3"/>
    <rect x="6" y="-8" width="29" height="21" rx="8" fill="${C.ink}" stroke="${C.paper}" stroke-width="3"/>
    <path d="M-6,0 L6,0 M-28,-2 L-20,-2" stroke="${C.paper}" stroke-width="3" stroke-linecap="round"/>
  </g>`;
}

/* ---- Social 4:5 (800 x 1000) ---- */
var ART = {};
ART.sIdeas = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.acid) + halftone(C.pink, 5, 22, 0, 520, 800, 480, 0.9) +
    figure(560, 700, 2.1, 'cap', C.pink) +
    T(48, 222, 'IDEAS', 180, C.ink, { rot: -4, fit: 640 }) + T(48, 345, 'THAT MOVE', 118, C.ink, { rot: -4 }) +
    T(54, 500, 'PEOPLE.', 168, C.ink, { rot: -4, fit: 690 }) + squig(52, 548, 400, C.pink, 9) +
    star(700, 110, 72, C.pink, 12) + smile(110, 900, 54, C.blue, C.paper) +
    T(750, 960, '@trioandco.eg', 26, C.ink, { a: 'end', f: FK, w: 700, ls: 1 }));
};
ART.sDrop = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.pink) + stripes(C.purple, 0, 700, 800, 300, 44, 0.9) +
    T(54, 330, 'NEW', 340, C.blue, { rot: -5, fit: 560 }) + T(48, 322, 'NEW', 340, C.ink, { rot: -5, fit: 560 }) +
    T(54, 600, 'DROP.', 300, C.blue, { rot: -5, fit: 680 }) + T(48, 592, 'DROP.', 300, C.ink, { rot: -5, fit: 680 }) +
    sticker(560, 790, 330, 150, 6, C.acid, ['11.24', 'LIMITED RUN'], C.ink, 62) +
    smile(120, 790, 62, C.blue, C.paper) + star(690, 110, 66, C.orange, -8) +
    T(54, 960, 'OUT NOW / WHILE IT LASTS', 28, C.paper, { f: FK, w: 700, ls: 2 }));
};
ART.sCreators = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.blue) + halftone(C.paper, 3, 18, 0, 0, 800, 330, 0.18) +
    `<g>${O(200, 560, 190, C.acid)}${O(400, 600, 190, C.pink)}${O(600, 560, 190, C.orange)}</g>` +
    figure(200, 520, 1.25, 'curls', C.paper) + figure(400, 560, 1.25, 'cap', C.paper) + figure(600, 520, 1.25, 'bun', C.paper) +
    T(54, 150, 'MEET THE', 96, C.acid, { f: FM, w: 400, ls: 0, rot: -3 }) + T(48, 270, 'CREATORS', 150, C.paper, { rot: -3, fit: 690 }) +
    sticker(640, 880, 280, 110, -5, C.acid, ['EP. 03', 'OUT FRIDAY'], C.ink, 48) +
    T(54, 930, 'THE PEOPLE BEHIND THE FEED', 24, C.paper, { f: FK, w: 700, ls: 2 }) + crown(90, 340, 0.8, C.acid, 6));
};
ART.sOffer = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.orange) + halftone(C.ink, 4, 20, 0, 640, 800, 360, 0.25) +
    T(40, 500, '-40%', 440, C.ink, { rot: -6, ls: -10, fit: 700 }) +
    T(60, 610, 'FRESH FITS.', 120, C.paper, { rot: -6, fit: 690 }) +
    sticker(520, 800, 520, 120, 4, C.purple, ['THIS WEEKEND ONLY'], C.paper, 50) +
    star(690, 130, 78, C.acid, 10) + smile(110, 880, 50, C.pink, C.ink) +
    T(54, 120, 'SALE', 80, C.ink, { f: FM, w: 400, ls: 0 }));
};
ART.sCarousel = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.purple) + halftone(C.blue, 6, 26, 400, 560, 400, 440, 0.8) +
    T(48, 260, '5 THINGS', 170, C.paper, { rot: -3, fit: 700 }) + T(48, 400, 'BRANDS', 170, C.acid, { rot: -3, fit: 640 }) +
    T(48, 540, 'GET WRONG.', 150, C.paper, { rot: -3, fit: 700 }) + squig(52, 580, 440, C.pink, 9) +
    sticker(200, 800, 260, 100, -4, C.acid, ['SWIPE  →'], C.ink, 50) +
    T(750, 960, '1/5', 34, C.paper, { a: 'end', f: FK, w: 700, ls: 2 }) +
    [0, 1, 2, 3, 4].map(function (i) { return O(60 + i * 26, 940, 7, i ? 'none' : C.paper, `stroke="${C.paper}" stroke-width="3"`); }).join('') +
    star(690, 120, 66, C.pink, 0));
};
ART.sOpen = function () {
  return svgWrap(800, 1000,
    R(0, 0, 800, 1000, C.ink) + stripes(C.acid, 0, 0, 800, 90, 38, 0.9) + stripes(C.acid, 0, 910, 800, 90, 38, 0.9) +
    O(620, 330, 170, C.blue) + T(60, 420, 'OPEN', 250, C.paper, { rot: -4 }) +
    T(40, 700, 'LATE.', 330, C.acid, { f: FM, w: 400, ls: 0, rot: -4, fit: 700 }) + squig(60, 740, 560, C.pink, 10) +
    T(60, 850, '9PM – 3AM / EVERY NIGHT', 34, C.paper, { f: FK, w: 700, ls: 2 }) +
    star(690, 640, 70, C.pink, 15) + crown(640, 180, 0.9, C.acid, 6));
};

/* ---------- Part 2: reels, brand sheets, films, case-study headers ---------- */
function reelUI(w, h, handle) {
  var rail = [0, 1, 2].map(function (i) {
    return O(w - 62, h - 520 + i * 96, 28, 'rgba(11,11,11,.55)') + O(w - 62, h - 520 + i * 96, 8, C.paper);
  }).join('');
  var bars = [0, 1, 2, 3, 4].map(function (i) {
    return R(34 + i * ((w - 68) / 5), 40, (w - 68) / 5 - 8, 6, i < 2 ? C.paper : 'rgba(245,245,240,.35)', 'rx="3"');
  }).join('');
  return bars + rail + O(60, h - 150, 24, C.acid) + T(100, h - 142, handle || '@trioandco.eg', 26, C.paper, { f: FK, w: 700, ls: 1 }) +
    R(34, h - 100, w * 0.55, 12, 'rgba(245,245,240,.7)', 'rx="6"') + R(34, h - 74, w * 0.38, 12, 'rgba(245,245,240,.45)', 'rx="6"');
}
ART.rLaunch = function () {
  return svgWrap(720, 1280,
    R(0, 0, 720, 1280, C.blue) + halftone(C.paper, 4, 22, 0, 0, 720, 520, 0.2) + O(360, 560, 250, C.pink) +
    figure(360, 560, 2.2, 'cap', C.acid) +
    T(40, 960, 'SHOWROOM', 124, C.paper, { rot: -4, fit: 590 }) + T(40, 1070, 'LAUNCH.', 150, C.acid, { rot: -4, fit: 570 }) +
    sticker(190, 190, 270, 100, -6, C.acid, ['NOW OPEN'], C.ink, 52) + star(620, 150, 62, C.orange, 12) + reelUI(720, 1280));
};
ART.rBts = function () {
  return svgWrap(720, 1280,
    R(0, 0, 720, 1280, C.pink) + stripes(C.ink, 0, 0, 720, 120, 50, 0.9) +
    `<g transform="rotate(-6 360 470)">${R(110, 330, 500, 300, C.ink, 'rx="14"')}${R(110, 250, 500, 80, C.paper, 'rx="10"')}${stripes(C.ink, 120, 256, 480, 68, 46, 1)}` +
    T(150, 450, 'SCENE 04', 54, C.acid, { f: FK, w: 700, ls: 2 }) + T(150, 520, 'TAKE 12', 54, C.paper, { f: FK, w: 700, ls: 2 }) + `</g>` +
    O(90, 190, 18, C.pink, `stroke="${C.ink}" stroke-width="6"`) + T(124, 202, 'REC', 40, C.ink, { f: FK, w: 700, ls: 3 }) +
    T(40, 880, 'BEHIND', 150, C.ink, { rot: -4, fit: 540 }) + T(40, 1000, 'THE SCENES.', 112, C.paper, { rot: -4, fit: 600 }) +
    star(620, 780, 64, C.acid, 8) + reelUI(720, 1280));
};
ART.rNew = function () {
  return svgWrap(720, 1280,
    R(0, 0, 720, 1280, C.acid) + halftone(C.pink, 5, 24, 0, 700, 720, 580, 0.9) + figure(480, 940, 2.1, 'bun', C.blue) +
    T(30, 330, 'NEW.', 330, C.ink, { rot: -5, ls: -8, fit: 600 }) + squig(40, 380, 460, C.pink, 10) +
    T(40, 520, 'FEATURE', 120, C.ink, { rot: -5 }) +
    sticker(200, 700, 330, 110, 5, C.purple, ['DROPS FRIDAY'], C.paper, 52) +
    star(630, 150, 64, C.blue, 0) + reelUI(720, 1280));
};
ART.rStory = function () {
  return svgWrap(720, 1280,
    R(0, 0, 720, 1280, C.purple) + O(360, 520, 230, C.acid) + figure(360, 520, 2.0, 'curls', C.pink) +
    T(40, 900, 'REAL', 150, C.paper, { rot: -4 }) + T(40, 1030, 'PEOPLE.', 150, C.acid, { f: FM, w: 400, ls: 0, rot: -4, fit: 540 }) +
    sticker(520, 170, 300, 100, 5, C.pink, ['CUSTOMER STORY'], C.ink, 36) + crown(60, 120, 0.9, C.acid, 6) + reelUI(720, 1280));
};

/* ---- Brand sheets 4:3 (800 x 600) ---- */
ART.bKilo = function () {
  return svgWrap(800, 600,
    R(0, 0, 800, 600, C.paper) + T(50, 340, 'KILO', 300, C.ink, { ls: -14, fit: 470 }) + R(58, 380, 320, 16, C.pink, 'rx="8"') +
    O(640, 210, 120, C.blue) + `<polygon points="640,110 745,290 535,290" fill="${C.acid}"/>` +
    [C.blue, C.acid, C.pink, C.ink].map(function (c, i) { return R(58 + i * 74, 450, 62, 62, c, 'rx="10"'); }).join('') +
    sticker(660, 470, 220, 90, -7, C.orange, ['SS25'], C.ink, 56) +
    T(58, 64, 'FASHION LABEL / IDENTITY', 20, C.ink, { f: FK, w: 700, ls: 3 }));
};
ART.bMoka = function () {
  return svgWrap(800, 600,
    R(0, 0, 800, 600, C.ink) + halftone(C.orange, 4, 20, 440, 0, 360, 600, 0.55) +
    T(46, 330, 'moka', 250, C.paper, { f: FM, w: 400, ls: 0, rot: -3, fit: 440 }) + O(556, 308, 20, C.acid) +
    `<g>${R(520, 360, 190, 150, C.paper, 'rx="26"')}<path d="M708,390 C770,390 770,470 706,470" fill="none" stroke="${C.paper}" stroke-width="22"/>${R(520, 360, 190, 34, C.pink, 'rx="16"')}</g>` +
    squig(540, 330, 150, C.acid, 6) + sticker(170, 470, 250, 90, 5, C.blue, ['OPEN 7AM'], C.paper, 48) +
    T(50, 64, 'CAFE / REBRAND', 20, C.acid, { f: FK, w: 700, ls: 3 }));
};
ART.bPulse = function () {
  return svgWrap(800, 600,
    R(0, 0, 800, 600, C.purple) + halftone(C.blue, 5, 22, 0, 330, 800, 270, 0.8) +
    T(46, 250, 'PULSE', 210, C.paper, { ls: -10, fit: 600 }) +
    `<path d="M46,310 L240,310 L280,230 L330,390 L380,270 L420,310 L760,310" fill="none" stroke="${C.acid}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>` +
    sticker(200, 480, 250, 140, -8, C.acid, ['MEMBER', 'CARD'], C.ink, 44) + sticker(470, 490, 200, 120, 6, C.pink, ['TAG'], C.ink, 56) +
    sticker(660, 470, 190, 110, -4, C.paper, ['PULSE', 'SS25'], C.ink, 34) +
    T(50, 64, 'LAUNCH KIT', 20, C.acid, { f: FK, w: 700, ls: 3 }));
};

/* ---- Films 16:9 (1280 x 720) ---- */
ART.fBrand = function () {
  return svgWrap(1280, 720,
    R(0, 0, 1280, 720, C.ink) + R(640, 0, 640, 720, C.blue) + halftone(C.paper, 4, 22, 640, 0, 640, 720, 0.18) +
    O(930, 330, 250, C.pink) + figure(930, 330, 2.3, 'cap', C.acid) +
    T(60, 330, 'BRAND', 170, C.paper, { rot: -3, fit: 520 }) + T(60, 490, 'FILM.', 190, C.acid, { f: FM, w: 400, ls: 0, rot: -3, fit: 460 }) +
    R(0, 0, 1280, 56, C.ink) + R(0, 664, 1280, 56, C.ink) + O(52, 28, 10, C.pink) + T(76, 37, 'REC  00:00:24:12', 24, C.paper, { f: FK, w: 700, ls: 2 }) +
    R(60, 690, 1160, 4, 'rgba(245,245,240,.3)') + R(60, 690, 520, 4, C.acid) + star(1180, 120, 56, C.orange, 10));
};
ART.fRecap = function () {
  var heads = [];
  for (var i = 0; i < 16; i++) {
    var x = 40 + i * 80 + (i % 2) * 14, y = 600 - (i % 3) * 42, col = [C.ink, '#161616'][i % 2];
    heads.push(O(x, y, 46, col, `stroke="${[C.acid, C.pink, C.orange, C.blue][i % 4]}" stroke-width="4"`));
  }
  var conf = [];
  for (var j = 0; j < 22; j++) conf.push(`<rect x="${(j * 163) % 1240 + 20}" y="${(j * 97) % 380 + 30}" width="26" height="12" rx="3" fill="${[C.acid, C.pink, C.orange, C.blue, C.paper][j % 5]}" transform="rotate(${(j * 47) % 180} ${(j * 163) % 1240 + 33} ${(j * 97) % 380 + 36})"/>`);
  return svgWrap(1280, 720,
    R(0, 0, 1280, 720, C.purple) + halftone(C.pink, 6, 28, 0, 0, 1280, 720, 0.35) + conf.join('') + heads.join('') +
    T(60, 250, 'EVENT', 190, C.paper, { rot: -3, fit: 600 }) + T(60, 410, 'RECAP.', 200, C.acid, { rot: -3, fit: 700 }) +
    sticker(1040, 180, 300, 110, 5, C.acid, ['AFTER MOVIE'], C.ink, 44) + R(0, 664, 1280, 56, C.ink) + T(60, 700, '00:02:10', 24, C.paper, { f: FK, w: 700, ls: 2 }));
};

/* ---- Case-study headers (profile slide 6): big number + figure ---- */
function caseArt(n, bg, numC, hair, rim, extra) {
  return svgWrap(800, 480,
    R(0, 0, 800, 480, bg) + halftone(numC === C.ink ? C.ink : C.paper, 4, 20, 0, 0, 800, 480, 0.12) + extra +
    figure(600, 330, 1.7, hair, rim) + T(34, 330, n, 330, numC, { ls: -16 }));
}
ART.case1 = function () { return caseArt('01', C.blue, C.paper, 'cap', C.acid, star(720, 80, 54, C.acid, 8) + O(430, 60, 20, C.orange)); };
ART.case2 = function () { return caseArt('02', C.pink, C.ink, 'bun', C.paper, smile(720, 80, 40, C.blue, C.paper) + star(450, 70, 36, C.acid, 0)); };
ART.case3 = function () { return caseArt('03', C.purple, C.paper, 'curls', C.pink, crown(380, 30, 0.7, C.acid, 6) + star(730, 90, 46, C.orange, 14)); };

/* ===================== EDIT ME ===================== */
var CONTACT = [
  { label: 'Phone',     text: '+20 10 8055 3261',    href: 'tel:+201080553261' },
  { label: 'Instagram', text: '@trioandco.eg',       href: 'https://www.instagram.com/trioandco.eg/' },
  { label: 'Email',     text: 'hello@trioandco.com', href: 'mailto:hello@trioandco.com' },
  { label: 'Website',   text: 'www.trioandco.com',   href: 'https://www.trioandco.com' }
];
/* c = row colour, on = text colour when the row is hovered. Text is copied from the company profile. */
var SERVICES = [
  { n: '01', t: 'Strategy',         d: 'Insight-led plans that point every idea at a goal.',          c: '--acid',   on: '--ink' },
  { n: '02', t: 'Content',          d: 'Concepts and campaign ideas with a point of view.',           c: '--pink',   on: '--ink' },
  { n: '03', t: 'Social Media',     d: 'Video, photo and copy built for feeds and for culture.',      c: '--blue',   on: '--white' },
  { n: '04', t: 'Web Development', d: 'Always-on channels, community and trend-led stories.',          c: '--orange', on: '--ink' },
  { n: '05', t: 'Branding',         d: 'Creator partnerships that feel real and perform.',            c: '--purple', on: '--white' },
  { n: '06', t: 'Campaigns',        d: 'Integrated launches across digital, outdoor and live.',       c: '--acid',   on: '--ink' },
  { n: '07', t: 'Event Management', d: 'Identities, voice and systems that are bold by design.',      c: '--pink',   on: '--ink' }
];
/* Case studies (profile slide 6). Replace "Client name / Key result" with the real client and result. */
var CASES = [
  { art: 'case1', bg: '--acid',   cat: 'Brand launch / Fashion',       t: 'Unmissable launch',      d: 'Full brand build and launch campaign for an emerging label, from identity to social rollout.', res: 'Client name  /  Key result' },
  { art: 'case2', bg: '--orange', cat: 'Creator campaign / Lifestyle', t: 'Creators first, always', d: 'A creator-led campaign that put real voices at the centre and turned fans into a community.',  res: 'Client name  /  Key result' },
  { art: 'case3', bg: '--pink',   cat: 'Social-first / Entertainment', t: 'Culture on the feed',    d: 'Short-form content and an always-on social engine built to ride trends and start them.',       res: 'Client name  /  Key result' }
];
/* photo: path to a square photo, e.g. 'ahmed.jpg'. Add a real phone per founder (leave '' to hide). */
var FOUNDERS = [
  { n: '01', name: 'Ahmed ElSinary', role: 'Co Founder', c: '--blue',   ini: 'AE', photo: '', phone: '', d: 'Leads creative vision and the look, sound and feel of every brand we build.' },
  { n: '02', name: 'Noor Ahmed',     role: 'Co Founder', c: '--pink',   ini: 'NA', photo: '', phone: '', d: 'Turns insight into sharp strategy and campaigns that connect with culture.' },
  { n: '03', name: 'Amr Mahmoud',    role: 'Co Founder', c: '--purple', ini: 'AM', photo: '', phone: '', d: 'Connects brands with the creators, communities and channels that move them.' }
];
/* Reel pieces.
   cat    : brand | social | video         kind / fmt : labels on the tile
   img    : your own image (path like 'work/zeekr.jpg'), ar = its width/height like '4/5'
   gen    : built-in sample artwork (delete it when you add img)
   video  : short mp4 for in-page playback;  link: full version on Instagram / YouTube / Drive */
var WORK = [
  { cat:'brand',  kind:'Brand',  fmt:'OOH',    t:'Billboard, out of home',       client:'Trio & Co.',  img:ASSETS.billboard, ar:'361/280' },
  { cat:'video',  kind:'Reel',   fmt:'9:16',   t:'Showroom launch reel',         client:'Client name', gen:'rLaunch', ar:'9/16' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Ideas that move people',       client:'Client name', gen:'sIdeas',  ar:'4/5' },
  { cat:'brand',  kind:'Brand',  fmt:'Pack',   t:'Sticker pack',                 client:'Trio & Co.',  img:ASSETS.stickers,  ar:'330/280' },
  { cat:'social', kind:'Social', fmt:'Post',   t:'Instagram post',               client:'Trio & Co.',  img:ASSETS.insta,     ar:'201/280' },
  { cat:'video',  kind:'Film',   fmt:'16:9',   t:'Brand film',                   client:'Client name', gen:'fBrand',  ar:'16/9' },
  { cat:'brand',  kind:'Brand',  fmt:'4:3',    t:'Identity for a fashion label', client:'Client name', gen:'bKilo',   ar:'4/3' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Product drop post',            client:'Client name', gen:'sDrop',   ar:'4/5' },
  { cat:'video',  kind:'Reel',   fmt:'9:16',   t:'Short-form for the feed',      client:'Trio & Co.',  img:ASSETS.phone,     ar:'164/312' },
  { cat:'brand',  kind:'Brand',  fmt:'Web',    t:'Agency website',               client:'Trio & Co.',  img:ASSETS.website,   ar:'387/278' },
  { cat:'social', kind:'Social', fmt:'Poster', t:'Poster series, pink',          client:'Trio & Co.',  img:ASSETS.pink,      ar:'157/280' },
  { cat:'brand',  kind:'Brand',  fmt:'4:3',    t:'Cafe rebrand',                 client:'Client name', gen:'bMoka',   ar:'4/3' },
  { cat:'video',  kind:'Reel',   fmt:'9:16',   t:'Behind the scenes cut',        client:'Client name', gen:'rBts',    ar:'9/16' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Creator spotlight',            client:'Client name', gen:'sCreators', ar:'4/5' },
  { cat:'brand',  kind:'Brand',  fmt:'Print',  t:'Business cards',               client:'Trio & Co.',  img:ASSETS.cards,     ar:'225/287' },
  { cat:'social', kind:'Social', fmt:'Poster', t:'Poster series, blue',          client:'Trio & Co.',  img:ASSETS.blue,      ar:'152/280' },
  { cat:'video',  kind:'Reel',   fmt:'9:16',   t:'Feature teaser',               client:'Client name', gen:'rNew',    ar:'9/16' },
  { cat:'brand',  kind:'Brand',  fmt:'4:3',    t:'Launch kit',                   client:'Client name', gen:'bPulse',  ar:'4/3' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Offer announcement',           client:'Client name', gen:'sOffer',  ar:'4/5' },
  { cat:'brand',  kind:'Brand',  fmt:'Merch',  t:'Tee, cap and tote',            client:'Trio & Co.',  img:ASSETS.merch,     ar:'264/277' },
  { cat:'video',  kind:'Film',   fmt:'16:9',   t:'Event recap',                  client:'Client name', gen:'fRecap',  ar:'16/9' },
  { cat:'social', kind:'Social', fmt:'Key visual', t:'Campaign collage',         client:'Trio & Co.',  img:ASSETS.collage,   ar:'381/262' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Carousel cover',               client:'Client name', gen:'sCarousel', ar:'4/5' },
  { cat:'brand',  kind:'Brand',  fmt:'Merch',  t:'Hoodie',                       client:'Trio & Co.',  img:ASSETS.hoodie,    ar:'178/184' },
  { cat:'video',  kind:'Reel',   fmt:'9:16',   t:'Customer story',               client:'Client name', gen:'rStory',  ar:'9/16' },
  { cat:'social', kind:'Social', fmt:'4:5',    t:'Opening-hours post',           client:'Client name', gen:'sOpen',   ar:'4/5' }
];
/* =================================================== */

(function () {
  'use strict';
  var cat = 'all', lastFocus = null, toastTimer = 0;
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function h(tag, attrs) {
    var e = document.createElement(tag), k, v, kids = Array.prototype.slice.call(arguments, 2);
    attrs = attrs || {};
    for (k in attrs) {
      v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'text') e.textContent = v;
      else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.forEach(function (c) { if (c != null) e.append(c); });
    return e;
  }
  function ratio(ar) { var p = String(ar).split('/'); return +(p[0] / (p[1] || 1)).toFixed(4); }
  function v(name) { return 'var(' + name + ')'; }
  function fitAll(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('text[data-max]'), function (t) {
      t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust');
      var max = +t.getAttribute('data-max'), len = 0;
      try { len = t.getComputedTextLength(); } catch (e) {}
      if (len > max) { t.setAttribute('textLength', max); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
  }
  function toast(msg) {
    $('#toast-t').textContent = msg;
    $('#toast').classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $('#toast').classList.remove('on'); }, 2400);
  }

  /* ---------- modal ---------- */
  function showModal(node, link) {
    lastFocus = document.activeElement;
    var box = $('#mbody');
    box.replaceChildren(node);
    if (link) box.append(h('a', { href: link, target: '_blank', rel: 'noopener', text: 'Watch the full version' }));
    $('#modal').hidden = false;
    $('#mclose').focus();
  }
  function closeModal() {
    var m = $('#mbody').querySelector('video');
    if (m) m.pause();
    $('#mbody').replaceChildren();
    $('#modal').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function openItem(it) {
    if (it.video) {
      var m = h('video', { src: it.video, controls: true, autoplay: true, playsinline: true });
      if (it.img) m.poster = it.img;
      showModal(m, it.link);
    } else if (it.img) {
      showModal(h('img', { src: it.img, alt: it.t }), it.link);
    } else if (it.gen) {
      var big = h('div', { 'class': 'big', style: '--ar:' + it.ar + ';--r:' + ratio(it.ar) });
      big.innerHTML = ART[it.gen]();
      showModal(big, it.link);
      fitAll(big);
    }
  }

  /* ---------- reel ---------- */
  function piece(it) {
    var art = h('span', { 'class': 'art' });
    if (it.img) art.append(h('img', { src: it.img, alt: it.t, loading: 'lazy', decoding: 'async' }));
    else art.innerHTML = ART[it.gen]();
    art.append(h('span', { 'class': 'chip', text: it.kind + ' / ' + it.fmt }));
    if (!it.img && it.gen) art.append(h('span', { 'class': 'chip smp', text: 'Sample' }));
    if (it.cat === 'video') art.append(h('span', { 'class': 'play', 'aria-hidden': 'true' }));
    var cap = h('span', { 'class': 'cap' }, h('span', { 'class': 'cl', text: it.client }), h('span', { 'class': 'ti', text: it.t }));
    var style = '--r:' + ratio(it.ar);
    if (it.link && !it.video && !it.img && !it.gen) {
      return h('a', { 'class': 'piece', 'data-cat': it.cat, style: style, href: it.link, target: '_blank', rel: 'noopener' }, art, cap);
    }
    return h('button', { 'class': 'piece', 'data-cat': it.cat, style: style, type: 'button', onclick: function () { openItem(it); } }, art, cap);
  }
  var FS = [['all', 'All'], ['brand', 'Branding'], ['social', 'Social'], ['video', 'Video']];
  function applyFilter() {
    $$('#filters .f').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.c === cat)); });
    $$('#reel .piece').forEach(function (t) { t.hidden = !(cat === 'all' || t.dataset.cat === cat); });
    $('#reel').scrollLeft = 0;
  }
  function renderReel() {
    $('#filters').replaceChildren.apply($('#filters'), FS.map(function (f) {
      return h('button', { 'class': 'f', type: 'button', 'data-c': f[0], onclick: function () { cat = f[0]; applyFilter(); } }, f[1]);
    }));
    $('#reel').replaceChildren.apply($('#reel'), WORK.map(piece));
    applyFilter();
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function step(dir) { var r = $('#reel'); r.scrollBy({ left: dir * r.clientWidth * 0.8, behavior: calm ? 'auto' : 'smooth' }); }
    $('#prev').addEventListener('click', function () { step(-1); });
    $('#next').addEventListener('click', function () { step(1); });
  }

  /* ---------- sections ---------- */
  function renderServices() {
    $('#svcs').replaceChildren.apply($('#svcs'), SERVICES.map(function (s) {
      return h('li', { 'class': 'svc', style: '--c:' + v(s.c) + ';--on:' + v(s.on) },
        h('span', { 'class': 'n', text: s.n }), h('h3', { text: s.t }), h('p', { text: s.d }));
    }));
  }
  function renderCases() {
    $('#cases').replaceChildren.apply($('#cases'), CASES.map(function (c) {
      var art = h('div', { 'class': 'art' });
      art.innerHTML = ART[c.art]();
      return h('article', { 'class': 'case', style: '--bgc:' + v(c.bg) },
        h('div', { 'class': 'tx' }, h('p', { 'class': 'cat', text: c.cat }), h('h3', { text: c.t }), h('p', { text: c.d }), h('p', { 'class': 'res', text: c.res })), art);
    }));
  }
  function renderFounders() {
    $('#founders-grid').replaceChildren.apply($('#founders-grid'), FOUNDERS.map(function (f) {
      var ava = h('div', { 'class': 'ava', style: 'background:' + v(f.c), 'aria-hidden': f.photo ? null : 'true' });
      if (f.photo) ava.append(h('img', { src: f.photo, alt: f.name })); else ava.textContent = f.ini;
      return h('article', { 'class': 'fc' }, ava, h('span', { 'class': 'no', text: f.n }), h('h3', { text: f.name }),
        h('span', { 'class': 'role', style: 'background:' + v(f.c), text: f.role }), h('p', { text: f.d }),
        f.phone ? h('div', { 'class': 'tel' }, h('span', { text: 'Phone' }), h('span', { text: f.phone })) : null);
    }));
  }
  function copy(text, node) {
    var sel = function () { var r = document.createRange(); r.selectNodeContents(node); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(text).then(function () { toast('Copied: ' + text); }, sel); } catch (e) { sel(); }
  }
  function renderContact() {
    $('#crows').replaceChildren.apply($('#crows'), CONTACT.map(function (r) {
      var a = h('a', { href: r.href, target: r.href.indexOf('http') === 0 ? '_blank' : null, rel: 'noopener', text: r.text });
      var b = h('button', { 'class': 'cp', type: 'button', 'aria-label': 'Copy ' + r.label, text: 'Copy' });
      b.addEventListener('click', function () { copy(r.text, a); });
      return h('div', { 'class': 'crow' }, h('span', { 'class': 'k', text: r.label }), a, b);
    }));
  }

  $('#mclose').addEventListener('click', closeModal);
  $('#modal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  renderServices(); renderCases(); renderFounders(); renderReel(); renderContact();
  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitAll(); });
})();

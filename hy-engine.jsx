// 현답 — 결정적 추천 엔진 (AI/API 없음)

function hyLoad(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
function hySave(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

const hyCard = (id) => HY_CARDS.find(c => c.id === id);
const hyPersona = (id) => HY_PERSONAS.find(p => p.id === id);

// 1. 감지
function hyDetect(text, chip) {
  const t = (text || '').toLowerCase();
  let best = null, bestScore = 0;
  HY_SCENARIOS.forEach(s => {
    let sc = 0;
    s.triggers.concat(HY_EN.triggers[s.id] || []).forEach(w => { if (t.includes(w)) sc += 2; });
    if (chip && chip === s.topic) sc += 1;
    if (sc > bestScore) { best = s; bestScore = sc; }
  });
  if (best && bestScore >= 2) return { topic: best.topic, scenario: best.id, keywords: best.keywords.slice(), detected: true };
  if (chip) return { topic: chip, scenario: null, keywords: [Object.keys(HY_KEYWORDS[chip])[0]], detected: true };
  return { topic: null, scenario: null, keywords: [], detected: false };
}

// 2. 카드 점수 + 2 idiom + 1 perspective 페이지
function hyCardPages(flow) {
  const sc = HY_SCENARIOS.find(s => s.id === flow.scenario);
  const score = (c) => {
    let s = 0;
    if (c.topics.includes(flow.topic)) s += 4;
    (flow.keywords || []).forEach(k => { if (c.tags.includes(k)) s += 3; });
    if (sc) { const i = sc.featured.indexOf(c.id); if (i >= 0) s += 12 - i; }
    return s;
  };
  const sort = (arr) => arr.map((c, i) => ({ c, s: score(c), i })).sort((a, b) => b.s - a.s || a.i - b.i).map(x => x.c);
  const idioms = sort(HY_CARDS.filter(c => c.kind === 'idiom'));
  const persp = sort(HY_CARDS.filter(c => c.kind === 'perspective'));
  const pages = [];
  let i = 0, j = 0;
  while (i < idioms.length || j < persp.length) {
    const p = [];
    if (i < idioms.length) p.push(idioms[i++]);
    if (i < idioms.length) p.push(idioms[i++]);
    if (j < persp.length) p.push(persp[j++]);
    pages.push(p);
  }
  return pages.slice(0, 4);
}

// 3. 인물 순위
function hyPersonaPages(card, keywords) {
  if (!card) return [[]];
  const rel = card.related || [];
  const ranked = HY_PERSONAS.map((p, idx) => {
    let s = 0;
    const r = rel.indexOf(p.id); if (r >= 0) s += [12, 9, 6, 3][r] || 0;
    if (card.persona === p.id) s += 12;
    if (p.methods.includes(card.thinkingMethod)) s += 4;
    (keywords || []).forEach(k => { if (p.tags.includes(k)) s += 3; });
    return { p, s, idx };
  }).sort((a, b) => b.s - a.s || a.idx - b.idx);
  const good = ranked.filter(x => x.s >= 6);
  // 다양성: 주된 방법이 겹치지 않는 인물 우선
  const out = [], used = new Set(), rest = [];
  good.forEach(x => { const m = x.p.methods[0]; if (!used.has(m)) { used.add(m); out.push(x.p); } else rest.push(x.p); });
  // 항상 4명(짝수)씩 보이도록 나머지 인물을 점수순으로 채움 → 8명 = 4 + 4
  const list = out.concat(rest);
  ranked.forEach(x => { if (!list.includes(x.p)) list.push(x.p); });
  const pages = [];
  for (let k = 0; k < list.length; k += 4) pages.push(list.slice(k, k + 4));
  return pages;
}

function hyReason(p, card, keywords) {
  const kw = (keywords || []).find(k => p.tags.includes(k));
  if (kw) return tr(`‘${kw}’ 고민에 어울려요`, `Fits a ‘${tKw(kw)}’ worry`);
  if (p.methods.includes(card.thinkingMethod)) return tr(`‘${card.title}’과 생각 방식이 닮았어요`, `Thinks like ‘${cardT(card).title}’`);
  return personaT(p).role;
}

// 4. 질문
function hyQuestions(flow) {
  const p = hyPersona(flow.personaId), c = hyCard(flow.cardId);
  if (!p || !c) return [];
  const pt = personaT(p), ct = cardT(c);
  return [
    { q: pt.question, from: tr(`${pt.name}의 관점`, `${pt.name}’s lens`), ex: pt.examples[flow.topic] || pt.examples.default, required: true },
    { q: ct.question, from: ct.title, required: false },
  ];
}

// 5. 실천
function hyActions(flow) {
  const p = hyPersona(flow.personaId), c = hyCard(flow.cardId);
  if (!p || !c) return [];
  const pt = personaT(p), ct = cardT(c);
  const a1 = pt.actionTemplates[flow.topic] || pt.actionTemplates.default;
  return [{ ...a1, src: tr(`${pt.name}의 관점`, `${pt.name}’s lens`) }, { ...ct.action, src: ct.title }];
}

function hyActionText(a) { if (!a) return ''; return a.when ? `${a.when}, ${a.what}` : a.what; }
function hyIsToday(iso) { const d = new Date(iso), n = new Date(); return d.toDateString() === n.toDateString(); }
const HY_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function hyDate(iso) { const d = new Date(iso); return tr(`${d.getMonth() + 1}월 ${d.getDate()}일`, `${HY_MON[d.getMonth()]} ${d.getDate()}`); }
function hyStatus(s) { return tr(HY_STATUS[s], { done: 'Did it', partial: 'Did some', missed: 'Didn’t' }[s]); }
function hyGroupLabel(iso) {
  const d = new Date(iso), n = new Date();
  const diff = Math.round((new Date(n.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (diff === 0) return tr('오늘', 'Today'); if (diff === 1) return tr('어제', 'Yesterday');
  const w = tr(['일', '월', '화', '수', '목', '금', '토'], ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])[d.getDay()];
  return `${hyDate(iso)} (${w})`;
}
function hyCardSource(c) { if (c.kind === 'idiom') return tType(c.contentType); const p = hyPersona(c.persona); return p ? tr(`${p.koName}의 관점`, `${personaT(p).name}’s lens`) : tType(c.contentType); }
function hyTodayCard() {
  const d = new Date(); const seed = d.getFullYear() * 400 + (d.getMonth() + 1) * 32 + d.getDate();
  return HY_CARDS[seed % HY_CARDS.length];
}

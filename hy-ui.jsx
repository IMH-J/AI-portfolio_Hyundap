// 현답 — 공용 UI (아이콘, 로고, 헤더, 버튼, 탭바, 카드, 온보딩 비디오)

const Ic = {
  back: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M15 18l-6-6 6-6"/></svg>,
  chev: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 18l6-6-6-6"/></svg>,
  arrow: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  bell: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>,
  gear: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  pencil: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z"/></svg>,
  check: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6L9 17l-5-5"/></svg>,
  home: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg>,
  explore: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>,
  records: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>,
};

// 메인 이후 모든 화면: 언어와 관계없이 오렌지 따옴표 심볼만 사용
function Logo({ h = 26 }) {
  return <img className="hy-symbol" style={{ height: h }} src="assets/symbol_quote.png" alt={tr('현답', 'Hyundap')} />;
}

// 온보딩 전용: 언어별 로고 하나만 표시
function OnboardingLogo() {
  const { lang } = useContext(HyLangCtx);
  return (
    <div className="hy-onb-logo">
      {lang === 'en'
        ? <img key="en" className="en" src="assets/logo_en_orange.png" alt="Hyundap" />
        : <img key="ko" className="ko" src="assets/logo_ko_orange.png" alt="현답" />}
    </div>
  );
}

function Header({ title, onBack, step, right }) {
  return (
    <div className="hy-top">
      <div className="hy-top-row">
        {onBack ? <button className="hy-ibtn" onClick={onBack} aria-label={tr('뒤로', 'Back')}><Ic.back /></button> : <div style={{ width: 44 }} />}
        <div className="hy-top-title">{title}</div>
        {step ? <div className="hy-top-step" style={{ width: 44, textAlign: 'right', paddingRight: 12 }}><b>{step}</b>/5</div> : (right || <div style={{ width: 44 }} />)}
      </div>
      {step ? <div className="hy-progress"><div style={{ width: (step / 5 * 100) + '%' }} /></div> : null}
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = 'key', onDisabled }) {
  return (
    <button className={'hy-btn hy-btn-' + variant} aria-disabled={disabled ? 'true' : undefined}
      onClick={() => { if (disabled) { onDisabled && onDisabled(); return; } onClick && onClick(); }}>{children}</button>
  );
}

function Tabbar({ active, onTab }) {
  const t = [['home', tr('홈', 'Home'), Ic.home], ['explore', tr('지혜 탐색', 'Explore'), Ic.explore], ['records', tr('내 기록', 'Records'), Ic.records]];
  return (
    <nav className="hy-tabbar" aria-label={tr('메인 메뉴', 'Main menu')}>
      {t.map(([id, label, I]) => (
        <button key={id} className={'hy-tab' + (active === id ? ' on' : '')} onClick={() => onTab(id)} aria-current={active === id ? 'page' : undefined}>
          <I /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function WisdomCard({ card, on, onClick, delay = 0 }) {
  const t = cardT(card);
  return (
    <button className={'hy-wcard' + (on ? ' on' : '')} onClick={onClick} style={{ animationDelay: delay + 'ms' }} aria-pressed={on}>
      <div className="ty">{t.contentType}</div>
      <div className="ti">{t.title}</div>
      <div className="ex">{t.easyExplanation}</div>
      <div className="mn">{t.meaning}{t.hanja ? <> <span className="hj">{t.hanja}</span></> : null}</div>
      <span className="hy-check"><Ic.check /></span>
    </button>
  );
}

function Orbs({ lg }) { return <div className={'hy-orbs' + (lg ? ' lg' : '')} aria-hidden="true"><i className="o1" /><i className="o2" /></div>; }

function OnboardingArt({ reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = true;
    if (reduced) { v.pause(); return; }
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  }, [reduced]);
  // 언어와 무관한 동일한 영상 (언어 전환 시에도 재시작되지 않음)
  return (
    <div className="hy-bub-video" aria-hidden="true">
      <video ref={ref} autoPlay={!reduced} muted loop playsInline webkit-playsinline="true" preload="auto" disablePictureInPicture>
        <source src="assets/onboarding_icons.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

// 눈금 링 (원형 상단 호)
function OrbTicks() {
  const ticks = [];
  for (let i = 0; i <= 60; i++) {
    const a = (-160 + i * (140 / 60)) * Math.PI / 180; // -160° ~ -20°
    const r1 = 86, r2 = i % 5 === 0 ? 82 : 84;
    ticks.push(<line key={i} x1={100 + r1 * Math.cos(a)} y1={100 + r1 * Math.sin(a)} x2={100 + r2 * Math.cos(a)} y2={100 + r2 * Math.sin(a)} />);
  }
  return <svg className="hy-orb-ticks" viewBox="0 0 200 200" aria-hidden="true">{ticks}</svg>;
}

// 인물 원형 — 한글 이름 + 영문 렌즈 + 큰 영문 이름 낙하
function PersonaOrb({ persona, reduced }) {
  if (!persona) {
    return (
      <div className="hy-orb">
        <div className="hy-orb-mask"><OrbTicks />
          <div className="hy-orb-ph">{tr('아래에서 인물을 골라 주세요', 'Pick a perspective below')}</div>
        </div>
      </div>
    );
  }
  const lines = persona.animationLabel.split('\n');
  const longest = Math.max(...lines.map(l => l.length));
  const fs = lines.length > 1 ? (longest > 7 ? 30 : 34) : longest > 8 ? 30 : longest > 6 ? 38 : 44;
  let n = 0;
  return (
    <div className="hy-orb lit">
      <div className="hy-orb-glow" />
      <div className="hy-orb-mask">
        <OrbTicks />
        <div className="hy-orb-head" key={'h' + persona.id}>
          <div className="ko">{persona.koName}</div>
          <div className="lens">{HY_LENS_TAG[persona.id]}</div>
        </div>
        <div className={'hy-letters' + (lines.length > 1 ? ' two' : '')} key={persona.id}>
          {lines.map((l, li) => (
            <div className="ln" key={li}>
              {l.split('').map((ch, i) => { const d = 80 + (n++) * 45; return <span key={i} className={reduced ? '' : 'drop'} style={{ fontSize: fs, animationDelay: d + 'ms' }}>{ch}</span>; })}
            </div>
          ))}
        </div>
        <i className="hy-orb-dot" />
      </div>
    </div>
  );
}

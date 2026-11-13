// 현답 — 앱 셸: 내비게이션, 탭, 영속화, 저장/체크인/다시 실천, 알림
const K = { lang: 'hy.lang.v1', onb: 'hy.onboarded.v1', flow: 'hy.flow.v1', stack: 'hy.stack.v1', rec: 'hy.records.v1', seen: 'hy.notifSeen.v1', exTopic: 'hy.exploreTopic.v1' };
const EMPTY = { worry: '', chip: null, sig: '', topic: null, detectedTopic: null, scenario: null, keywords: [], cardId: null, cardPage: 0, personaId: null, personaPage: 0, answers: {}, action: null, actionKey: null, fromExplore: false };

function useReduced() {
  const q = '(prefers-reduced-motion: reduce)';
  const [r, setR] = useState(() => window.matchMedia(q).matches);
  useEffect(() => { const m = window.matchMedia(q); const h = () => setR(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h); }, []);
  return r;
}

function App() {
  const reduced = useReduced();
  const [lang, setLang] = useState(() => hyLoad(K.lang, 'ko'));
  HY_LANG = lang; // 렌더 전에 전역 언어 갱신
  useEffect(() => { hySave(K.lang, lang); document.documentElement.lang = lang; document.title = lang === 'en' ? 'Hyundap — Borrow a little wisdom for today' : '현답 Hyundap — 오늘의 지혜를 슬쪍 빌려 보세요'; }, [lang]);
  const langCtx = useMemo(() => ({ lang, setLang }), [lang]);
  const [onboarded, setOnboarded] = useState(() => hyLoad(K.onb, false));
  const [flow, setFlowS] = useState(() => ({ ...EMPTY, ...hyLoad(K.flow, {}) }));
  const [stack, setStack] = useState(() => { const s = hyLoad(K.stack, ['home']); return Array.isArray(s) && s.length ? s : ['home']; });
  const [records, setRecords] = useState(() => hyLoad(K.rec, []));
  const [seen, setSeen] = useState(() => hyLoad(K.seen, 0));
  const [exTopic, setExTopic] = useState(() => hyLoad(K.exTopic, '전체'));
  const [dir, setDir] = useState('tab');
  const [focusInput, setFocusInput] = useState(false);
  const [toast, setToast] = useState(null);
  const [checkinId, setCheckinId] = useState(() => hyLoad('hy.checkinId', null));
  const [recordId, setRecordId] = useState(() => hyLoad('hy.recordId', null));

  useEffect(() => hySave(K.onb, onboarded), [onboarded]);
  useEffect(() => hySave(K.flow, flow), [flow]);
  useEffect(() => hySave(K.stack, stack), [stack]);
  useEffect(() => hySave(K.rec, records), [records]);
  useEffect(() => hySave(K.seen, seen), [seen]);
  useEffect(() => hySave(K.exTopic, exTopic), [exTopic]);
  useEffect(() => hySave('hy.checkinId', checkinId), [checkinId]);
  useEffect(() => hySave('hy.recordId', recordId), [recordId]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t); }, [toast]);

  const setFlow = useCallback((p) => setFlowS(f => ({ ...f, ...p })), []);
  const screen = stack[stack.length - 1];
  const go = (s) => { setDir('fwd'); setStack(st => [...st, s]); };
  const back = () => { setDir('back'); setStack(st => st.length > 1 ? st.slice(0, -1) : ['home']); };
  const onTab = (t) => { setDir('tab'); setStack([t]); };

  const startFlow = () => {
    const sig = flow.worry.trim() + '|' + (flow.chip || '');
    if (sig === flow.sig && flow.topic) { go('keywords'); return; }
    const d = hyDetect(flow.worry, flow.chip);
    setFlowS(f => ({ ...EMPTY, worry: f.worry, chip: f.chip, sig, topic: d.topic, detectedTopic: d.topic, scenario: d.scenario, keywords: d.keywords }));
    go('keywords');
  };

  const pickFromExplore = (card, topic) => {
    const t = topic || card.topics[0];
    const kws = card.tags.filter(k => HY_KEYWORDS[t] && HY_KEYWORDS[t][k]).slice(0, 2);
    setFlowS({ ...EMPTY, sig: 'explore:' + card.id, topic: t, detectedTopic: t, keywords: kws.length ? kws : [Object.keys(HY_KEYWORDS[t])[0]], cardId: card.id, fromExplore: true });
    go('persona');
  };

  const newWorry = () => { setFlowS({ ...EMPTY }); setDir('tab'); setStack(['home']); setFocusInput(true); };

  const commit = () => {
    const p = hyPersona(flow.personaId);
    const card = hyCard(flow.cardId);
    const key = flow.personaId + '|' + flow.cardId;
    const ans = (flow.answers && flow.answers[key]) || [];
    const rec = {
      id: 'r' + Date.now(), date: new Date().toISOString(),
      worry: flow.worry.trim(), topic: flow.topic, keywords: flow.keywords,
      cardId: card.id, cardTitle: card.title, cardType: card.contentType,
      personaId: p.id, personaName: p.koName, personaLens: p.perspectiveDescription,
      lang,
      qa: hyQuestions(flow).map((q, i) => ({ q: q.q, a: (ans[i] || '').trim() })).filter((x, i) => i === 0 || x.a),
      action: { ...flow.action, what: flow.action.what.trim(), when: (flow.action.when || '').trim() },
      status: null, memo: '', nextAction: null,
    };
    setRecords(rs => [rec, ...rs]);
    setFlowS({ ...EMPTY });
    setDir('tab'); setStack(['home']);
    setToast(tr('오늘의 실천을 저장했어요', 'Today’s step is saved'));
  };

  const openCheckin = (id) => { setCheckinId(id); go('checkin'); };
  const openRecord = (id) => { setRecordId(id); go('record'); };
  const saveCheckin = (id, status, memo, nextAction) => {
    setRecords(rs => rs.map(r => r.id === id ? { ...r, status, memo, nextAction, checkedAt: new Date().toISOString() } : r));
    setDir('tab'); setStack(['records']);
    setToast(tr('체크인을 기록했어요', 'Check-in saved'));
  };
  const redo = (r) => {
    const key = r.personaId + '|' + r.cardId;
    const act = r.nextAction || r.action;
    setFlowS({ ...EMPTY, worry: r.worry, sig: 'redo:' + r.id, topic: r.topic, detectedTopic: r.topic, keywords: r.keywords, cardId: r.cardId, personaId: r.personaId,
      answers: { [key]: r.qa.map(x => x.a) }, action: { ...act }, actionKey: key + '|' + lang, actionEdited: true, fromExplore: true });
    go('action');
  };

  const today = records.find(r => hyIsToday(r.date));
  const notes = [];
  records.slice(0, 8).forEach(r => {
    const t = new Date(r.date).getTime();
    if (!r.status) notes.push({ id: 'c' + r.id, recId: r.id, t, unread: t > seen, title: tr('저녁 체크인', 'Evening check-in'), body: tr(`‘${hyActionText(r.action)}’ 해 보셨나요?`, `Did you try ‘${hyActionText(r.action)}’?`) });
    else notes.push({ id: 'd' + r.id, recId: null, t, unread: false, title: tr('기록이 저장됐어요', 'Record saved'), body: `${hyDate(r.date)} · ${hyStatus(r.status)}` });
  });
  const unread = notes.some(n => n.unread);

  if (!onboarded) {
    return (
      <HyLangCtx.Provider value={langCtx}>
      <div className="hy-root"><div className="hy-app"><div className="hy-view tab">
        <ScreenOnboarding reduced={reduced}
          onStart={() => { setOnboarded(true); setDir('tab'); setStack(['home']); setFocusInput(true); }}
          onBrowse={() => { setOnboarded(true); setDir('tab'); setStack(['home']); }} />
      </div></div></div>
      </HyLangCtx.Provider>
    );
  }

  let s = screen;
  const needs = { keywords: () => flow.topic || flow.worry.trim() || flow.chip, wisdom: () => flow.topic && flow.keywords.length, persona: () => flow.cardId, question: () => flow.personaId && flow.cardId, action: () => flow.personaId && flow.cardId };
  if (needs[s] && !needs[s]()) s = 'home';

  let view;
  const c = { flow, setFlow, go, back, reduced };
  switch (s) {
    case 'explore': view = <ScreenExplore onTab={onTab} pickFromExplore={pickFromExplore} topic={exTopic} setTopic={setExTopic} />; break;
    case 'records': view = <ScreenRecords records={records} onTab={onTab} openRecord={openRecord} newWorry={newWorry} />; break;
    case 'record': view = <ScreenRecordDetail rec={records.find(r => r.id === recordId)} back={back} redo={redo} newWorry={newWorry} openCheckin={openCheckin} />; break;
    case 'notifications': view = <ScreenNotifications back={back} notes={notes} openCheckin={openCheckin} markRead={() => setSeen(Date.now())} go={go} />; break;
    case 'settings': view = <ScreenSettings back={back} replayOnboarding={() => { setOnboarded(false); setStack(['home']); }} resetAll={() => { setRecords([]); setFlowS({ ...EMPTY }); setDir('tab'); setStack(['home']); setToast(tr('모든 기록을 지웠어요', 'All records erased')); }} />; break;
    case 'keywords': view = <ScreenKeywords {...c} />; break;
    case 'wisdom': view = <ScreenWisdom {...c} />; break;
    case 'persona': view = <ScreenPersona {...c} />; break;
    case 'question': view = <ScreenQuestion {...c} />; break;
    case 'action': view = <ScreenAction {...c} commit={commit} lang={lang} />; break;
    case 'checkin': view = <ScreenCheckin key={checkinId} rec={records.find(r => r.id === checkinId)} back={back} save={saveCheckin} />; break;
    default: view = <ScreenHome flow={flow} setFlow={setFlow} startFlow={startFlow} focusInput={focusInput} clearFocus={() => setFocusInput(false)}
      today={today} openCheckin={(id) => { const r = records.find(x => x.id === id); if (r && r.status) openRecord(id); else openCheckin(id); }} go={go} onTab={onTab} unread={unread}
      openTodayCard={(card) => pickFromExplore(card, null)} />;
  }

  return (
    <HyLangCtx.Provider value={langCtx}>
    <div className="hy-root">
      <div className="hy-app">
        <div key={s + stack.length} className={'hy-view ' + (dir === 'back' ? 'back' : dir === 'tab' ? 'tab' : '')}>{view}</div>
        {toast ? <div className="hy-toast" role="status">{toast}</div> : null}
      </div>
    </div>
    </HyLangCtx.Provider>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

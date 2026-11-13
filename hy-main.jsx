// 현답 — 온보딩, 홈, 탐색, 기록, 상세, 알림, 설정

function ScreenOnboarding({ onStart, onBrowse, reduced }) {
  return (
    <>
      <div className="hy-onb">
        <div className="hy-onb-head"><OnboardingLogo /><LangToggle /></div>
        <div className="hy-onb-copy">
          {tr(
            <h1 className="hy-h1">오늘의 지혜를<br />슬쩍 빌려<br />보세요</h1>,
            <h1 className="hy-h1">Borrow a little<br />wisdom<br />for today</h1>
          )}
          {tr(
            <p className="hy-sub">혼자 풀기 어려운 고민,<br />다른 시선으로 바라봐요.</p>,
            <p className="hy-sub">Worries that are hard to untangle alone —<br />see them through other eyes.</p>
          )}
        </div>
        <div className="hy-onb-art"><OnboardingArt reduced={reduced} /></div>
      </div>
      <div className="hy-bottom">
        <Btn onClick={onStart}>{tr('내 고민 꺼내기', 'Share my worry')}</Btn>
        <button className="hy-btn hy-btn-text" style={{ marginTop: 6 }} onClick={onBrowse}>{tr('먼저 둘러볼게요', 'Just looking around')}</button>
      </div>
    </>
  );
}

function ScreenHome({ flow, setFlow, startFlow, focusInput, clearFocus, today, openCheckin, go, onTab, unread, openTodayCard }) {
  const ta = useRef(null);
  const [hint, setHint] = useState(false);
  useEffect(() => { if (focusInput && ta.current) { setTimeout(() => ta.current && ta.current.focus(), 320); clearFocus(); } }, [focusInput]);
  useEffect(() => { const t = ta.current; if (t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px'; } }, [flow.worry]);
  useEffect(() => { if (!hint) return; const t = setTimeout(() => setHint(false), 2400); return () => clearTimeout(t); }, [hint]);
  const can = flow.worry.trim() || flow.chip;
  const card = hyTodayCard();
  const ct = cardT(card);
  return (
    <>
      <div className="hy-top">
        <div className="hy-top-row">
          <div className="hy-logo-wrap"><Logo h={28} /></div>
          <div className="hy-top-actions">
            <button className="hy-ibtn" onClick={() => go('notifications')} aria-label={tr('알림', 'Notifications')}><Ic.bell />{unread ? <span className="badge" /> : null}</button>
            <LangToggle />
          </div>
        </div>
      </div>
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 18 }}>오늘은 어떤 고민이<br />있나요?</h2>,
            <h2 className="hy-h2" style={{ marginTop: 18 }}>What’s on your mind<br />today?</h2>)}
        <div className="hy-input" style={{ marginTop: 22 }}>
          <Ic.pencil />
          <textarea ref={ta} rows={1} maxLength={140} value={flow.worry} placeholder={tr('지금 떠오르는 고민을 적어 주세요', 'Write down whatever’s worrying you')}
            aria-label={tr('고민 입력', 'Your worry')}
            onChange={(e) => setFlow({ worry: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); if (can) startFlow(); else setHint(true); } }} />
        </div>
        <div className="hy-chips">
          {HY_CHIPS.map(c => <button key={c} className={'hy-chip' + (flow.chip === c ? ' on' : '')} onClick={() => setFlow({ chip: flow.chip === c ? null : c })} aria-pressed={flow.chip === c}>{tTopic(c)}</button>)}
        </div>
        <div style={{ marginTop: 18 }}>
          {hint ? <div className="hy-hint hy-fade">{tr('고민을 적거나 주제를 하나 골라 주세요', 'Write a worry or pick a topic')}</div> : null}
          <Btn disabled={!can} onDisabled={() => setHint(true)} onClick={startFlow}>{tr('나에게 맞는 지혜 찾기', 'Find wisdom for me')}</Btn>
        </div>

        <div className="hy-sec"><h3>{tr('오늘 슬쩍 빌릴 지혜', 'Wisdom to borrow today')}</h3><button className="hy-more" onClick={() => onTab('explore')}>{tr('더 보기', 'More')} <Ic.chev /></button></div>
        <button className="hy-card hy-today-card" onClick={() => openTodayCard(card)}>
          <Orbs />
          <span className="hy-tag">{card.kind === 'idiom' ? tr('오늘의 ' + card.contentType, 'Today’s idiom') : tr('새로운 관점', 'A new lens')}</span>
          <div className="t">{ct.title}</div>
          <div className="d">{ct.easyExplanation}</div>
          <div className="f"><span className="hy-cap">{hyCardSource(card)}</span><span className="hy-round"><Ic.arrow /></span></div>
        </button>

        <div className="hy-sec"><h3>{tr('오늘의 작은 실천', 'Today’s small step')}</h3></div>
        {today ? (
          <div className="hy-practice">
            <span className={'circle' + (today.status ? ' done' : '')}>{today.status ? <Ic.check /> : null}</span>
            <div className="txt">
              <div className="a">{hyActionText(today.action)}</div>
              <div className="m">{today.status ? tr(`체크인 완료 · ${hyStatus(today.status)}`, `Checked in · ${hyStatus(today.status)}`) : tr(`약 ${today.action.minutes}분이면 충분해요`, `About ${today.action.minutes} min is enough`)}</div>
            </div>
            <button className="hy-pill-btn" onClick={() => openCheckin(today.id)}>{today.status ? tr('기록 보기', 'View') : tr('체크인', 'Check in')}</button>
          </div>
        ) : (
          <div className="hy-empty-practice">
            <p>{tr('아직 정한 실천이 없어요', 'No step set yet')}</p>
            <span>{tr('고민을 적으면 1–5분짜리 작은 실천을 함께 정해요.', 'Write a worry and we’ll pick a 1–5 minute step together.')}</span>
            <button className="hy-link" onClick={() => ta.current && ta.current.focus()}>{tr('고민 적고 시작하기', 'Write a worry to start')} <Ic.chev /></button>
          </div>
        )}
      </div>
      <Tabbar active="home" onTab={onTab} />
    </>
  );
}

function ScreenExplore({ onTab, pickFromExplore, topic, setTopic }) {
  const list = HY_CARDS.filter(c => topic === '전체' || c.topics.includes(topic));
  return (
    <>
      <div className="hy-top"><div className="hy-top-row"><div className="hy-top-title" style={{ paddingLeft: 12 }}>{tr('지혜 탐색', 'Explore')}</div><LangToggle /></div></div>
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 8 }}>마음에 드는 지혜를<br />골라 보세요</h2>,
            <h2 className="hy-h2" style={{ marginTop: 8 }}>Pick the wisdom<br />that speaks to you</h2>)}
        <p className="hy-sub sm">{tr('고르면 바로 함께 빌릴 관점을 찾아 드려요.', 'Choose one and we’ll find a perspective to borrow with it.')}</p>
        <div className="hy-filter" style={{ marginTop: 18 }}>
          {['전체', ...HY_TOPICS.map(t => t.id)].map(t => <button key={t} className={'hy-chip' + (topic === t ? ' on' : '')} onClick={() => setTopic(t)}>{t === '전체' ? tr('전체', 'All') : tTopic(t)}</button>)}
        </div>
        <div className="hy-wlist" style={{ marginTop: 18 }} key={topic}>
          {list.map((c, i) => <WisdomCard key={c.id} card={c} delay={Math.min(i, 8) * 60} onClick={() => pickFromExplore(c, topic === '전체' ? null : topic)} />)}
        </div>
      </div>
      <Tabbar active="explore" onTab={onTab} />
    </>
  );
}

function StatusPill({ s }) {
  if (!s) return <span className="hy-st none">{tr('체크인 전', 'Not checked in')}</span>;
  return <span className={'hy-st ' + s}>{hyStatus(s)}</span>;
}

// 기록은 저장 당시 텍스트를 쓰되, 원본 id가 있으면 현재 언어로 다시 표시
function recCardTitle(r) { const c = hyCard(r.cardId); return c ? cardT(c).title : r.cardTitle; }
function recCardType(r) { const c = hyCard(r.cardId); return c ? tType(c.contentType) : r.cardType; }
function recPersona(r) { const p = hyPersona(r.personaId); return p ? personaT(p) : { name: r.personaName, lens: r.personaLens }; }

function ScreenRecords({ records, onTab, openRecord, newWorry }) {
  const groups = [];
  records.forEach(r => { const l = hyGroupLabel(r.date); let g = groups.find(x => x.l === l); if (!g) { g = { l, items: [] }; groups.push(g); } g.items.push(r); });
  const done = records.filter(r => r.status === 'done' || r.status === 'partial').length;
  const lenses = new Set(records.map(r => r.personaId)).size;
  return (
    <>
      <div className="hy-top"><div className="hy-top-row"><div className="hy-top-title" style={{ paddingLeft: 12 }}>{tr('내 기록', 'Records')}</div><LangToggle /></div></div>
      <div className="hy-scroll">
        {records.length === 0 ? (
          <div className="hy-empty">
            <Orbs lg />
            <h3 className="hy-h3">{tr('아직 기록이 없어요', 'No records yet')}</h3>
            {tr(<p className="hy-sub sm">고민 하나를 꺼내 작은 실천을 정하면<br />여기에 차곡차곡 쌓여요.</p>,
                <p className="hy-sub sm">Share a worry and set a small step —<br />they’ll pile up here.</p>)}
            <div style={{ width: '100%', marginTop: 28 }}><Btn onClick={newWorry}>{tr('첫 고민 꺼내기', 'Share my first worry')}</Btn></div>
          </div>
        ) : (
          <>
            <h2 className="hy-h2" style={{ marginTop: 8 }}>{tr('빌려 쓴 지혜들', 'Wisdom I’ve borrowed')}</h2>
            <div className="hy-stats">
              <div><b>{records.length}</b><span>{tr('기록', 'Records')}</span></div>
              <div><b>{done}</b><span>{tr('실천', 'Done')}</span></div>
              <div><b>{lenses}</b><span>{tr('빌린 관점', 'Lenses')}</span></div>
            </div>
            {groups.map(g => (
              <div className="hy-group" key={g.l}>
                <div className="gl">{g.l}</div>
                {g.items.map(r => (
                  <button className="hy-rec" key={r.id} onClick={() => openRecord(r.id)}>
                    <div className="tp"><span className="kw">{recCardTitle(r)} · {tr(`${recPersona(r).name}의 관점`, `${recPersona(r).name}’s lens`)}</span><StatusPill s={r.status} /></div>
                    <div className="ac">{hyActionText(r.action)}</div>
                    {r.worry ? <div className="mt">{r.worry}</div> : null}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
      <Tabbar active="records" onTab={onTab} />
    </>
  );
}

function ScreenRecordDetail({ rec, back, redo, newWorry, openCheckin }) {
  if (!rec) return <><Header onBack={back} title={tr('기록', 'Record')} /><div className="hy-scroll"><p className="hy-sub">{tr('기록을 찾을 수 없어요.', 'Record not found.')}</p></div></>;
  const per = recPersona(rec);
  const min = (m) => tr(`약 ${m}분`, `about ${m} min`);
  const rows = [
    [tr('날짜', 'Date'), hyDate(rec.date)],
    rec.worry ? [tr('고민', 'Worry'), rec.worry] : null,
    [tr('키워드', 'Keywords'), [tTopic(rec.topic), ...(rec.keywords || []).map(tKw)].join(' · ')],
    [tr('지혜', 'Wisdom'), `${recCardTitle(rec)} (${recCardType(rec)})`],
    [tr('빌린 관점', 'Lens'), `${per.name} — ${per.lens}`],
    ...rec.qa.map((x, i) => [i === 0 ? tr('질문과 답', 'Q & A') : tr('질문 2', 'Question 2'), <><span style={{ color: 'var(--sub)', fontSize: 13.5 }}>{x.q}</span><br />{x.a || '—'}</>]),
    [tr('실천', 'Step'), `${hyActionText(rec.action)} · ${min(rec.action.minutes)}`],
    [tr('실천 상태', 'Status'), rec.status ? hyStatus(rec.status) : tr('체크인 전', 'Not checked in')],
    rec.memo ? [tr('메모', 'Note'), rec.memo] : null,
    rec.nextAction ? [tr('다음 행동', 'Next step'), `${hyActionText(rec.nextAction)} · ${min(rec.nextAction.minutes)}`] : null,
  ].filter(Boolean);
  return (
    <>
      <Header onBack={back} title={tr('기록', 'Record')} />
      <div className="hy-scroll">
        <div style={{ marginTop: 8 }}><StatusPill s={rec.status} /></div>
        <h2 className="hy-h2" style={{ marginTop: 10, fontSize: 22 }}>{hyActionText(rec.action)}</h2>
        <dl className="hy-dl">{rows.map(([k, v], i) => <div key={i}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div>
      <div className="hy-bottom hy-btn-row">
        {rec.status ? <Btn onClick={() => redo(rec)}>{tr('다시 실천하기', 'Try it again')}</Btn> : <Btn onClick={() => openCheckin(rec.id)}>{tr('저녁 체크인 하기', 'Evening check-in')}</Btn>}
        <Btn variant="line" onClick={newWorry}>{tr('새 고민 시작하기', 'Start a new worry')}</Btn>
      </div>
    </>
  );
}

function ScreenNotifications({ back, notes, openCheckin, markRead, go }) {
  useEffect(() => { return () => markRead(); }, []);
  return (
    <>
      <Header onBack={back} title={tr('알림', 'Notifications')} right={<button className="hy-ibtn" onClick={() => go('settings')} aria-label={tr('설정', 'Settings')}><Ic.gear /></button>} />
      <div className="hy-scroll">
        {notes.length === 0 ? (
          <div className="hy-empty"><Orbs lg /><h3 className="hy-h3">{tr('새 알림이 없어요', 'No new notifications')}</h3><p className="hy-sub sm">{tr('실천을 정하면 저녁 체크인을 알려 드려요.', 'Set a step and we’ll remind you to check in tonight.')}</p></div>
        ) : notes.map(n => (
          <button className="hy-row" key={n.id} onClick={() => n.recId && openCheckin(n.recId)} disabled={!n.recId}>
            <span className={'dot' + (n.unread ? '' : ' off')} />
            <div className="tx"><b>{n.title}</b><span>{n.body}</span></div>
            {n.recId ? <Ic.chev className="chev" /> : null}
          </button>
        ))}
      </div>
    </>
  );
}

function ScreenSettings({ back, replayOnboarding, resetAll }) {
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { if (!confirm) return; const t = setTimeout(() => setConfirm(false), 3000); return () => clearTimeout(t); }, [confirm]);
  return (
    <>
      <Header onBack={back} title={tr('설정', 'Settings')} />
      <div className="hy-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="hy-row" style={{ cursor: 'default' }}><div className="tx"><b>{tr('언어', 'Language')}</b><span>{tr('한국어 / English', 'Korean / English')}</span></div><LangToggle /></div>
        <button className="hy-row" onClick={replayOnboarding}><div className="tx"><b>{tr('온보딩 다시 보기', 'Replay onboarding')}</b><span>{tr('처음 화면을 다시 볼 수 있어요', 'See the welcome screen again')}</span></div><Ic.chev className="chev" /></button>
        <button className="hy-row" onClick={() => { if (confirm) { resetAll(); setConfirm(false); } else setConfirm(true); }}>
          <div className="tx"><b style={confirm ? { color: 'var(--red)' } : null}>{confirm ? tr('한 번 더 누르면 모두 지워져요', 'Tap again to erase everything') : tr('모든 기록 지우기', 'Erase all records')}</b><span>{tr('이 기기에 저장된 기록과 진행 중인 고민을 지워요', 'Clears records and the current worry on this device')}</span></div>
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '40px 0 8px' }}>
          <Logo h={32} />
          <span className="hy-cap">{tr('오늘의 지혜를 슬쩍 빌려 보세요', 'Borrow a little wisdom for today')}</span>
        </div>
      </div>
    </>
  );
}

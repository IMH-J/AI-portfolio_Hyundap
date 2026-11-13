// 현답 — 플로우: 키워드 → 지혜 → 인물 → 질문 → 실천, 체크인

function ScreenKeywords({ flow, setFlow, go, back }) {
  const detected = !!flow.detectedTopic;
  const kwMap = flow.topic ? HY_KEYWORDS[flow.topic] : null;
  const toggle = (k) => {
    const has = flow.keywords.includes(k);
    if (has) setFlow({ keywords: flow.keywords.filter(x => x !== k) });
    else if (flow.keywords.length < 3) setFlow({ keywords: [...flow.keywords, k] });
  };
  const pickTopic = (t) => { if (t === flow.topic) return; setFlow({ topic: t, keywords: [Object.keys(HY_KEYWORDS[t])[0]] }); };
  return (
    <>
      <Header onBack={back} step={1} />
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 8 }}>어떤 마음에<br />가까운가요?</h2>,
            <h2 className="hy-h2" style={{ marginTop: 8 }}>Which feeling<br />is closest?</h2>)}
        {flow.worry.trim() ? <div className="hy-quote" style={{ marginTop: 20 }}><span>{tr('나의 고민', 'My worry')}</span><p>{flow.worry.trim()}</p></div> : null}
        <span className="hy-label">{tr('주제', 'Topic')}</span>
        {!detected ? <div className="hy-notice">{tr('딱 맞는 예시를 찾지 못했어요. 어떤 쪽에 가까운지 직접 골라 주세요.', 'We couldn’t find a close match. Please pick the one that feels closest.')}</div> : null}
        <div className="hy-topic-grid">
          {HY_TOPICS.map(t => (
            <button key={t.id} className={'hy-topic' + (flow.topic === t.id ? ' on' : '')} onClick={() => pickTopic(t.id)} aria-pressed={flow.topic === t.id}>
              <b>{tTopic(t.id)}</b><span>{tTopicDesc(t)}</span>
            </button>
          ))}
        </div>
        {kwMap ? (
          <div className="hy-fade" key={flow.topic}>
            <span className="hy-label">{tr('키워드', 'Keywords')} <span style={{ color: 'var(--muted)' }}>· {tr('최대 3개', 'up to 3')}</span></span>
            <div className="hy-kw-grid">
              {Object.keys(kwMap).map(k => (
                <button key={k} className={'hy-kw' + (flow.keywords.includes(k) ? ' on' : '')} onClick={() => toggle(k)} aria-pressed={flow.keywords.includes(k)}>
                  {flow.keywords.includes(k) ? <Ic.check /> : null}{tKw(k)}
                </button>
              ))}
            </div>
            <div className="hy-kw-desc">
              {flow.keywords.map(k => <div key={k}><b>{tKw(k)}</b>{tKwMeaning(flow.topic, k)}</div>)}
            </div>
          </div>
        ) : null}
      </div>
      <div className="hy-bottom">
        <Btn disabled={!flow.topic || !flow.keywords.length} onClick={() => go('wisdom')}>{tr('지혜 살펴보기', 'See wisdom')}</Btn>
      </div>
    </>
  );
}

function ScreenWisdom({ flow, setFlow, go, back }) {
  const pages = useMemo(() => hyCardPages(flow), [flow.topic, flow.keywords.join(','), flow.scenario]);
  const page = Math.min(flow.cardPage || 0, pages.length - 1);
  const list = pages[page] || [];
  const stale = flow.cardId && !pages.some(p => p.some(c => c.id === flow.cardId));
  return (
    <>
      <Header onBack={back} step={2} />
      <div className="hy-scroll">
        <div className="hy-eyebrow" style={{ marginTop: 8 }}>{tTopic(flow.topic)} · {flow.keywords.map(tKw).join(', ')}</div>
        {tr(<h2 className="hy-h2" style={{ marginTop: 6 }}>이 고민에 어울리는<br />지혜를 골라 보세요</h2>,
            <h2 className="hy-h2" style={{ marginTop: 6 }}>Pick the wisdom<br />that fits this worry</h2>)}
        {stale ? <div className="hy-notice" style={{ marginTop: 16, marginBottom: 0 }}>{tr('키워드가 바뀌어서 이전에 고른 지혜가 목록에 없어요. 다시 골라 주세요.', 'Your keywords changed, so your earlier pick isn’t listed. Please choose again.')}</div> : null}
        <div className="hy-wlist" style={{ marginTop: 20 }} key={page}>
          {list.map((c, i) => <WisdomCard key={c.id} card={c} delay={i * 60} on={flow.cardId === c.id} onClick={() => setFlow({ cardId: c.id, personaId: null, personaPage: 0 })} />)}
        </div>
        {pages.length > 1 ? (
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button className="hy-btn hy-btn-text" style={{ width: 'auto', padding: '0 12px' }} onClick={() => setFlow({ cardPage: (page + 1) % pages.length })}>
              {tr('다른 지혜 보기', 'Show other wisdom')} <span style={{ fontVariantNumeric: 'tabular-nums', marginLeft: 4 }}>{page + 1}/{pages.length}</span>
            </button>
          </div>
        ) : null}
      </div>
      <div className="hy-bottom">
        <Btn disabled={!flow.cardId || stale} onClick={() => go('persona')}>{tr('이 지혜로 생각하기', 'Think with this')}</Btn>
      </div>
    </>
  );
}

function ScreenPersona({ flow, setFlow, go, back, reduced }) {
  const card = hyCard(flow.cardId);
  const ct = cardT(card);
  const pages = useMemo(() => hyPersonaPages(card, flow.keywords), [flow.cardId, flow.keywords.join(',')]);
  const page = Math.min(flow.personaPage || 0, pages.length - 1);
  const list = pages[page] || [];
  const sel = hyPersona(flow.personaId);
  return (
    <>
      <Header onBack={back} step={3} />
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 8 }}>누구의 관점을<br />빌려 볼까요?</h2>,
            <h2 className="hy-h2" style={{ marginTop: 8 }}>Whose perspective<br />will you borrow?</h2>)}
        <p className="hy-sub sm">{tr(`‘${ct.title}’과 함께 빌려 볼 만한 관점이에요.`, `Perspectives worth borrowing with ‘${ct.title}’.`)}</p>
        <div className="hy-stage">
          <PersonaOrb persona={sel} reduced={reduced} />
          <div className="hy-stage-desc">{sel ? personaT(sel).lens : ''}</div>
        </div>
        <div className="hy-plist">
          {list.map(p => { const pt = personaT(p); return (
            <button key={p.id} className={'hy-pbtn' + (flow.personaId === p.id ? ' on' : '')} onClick={() => setFlow({ personaId: p.id })} aria-pressed={flow.personaId === p.id}>
              <div className="n">{pt.name}</div>
              <div className="l">{pt.lens}</div>
              <div className="r">{hyReason(p, card, flow.keywords)}</div>
              <span className="hy-check"><Ic.check /></span>
            </button>
          ); })}
        </div>
        {pages.length > 1 ? (
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button className="hy-btn hy-btn-text" style={{ width: 'auto', padding: '0 12px' }} onClick={() => setFlow({ personaPage: (page + 1) % pages.length })}>
              {tr('다른 관점 보기', 'Show other perspectives')} <span style={{ fontVariantNumeric: 'tabular-nums', marginLeft: 4 }}>{page + 1}/{pages.length}</span>
            </button>
          </div>
        ) : null}
      </div>
      <div className="hy-bottom">
        <Btn disabled={!flow.personaId} onClick={() => go('question')}>{tr('이 관점 빌리기', 'Borrow this lens')}</Btn>
      </div>
    </>
  );
}

function ScreenQuestion({ flow, setFlow, go, back }) {
  const pt = personaT(hyPersona(flow.personaId));
  const qs = hyQuestions(flow);
  const key = flow.personaId + '|' + flow.cardId;
  const ans = (flow.answers && flow.answers[key]) || ['', ''];
  const setAns = (i, v) => { const a = [...ans]; a[i] = v; setFlow({ answers: { ...flow.answers, [key]: a } }); };
  const [showEx, setShowEx] = useState(false);
  return (
    <>
      <Header onBack={back} step={4} />
      <div className="hy-scroll">
        <div className="hy-persona-strip" style={{ marginTop: 8 }}>
          <div className="av">{pt.name.slice(0, 1)}</div>
          <div><b>{tr(`${pt.name}의 관점`, `${pt.name}’s lens`)}</b><span>{pt.lens}</span></div>
        </div>
        {qs.map((q, i) => (
          <div className="hy-q" key={i}>
            <div className="from">{q.from}{q.required ? '' : tr(' · 선택', ' · optional')}</div>
            <h3>{q.q}</h3>
            <textarea className="hy-ta" rows={3} maxLength={200} value={ans[i] || ''} placeholder={i === 0 ? tr('떠오르는 대로 적어 보세요', 'Write whatever comes to mind') : tr('적고 싶을 때만 적어도 괜찮아요', 'Only if you feel like it')}
              onChange={(e) => setAns(i, e.target.value)} aria-label={q.q} />
            <div className="hy-count">{(ans[i] || '').length}/200</div>
            {q.ex ? (
              <div className="hy-ex-toggle">
                <button className="hy-link" style={{ color: 'var(--sub)' }} onClick={() => setShowEx(!showEx)}>{tr('예시 보기', 'See an example')} <Ic.chev style={{ transform: showEx ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} /></button>
                {showEx ? <button className="hy-ex hy-fade" onClick={() => setAns(0, q.ex)}><em>{tr('눌러서 채우기', 'Tap to fill in')}</em>{q.ex}</button> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="hy-bottom">
        <Btn disabled={!(ans[0] || '').trim()} onClick={() => go('action')}>{tr('오늘의 실천 만들기', 'Make today’s step')}</Btn>
      </div>
    </>
  );
}

function ScreenAction({ flow, setFlow, back, commit, lang }) {
  const pt = personaT(hyPersona(flow.personaId));
  const key = flow.personaId + '|' + flow.cardId;
  const alts = hyActions(flow);
  // 언어가 바뀌어 기본 제안을 그대로 쓰는 중이면 새 언어로 교체
  useEffect(() => {
    const k = key + '|' + lang;
    if (!flow.action || flow.actionKey !== k) {
      if (flow.action && flow.actionKey && flow.actionKey.split('|').slice(0, 2).join('|') === key && flow.actionEdited) { setFlow({ actionKey: k }); return; }
      const a = alts[0]; setFlow({ action: { when: a.when, what: a.what, minutes: a.minutes }, actionKey: k, actionEdited: false });
    }
  }, [key, lang]);
  const a = flow.action || alts[0];
  const ans = ((flow.answers && flow.answers[key]) || [])[0];
  const set = (patch, edited = true) => setFlow({ action: { ...a, ...patch }, actionEdited: edited });
  return (
    <>
      <Header onBack={back} step={5} />
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 8 }}>{pt.name}의 관점으로<br />이렇게 해 볼까요?</h2>,
            <h2 className="hy-h2" style={{ marginTop: 8 }}>Try this through<br />{pt.name}’s lens?</h2>)}
        {ans ? <div className="hy-answer"><span>{tr('내 답', 'My answer')}</span><p>{ans}</p></div> : null}
        <div className="hy-action-card">
          <span className="hy-tag">{tr(`오늘의 작은 실천 · 약 ${a.minutes}분`, `Today’s small step · about ${a.minutes} min`)}</span>
          <div className="hy-preview">{hyActionText(a) || tr('무엇을 해 볼지 적어 주세요', 'Write what you’ll try')}</div>
          <div className="hy-field"><label htmlFor="f-when">{tr('언제 · 상황', 'When · situation')}</label><input id="f-when" value={a.when || ''} maxLength={40} onChange={(e) => set({ when: e.target.value })} placeholder={tr('예: 점심 먹고', 'e.g. After lunch')} /></div>
          <div className="hy-field"><label htmlFor="f-what">{tr('무엇을 · 행동과 분량', 'What · action and amount')}</label><textarea id="f-what" rows={2} value={a.what} maxLength={100} onChange={(e) => set({ what: e.target.value })} placeholder={tr('예: 할 말 3줄 적기', 'e.g. Write 3 lines of what to say')} /></div>
          <div className="hy-field"><label>{tr('얼마나', 'How long')}</label>
            <div className="hy-mins">{[1, 2, 3, 4, 5].map(m => <button key={m} className={'hy-min' + (a.minutes === m ? ' on' : '')} onClick={() => set({ minutes: m })}>{tr(m + '분', m + ' min')}</button>)}</div>
          </div>
        </div>
        <span className="hy-label">{tr('다른 실천도 있어요', 'Other ideas')}</span>
        <div className="hy-alt">
          {alts.map((x, i) => <button key={i} onClick={() => set({ when: x.when, what: x.what, minutes: x.minutes }, false)}><em>{x.src}</em>{hyActionText(x)} · {tr(x.minutes + '분', x.minutes + ' min')}</button>)}
        </div>
      </div>
      <div className="hy-bottom">
        <Btn disabled={!a.what || !a.what.trim()} onClick={commit}>{tr('오늘 해볼게요', 'I’ll try it today')}</Btn>
      </div>
    </>
  );
}

function ScreenCheckin({ rec, back, save }) {
  const [status, setStatus] = useState(rec ? rec.status : null);
  const [memo, setMemo] = useState(rec ? rec.memo || '' : '');
  const [next, setNext] = useState(() => rec && rec.nextAction ? rec.nextAction : (rec ? { when: rec.action.when, what: '', minutes: 1 } : null));
  if (!rec) return <><Header onBack={back} title={tr('저녁 체크인', 'Evening check-in')} /><div className="hy-scroll"><p className="hy-sub">{tr('기록을 찾을 수 없어요.', 'Record not found.')}</p></div></>;
  const per = recPersona(rec);
  const smallerWhat = () => tr('처음 1분만 ' + rec.action.what.replace(/\d+분/, '1분'), 'Just the first minute: ' + rec.action.what);
  return (
    <>
      <Header onBack={back} title={tr('저녁 체크인', 'Evening check-in')} />
      <div className="hy-scroll">
        {tr(<h2 className="hy-h2" style={{ marginTop: 8 }}>오늘의 실천,<br />해 보셨나요?</h2>,
            <h2 className="hy-h2" style={{ marginTop: 8 }}>Did you try<br />today’s step?</h2>)}
        <div className="hy-practice" style={{ marginTop: 18 }}>
          <span className="circle" />
          <div className="txt"><div className="a">{hyActionText(rec.action)}</div><div className="m">{recCardTitle(rec)} · {tr(`${per.name}의 관점 · 약 ${rec.action.minutes}분`, `${per.name}’s lens · about ${rec.action.minutes} min`)}</div></div>
        </div>
        <div className="hy-status">
          {Object.keys(HY_STATUS).map(k => <button key={k} className={status === k ? 'on' : ''} onClick={() => { setStatus(k); if (k === 'missed' && !next.what) setNext({ ...next, what: smallerWhat(), minutes: 1 }); }} aria-pressed={status === k}>{hyStatus(k)}</button>)}
        </div>
        {status ? (
          <div className="hy-fade">
            <span className="hy-label">{status === 'missed' ? tr('어떤 점이 어려웠나요?', 'What made it hard?') : tr('해보니 무엇이 달랐나요?', 'What felt different?')}</span>
            <textarea className="hy-ta" rows={3} maxLength={200} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder={tr('짧게 적어도 충분해요', 'A few words is enough')} />
            <div className="hy-count">{memo.length}/200</div>
            {status === 'missed' ? (
              <div className="hy-action-card">
                <span className="hy-tag">{tr('다음엔 더 작게', 'Smaller next time')}</span>
                <div className="hy-field"><label htmlFor="n-when">{tr('언제', 'When')}</label><input id="n-when" value={next.when || ''} onChange={(e) => setNext({ ...next, when: e.target.value })} /></div>
                <div className="hy-field"><label htmlFor="n-what">{tr('무엇을', 'What')}</label><textarea id="n-what" rows={2} value={next.what} onChange={(e) => setNext({ ...next, what: e.target.value })} /></div>
                <div className="hy-field"><label>{tr('얼마나', 'How long')}</label>
                  <div className="hy-mins">{[1, 2, 3, 4, 5].map(m => <button key={m} className={'hy-min' + (next.minutes === m ? ' on' : '')} onClick={() => setNext({ ...next, minutes: m })}>{tr(m + '분', m + ' min')}</button>)}</div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="hy-bottom">
        <Btn disabled={!status} onClick={() => save(rec.id, status, memo.trim(), status === 'missed' && next.what.trim() ? { ...next, what: next.what.trim() } : null)}>{tr('기록 저장', 'Save')}</Btn>
      </div>
    </>
  );
}

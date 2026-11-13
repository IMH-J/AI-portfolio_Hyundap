// 현답 — 한/영 이중 언어 지원
// 전역 HY_LANG 은 App 렌더 시 갱신되며, 모든 화면이 함께 다시 렌더링됩니다.
let HY_LANG = 'ko';
const tr = (ko, en) => (HY_LANG === 'en' ? en : ko);

const HY_EN = {
  topics: {
    불안: ['Anxiety', 'I feel worried and tense'],
    관계: ['Relationships', 'People feel hard right now'],
    진로: ['Career', 'I’m unsure of my direction'],
    자신감: ['Confidence', 'I feel small'],
    습관: ['Habits', 'Keeping at it is hard'],
    창의: ['Creativity', 'My ideas feel stuck'],
  },
  kwNames: {
    걱정: 'Worry', 긴장: 'Nerves', 불확실: 'Uncertainty', 실수: 'Mistakes',
    갈등: 'Conflict', 오해: 'Misunderstanding', 거리감: 'Distance', 도움: 'Help',
    선택: 'Choice', 방향: 'Direction', 준비: 'Preparation', 비교: 'Comparison',
    실패: 'Failure', 인정: 'Self-acceptance', 도전: 'Challenge',
    미루기: 'Procrastination', 꾸준함: 'Consistency', 집중: 'Focus', 시작: 'Getting started',
    아이디어: 'Ideas', 막힘: 'Feeling stuck', 관찰: 'Observation', 새로움: 'Fresh eyes',
  },
  kwMeanings: {
    불안: { 걱정: 'Picturing things that haven’t happened yet', 긴장: 'Body and mind tightening before a big moment', 불확실: 'Frustration of not knowing the outcome', 실수: 'Fear of getting it wrong or messing up' },
    관계: { 갈등: 'Thoughts or feelings clashing', 오해: 'A gap from reading things differently', 거리감: 'Feeling it’s hard to get close, or drifting apart', 도움: 'Asking for or sharing support' },
    진로: { 선택: 'Having to pick one path among many', 방향: 'Deciding where to head next', 준비: 'Getting ready for what’s ahead', 비교: 'Measuring my pace against others’' },
    자신감: { 실패: 'Things not going as hoped', 비교: 'Feeling smaller next to others', 인정: 'Telling myself I’m okay as I am', 도전: 'Courage to try something unfamiliar' },
    습관: { 미루기: 'Pushing tasks to later, again', 꾸준함: 'The strength to keep small things going', 집중: 'Gathering your mind on one thing', 시작: 'Taking the very first step' },
    창의: { 아이디어: 'Coming up with something new', 막힘: 'When thinking won’t move forward', 관찰: 'Discovering by looking closely', 새로움: 'Seeing the familiar differently' },
  },
  types: {
    고사성어: 'Classical idiom', 사자성어: 'Four-character idiom', '스토아적 관점': 'Stoic view',
    '관계의 지혜': 'Relational wisdom', '질문의 지혜': 'Wisdom of questions', '관찰의 지혜': 'Wisdom of observation',
    '실천의 지혜': 'Practical wisdom', '마음의 지혜': 'Wisdom of the mind',
  },
  cards: {
    saeong: { title: 'The Old Man’s Horse', roman: 'Saeongjima', meaning: 'Good and bad fortune can’t be known in advance.', ex: 'No one knows where something that looks bad today may lead. Take a step back before deciding the ending.', q: 'What different meaning could this situation have later on?', a: { when: 'Before bed', what: 'Write one other way today’s worry could turn out', minutes: 2 } },
    jeonhwa: { title: 'Turning Misfortune Around', roman: 'Jeonhwawibok', meaning: 'A bad thing can turn into a good one.', ex: 'Even hard moments can hide a lesson or a next chance. Look for what you can take away.', q: 'What is one thing from this you can use next time?', a: { when: 'This evening', what: 'Write one line about what I learned', minutes: 2 } },
    yeokji: { title: 'Trading Places', roman: 'Yeokjisaji', meaning: 'Think by putting yourself in the other’s position.', ex: 'Standing in someone else’s spot for a moment can reveal what you couldn’t see.', q: 'How might this look from the other person’s side?', a: { when: 'Before the next talk', what: 'Write three things the other person may have been thinking', minutes: 3 } },
    hwai: { title: 'Harmony Without Sameness', roman: 'Hwaibudong', meaning: 'Get along without having to become the same.', ex: 'You can stay close even when you think differently. Find a way to hold the difference together.', q: 'How far is it okay for us to be different?', a: { when: 'Sometime today', what: 'Write one thing we share and one thing we don’t', minutes: 2 } },
    ongo: { title: 'Learn the Old, Know the New', roman: 'Ongojisin', meaning: 'Studying the past helps you understand the new.', ex: 'What you’ve already tried, and what others went through first, can hint at a new path.', q: 'When you faced something similar, what helped?', a: { when: 'After lunch', what: 'Recall and write down one time things went well', minutes: 3 } },
    yubi: { title: 'Prepared, Without Worry', roman: 'Yubimuhwan', meaning: 'Preparing ahead eases worry.', ex: 'The smallest way to shrink a worry is to prepare one thing you can do right now.', q: 'What is the smallest thing you can prepare right now?', a: { when: 'This afternoon', what: 'Make a 3-line list of things to prepare or say', minutes: 3 } },
    gojin: { title: 'Sweetness After Bitterness', roman: 'Gojingamnae', meaning: 'When the bitter ends, the sweet arrives.', ex: 'So your effort doesn’t feel wasted, look back once at how far you’ve come.', q: 'What would you say to yourself for holding on this far?', a: { when: 'Before bed', what: 'Write three things I got done this week', minutes: 3 } },
    sipsi: { title: 'Ten Spoons Make a Bowl', roman: 'Sipsiilban', meaning: 'Small help from many adds up to a lot.', ex: 'You don’t have to do it all alone. Sharing small help often makes things easier than expected.', q: 'Whom could you ask, or offer, a small bit of help?', a: { when: 'Sometime today', what: 'Draft a one-sentence message asking for help', minutes: 2 } },
    ugong: { title: 'The Old Man Who Moved Mountains', roman: 'Ugongisan', meaning: 'Steady effort can move even a mountain.', ex: 'Even big tasks change when tiny steps stack up daily. Dig just one shovel today.', q: 'What is the smallest step you can take today?', a: { when: 'Right now', what: 'Start a postponed task for just one minute', minutes: 1 } },
    ilchwi: { title: 'Growing Day by Day', roman: 'Ilchwiwoljang', meaning: 'Growing and advancing every day and month.', ex: 'Being a little better than yesterday is growth too. Notice the small changes.', q: 'What got a little better than yesterday?', a: { when: 'Before bed', what: 'Write one thing that improved today', minutes: 1 } },
    jeolcha: { title: 'Cut, Carve, Polish', roman: 'Jeolchatakma', meaning: 'Refine steadily, like cutting and polishing jade.', ex: 'It doesn’t need to be perfect at first. Make a rough draft and polish it bit by bit.', q: 'If you could refine just one part of this idea, which would it be?', a: { when: 'Sometime today', what: 'Rewrite just one sentence in my draft', minutes: 3 } },
    gwayu: { title: 'Too Much Is Like Too Little', roman: 'Gwayubulgeup', meaning: 'Overdoing is as bad as falling short.', ex: 'If you’re trying too hard, it’s okay to ease off. Look for the right amount.', q: 'What would be okay to do a little less of right now?', a: { when: 'This afternoon', what: 'Move one of today’s tasks to tomorrow', minutes: 1 } },
    p_control: { title: 'Focus on What’s Yours', meaning: 'A way of thinking that puts energy into what you can change.', ex: 'Separating what you can and can’t change makes it clear where to spend your energy.', q: 'Which part of this is in your hands?', a: { when: 'Sometime today', what: 'Circle one thing I can actually change', minutes: 2 } },
    p_fact: { title: 'Separate Worry From Fact', meaning: 'Telling apart what happened from what you imagined.', ex: 'How much of the worry in your head has actually happened? Split facts from imagination.', q: 'Among your worries, what has actually been confirmed?', a: { when: 'Right now', what: 'Fold a page in half and list facts vs. worries', minutes: 3 } },
    p_why: { title: 'Ask for the Evidence', meaning: 'Checking your thoughts by questioning yourself.', ex: 'Asking “Is that really true?” once can loosen a thought you were sure about.', q: 'Which belief about yourself has the weakest evidence?', a: { when: 'This evening', what: 'Ask “Is that really true?” and write one counter-example', minutes: 2 } },
    p_unknown: { title: 'Start With What You Don’t Know', meaning: 'Splitting known from unknown to find the next step.', ex: 'Once you separate what you know from what you don’t, what to look into becomes clear.', q: 'What don’t you know yet for this decision?', a: { when: 'Sometime today', what: 'Write three questions I need to look into', minutes: 3 } },
    p_seat: { title: 'Sit in Their Seat', meaning: 'Not doing to others what you wouldn’t want done to you.', ex: 'Thinking of the tone you’d like to hear changes the words you offer.', q: 'If you were them, what would you want to hear?', a: { when: 'Before the next talk', what: 'Write a gentle opening sentence for them', minutes: 2 } },
    p_diff: { title: 'Leave Room for Difference', meaning: 'Not forcing different thoughts into one.', ex: 'You don’t have to merge every view — there’s room to hold both.', q: 'What is okay to stay different between you?', a: { when: 'Sometime today', what: 'Write my view and theirs side by side, one line each', minutes: 2 } },
    p_observe: { title: 'Observe Closely First', meaning: 'Holding off judgment and looking for longer.', ex: 'Look longer before judging, and you’ll spot what you missed at first.', q: 'What part of this haven’t you looked at closely yet?', a: { when: 'Sometime today', what: 'Note three things I notice for the first time', minutes: 3 } },
    p_draw: { title: 'Draw It Another Way', meaning: 'Changing how you express something to widen thinking.', ex: 'Stuck in words? Try a sketch. Stuck in sketches? Try saying it out loud.', q: 'If you drew this worry as a picture or diagram, what shape would it be?', a: { when: 'Right now', what: 'Doodle my worry on one page', minutes: 3 } },
    p_real: { title: 'Find a Small Real-World Fix', meaning: 'Looking for something concrete you can use now.', ex: 'One method you can use today helps more than a grand plan.', q: 'What could you try with only what you have now?', a: { when: 'This afternoon', what: 'Pick and note one method I can use today', minutes: 2 } },
    p_steps: { title: 'Break It Into Small Steps', meaning: 'Splitting a big task so the first step feels light.', ex: 'Break a big task down and the first step is smaller than you think.', q: 'If you split this into three steps, what is the first?', a: { when: 'Right now', what: 'Write the task as three steps', minutes: 2 } },
    p_calm: { title: 'Settle and Look Within', meaning: 'Pausing a hurried mind to check on yourself.', ex: 'Set down the rush for a moment and calmly notice how you are right now.', q: 'What state is your mind in right now?', a: { when: 'Right now', what: 'Close my eyes and take five slow breaths', minutes: 1 } },
    p_learn: { title: 'Put Today’s Learning to Use', meaning: 'Learning by actually doing, even a little.', ex: 'Trying it once today stays with you longer than just knowing it.', q: 'What did you learn recently that you could try once today?', a: { when: 'This evening', what: 'Try one thing I learned recently, within 5 minutes', minutes: 5 } },
  },
  personas: {
    seneca: { name: 'Seneca', role: 'Roman Stoic philosopher', lens: 'Focus on what’s in your hands', q: 'In this situation, what can you decide and what can’t you?', ex: { default: 'I can’t decide the result, but I can decide to prepare for 10 minutes today.', 관계: 'I can’t decide their reaction, but I can decide my first words.' }, act: { default: { when: 'This evening', what: 'Pick one thing I can control and do it', minutes: 3 }, 불안: { when: 'Before bed', what: 'Mark only the worries that are in my hands', minutes: 2 } } },
    socrates: { name: 'Socrates', role: 'Greek philosopher who thought through questions', lens: 'Examine the grounds of your thoughts', q: 'What is the evidence for that thought — and against it?', ex: { default: 'I thought “I always make mistakes,” but last week I finished a task without any.' }, act: { default: { when: 'Sometime today', what: 'Write two counter-examples to my belief', minutes: 3 } } },
    confucius: { name: 'Confucius', role: 'Thinker who valued learning and relationships', lens: 'Learn, practice, and care for relationships', q: 'What kindness could you offer first in this relationship?', ex: { default: 'I could ask how they’ve been, then calmly say I felt hurt last time.', 습관: 'I can start by trying again today what I learned yesterday.' }, act: { default: { when: 'Sometime today', what: 'Tell them one thing I’m grateful for', minutes: 2 }, 습관: { when: 'This evening', what: 'Review yesterday’s learning for 5 minutes', minutes: 5 } } },
    davinci: { name: 'Leonardo da Vinci', role: 'Renaissance artist who loved observing and noting', lens: 'Observe closely and draw it differently', q: 'If you drew this worry as a picture or diagram, what shape would it be?', ex: { default: 'I wrote my worry in the middle and linked people and tasks — the biggest cluster stood out.' }, act: { default: { when: 'Sometime today', what: 'Draw my worry as a single picture', minutes: 4 } } },
    jeong: { name: 'Jeong Yak-yong', role: 'Late-Joseon scholar of practical learning', lens: 'Find methods that work in real life', q: 'What concrete method could you try right now with what you have?', ex: { default: 'Instead of writing a résumé from scratch, I could first list my past experiences.' }, act: { default: { when: 'This afternoon', what: 'Note one usable method and try it', minutes: 3 } } },
    yi_hwang: { name: 'Yi Hwang', role: 'Joseon scholar devoted to cultivating the mind', lens: 'Settle your mind and look calmly', q: 'What state is your mind in, and what is shaking it most?', ex: { default: 'I felt rushed, like I’d ruin everything — but what shook me most was worry about the first moment.' }, act: { default: { when: 'Right now', what: 'Breathe slowly and name my feeling in one word', minutes: 2 } } },
    yi_i: { name: 'Yi I', role: 'Joseon scholar who stressed practice and reform', lens: 'Practice in small steps', q: 'If you split this into three steps, what’s the first one for today?', ex: { default: '① Gather sources ② Outline ③ Write page one. Today I’ll just gather three sources.' }, act: { default: { when: 'Right now', what: 'Do only the first step for 5 minutes', minutes: 5 }, 습관: { when: 'Right now', what: 'Do the first step of a postponed task for 2 minutes', minutes: 2 } } },
    wonhyo: { name: 'Wonhyo', role: 'Silla monk who sought to embrace differing views', lens: 'Embrace differences and look within', q: 'When you set both sides together, what do they share?', ex: { default: 'I wanted to finish fast and my friend wanted to be thorough — but we both wanted to do it well.' }, act: { default: { when: 'Sometime today', what: 'Write one thing we have in common', minutes: 2 } } },
  },
  triggers: {
    presentation: ['presentation', 'interview', 'exam', 'test', 'stage', 'nervous', 'speech', 'pitch'],
    worry: ['worry', 'worried', 'anxious', 'anxiety', 'afraid', 'scared', 'overthink', 'can’t sleep', "can't sleep"],
    help: ['help', 'favor', 'team', 'group project', 'collaborat', 'together'],
    conflict: ['fight', 'argu', 'conflict', 'friend', 'misunderstand', 'coworker', 'boss', 'family', 'partner', 'upset'],
    career: ['career', 'job', 'major', 'future', 'quit', 'company', 'resume', 'résumé'],
    procrastination: ['procrastinat', 'habit', 'exercise', 'study', 'routine', 'lazy', 'consisten', 'put off'],
    idea: ['idea', 'creative', 'writing', 'design', 'stuck', 'inspiration', 'plan'],
    failure: ['fail', 'rejected', 'confidence', 'self-esteem', 'messed up', 'not good enough'],
  },
};

// 인물 원형 안의 영문 소제목 (언어 무관, 원형 디자인 요소)
const HY_LENS_TAG = {
  seneca: 'STOIC THINKING', socrates: 'QUESTIONING', confucius: 'HUMANE LEARNING', davinci: 'CURIOUS OBSERVATION',
  jeong: 'PRACTICAL LEARNING', yi_hwang: 'MINDFUL REFLECTION', yi_i: 'STEP BY STEP', wonhyo: 'HARMONIZING VIEWS',
};

// ---------- 헬퍼 ----------
function tTopic(id) { return HY_LANG === 'en' && HY_EN.topics[id] ? HY_EN.topics[id][0] : id; }
function tTopicDesc(t) { return HY_LANG === 'en' && HY_EN.topics[t.id] ? HY_EN.topics[t.id][1] : t.desc; }
function tKw(k) { return HY_LANG === 'en' ? (HY_EN.kwNames[k] || k) : k; }
function tKwMeaning(topic, k) { return HY_LANG === 'en' ? ((HY_EN.kwMeanings[topic] || {})[k] || '') : HY_KEYWORDS[topic][k]; }
function tType(t) { return HY_LANG === 'en' ? (HY_EN.types[t] || t) : t; }

function cardT(c) {
  if (!c) return null;
  const e = HY_LANG === 'en' ? HY_EN.cards[c.id] : null;
  if (!e) return { title: c.title, contentType: c.contentType, meaning: c.meaning, easyExplanation: c.easyExplanation, hanja: c.hanja, question: c.question, action: c.action };
  return { title: e.title, contentType: tType(c.contentType), meaning: e.meaning, easyExplanation: e.ex, hanja: c.hanja ? `${c.hanja} · ${e.roman}` : null, question: e.q, action: e.a };
}

function personaT(p) {
  if (!p) return null;
  const e = HY_LANG === 'en' ? HY_EN.personas[p.id] : null;
  if (!e) return { name: p.koName, role: p.role, lens: p.perspectiveDescription, question: p.questionTemplates[0], examples: p.examples, actionTemplates: p.actionTemplates };
  return { name: e.name, role: e.role, lens: e.lens, question: e.q, examples: e.ex, actionTemplates: e.act };
}

const HyLangCtx = createContext({ lang: 'ko', setLang: () => {} });
function LangToggle() {
  const { lang, setLang } = useContext(HyLangCtx);
  return (
    <div className="hy-lang" role="group" aria-label="Language">
      <button className={lang === 'ko' ? 'on' : ''} onClick={() => setLang('ko')} aria-pressed={lang === 'ko'}>KR</button>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>ENG</button>
    </div>
  );
}

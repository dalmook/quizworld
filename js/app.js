let allQuizzes = [];
let filteredQuizzes = [];
let currentIndex = 0;
let selectedCategory = '전체';
let isAnswerVisible = false;
let isHintVisible = false;

const CATEGORIES = ['전체','동물','음식','생활','학교','자연','넌센스','상식','과학','가족','몸','말장난','숫자','계절','교통','색깔','우주'];
const PRAISES = ['좋아요! 생각해 봤다면 이미 성공이에요!','와! 다음 문제도 도전해 볼까요?','정답 확인 완료!','머리가 반짝반짝해요!','가족에게도 한번 내보세요!'];

async function loadQuizzes() {
  const res = await fetch('./data/quizzes.json');
  if (!res.ok) throw new Error('퀴즈 파일을 불러오지 못했어요.');
  return res.json();
}
function saveProgress(){ localStorage.setItem('kidsQuizProgress', JSON.stringify({currentIndex, selectedCategory})); }
function loadProgress(){
  const raw = localStorage.getItem('kidsQuizProgress'); if(!raw) return;
  try { const p = JSON.parse(raw); currentIndex = p.currentIndex || 0; selectedCategory = p.selectedCategory || '전체'; } catch { }
}
function renderHome(){ document.getElementById('home-screen').classList.remove('hidden'); document.getElementById('quiz-screen').classList.add('hidden'); }
function renderCategories(){
  const wrap = document.getElementById('category-chips');
  wrap.innerHTML = '';
  CATEGORIES.forEach(c=>{ const b=document.createElement('button'); b.className='chip'+(c===selectedCategory?' active':''); b.textContent=c; b.onclick=()=>setCategory(c); wrap.appendChild(b); });
}
function setCategory(category){ selectedCategory=category; filteredQuizzes = category==='전체'? [...allQuizzes] : allQuizzes.filter(q=>q.category===category); currentIndex=0; renderCategories(); renderQuiz(); saveProgress(); }
function showHint(){ isHintVisible=true; renderQuiz(); }
function showAnswer(){ isAnswerVisible=true; renderQuiz(); }
function nextQuiz(){ if(!filteredQuizzes.length) return; currentIndex=(currentIndex+1)%filteredQuizzes.length; isHintVisible=false; isAnswerVisible=false; renderQuiz(); saveProgress(); }
function randomQuiz(){ if(!filteredQuizzes.length) return; currentIndex=Math.floor(Math.random()*filteredQuizzes.length); isHintVisible=false; isAnswerVisible=false; renderQuiz(); saveProgress(); }
function resetToHome(){ renderHome(); }

function speakQuestion(){
  const q=filteredQuizzes[currentIndex];
  if(!('speechSynthesis' in window)){ alert('이 브라우저에서는 음성 읽기를 지원하지 않아요.'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(q.question);
  utter.lang='ko-KR';
  const voices = speechSynthesis.getVoices();
  const koVoice = voices.find(v=>v.lang.toLowerCase().includes('ko-kr'));
  if(koVoice) utter.voice = koVoice;
  speechSynthesis.speak(utter);
}

function renderQuiz(){
  const err=document.getElementById('error-text'); err.classList.add('hidden');
  if(!filteredQuizzes.length){
    document.getElementById('question-text').textContent='이 카테고리에는 아직 문제가 없어요.';
    document.getElementById('progress-text').textContent='0 / 0';
    document.getElementById('progress-fill').style.width='0%';
    return;
  }
  const q = filteredQuizzes[currentIndex];
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  document.getElementById('question-text').textContent=q.question;
  document.getElementById('progress-text').textContent=`${currentIndex+1} / ${filteredQuizzes.length}`;
  document.getElementById('progress-fill').style.width=`${((currentIndex+1)/filteredQuizzes.length)*100}%`;
  document.getElementById('category-badge').textContent=q.category;
  document.getElementById('level-badge').textContent=q.level;

  const hint=document.getElementById('hint-box');
  hint.textContent=`💡 힌트: ${q.hint}`;
  hint.classList.toggle('hidden', !isHintVisible);

  const answer=document.getElementById('answer-box');
  answer.textContent=`✅ 정답: ${q.answer}`;
  answer.classList.toggle('hidden', !isAnswerVisible);

  const fact=document.getElementById('fact-box');
  fact.textContent=`🌈 ${q.funFact}`;
  fact.classList.toggle('hidden', !isAnswerVisible);

  const praise=document.getElementById('praise-box');
  praise.textContent=PRAISES[Math.floor(Math.random()*PRAISES.length)];
  praise.classList.toggle('hidden', !isAnswerVisible);
}

async function init(){
  loadProgress();
  try { allQuizzes = await loadQuizzes(); } catch(e){
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('error-text').classList.remove('hidden');
    document.getElementById('error-text').textContent = e.message;
    return;
  }
  setCategory(selectedCategory);
  if(currentIndex>=filteredQuizzes.length) currentIndex=0;
  renderHome();
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('start-btn').addEventListener('click',()=>{ isHintVisible=false; isAnswerVisible=false; renderQuiz(); });
  document.getElementById('today-random-btn').addEventListener('click',()=>{ randomQuiz(); renderQuiz(); });
  document.getElementById('hint-btn').addEventListener('click',showHint);
  document.getElementById('answer-btn').addEventListener('click',showAnswer);
  document.getElementById('next-btn').addEventListener('click',nextQuiz);
  document.getElementById('random-btn').addEventListener('click',randomQuiz);
  document.getElementById('speak-btn').addEventListener('click',speakQuestion);
  document.getElementById('home-btn').addEventListener('click',resetToHome);
  init();
});

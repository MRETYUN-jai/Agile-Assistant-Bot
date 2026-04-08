import '../style.css';

// ═══════════════════════════════════════════════════════
// 0. NAV & SCROLL EFFECTS
// ═══════════════════════════════════════════════════════
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Scroll-in animation
const observeEls = document.querySelectorAll('.section');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08 });
observeEls.forEach(el => { el.classList.add('animate-in'); io.observe(el); });

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navMenu.querySelector(`a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
});

// ═══════════════════════════════════════════════════════
// 1. METHODOLOGY CARDS
// ═══════════════════════════════════════════════════════
const methodologies = [
  {
    emoji: '🏉', name: 'Scrum',
    desc: 'Iterative framework with sprints, daily standups, and defined roles.',
    details: [
      '<strong>Roles:</strong> Product Owner, Scrum Master, Dev Team',
      '<strong>Events:</strong> Sprint Planning, Daily Standup, Sprint Review, Retrospective',
      '<strong>Artifacts:</strong> Product Backlog, Sprint Backlog, Increment',
      '<strong>Sprint Duration:</strong> 1–4 weeks (commonly 2 weeks)',
      '<strong>Best For:</strong> Cross-functional teams building complex products'
    ]
  },
  {
    emoji: '📌', name: 'Kanban',
    desc: 'Continuous flow with visual boards and WIP limits.',
    details: [
      '<strong>Core Principles:</strong> Visualize work, limit WIP, manage flow',
      '<strong>Board Columns:</strong> To Do → In Progress → Review → Done',
      '<strong>WIP Limits:</strong> Cap items per column to prevent bottlenecks',
      '<strong>Metrics:</strong> Lead time, cycle time, throughput',
      '<strong>Best For:</strong> Support teams, continuous delivery, maintenance work'
    ]
  },
  {
    emoji: '⚡', name: 'Extreme Programming (XP)',
    desc: 'Engineering-focused with pair programming and TDD.',
    details: [
      '<strong>Practices:</strong> Pair programming, TDD, CI, refactoring, simple design',
      '<strong>Planning:</strong> Planning Game with user stories and iterations',
      '<strong>Releases:</strong> Small, frequent releases (1–2 week iterations)',
      '<strong>Values:</strong> Communication, simplicity, feedback, courage, respect',
      '<strong>Best For:</strong> Teams requiring high code quality and rapid feedback'
    ]
  },
  {
    emoji: '🏢', name: 'SAFe',
    desc: 'Scaled Agile Framework for large enterprise organizations.',
    details: [
      '<strong>Levels:</strong> Team, Program, Large Solution, Portfolio',
      '<strong>Cadence:</strong> Program Increments (PI) typically 8–12 weeks',
      '<strong>Events:</strong> PI Planning, System Demos, Inspect & Adapt',
      '<strong>Roles:</strong> Release Train Engineer, Product Manager, System Architect',
      '<strong>Best For:</strong> Large organizations with multiple agile teams'
    ]
  },
  {
    emoji: '🍃', name: 'Lean',
    desc: 'Eliminate waste, amplify learning, deliver fast.',
    details: [
      '<strong>7 Principles:</strong> Eliminate waste, amplify learning, decide late, deliver fast, empower team, build integrity, optimize the whole',
      '<strong>Waste Types:</strong> Partially done work, extra processes, task switching, waiting, defects',
      '<strong>Tools:</strong> Value stream mapping, A3 problem solving, Kanban',
      '<strong>Metrics:</strong> Cycle time, process efficiency, value-adding ratio',
      '<strong>Best For:</strong> Optimizing existing processes and reducing inefficiency'
    ]
  }
];

const methodGrid = document.getElementById('method-grid');
methodologies.forEach(m => {
  const card = document.createElement('div');
  card.className = 'method-card';
  card.innerHTML = `
    <div class="card-emoji">${m.emoji}</div>
    <h3>${m.name}</h3>
    <p class="card-desc">${m.desc}</p>
    <div class="card-details">
      <ul>${m.details.map(d => `<li>${d}</li>`).join('')}</ul>
    </div>
  `;
  card.addEventListener('click', () => {
    document.querySelectorAll('.method-card.expanded').forEach(c => {
      if (c !== card) c.classList.remove('expanded');
    });
    card.classList.toggle('expanded');
  });
  methodGrid.appendChild(card);
});

// ═══════════════════════════════════════════════════════
// 2. SPRINT PLANNER
// ═══════════════════════════════════════════════════════
let stories = [];
const storyList = document.getElementById('story-list');
const sprintCapInput = document.getElementById('sprint-capacity');
const addStoryBtn = document.getElementById('add-story-btn');

function renderStories() {
  const cap = parseInt(sprintCapInput.value) || 40;
  const total = stories.reduce((s, st) => s + st.points, 0);
  const pct = Math.min((total / cap) * 100, 100);
  document.getElementById('sprint-load').textContent = `${total} / ${cap} pts`;
  const fill = document.getElementById('sprint-progress-fill');
  fill.style.width = pct + '%';
  fill.classList.toggle('overload', total > cap);

  storyList.innerHTML = '';
  stories.forEach((st, i) => {
    const div = document.createElement('div');
    div.className = `story-item ${st.priority}`;
    div.innerHTML = `
      <span class="story-title-text">${st.title}</span>
      <span class="story-pts">${st.points} pt${st.points > 1 ? 's' : ''}</span>
      <button class="delete-story" data-i="${i}">✕</button>
    `;
    storyList.appendChild(div);
  });
}

addStoryBtn.addEventListener('click', () => {
  const titleEl = document.getElementById('story-title');
  const title = titleEl.value.trim();
  if (!title) return;
  const points = parseInt(document.getElementById('story-points').value);
  const priority = document.getElementById('story-priority').value;
  stories.push({ title, points, priority });
  titleEl.value = '';
  renderStories();
});

document.getElementById('story-title').addEventListener('keydown', e => {
  if (e.key === 'Enter') addStoryBtn.click();
});

storyList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-story')) {
    stories.splice(parseInt(e.target.dataset.i), 1);
    renderStories();
  }
});

sprintCapInput.addEventListener('input', renderStories);

// ═══════════════════════════════════════════════════════
// 3. STANDUP TIMER
// ═══════════════════════════════════════════════════════
let teamMembers = [];
let timerInterval = null;
let currentMemberIdx = -1;
let timeLeft = 0;
let totalTime = 0;

const teamList = document.getElementById('team-list');
const timerCountdown = document.getElementById('timer-countdown');
const timerCurrentName = document.getElementById('timer-current-name');
const timerProgress = document.getElementById('timer-progress');
const startBtn = document.getElementById('start-standup-btn');
const skipBtn = document.getElementById('skip-person-btn');
const resetBtn = document.getElementById('reset-standup-btn');
const CIRCUMFERENCE = 2 * Math.PI * 90; // r=90

// Add SVG gradient definition
const svgEl = document.querySelector('.timer-circle svg');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
defs.innerHTML = `<linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06d6a0"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient>`;
svgEl.prepend(defs);
timerProgress.setAttribute('stroke', 'url(#timerGrad)');
timerProgress.style.strokeDasharray = CIRCUMFERENCE;
timerProgress.style.strokeDashoffset = 0;

function renderTeam() {
  teamList.innerHTML = '';
  teamMembers.forEach((m, i) => {
    const div = document.createElement('div');
    div.className = 'team-member' + (i === currentMemberIdx ? ' active' : '') + (m.done ? ' done' : '');
    div.innerHTML = `${m.name} <button class="remove-member" data-i="${i}">✕</button>`;
    teamList.appendChild(div);
  });
  startBtn.disabled = teamMembers.length === 0;
}

document.getElementById('add-person-btn').addEventListener('click', () => {
  const inp = document.getElementById('person-name');
  const name = inp.value.trim();
  if (!name) return;
  teamMembers.push({ name, done: false });
  inp.value = '';
  renderTeam();
});

document.getElementById('person-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-person-btn').click();
});

teamList.addEventListener('click', e => {
  if (e.target.classList.contains('remove-member')) {
    teamMembers.splice(parseInt(e.target.dataset.i), 1);
    renderTeam();
  }
});

function updateTimerDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timerCountdown.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  const offset = CIRCUMFERENCE * (1 - timeLeft / totalTime);
  timerProgress.style.strokeDashoffset = offset;
}

function startNextPerson() {
  currentMemberIdx++;
  if (currentMemberIdx >= teamMembers.length) {
    finishStandup();
    return;
  }
  totalTime = parseInt(document.getElementById('time-per-person').value) || 90;
  timeLeft = totalTime;
  timerCurrentName.textContent = teamMembers[currentMemberIdx].name;
  renderTeam();
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      teamMembers[currentMemberIdx].done = true;
      clearInterval(timerInterval);
      // Play beep
      try { document.getElementById('timer-beep').currentTime = 0; document.getElementById('timer-beep').play(); } catch (e) {}
      startNextPerson();
    }
  }, 1000);
}

function finishStandup() {
  clearInterval(timerInterval);
  timerCurrentName.textContent = '✅ Done!';
  timerCountdown.textContent = '0:00';
  timerProgress.style.strokeDashoffset = CIRCUMFERENCE;
  startBtn.disabled = true;
  skipBtn.disabled = true;
  renderTeam();
}

startBtn.addEventListener('click', () => {
  teamMembers.forEach(m => m.done = false);
  currentMemberIdx = -1;
  startBtn.disabled = true;
  skipBtn.disabled = false;
  startNextPerson();
});

skipBtn.addEventListener('click', () => {
  if (currentMemberIdx >= 0 && currentMemberIdx < teamMembers.length) {
    teamMembers[currentMemberIdx].done = true;
    clearInterval(timerInterval);
    startNextPerson();
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  teamMembers.forEach(m => m.done = false);
  currentMemberIdx = -1;
  timeLeft = 0;
  timerCurrentName.textContent = '—';
  timerCountdown.textContent = '0:00';
  timerProgress.style.strokeDashoffset = 0;
  startBtn.disabled = teamMembers.length === 0;
  skipBtn.disabled = true;
  renderTeam();
});

// ═══════════════════════════════════════════════════════
// 4. RETRO FORMAT GENERATOR
// ═══════════════════════════════════════════════════════
const retroFormats = [
  { name: 'Start, Stop, Continue', desc: 'Classic format focusing on new actions, things to stop, and what to keep.', cols: ['🟢 Start', '🔴 Stop', '🔵 Continue'] },
  { name: 'Mad, Sad, Glad', desc: 'Emotion-based format to surface team feelings.', cols: ['😡 Mad', '😢 Sad', '😊 Glad'] },
  { name: '4Ls', desc: 'Reflect on what you Liked, Learned, Lacked, and Longed for.', cols: ['❤️ Liked', '📚 Learned', '❌ Lacked', '🌟 Longed For'] },
  { name: 'Sailboat', desc: 'Use nautical metaphors: wind (helping), anchor (slowing), island (goal), rocks (risks).', cols: ['💨 Wind', '⚓ Anchor', '🏝️ Island', '🪨 Rocks'] },
  { name: 'Starfish', desc: 'Five categories of actions for nuanced reflection.', cols: ['⭐ Keep', '➕ More Of', '➖ Less Of', '🆕 Start', '🛑 Stop'] },
  { name: 'DAKI', desc: 'Drop, Add, Keep, Improve — action-oriented format.', cols: ['🗑️ Drop', '➕ Add', '✅ Keep', '📈 Improve'] },
  { name: 'Lean Coffee', desc: 'Democratic format where the team votes on topics to discuss.', cols: ['☕ To Discuss', '💬 Discussing', '✅ Discussed'] },
  { name: 'Hot Air Balloon', desc: 'What lifts us up vs what weighs us down.', cols: ['🔥 Hot Air (lifts)', '🧺 Sandbags (weighs)', '☁️ Storm Clouds (risks)'] },
  { name: 'Three Wishes', desc: 'If you had three wishes for the team, what would they be?', cols: ['🌟 Wish 1', '🌟 Wish 2', '🌟 Wish 3'] },
  { name: 'Rose, Thorn, Bud', desc: 'Celebrate wins, identify challenges, spot opportunities.', cols: ['🌹 Rose', '🌵 Thorn', '🌱 Bud'] }
];

const retroDisplay = document.getElementById('retro-display');

document.getElementById('shuffle-retro-btn').addEventListener('click', () => {
  const fmt = retroFormats[Math.floor(Math.random() * retroFormats.length)];
  retroDisplay.innerHTML = `
    <div class="retro-format-name">${fmt.name}</div>
    <div class="retro-format-desc">${fmt.desc}</div>
    <div class="retro-columns">${fmt.cols.map(c => `<div class="retro-col">${c}</div>`).join('')}</div>
  `;
  retroDisplay.style.animation = 'none';
  void retroDisplay.offsetWidth;
  retroDisplay.style.animation = 'slideIn .4s ease';
});

// ═══════════════════════════════════════════════════════
// 5. PLANNING POKER
// ═══════════════════════════════════════════════════════
const pokerValues = ['0', '½', '1', '2', '3', '5', '8', '13', '21', '?', '☕'];
let pokerPlayers = [];
let selectedCard = null;
let cardsRevealed = false;

const pokerCardsContainer = document.getElementById('poker-cards');
const pokerPlayerList = document.getElementById('poker-player-list');
const revealBtn = document.getElementById('reveal-cards-btn');
const resetPokerBtn = document.getElementById('reset-poker-btn');
const pokerResult = document.getElementById('poker-result');

// Render poker cards
pokerValues.forEach(v => {
  const card = document.createElement('div');
  card.className = 'poker-card';
  card.textContent = v;
  card.addEventListener('click', () => {
    if (cardsRevealed) return;
    document.querySelectorAll('.poker-card.selected').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedCard = v;
    // Auto-assign to first player without vote
    const unvoted = pokerPlayers.find(p => p.vote === null);
    if (unvoted) {
      unvoted.vote = v;
      selectedCard = null;
      card.classList.remove('selected');
      renderPokerPlayers();
    }
  });
  pokerCardsContainer.appendChild(card);
});

function renderPokerPlayers() {
  pokerPlayerList.innerHTML = '';
  pokerPlayers.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'poker-player';
    const voteText = cardsRevealed ? (p.vote ?? '—') : (p.vote ? '✔' : '—');
    const voteClass = cardsRevealed ? '' : 'hidden-vote';
    div.innerHTML = `
      <span>${p.name}</span>
      <span class="player-vote ${voteClass}">${voteText}</span>
      <button class="remove-member" data-i="${i}">✕</button>
    `;
    pokerPlayerList.appendChild(div);
  });
  revealBtn.disabled = pokerPlayers.length === 0 || pokerPlayers.every(p => p.vote === null);
}

document.getElementById('add-poker-player').addEventListener('click', () => {
  const inp = document.getElementById('poker-player-name');
  const name = inp.value.trim();
  if (!name) return;
  pokerPlayers.push({ name, vote: null });
  inp.value = '';
  renderPokerPlayers();
});

document.getElementById('poker-player-name').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-poker-player').click();
});

pokerPlayerList.addEventListener('click', e => {
  if (e.target.classList.contains('remove-member')) {
    pokerPlayers.splice(parseInt(e.target.dataset.i), 1);
    renderPokerPlayers();
  }
});

revealBtn.addEventListener('click', () => {
  cardsRevealed = true;
  renderPokerPlayers();
  revealBtn.disabled = true;

  // Compute average of numeric votes
  const numericVotes = pokerPlayers
    .map(p => p.vote === '½' ? 0.5 : parseFloat(p.vote))
    .filter(v => !isNaN(v));

  if (numericVotes.length > 0) {
    const avg = (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1);
    pokerResult.classList.remove('hidden');
    pokerResult.innerHTML = `
      <div class="result-label">Average Estimate</div>
      <div class="result-avg">${avg} pts</div>
    `;
  }
});

resetPokerBtn.addEventListener('click', () => {
  cardsRevealed = false;
  selectedCard = null;
  pokerPlayers.forEach(p => p.vote = null);
  document.querySelectorAll('.poker-card.selected').forEach(c => c.classList.remove('selected'));
  pokerResult.classList.add('hidden');
  renderPokerPlayers();
});

// ═══════════════════════════════════════════════════════
// 6. VELOCITY CALCULATOR
// ═══════════════════════════════════════════════════════
let velocityData = [];
const velocityDataEl = document.getElementById('velocity-data');
const velocitySummary = document.getElementById('velocity-summary');
const velocityChart = document.getElementById('velocity-chart');

function renderVelocity() {
  velocityDataEl.innerHTML = '';
  velocityData.forEach((v, i) => {
    const div = document.createElement('div');
    div.className = 'velocity-item';
    div.innerHTML = `
      <span class="vel-name">${v.name}</span>
      <span class="vel-pts">${v.points} pts</span>
      <button class="remove-vel" data-i="${i}">✕</button>
    `;
    velocityDataEl.appendChild(div);
  });

  if (velocityData.length >= 1) {
    velocitySummary.classList.remove('hidden');
    velocityChart.classList.remove('hidden');

    const pts = velocityData.map(v => v.points);
    const avg = (pts.reduce((a, b) => a + b, 0) / pts.length).toFixed(1);
    const best = Math.max(...pts);
    const trend = pts.length >= 2 ? (pts[pts.length - 1] >= pts[pts.length - 2] ? '📈 Up' : '📉 Down') : '—';

    document.getElementById('avg-velocity').textContent = avg + ' pts';
    document.getElementById('best-sprint').textContent = best + ' pts';
    document.getElementById('velocity-trend').textContent = trend;

    drawVelocityChart();
  } else {
    velocitySummary.classList.add('hidden');
    velocityChart.classList.add('hidden');
  }
}

function drawVelocityChart() {
  const canvas = velocityChart;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);

  const pts = velocityData.map(v => v.points);
  const max = Math.max(...pts, 1) * 1.2;
  const pad = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const barW = Math.min(chartW / pts.length - 8, 50);

  // Grid lines
  ctx.strokeStyle = 'rgba(99,102,241,.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), pad.left - 8, y + 4);
  }

  // Bars
  pts.forEach((p, i) => {
    const x = pad.left + (chartW / pts.length) * i + (chartW / pts.length - barW) / 2;
    const barH = (p / max) * chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#06d6a0');
    grad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '600 12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(p, x + barW / 2, y - 8);

    // Sprint name
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter';
    ctx.fillText(velocityData[i].name, x + barW / 2, H - pad.bottom + 20);
  });

  // Avg line
  const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
  const avgY = pad.top + chartH - (avg / max) * chartH;
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad.left, avgY);
  ctx.lineTo(W - pad.right, avgY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#22c55e';
  ctx.font = '600 11px Inter';
  ctx.textAlign = 'left';
  ctx.fillText('Avg: ' + avg.toFixed(1), W - pad.right + 4, avgY + 4);
}

document.getElementById('add-velocity-btn').addEventListener('click', () => {
  const nameEl = document.getElementById('velocity-sprint-name');
  const ptsEl = document.getElementById('velocity-points');
  const name = nameEl.value.trim() || `Sprint ${velocityData.length + 1}`;
  const points = parseInt(ptsEl.value) || 0;
  velocityData.push({ name, points });
  nameEl.value = '';
  renderVelocity();
});

velocityDataEl.addEventListener('click', e => {
  if (e.target.classList.contains('remove-vel')) {
    velocityData.splice(parseInt(e.target.dataset.i), 1);
    renderVelocity();
  }
});

// ═══════════════════════════════════════════════════════
// 7. BURNDOWN CHART
// ═══════════════════════════════════════════════════════
let burndownState = null;

document.getElementById('generate-bd-btn').addEventListener('click', () => {
  const totalPts = parseInt(document.getElementById('bd-total-points').value) || 40;
  const sprintDays = parseInt(document.getElementById('bd-sprint-days').value) || 10;
  burndownState = { totalPts, sprintDays, actuals: new Array(sprintDays).fill('') };

  const inputsContainer = document.getElementById('burndown-inputs');
  inputsContainer.classList.remove('hidden');
  inputsContainer.innerHTML = '';
  for (let i = 0; i < sprintDays; i++) {
    const div = document.createElement('div');
    div.className = 'bd-day-input';
    div.innerHTML = `
      <label>Day ${i + 1}</label>
      <input type="number" data-day="${i}" placeholder="${Math.round(totalPts - totalPts / sprintDays * (i + 1))}" min="0" />
    `;
    inputsContainer.appendChild(div);
  }

  document.getElementById('update-bd-btn').classList.remove('hidden');
  document.getElementById('burndown-canvas').classList.remove('hidden');
  drawBurndown();
});

document.getElementById('update-bd-btn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('#burndown-inputs input');
  inputs.forEach(inp => {
    const day = parseInt(inp.dataset.day);
    const val = inp.value.trim();
    burndownState.actuals[day] = val === '' ? null : parseInt(val);
  });
  drawBurndown();
});

function drawBurndown() {
  const canvas = document.getElementById('burndown-canvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);

  const { totalPts, sprintDays, actuals } = burndownState;
  const pad = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = totalPts * 1.1;

  // Grid
  ctx.strokeStyle = 'rgba(99,102,241,.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), pad.left - 8, y + 4);
  }

  // X-axis labels
  ctx.fillStyle = '#64748b';
  ctx.font = '11px Inter';
  ctx.textAlign = 'center';
  for (let i = 0; i <= sprintDays; i++) {
    const x = pad.left + (chartW / sprintDays) * i;
    ctx.fillText(i === 0 ? 'Start' : `D${i}`, x, H - pad.bottom + 20);
  }

  // Ideal line
  ctx.strokeStyle = 'rgba(99,102,241,.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  for (let i = 0; i <= sprintDays; i++) {
    const x = pad.left + (chartW / sprintDays) * i;
    const idealPts = totalPts - (totalPts / sprintDays) * i;
    const y = pad.top + chartH - (idealPts / max) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Actual line
  const actualPoints = [];
  actualPoints.push(totalPts); // day 0
  actuals.forEach(v => {
    if (v !== null && v !== '') actualPoints.push(v);
  });

  if (actualPoints.length > 1) {
    const grad = ctx.createLinearGradient(pad.left, pad.top, W - pad.right, H - pad.bottom);
    grad.addColorStop(0, '#22c55e');
    grad.addColorStop(1, '#06d6a0');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    actualPoints.forEach((p, i) => {
      const x = pad.left + (chartW / sprintDays) * i;
      const y = pad.top + chartH - (p / max) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    actualPoints.forEach((p, i) => {
      const x = pad.left + (chartW / sprintDays) * i;
      const y = pad.top + chartH - (p / max) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // Legend
  ctx.font = '600 11px Inter';
  ctx.textAlign = 'left';
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = 'rgba(99,102,241,.5)';
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top - 10);
  ctx.lineTo(pad.left + 30, pad.top - 10);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Ideal', pad.left + 36, pad.top - 6);

  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pad.left + 90, pad.top - 10);
  ctx.lineTo(pad.left + 120, pad.top - 10);
  ctx.stroke();
  ctx.fillText('Actual', pad.left + 126, pad.top - 6);
}

// Resize handler for charts
window.addEventListener('resize', () => {
  if (velocityData.length > 0) drawVelocityChart();
  if (burndownState) drawBurndown();
});

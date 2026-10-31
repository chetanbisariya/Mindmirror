/**
 * MindMirror - Main UI Application Controller
 */

// Application State
const state = {
  theme: localStorage.getItem('mm_theme') || 'light',
  currentView: 'home',
  
  // Assessment
  assessmentMode: null, // 'problem', 'personality', 'full'
  questionsList: [],
  currentIndex: 0,
  problemAnswers: {}, // { qId: score }
  personalityAnswers: {}, // { qId: { trait, weight } }

  // CBT State
  selectedDistortions: new Set(),

  // Breath Pacer Instance
  breathPacer: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initAssessmentLaunchers();
  initBreathGym();
  initCbtTool();
  initCrisisDirectory();
  initKeyboardNavigation();
});

/* ========================================================
   THEME TOGGLING
   ======================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeButtonIcon();

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('mm_theme', state.theme);
      updateThemeButtonIcon();
    });
  }
}

function updateThemeButtonIcon() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.textContent = state.theme === 'light' ? '🌙' : '☀️';
    toggleBtn.setAttribute('title', `Switch to ${state.theme === 'light' ? 'Dark' : 'Light'} Mode`);
  }
}

/* ========================================================
   NAVIGATION & VIEW SWITCHING
   ======================================================== */
function switchView(viewName) {
  state.currentView = viewName;
  const views = document.querySelectorAll('.view-panel');
  views.forEach(v => {
    v.style.display = 'none';
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav links active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  // Stop breath pacer if navigating away from breath view
  if (viewName !== 'breath' && state.breathPacer && state.breathPacer.isRunning) {
    state.breathPacer.stop();
  }
}

function initNavigation() {
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      const view = el.getAttribute('data-view');
      if (view === 'screener') {
        startAssessment('problem');
      } else if (view === 'personality') {
        startAssessment('personality');
      } else {
        switchView(view);
      }
    });
  });

  const navBrand = document.getElementById('nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', () => switchView('home'));
  }

  const crisisBannerLink = document.getElementById('link-crisis-banner');
  if (crisisBannerLink) {
    crisisBannerLink.addEventListener('click', () => switchView('crisis'));
  }

  const quickBreath = document.getElementById('quick-tool-breath');
  if (quickBreath) {
    quickBreath.addEventListener('click', () => switchView('breath'));
  }

  const quickCbt = document.getElementById('quick-tool-cbt');
  if (quickCbt) {
    quickCbt.addEventListener('click', () => switchView('cbt'));
  }
}

/* ========================================================
   ASSESSMENT LAUNCHERS & WIZARD
   ======================================================== */
function initAssessmentLaunchers() {
  const btnProb = document.getElementById('btn-start-problem');
  const btnPers = document.getElementById('btn-start-personality');
  const btnFull = document.getElementById('btn-start-full');

  if (btnProb) btnProb.addEventListener('click', () => startAssessment('problem'));
  if (btnPers) btnPers.addEventListener('click', () => startAssessment('personality'));
  if (btnFull) btnFull.addEventListener('click', () => startAssessment('full'));

  // Wizard Navigation
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', handlePreviousQuestion);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', handleNextQuestion);
  }
}

function startAssessment(mode) {
  state.assessmentMode = mode;
  state.currentIndex = 0;
  state.problemAnswers = {};
  state.personalityAnswers = {};

  if (mode === 'problem') {
    state.questionsList = [...PROBLEM_QUESTIONS];
  } else if (mode === 'personality') {
    state.questionsList = [...PERSONALITY_QUESTIONS];
  } else if (mode === 'full') {
    state.questionsList = [...PROBLEM_QUESTIONS, ...PERSONALITY_QUESTIONS];
  }

  switchView('assessment');
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const q = state.questionsList[state.currentIndex];
  if (!q) return;

  const total = state.questionsList.length;
  const currentNum = state.currentIndex + 1;
  const progressPercent = Math.round((currentNum / total) * 100);

  // Update Badge & Header Progress
  const badgeEl = document.getElementById('wizard-badge');
  const stepLabel = document.getElementById('wizard-step-label');
  const percentLabel = document.getElementById('wizard-percent-label');
  const progressBar = document.getElementById('wizard-progress-bar');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const nextBtn = document.getElementById('wizard-next-btn');

  if (q.category) {
    const cat = PROBLEM_CATEGORIES[q.category];
    badgeEl.textContent = `${cat.icon} Emotional Screener: ${cat.name}`;
  } else {
    badgeEl.textContent = `🎭 Personality Archetype Compass (Trait Axis)`;
  }

  stepLabel.textContent = `Question ${currentNum} of ${total}`;
  percentLabel.textContent = `${progressPercent}% Complete`;
  progressBar.style.width = `${progressPercent}%`;

  prevBtn.disabled = state.currentIndex === 0;

  // Title and Subtext
  document.getElementById('wizard-q-title').textContent = q.question;
  document.getElementById('wizard-q-subtext').textContent = q.subtext || '';

  // Render Options
  const container = document.getElementById('wizard-options-container');
  container.innerHTML = '';

  const isPersonality = !q.category;
  const currentSavedAns = isPersonality 
    ? state.personalityAnswers[q.id] 
    : state.problemAnswers[q.id];

  nextBtn.disabled = currentSavedAns === undefined;
  nextBtn.textContent = (currentNum === total) ? 'View My Full Insights ➔' : 'Next Question ➔';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.setAttribute('type', 'button');

    const keyLetter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);

    // Check if this option is selected
    let isSelected = false;
    if (isPersonality) {
      if (currentSavedAns && currentSavedAns.trait === opt.trait && currentSavedAns.weight === opt.weight) {
        isSelected = true;
      }
    } else {
      if (currentSavedAns !== undefined && currentSavedAns === opt.score) {
        isSelected = true;
      }
    }

    if (isSelected) {
      btn.classList.add('selected');
    }

    btn.innerHTML = `
      <div class="option-bullet">${keyLetter}</div>
      <div class="option-text">${opt.text}</div>
    `;

    btn.addEventListener('click', () => {
      // Clear selections
      container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Save answer
      if (isPersonality) {
        state.personalityAnswers[q.id] = { trait: opt.trait, weight: opt.weight };
      } else {
        state.problemAnswers[q.id] = opt.score;
      }

      nextBtn.disabled = false;

      // Smooth auto-advance after gentle delay for flow
      setTimeout(() => {
        handleNextQuestion();
      }, 260);
    });

    container.appendChild(btn);
  });
}

function handleNextQuestion() {
  if (state.currentIndex < state.questionsList.length - 1) {
    state.currentIndex++;
    renderCurrentQuestion();
  } else {
    // Finished all questions!
    showResults();
  }
}

function handlePreviousQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderCurrentQuestion();
  }
}

function initKeyboardNavigation() {
  window.addEventListener('keydown', (e) => {
    if (state.currentView !== 'assessment') return;
    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      const idx = parseInt(key, 10) - 1;
      const options = document.querySelectorAll('#wizard-options-container .option-btn');
      if (options[idx]) {
        options[idx].click();
      }
    } else if (key === 'ArrowRight' || key === 'Enter') {
      const nextBtn = document.getElementById('wizard-next-btn');
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click();
      }
    } else if (key === 'ArrowLeft') {
      const prevBtn = document.getElementById('wizard-prev-btn');
      if (prevBtn && !prevBtn.disabled) {
        prevBtn.click();
      }
    }
  });
}

/* ========================================================
   RESULTS RENDERING & SYNTHESIS
   ======================================================== */
function showResults() {
  switchView('results');

  const container = document.getElementById('results-content-area');
  container.innerHTML = '';

  const hasProblem = Object.keys(state.problemAnswers).length > 0;
  const hasPersonality = Object.keys(state.personalityAnswers).length > 0;

  let problemData = hasProblem ? calculateProblemResults(state.problemAnswers) : null;
  let personalityData = hasPersonality ? calculatePersonalityResults(state.personalityAnswers) : null;

  // Header Banner
  const headerBanner = document.createElement('div');
  headerBanner.className = 'results-header-banner';
  headerBanner.innerHTML = `
    <div class="results-header-text">
      <h2>Your Psychological Insights & Coping Blueprint</h2>
      <p>Here is your compassionate clinical synthesis, personalized root-cause breakdown, and tailored coping strategies.</p>
    </div>
    <div class="results-actions-top">
      <button class="btn btn-secondary btn-sm" id="btn-print-results">
        🖨️ Print / Save PDF
      </button>
      <button class="btn btn-primary btn-sm" id="btn-retake-results">
        ↺ Retake Assessment
      </button>
    </div>
  `;
  container.appendChild(headerBanner);

  // Wire up Print & Retake buttons
  setTimeout(() => {
    const printBtn = document.getElementById('btn-print-results');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    const retakeBtn = document.getElementById('btn-retake-results');
    if (retakeBtn) retakeBtn.addEventListener('click', () => switchView('home'));
  }, 50);

  // If Problem data exists, show Overall Emotional Strain and Dimension breakdown
  if (problemData) {
    renderProblemOverview(container, problemData);
    renderDimensionBars(container, problemData);
    renderBlueprint(container, problemData);
  }

  // If Personality data exists, show Archetype card
  if (personalityData) {
    renderArchetypeCard(container, personalityData);
  }

  // Cross-Synthesis if both exist
  if (problemData && personalityData) {
    renderCrossSynthesisCard(container, problemData, personalityData);
  }

  // Built-in Practice Recommendations Footer
  renderActionFooter(container);
}

function renderProblemOverview(container, data) {
  const grid = document.createElement('div');
  grid.className = 'overview-cards-grid';

  grid.innerHTML = `
    <!-- Overall Strain -->
    <div class="stat-card">
      <div class="stat-card-label">Overall Emotional Strain</div>
      <div class="stat-card-value">
        ${data.overallPercentage}%
        <span class="severity-pill ${data.severityClass}">${data.severity}</span>
      </div>
      <p class="stat-card-desc">${data.severityDescription}</p>
    </div>

    <!-- Primary Concern -->
    <div class="stat-card" style="border-top: 3px solid ${data.primaryMeta.color};">
      <div class="stat-card-label">Primary Challenge</div>
      <div class="stat-card-value" style="font-size: 1.35rem;">
        <span>${data.primaryMeta.icon}</span> ${data.primaryMeta.name}
      </div>
      <p class="stat-card-desc">${data.primaryMeta.description}</p>
    </div>

    <!-- Secondary Factor -->
    <div class="stat-card" style="border-top: 3px solid ${data.secondaryMeta.color};">
      <div class="stat-card-label">Contributing Secondary Factor</div>
      <div class="stat-card-value" style="font-size: 1.35rem;">
        <span>${data.secondaryMeta.icon}</span> ${data.secondaryMeta.name}
      </div>
      <p class="stat-card-desc">${data.secondaryMeta.description}</p>
    </div>
  `;

  container.appendChild(grid);
}

function renderDimensionBars(container, data) {
  const sec = document.createElement('div');
  sec.className = 'dimensions-section';

  let barsHtml = '';
  data.sortedCategories.forEach(catKey => {
    const meta = PROBLEM_CATEGORIES[catKey];
    const pct = data.percentages[catKey];

    barsHtml += `
      <div class="dimension-row">
        <div class="dimension-info">
          <div class="dimension-name">
            <span>${meta.icon}</span>
            <span>${meta.name}</span>
          </div>
          <div class="dimension-percentage">${pct}% Intensity</div>
        </div>
        <div class="dimension-bar-track">
          <div class="dimension-bar-value" style="width: ${pct}%; background: ${meta.color};"></div>
        </div>
      </div>
    `;
  });

  sec.innerHTML = `
    <h3 class="section-title">📊 Emotional Landscape Breakdown</h3>
    <p class="section-subtitle">Relative intensity across the 7 evaluated psychological wellness dimensions:</p>
    <div class="dimension-bars-list">
      ${barsHtml}
    </div>
  `;

  container.appendChild(sec);
}

function renderBlueprint(container, data) {
  const bp = data.blueprint;
  const meta = data.primaryMeta;

  const card = document.createElement('div');
  card.className = 'blueprint-card';

  let habitsHtml = '';
  bp.weeklyHabits.forEach(h => {
    habitsHtml += `
      <div class="habit-card">
        <strong>${h.title}</strong>
        <div>${h.detail}</div>
      </div>
    `;
  });

  let rescueStepsHtml = '';
  bp.immediateRescue.steps.forEach(s => {
    rescueStepsHtml += `<li>${s}</li>`;
  });

  card.innerHTML = `
    <div class="blueprint-header">
      <div class="blueprint-avatar">${meta.icon}</div>
      <div class="blueprint-header-text">
        <h3>Actionable Coping Blueprint: ${bp.title}</h3>
        <p>${bp.subTitle}</p>
      </div>
    </div>

    <!-- Neurobiology Explainer -->
    <div class="neurology-box">
      <strong>🧠 What Is Happening In Your Nervous System:</strong>
      ${bp.neurology}
    </div>

    <!-- 3-Tier Blueprint -->
    <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">
      🛠️ Your 3-Tier Step-by-Step Fix:
    </h4>

    <div class="solution-tiers">
      <!-- Tier 1 -->
      <div class="tier-item tier-1">
        <div class="tier-header">
          <span class="tier-tag">Tier 1: Immediate Triage (0 – 5 Mins)</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${bp.immediateRescue.duration}</span>
        </div>
        <div class="tier-title">${bp.immediateRescue.name}</div>
        <ol class="tier-steps">
          ${rescueStepsHtml}
        </ol>
      </div>

      <!-- Tier 2 -->
      <div class="tier-item tier-2">
        <div class="tier-header">
          <span class="tier-tag">Tier 2: Daily Rebalancing Micro-Habits</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Next 7 Days</span>
        </div>
        <div class="tier-title">3 Concrete Daily Keystone Habits</div>
        <div class="habit-list">
          ${habitsHtml}
        </div>
      </div>

      <!-- Tier 3 -->
      <div class="tier-item tier-3">
        <div class="tier-header">
          <span class="tier-tag">Tier 3: Cognitive & Mindset Reframe</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">CBT Thought Restructuring</span>
        </div>
        <div class="tier-title">Transforming Automatic Thoughts</div>
        <div class="cbt-preview-box">
          <div class="cbt-row">
            <span class="cbt-label">Distorted Thought:</span>
            <div class="cbt-val">${bp.cbtReframe.thought}</div>
          </div>
          <div class="cbt-row">
            <span class="cbt-label">Cognitive Trap:</span>
            <div style="color: var(--accent-rose); font-weight: 600;">${bp.cbtReframe.distortion}</div>
          </div>
          <div class="cbt-row" style="margin-bottom: 0;">
            <span class="cbt-label">Balanced Healing Reframe:</span>
            <div style="color: var(--accent-emerald); font-weight: 600; line-height: 1.5;">${bp.cbtReframe.reframe}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Self-Compassion Mantra -->
    <div class="mantra-banner">
      <div class="mantra-title">🌱 Your Compassionate Anchor Mantra</div>
      <div class="mantra-quote">"${bp.mantra}"</div>
    </div>

    <!-- Clinical Advisory -->
    <div style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; border-top: 1px solid var(--border-color); padding-top: 1rem;">
      <strong>Professional Recommendation:</strong> ${bp.proAdvice}
    </div>
  `;

  container.appendChild(card);
}

function renderArchetypeCard(container, data) {
  const arc = data.archetype;

  const card = document.createElement('div');
  card.className = 'archetype-showcase-card';

  let strengthsHtml = '';
  arc.strengths.forEach(s => strengthsHtml += `<li>${s}</li>`);

  let shadowsHtml = '';
  arc.shadows.forEach(s => shadowsHtml += `<li>${s}</li>`);

  card.innerHTML = `
    <div class="archetype-banner">
      <div class="archetype-big-icon">${arc.archetypeIcon}</div>
      <div class="archetype-titles">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">
          Your Personality Archetype
        </div>
        <h3>${arc.name}</h3>
        <div class="archetype-tagline">${arc.tagline}</div>
      </div>
    </div>

    <p class="archetype-summary">${arc.summary}</p>

    <!-- Dominant Axes -->
    <div style="background: var(--bg-tertiary); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.75rem;">
      <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">
        Your Core Cognitive Traits Breakdown
      </h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; font-size: 0.9rem;">
        <div><strong>Energy Recharge:</strong> ${data.dominantAxes.energy}</div>
        <div><strong>Information Lens:</strong> ${data.dominantAxes.lens}</div>
        <div><strong>Decision Style:</strong> ${data.dominantAxes.decisions}</div>
        <div><strong>Lifestyle Rhythm:</strong> ${data.dominantAxes.lifestyle}</div>
      </div>
    </div>

    <!-- Strengths & Shadows Grid -->
    <div class="archetype-grid">
      <div class="trait-box">
        <h4 style="color: var(--accent-emerald);">✨ Core Superpowers</h4>
        <ul class="trait-list">
          ${strengthsHtml}
        </ul>
      </div>

      <div class="trait-box">
        <h4 style="color: var(--accent-amber);">⚠️ Blind Spots & Shadow Edges</h4>
        <ul class="trait-list">
          ${shadowsHtml}
        </ul>
      </div>
    </div>

    <!-- Stress & Recharge -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
      <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-rose);">
        <strong style="color: var(--accent-rose); display: block; margin-bottom: 0.35rem;">🔥 How You React Under Stress:</strong>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${arc.stressReaction}</p>
      </div>
      <div style="background: var(--bg-secondary); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-teal);">
        <strong style="color: var(--accent-teal); display: block; margin-bottom: 0.35rem;">🔋 Optimal Mental Recharge Style:</strong>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">${arc.optimalRecharge}</p>
      </div>
    </div>
  `;

  container.appendChild(card);
}

function renderCrossSynthesisCard(container, probData, persData) {
  const card = document.createElement('div');
  card.className = 'cross-synthesis-card';

  const synthesisText = generateCrossSynthesis(probData.primaryCategory, persData.matchedKey);

  card.innerHTML = `
    <h3>✨ Dynamic Cross-Synthesis: Your Personality Meets Your Current Struggle</h3>
    <p>
      <strong>How ${persData.archetype.name} specifically experiences ${probData.primaryMeta.name}:</strong><br>
      ${synthesisText}
    </p>
  `;

  container.appendChild(card);
}

function renderActionFooter(container) {
  const footer = document.createElement('div');
  footer.style.textAlign = 'center';
  footer.style.marginTop = '2.5rem';
  footer.innerHTML = `
    <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.75rem;">Put Your Healing Into Motion Right Now</h3>
    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Use our built-in mindfulness and cognitive exercises immediately:</p>
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <button class="btn btn-primary" id="btn-results-open-breath">
        🫁 Practice Recommended Breathing
      </button>
      <button class="btn btn-secondary" id="btn-results-open-cbt">
        📝 Deconstruct a Negative Thought (CBT)
      </button>
      <button class="btn btn-secondary" id="btn-results-home">
        🏠 Back to Home Hub
      </button>
    </div>
  `;

  container.appendChild(footer);

  setTimeout(() => {
    document.getElementById('btn-results-open-breath')?.addEventListener('click', () => switchView('breath'));
    document.getElementById('btn-results-open-cbt')?.addEventListener('click', () => switchView('cbt'));
    document.getElementById('btn-results-home')?.addEventListener('click', () => switchView('home'));
  }, 50);
}

/* ========================================================
   BREATHWORK GYM CONTROLLER
   ======================================================== */
function initBreathGym() {
  state.breathPacer = new BreathPacer('breath-canvas', 'pacer-instruction', 'pacer-timer', 'pacer-cycles');

  // Mode Tabs
  const modeTabs = document.querySelectorAll('[data-breath-mode]');
  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-breath-mode');
      state.breathPacer.setMode(mode);
    });
  });

  // Start / Pause Toggle
  const toggleBtn = document.getElementById('btn-pacer-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (state.breathPacer.isRunning) {
        state.breathPacer.stop();
        toggleBtn.textContent = '▶ Resume Breathing';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
      } else {
        state.breathPacer.start();
        toggleBtn.textContent = '⏸ Pause Session';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
      }
    });
  }

  // Reset
  const resetBtn = document.getElementById('btn-pacer-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.breathPacer.reset();
      if (toggleBtn) {
        toggleBtn.textContent = '▶ Begin Breathing';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
      }
    });
  }

  // Sound Toggle
  const soundBtn = document.getElementById('btn-pacer-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isSoundOn = state.breathPacer.toggleSound();
      soundBtn.textContent = isSoundOn ? '🔔 Sound: On' : '🔕 Sound: Off';
    });
  }
}

/* ========================================================
   CBT THOUGHT DETANGLER CONTROLLER
   ======================================================== */
function initCbtTool() {
  // Render Distortion Chips
  const container = document.getElementById('cbt-distortions-container');
  if (container) {
    container.innerHTML = '';
    COGNITIVE_DISTORTIONS.forEach(d => {
      const chip = document.createElement('button');
      chip.className = 'chip-btn';
      chip.setAttribute('type', 'button');
      chip.setAttribute('data-distortion-id', d.id);
      chip.innerHTML = `
        <strong>${d.icon} ${d.name}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${d.desc}</div>
      `;

      chip.addEventListener('click', () => {
        if (state.selectedDistortions.has(d.id)) {
          state.selectedDistortions.delete(d.id);
          chip.classList.remove('selected');
        } else {
          state.selectedDistortions.add(d.id);
          chip.classList.add('selected');
        }
      });

      container.appendChild(chip);
    });
  }

  // Preloaded Example Pills
  const examplePillsContainer = document.getElementById('cbt-examples-pills');
  if (examplePillsContainer) {
    examplePillsContainer.innerHTML = '';
    CBT_PRELOADED_EXAMPLES.forEach(ex => {
      const pill = document.createElement('button');
      pill.className = 'btn btn-secondary btn-sm';
      pill.textContent = ex.title;
      pill.addEventListener('click', () => loadCbtExample(ex));
      examplePillsContainer.appendChild(pill);
    });
  }

  // Generate Reframe Button
  const genBtn = document.getElementById('btn-generate-reframe');
  if (genBtn) {
    genBtn.addEventListener('click', generateCbtReframe);
  }

  // Copy Reframe
  const copyBtn = document.getElementById('btn-copy-reframe');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = document.getElementById('cbt-reframed-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✓ Copied to Clipboard!';
        setTimeout(() => copyBtn.textContent = '📋 Copy Reframe', 2000);
      });
    });
  }

  // Clear CBT
  const clearBtn = document.getElementById('btn-clear-cbt');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCbtForm);
  }
}

function loadCbtExample(ex) {
  document.getElementById('cbt-input-thought').value = ex.originalThought;
  document.getElementById('cbt-input-evidence').value = ex.evidenceAgainst;
  document.getElementById('cbt-input-friend').value = ex.friendAdvice;

  // Clear and select matching chips
  state.selectedDistortions.clear();
  document.querySelectorAll('#cbt-distortions-container .chip-btn').forEach(btn => {
    const id = btn.getAttribute('data-distortion-id');
    if (ex.distortions.includes(id)) {
      state.selectedDistortions.add(id);
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Display the output
  document.getElementById('cbt-reframed-text').textContent = ex.reframedThought;
  document.getElementById('cbt-output-box').style.display = 'block';
}

function generateCbtReframe() {
  const thought = document.getElementById('cbt-input-thought').value.trim();
  const evidence = document.getElementById('cbt-input-evidence').value.trim();
  const friend = document.getElementById('cbt-input-friend').value.trim();

  if (!thought) {
    alert('Please enter the negative thought you would like to deconstruct.');
    return;
  }

  // Distortions summary text
  let distortionNames = [];
  COGNITIVE_DISTORTIONS.forEach(d => {
    if (state.selectedDistortions.has(d.id)) {
      distortionNames.push(d.name);
    }
  });

  const distText = distortionNames.length > 0 
    ? `I recognize my mind was trapped in ${distortionNames.join(' and ')}.` 
    : `I recognize this thought is an emotional reaction rather than an objective fact.`;

  const evText = evidence ? `The verifiable reality is that: ${evidence}.` : '';
  const frText = friend ? `Remember: ${friend}.` : '';

  const synthesized = `"${distText} While I initially felt: '${thought}', ${evText} ${frText} I choose to release extreme catastrophizing and focus on what is within my constructive control right now."`;

  document.getElementById('cbt-reframed-text').textContent = synthesized;
  const box = document.getElementById('cbt-output-box');
  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearCbtForm() {
  document.getElementById('cbt-input-thought').value = '';
  document.getElementById('cbt-input-evidence').value = '';
  document.getElementById('cbt-input-friend').value = '';
  state.selectedDistortions.clear();
  document.querySelectorAll('#cbt-distortions-container .chip-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  document.getElementById('cbt-output-box').style.display = 'none';
}

/* ========================================================
   CRISIS DIRECTORY
   ======================================================== */
function initCrisisDirectory() {
  const container = document.getElementById('crisis-list-container');
  if (!container) return;

  container.innerHTML = '';
  CRISIS_RESOURCES.forEach(r => {
    const card = document.createElement('div');
    card.className = 'crisis-card';
    card.innerHTML = `
      <div>
        <span class="crisis-badge">${r.badge}</span>
        <div class="crisis-country">${r.country}</div>
        <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-secondary);">${r.name}</div>
        <div class="crisis-contact">${r.contact}</div>
      </div>
      <div>
        <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="width: 100%; text-decoration: none;">
          Official Helpline Website ↗
        </a>
      </div>
    `;
    container.appendChild(card);
  });
}

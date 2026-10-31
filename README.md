# 🪞 MindMirror — Psychological Problem Screener & Personality Discovery WebApp

**MindMirror** is an interactive, compassionate psychological wellness and self-discovery web application. It helps individuals identify the emotional hurdles they are facing, provides actionable 3-tier coping blueprints to overcome them, and uncovers their unique personality archetype to reveal how their cognitive wiring influences their response to stress.

---

## 🌟 Key Capabilities

### 1. 🧠 Emotional Problem Screener (Distress Screener)
Evaluates **7 core psychological dimensions** adapted from clinically recognized screening frameworks (GAD-7, PHQ-9, Maslach Burnout Inventory, Insomnia Severity Index, and Clance Imposter Scale):
- **🌪️ Anxiety & Overthinking**: Anticipatory dread, cognitive loops, somatic tension.
- **🔋 Burnout & Emotional Exhaustion**: Chronic depletion, cynicism, feeling running on empty.
- **🌧️ Depressive Fog & Low Vitality**: Loss of joy (anhedonia), heavy fatigue, harsh self-criticism.
- **⚡ Acute Stress & Overwhelm**: Executive bandwidth saturation, sensory overload, irritability.
- **🌙 Sleep & Somatic Disturbance**: Racing thoughts at night, delayed sleep onset, unrefreshing rest.
- **🪞 Imposter Syndrome & Self-Doubt**: Perfectionistic fear of failure, attributing success to luck.
- **🛡️ Boundary Fatigue & People-Pleasing**: Inability to say no, absorbing emotional burdens of others.

### 2. 🛠️ Actionable 3-Tier Coping Blueprint ("Your Mind Prescription")
For the user's primary challenge, MindMirror automatically generates:
- **Neurobiological Explainer**: What is happening in the nervous system (amygdala hijack, HPA axis, cortisol, dopamine).
- **Tier 1: Immediate Triage (0 – 5 Mins)**: Step-by-step somatic de-escalation (Physiological Sigh, 5-4-3-2-1 Grounding, Brain Dumps).
- **Tier 2: Daily Rebalancing Micro-Habits (Next 7 Days)**: 3 concrete daily habits with realistic implementation rules.
- **Tier 3: CBT Cognitive Reframe**: Transforms automatic distorted thoughts into grounded, objective realities.
- **Self-Compassion Anchor Mantra**: A memorable phrase to stabilize self-talk.
- **Clinical Advisory**: Evidence-informed guidance on when and how to seek licensed therapy.

### 3. 🎭 Personality Archetype Compass
Evaluates 4 bipolar cognitive axes (Energy vector, Perception lens, Decision compass, Lifestyle architecture) and maps users to **8 memorable psychological archetypes**:
- 🌿 **The Empathetic Harmonizer**: Emotional heart, diplomatic, community anchor.
- 🦉 **The Strategic Architect**: Systems thinker, long-range planner, analytical.
- 🦅 **The Visionary Pioneer**: Creative innovator, associative thinker, catalyst of ideas.
- 🌊 **The Deep Contemplator**: Introspective philosopher, truth-seeker, quiet wisdom.
- ⚡ **The Resilient Catalyst**: Pragmatic problem solver, unflappable in crises.
- 🎨 **The Sensitive Dreamer**: Authentic, poetic soul, value-driven artist.
- 🛡️ **The Grounded Protector**: Methodical, dependable guardian, loyal rock.
- 🌟 **The Dynamic Communicator**: Magnetic storyteller, uplifting social connector.

### 4. ✨ Dynamic Cross-Synthesis
When users complete both assessments, MindMirror calculates a **custom intersection analysis**:
> *Example: How an **Empathetic Harmonizer** experiences **Burnout** vs. how a **Strategic Architect** experiences **Burnout**.*

### 5. 🫁 Interactive Breathwork Gym
- Real-time animated canvas pacer with smooth breathing feedback.
- **3 Modes**: Box Breathing (4-4-4-4), 4-7-8 Relaxing Sleep Breath, and Physiological Sigh (Vagal reset).
- Web Audio API gentle sound chime toggle (runs 100% offline).

### 6. 📝 CBT Thought De-Tangler
- Step-by-step cognitive restructuring tool.
- Catalogs 7 classic cognitive distortions (Catastrophizing, Mind Reading, All-or-Nothing, "Should" Statements, etc.).
- Preloaded scenarios for Work Anxiety, Relationship Insecurity, and Perfectionism.
- Synthesizes balanced perspectives with one-click clipboard copying.

### 7. 🔒 100% Private & Safe
- Runs entirely in the client browser (`localStorage`).
- Zero tracking, zero data transmitted to any cloud servers.
- Prominent crisis hotline directory (US 988, UK 111, Canada 988, India, Australia, International).

---

## 🚀 How to Run the Web Application

### Option A: Double-Click Launcher (Windows)
Double-click:
```
start.bat
```
This launches `server.js` and immediately opens the app in your default web browser at `http://localhost:3000`.

### Option B: Node.js Terminal
Run in the `mind-mirror` directory:
```bash
node server.js
```
Then visit `http://localhost:3000`.

### Option C: Direct Browser Opening (No Server Needed)
Double-click `index.html` or open it directly in Chrome, Edge, Firefox, or Safari (`file:///.../index.html`). All scripts, styles, audio synthesis, and logic work offline without external dependencies!

---

## 📁 Project Architecture

```
d:\Antigravity project\mind-mirror\
├── index.html            # Main semantic Single Page Application
├── server.js             # Zero-dependency Node.js HTTP server
├── start.bat             # Windows one-click launcher
├── test.js               # Comprehensive test suite
├── README.md             # Documentation
├── css/
│   ├── main.css          # Design system, themes (Light/Dark), typography, resets
│   └── components.css    # Cards, sliders, progress bars, radar charts, pacer styles
└── js/
    ├── questions.js      # 12 Problem questions + 8 Personality questions
    ├── engine.js         # Scoring, archetypes, blueprints, and cross-synthesis
    ├── breath-pacer.js   # Canvas animation & Web Audio chime engine
    ├── cbt-tool.js       # Cognitive distortions & CBT restructuring logic
    └── app.js            # Main UI coordinator, event handling & views
```

---

## ⚠️ Medical & Educational Disclaimer
*MindMirror is an educational and self-reflection web tool designed to foster emotional awareness and provide evidence-informed coping techniques. It does not constitute medical advice, clinical diagnosis, or psychiatric treatment. If you are experiencing thoughts of self-harm or severe psychiatric distress, please consult a licensed mental health professional or contact an emergency helpline.*

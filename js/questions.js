/**
 * MindMirror - Question Datasets
 * 1. Problem Assessment (Emotional Distress & Psychological Screener)
 * 2. Personality Archetype Assessment
 */

const PROBLEM_CATEGORIES = {
  anxiety: {
    id: 'anxiety',
    name: 'Anxiety & Overthinking',
    icon: '🌪️',
    color: '#6366f1',
    description: 'Mental loops, anticipatory worry, somatic tension, and difficulty calming the nervous system.'
  },
  burnout: {
    id: 'burnout',
    name: 'Burnout & Emotional Exhaustion',
    icon: '🔋',
    color: '#f97316',
    description: 'Chronic mental depletion, emotional numbness, loss of motivation, and feeling drained despite rest.'
  },
  depression: {
    id: 'depression',
    name: 'Depressive Fog & Low Vitality',
    icon: '🌧️',
    color: '#0284c7',
    description: 'Persistent heaviness, loss of pleasure in usual activities, low energy, and critical self-talk.'
  },
  stress: {
    id: 'stress',
    name: 'Acute Stress & Overwhelm',
    icon: '⚡',
    color: '#ef4444',
    description: 'Feeling unable to cope with accumulating life demands, sensory overload, and emotional irritability.'
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep & Somatic Disturbance',
    icon: '🌙',
    color: '#8b5cf6',
    description: 'Racing mind at night, interrupted sleep, waking up unrefreshed, and daytime cognitive fatigue.'
  },
  imposter: {
    id: 'imposter',
    name: 'Imposter Syndrome & Self-Doubt',
    icon: '🪞',
    color: '#ec4899',
    description: 'Chronic fear of being exposed as incompetent, perfectionistic paralysis, and discounting personal achievements.'
  },
  boundaries: {
    id: 'boundaries',
    name: 'People-Pleasing & Boundary Fatigue',
    icon: '🛡️',
    color: '#10b981',
    description: 'Difficulty saying no, absorbing other people\'s emotional baggage, conflict avoidance, and resentment.'
  }
};

const PROBLEM_QUESTIONS = [
  // Anxiety & Overthinking
  {
    id: 'p1',
    category: 'anxiety',
    question: 'How often do you find your mind trapped in repetitive "what if" scenarios, dreading potential future problems?',
    subtext: 'Consider your baseline over the past 2–4 weeks.',
    options: [
      { text: 'Rarely or Never — My mind stays relatively present.', score: 0 },
      { text: 'Occasionally — Usually before high-stakes events.', score: 1 },
      { text: 'Frequently — I spend hours replaying worries.', score: 2 },
      { text: 'Almost Constantly — It feels like an unstoppable mental loop.', score: 3 }
    ]
  },
  {
    id: 'p2',
    category: 'anxiety',
    question: 'Do you experience physical sensations of anxiety (e.g., tight chest, shallow breathing, clenched jaw, restlessness)?',
    subtext: 'Your body often registers anxiety before your conscious mind does.',
    options: [
      { text: 'Almost never — My body generally feels calm and relaxed.', score: 0 },
      { text: 'Mildly — Only when actively dealing with acute deadlines.', score: 1 },
      { text: 'Noticeably — Muscle tension or racing heart occurs several days a week.', score: 2 },
      { text: 'Severely — Constant physical tightness, stomach knots, or jitters.', score: 3 }
    ]
  },
  // Burnout & Emotional Exhaustion
  {
    id: 'p3',
    category: 'burnout',
    question: 'When you wake up in the morning, how do you feel regarding your energy and the day ahead?',
    subtext: 'Evaluate your mental and physical battery.',
    options: [
      { text: 'Rested & Curious — Ready to tackle my priorities.', score: 0 },
      { text: 'A bit sluggish — Takes a coffee or shower to get going.', score: 1 },
      { text: 'Mentally drained — Even after sleeping, I feel depleted.', score: 2 },
      { text: 'Utterly exhausted — Dread getting out of bed; feel running on empty.', score: 3 }
    ]
  },
  {
    id: 'p4',
    category: 'burnout',
    question: 'Have you noticed an increase in cynicism, detachment, or feeling like "nothing really matters"?',
    subtext: 'Emotional numbness and detachment are protective defenses against prolonged overload.',
    options: [
      { text: 'Not at all — I stay engaged and care deeply about what I do.', score: 0 },
      { text: 'Occasionally — When I have had a particularly long week.', score: 1 },
      { text: 'Frequently — I find myself checking out emotionally or feeling indifferent.', score: 2 },
      { text: 'Very often — I feel deeply disillusioned and emotionally disconnected.', score: 3 }
    ]
  },
  // Depressive Fog & Low Vitality
  {
    id: 'p5',
    category: 'depression',
    question: 'How is your ability to experience genuine joy, enthusiasm, or excitement for things you usually love?',
    subtext: 'Psychologists refer to this reduction in pleasure as anhedonia.',
    options: [
      { text: 'Vibrant — I readily enjoy hobbies, friends, and small pleasures.', score: 0 },
      { text: 'Slightly muted — Some things feel less exciting, but still enjoyable.', score: 1 },
      { text: 'Significantly dampened — Most activities feel like a chore or flat.', score: 2 },
      { text: 'Almost gone — I feel an emotional numbness or persistent gray haze.', score: 3 }
    ]
  },
  {
    id: 'p6',
    category: 'depression',
    question: 'How loud is your internal self-critic (feelings of guilt, inadequacy, or hopelessness)?',
    subtext: 'Notice the tone of the voice you use to speak to yourself.',
    options: [
      { text: 'Kind & Supportive — I give myself grace when things go wrong.', score: 0 },
      { text: 'Occasional self-doubt — But I can bounce back fairly quickly.', score: 1 },
      { text: 'Frequently harsh — I often blame myself or feel not good enough.', score: 2 },
      { text: 'Relentless — Persistent feeling of worthlessness or deep discouragement.', score: 3 }
    ]
  },
  // Acute Stress & Overwhelm
  {
    id: 'p7',
    category: 'stress',
    question: 'When multiple tasks or unexpected events pile up, how does your capacity to cope respond?',
    subtext: 'Assesses executive function and cognitive bandwidth under pressure.',
    options: [
      { text: 'Resilient — I prioritize calmly and take one step at a time.', score: 0 },
      { text: 'Strained but functional — I get a bit stressed, then regain control.', score: 1 },
      { text: 'Overwhelmed — I feel paralyzed, irritable, or want to avoid everything.', score: 2 },
      { text: 'Near breaking point — Minor inconveniences provoke extreme panic or tears.', score: 3 }
    ]
  },
  {
    id: 'p8',
    category: 'stress',
    question: 'How frequently do you feel irritable, short-tempered, or on edge with colleagues, friends, or family?',
    subtext: 'Irritability is one of the most reliable markers of a flooded nervous system.',
    options: [
      { text: 'Rarely — I maintain patience even in chaotic situations.', score: 0 },
      { text: 'Occasionally — Only when hungry or sleep-deprived.', score: 1 },
      { text: 'Frequently — I snap quickly or have a very short emotional fuse.', score: 2 },
      { text: 'Almost daily — I constantly feel agitated or easily triggered.', score: 3 }
    ]
  },
  // Sleep & Somatic Disturbance
  {
    id: 'p9',
    category: 'sleep',
    question: 'What happens when your head hits the pillow at night?',
    subtext: 'Your circadian rhythm and sleep onset latency reveal nervous system activation.',
    options: [
      { text: 'Easy transition — I fall asleep peacefully within 15–20 minutes.', score: 0 },
      { text: 'Mild delay — Sometimes takes 30–45 mins if I had a stimulating day.', score: 1 },
      { text: 'Racing thoughts — Mind reviews the day, plans tomorrow, or spins on worries.', score: 2 },
      { text: 'Chronic struggle — Severe insomnia, wake up repeatedly, or dread bedtime.', score: 3 }
    ]
  },
  // Imposter Syndrome & Self-Doubt
  {
    id: 'p10',
    category: 'imposter',
    question: 'When you accomplish something significant, what is your genuine internal reaction?',
    subtext: 'How you attribute your successes reveals your relationship with competence.',
    options: [
      { text: 'Pride & Satisfaction — I acknowledge my effort and capability.', score: 0 },
      { text: 'Modest gratitude — Happy it worked, though recognize some luck.', score: 1 },
      { text: 'Relief masked as luck — "I just got lucky, they will realize I am faking."', score: 2 },
      { text: 'Intense fraudulence — Terrified of being "found out" as inadequate.', score: 3 }
    ]
  },
  // People-Pleasing & Boundary Fatigue
  {
    id: 'p11',
    category: 'boundaries',
    question: 'How easy or difficult is it for you to say "No" when someone asks for your time, energy, or favors?',
    subtext: 'Healthy boundaries protect your emotional integrity and prevent hidden resentment.',
    options: [
      { text: 'Healthy & Clear — I say no respectfully without lingering guilt.', score: 0 },
      { text: 'Mildly hesitant — Sometimes say yes when I prefer not to, but manage ok.', score: 1 },
      { text: 'Very difficult — I say yes out of fear of disappointing or conflict.', score: 2 },
      { text: 'Almost impossible — I constantly sacrifice my well-being to please others.', score: 3 }
    ]
  },
  {
    id: 'p12',
    category: 'boundaries',
    question: 'Do you carry silent resentment toward people because you give much more than you receive?',
    subtext: 'Unspoken resentment is the classic symptom of porous emotional boundaries.',
    options: [
      { text: 'No — My relationships feel mutual, balanced, and open.', score: 0 },
      { text: 'Rarely — Only in a specific isolated relationship.', score: 1 },
      { text: 'Often — I feel taken for granted yet keep over-delivering.', score: 2 },
      { text: 'Deeply & Constantly — I feel exhausted carrying everyone else\'s emotional weight.', score: 3 }
    ]
  }
];

/**
 * Personality Dimensions:
 * 1. EI: Extraversion vs Introversion (Where you draw energy)
 * 2. NS: Intuition / Big Picture vs Sensing / Grounded Reality (How you process info)
 * 3. TF: Thinking / Logic vs Feeling / Empathy (How you make decisions)
 * 4. JP: Conscientious Structure vs Spontaneous Flow (How you organize life)
 */
const PERSONALITY_QUESTIONS = [
  // E vs I (Energy Recharge)
  {
    id: 'pers_1',
    dimension: 'EI',
    question: 'After an exhausting, high-intensity week, how does your battery recharge most naturally?',
    subtext: 'Notice what truly restores your vitality, not just what looks good on paper.',
    options: [
      {
        text: 'Solitary Sanctuary: Quiet time alone with a book, hobby, or peaceful walk without needing to talk.',
        trait: 'I',
        weight: 2
      },
      {
        text: 'Intimate Connection: A quiet one-on-one dinner with a close confidant, but generally low social stimulation.',
        trait: 'I',
        weight: 1
      },
      {
        text: 'Vibrant Gathering: Meeting up with a group of friends, attending a social event, or being around lively atmosphere.',
        trait: 'E',
        weight: 1
      },
      {
        text: 'High-Energy Socializing: Hosting, conversing, making new connections — being around people energizes me.',
        trait: 'E',
        weight: 2
      }
    ]
  },
  {
    id: 'pers_2',
    dimension: 'EI',
    question: 'When you are trying to understand a complex problem or emotion, what is your instinctual habit?',
    subtext: 'Examines internal cognitive digestion vs external verbal processing.',
    options: [
      {
        text: 'Internalizing: I retreat into my mind, journal, or reflect deeply before uttering a word.',
        trait: 'I',
        weight: 2
      },
      {
        text: 'Quiet Contemplation: I think it through privately first, then may share with one trusted person.',
        trait: 'I',
        weight: 1
      },
      {
        text: 'Discussion: Talking it out with someone helps me hear my own thoughts and formulate clarity.',
        trait: 'E',
        weight: 1
      },
      {
        text: 'Verbal Brainstorming: I need to speak thoughts out loud; ideas take form as I interact with others.',
        trait: 'E',
        weight: 2
      }
    ]
  },
  // N vs S (Information Lens)
  {
    id: 'pers_3',
    dimension: 'NS',
    question: 'When learning something new or planning a project, which perspective naturally grabs you first?',
    subtext: 'Abstract visionaries focus on possibilities; grounded realists focus on tangible facts.',
    options: [
      {
        text: 'Concrete Facts & Steps: Tell me exactly what exists, the verifiable data, and the practical realistic steps.',
        trait: 'S',
        weight: 2
      },
      {
        text: 'Hands-On Pragmatism: I prefer proven methods, observable reality, and tangible immediate applications.',
        trait: 'S',
        weight: 1
      },
      {
        text: 'Conceptual Frameworks: I look for underlying patterns, future implications, and innovative alternatives.',
        trait: 'N',
        weight: 1
      },
      {
        text: 'Visionary Possibilities: I dwell in the world of "what could be", metaphors, big-picture dreams, and novel theories.',
        trait: 'N',
        weight: 2
      }
    ]
  },
  {
    id: 'pers_4',
    dimension: 'NS',
    question: 'How do you describe your day-to-day conversation style?',
    subtext: 'Notice whether you lean toward literal details or symbolic concepts.',
    options: [
      {
        text: 'Grounded & Literal: I share specific events, sequential details, and what actually occurred in clear terms.',
        trait: 'S',
        weight: 1
      },
      {
        text: 'Philosophical & Metaphorical: I connect random ideas, discuss meanings, philosophy, and future visions.',
        trait: 'N',
        weight: 1
      }
    ]
  },
  // T vs F (Decision Compass)
  {
    id: 'pers_5',
    dimension: 'TF',
    question: 'When a close friend or colleague comes to you with a dilemma, what is your gut response?',
    subtext: 'Assesses whether your primary instinct is analytical troubleshooting or empathetic resonance.',
    options: [
      {
        text: 'Analytical Architecture: I instantly analyze the root cause, identify flaws, and suggest logical solutions.',
        trait: 'T',
        weight: 2
      },
      {
        text: 'Objective Fairness: I look at the objective facts and principles of fairness before looking at emotions.',
        trait: 'T',
        weight: 1
      },
      {
        text: 'Empathetic Presence: I first validate how they feel, listen with warmth, and ensure they feel understood.',
        trait: 'F',
        weight: 1
      },
      {
        text: 'Deep Compassionate Attunement: I feel what they feel deeply; protecting their emotional well-being is top priority.',
        trait: 'F',
        weight: 2
      }
    ]
  },
  {
    id: 'pers_6',
    dimension: 'TF',
    question: 'When making a tough life choice, what is your ultimate non-negotiable anchor?',
    subtext: 'Your north star: logical consistency or alignment with human values & feelings.',
    options: [
      {
        text: 'Logical truth, rationality, and strategic long-term efficiency — even if it hurts feelings.',
        trait: 'T',
        weight: 2
      },
      {
        text: 'Core human values, empathy, harmony, and how it impacts the hearts of people involved.',
        trait: 'F',
        weight: 2
      }
    ]
  },
  // J vs P (Life Architecture)
  {
    id: 'pers_7',
    dimension: 'JP',
    question: 'How do you prefer to approach your weekly schedule and daily tasks?',
    subtext: 'Structure and deliberate order vs flexibility and dynamic spontaneous flow.',
    options: [
      {
        text: 'Strict Order: Structured calendar, to-do lists checked off methodically; I hate loose ends and surprises.',
        trait: 'J',
        weight: 2
      },
      {
        text: 'Planned Framework: I like a clear roadmap and deadlines, though I can adapt when necessary.',
        trait: 'J',
        weight: 1
      },
      {
        text: 'Adaptive Rhythm: I keep my options open, respond to what inspires me in the moment, and dislike rigid boxes.',
        trait: 'P',
        weight: 1
      },
      {
        text: 'Spontaneous Exploration: Pure flexibility; strict schedules suffocate my creativity. I thrive in responsive flow.',
        trait: 'P',
        weight: 2
      }
    ]
  },
  {
    id: 'pers_8',
    dimension: 'JP',
    question: 'When going on a vacation or road trip, which style sounds most enjoyable to you?',
    subtext: 'Reveals your comfort level with ambiguity vs advance certainty.',
    options: [
      {
        text: 'Curated Itinerary: Bookings confirmed, key attractions scheduled, logistics mapped in advance.',
        trait: 'J',
        weight: 1
      },
      {
        text: 'Open Horizon: Just book the ticket; figure out accommodations and wander wherever curiosity leads upon arrival.',
        trait: 'P',
        weight: 1
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROBLEM_CATEGORIES,
    PROBLEM_QUESTIONS,
    PERSONALITY_QUESTIONS
  };
}

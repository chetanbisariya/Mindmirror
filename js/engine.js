/**
 * MindMirror - Psychological Scoring & Synthesis Engine
 * Calculates distress dimensions, personality archetypes, and synthesizes personalized recovery blueprints.
 */

let _PROBLEM_QUESTIONS = typeof PROBLEM_QUESTIONS !== 'undefined' ? PROBLEM_QUESTIONS : [];
let _PROBLEM_CATEGORIES = typeof PROBLEM_CATEGORIES !== 'undefined' ? PROBLEM_CATEGORIES : {};
let _PERSONALITY_QUESTIONS = typeof PERSONALITY_QUESTIONS !== 'undefined' ? PERSONALITY_QUESTIONS : [];

if (typeof require !== 'undefined') {
  try {
    const qData = require('./questions.js');
    _PROBLEM_QUESTIONS = qData.PROBLEM_QUESTIONS;
    _PROBLEM_CATEGORIES = qData.PROBLEM_CATEGORIES;
    _PERSONALITY_QUESTIONS = qData.PERSONALITY_QUESTIONS;
  } catch (e) {}
}

// Personality Archetypes Catalog
const PERSONALITY_ARCHETYPES = {
  HARMONIZER: {
    id: 'HARMONIZER',
    name: 'The Empathetic Harmonizer',
    code: 'E/F Axis',
    archetypeIcon: '🌿',
    tagline: 'The Emotional Heart & Compassionate Anchor',
    summary: 'You possess an extraordinary gift for emotional attunement, community connection, and intuitive warmth. You naturally sense how others feel before they even speak, and you pour yourself into creating harmony and genuine belonging.',
    strengths: [
      'High Emotional Intelligence (EQ) & deep empathy',
      'Natural diplomat and compassionate mediator in group friction',
      'Inspires trust, psychological safety, and loyalty in others',
      'Value-driven and deeply committed to uplifting those around you'
    ],
    shadows: [
      'Vulnerability to people-pleasing and boundary collapse',
      'Absorbing the emotional residue and trauma of others as your own',
      'Difficulty articulating personal needs out of fear of causing disharmony',
      'Prone to severe guilt when having to disappoint anyone'
    ],
    stressReaction: 'When overwhelmed, you tend to over-function for others while silently collapsing inward, feeling unappreciated and emotionally depleted.',
    optimalRecharge: 'Boundaried solitude in serene natural surroundings, heart-to-heart sharing with reciprocal listeners, and explicit permission to do nothing for anyone else.'
  },
  ARCHITECT: {
    id: 'ARCHITECT',
    name: 'The Strategic Architect',
    code: 'N/T/J Axis',
    archetypeIcon: '🦉',
    tagline: 'The Visionary Systems Thinker & Master Strategist',
    summary: 'You view the world through a lens of principles, strategic patterns, and optimization. You have high standards, an incisive intellect, and a relentless drive to turn complex chaos into elegant, functional systems.',
    strengths: [
      'Clarity of vision, long-range foresight, and objective rationality',
      'High intellectual independence and disdain for inefficient dogma',
      'Exceptional capability to execute structured, ambitious long-term plans',
      'Calm, analytical composure in the face of logistical chaos'
    ],
    shadows: [
      'Perfectionism and impatience with emotional inefficiency',
      'Risk of paralysis by analysis when information feels incomplete',
      'Tendency to intellectualize emotions rather than feeling and processing them',
      'Holding yourself and others to unrealistically severe standards'
    ],
    stressReaction: 'Under intense stress, you obsessively micromanage, withdraw into cynical isolation, or become hypercritical of minor flaws.',
    optimalRecharge: 'Uninterrupted deep-work flow, intellectual deep-dives on complex topics, physical workouts with clear metrics, and quiet order.'
  },
  PIONEER: {
    id: 'PIONEER',
    name: 'The Visionary Pioneer',
    code: 'E/N/P Axis',
    archetypeIcon: '🦅',
    tagline: 'The Inspiring Innovator & Catalyst of Possibility',
    summary: 'You are fueled by curiosity, novel possibilities, and creative vitality. You see invisible connections everywhere, love igniting new projects, and inspire those around you with infectious enthusiasm and open-minded optimism.',
    strengths: [
      'Boundless creative imagination and associative thinking',
      'Magnetic enthusiasm that rallies people around new visions',
      'Adaptable, quick on your feet, and energized by genuine novelty',
      'Deep appreciation for individuality and unconventional perspectives'
    ],
    shadows: [
      'Difficulty following through on tedious, repetitive maintenance steps',
      'Shiny object syndrome and chronic mental restlessness',
      'Tendency to overcommit and spread your focus across too many frontiers',
      'Fear of missing out (FOMO) and commitment anxiety'
    ],
    stressReaction: 'Under stress, you become scattered, hyper-distracted, anxious about feeling trapped, or experience sudden crashes of uncharacteristic doom.',
    optimalRecharge: 'Unstructured creative exploration, novel environments, brainstorming without deadlines, and playful physical activities.'
  },
  CONTEMPLATOR: {
    id: 'CONTEMPLATOR',
    name: 'The Deep Contemplator',
    code: 'I/N Axis',
    archetypeIcon: '🌊',
    tagline: 'The Introspective Philosopher & Seeker of Truth',
    summary: 'You inhabit a rich, nuanced inner landscape. You are reflective, observant, and driven by an insatiable desire to understand the deeper meaning of life, human nature, and consciousness.',
    strengths: [
      'Profound introspective depth and conceptual originality',
      'Exceptional ability to listen quietly and perceive hidden subtexts',
      'Fierce authenticity and unwillingness to conform to superficial trends',
      'Capacity for deep, nuanced contemplation and creative synthesis'
    ],
    shadows: [
      'Risk of existential melancholy and chronic social alienation',
      'Overthinking mundane decisions until everyday action feels burdensome',
      'Tendency to retreat completely into your mental cave when hurt',
      'Sensitivity to sensory overload, harsh criticism, or superficial environments'
    ],
    stressReaction: 'When overwhelmed, you disconnect from your physical body, spiral into existential doubt, and build invisible walls around your vulnerability.',
    optimalRecharge: 'Complete silence, reading in cozy nooks, contemplative journaling, solitary walks in nature, and immersion in evocative art or music.'
  },
  CATALYST: {
    id: 'CATALYST',
    name: 'The Resilient Catalyst',
    code: 'S/T/P Axis',
    archetypeIcon: '⚡',
    tagline: 'The Pragmatic Problem Solver & Crisis Master',
    summary: 'You are grounded, action-oriented, and unflappable. Where others panic, you assess the immediate facts with calm practicality and take decisive action to troubleshoot the obstacle in front of you.',
    strengths: [
      'Exceptional composure, adaptability, and grit under pressure',
      'Pragmatic, no-nonsense problem solving rooted in tangible reality',
      'Hands-on mastery and quick mastery of technical or physical tools',
      'Direct, refreshingly honest, and grounded communication'
    ],
    shadows: [
      'Can come across as emotionally blunt, skeptical, or detached',
      'Impatience with theoretical discussions that lack immediate practical utility',
      'Tendency to bury emotional vulnerabilities beneath physical activity or thrill-seeking',
      'Disdain for rigid rules or long-winded corporate red tape'
    ],
    stressReaction: 'Under stress, you either shut down emotionally into cynical silence or act out impulsively to break the tension.',
    optimalRecharge: 'Vigorous physical exercise, working with tangible materials or mechanics, high-adrenaline sports, and unstructured personal autonomy.'
  },
  DREAMER: {
    id: 'DREAMER',
    name: 'The Sensitive Dreamer',
    code: 'I/F/P Axis',
    archetypeIcon: '🎨',
    tagline: 'The Poetic Soul & Guardian of Authenticity',
    summary: 'You are guided by a deep internal moral compass, immense empathy, and an artistic, idealistic spirit. You yearn for deep authenticity, meaningful connection, and a world where every soul is free to be their truest self.',
    strengths: [
      'Extraordinary capacity for unconditional acceptance and empathy',
      'Rich creative imagination and artistic or expressive sensitivity',
      'Unyielding dedication to core personal values and quiet justice',
      'Ability to see beauty and poetry in the ordinary and the vulnerable'
    ],
    shadows: [
      'Prone to deep self-doubt, vulnerability to emotional wounds, and feeling misunderstood',
      'Idealistic expectations colliding painfully with harsh real-world realities',
      'Difficulty dealing with administrative or commercial logistics',
      'Tends to withdraw and freeze when faced with interpersonal conflict'
    ],
    stressReaction: 'Under severe stress, you fall into deep melancholic paralysis, feeling alien to the world and questioning your worth or creative gift.',
    optimalRecharge: 'Creative flow (painting, writing, crafting), gentle sanctuary with no demands, time with animals, and reading stories that feed the spirit.'
  },
  PROTECTOR: {
    id: 'PROTECTOR',
    name: 'The Grounded Protector',
    code: 'I/S/J Axis',
    archetypeIcon: '🛡️',
    tagline: 'The Steadfast Anchor & Devoted Guardian',
    summary: 'You are the dependable bedrock of any family, team, or community. Methodical, observant, and deeply loyal, you take quiet pride in creating stability, remembering every detail, and protecting what matters most.',
    strengths: [
      'Unshakable reliability, integrity, and follow-through on commitments',
      'Meticulous memory for personal details, traditions, and practical needs',
      'Quiet, humble dedication without needing the spotlight',
      'Master of logistical stability, order, and comforting domestic harmony'
    ],
    shadows: [
      'Overwhelming reluctance to embrace sudden change or uncertainty',
      'Tendency to bottle up personal pain and martyr yourself silently',
      'Taking on heavy burdens without ever asking for help',
      'Difficulty forgiving yourself for perceived mistakes or oversights'
    ],
    stressReaction: 'Under stress, you catastrophize worst-case scenarios about the future, feel unappreciated, and exhaust yourself cleaning or organizing frantically.',
    optimalRecharge: 'A predictable, cozy routine, relaxing domestic hobbies (baking, gardening, crafting), quiet gratitude, and a clean, serene living space.'
  },
  COMMUNICATOR: {
    id: 'COMMUNICATOR',
    name: 'The Dynamic Communicator',
    code: 'E/S Axis',
    archetypeIcon: '🌟',
    tagline: 'The Magnetic Storyteller & Community Catalyst',
    summary: 'You bring vibrant energy, charm, and presence wherever you step. You are a natural connector of people, pragmatic yet expressive, with a talent for transforming mundane moments into celebratory memories.',
    strengths: [
      'Effortless social magnetism, warmth, and engaging storytelling',
      'Pragmatic realism combined with uplifting infectious optimism',
      'Quick ability to read group dynamics and break the ice',
      'Generous, playful, and deeply attentive to the sensory joys of life'
    ],
    shadows: [
      'Vulnerability to needing external validation or approval',
      'Tendency to avoid facing heavy negative emotions by seeking distractions',
      'Difficulty with prolonged solitary work or abstract long-term planning',
      'Impulsive commitments made in the heat of enthusiasm'
    ],
    stressReaction: 'Under stress, you fear abandonment, become hyper-sensitive to perceived coldness, or compulsively seek social buzz to avoid empty quiet.',
    optimalRecharge: 'Fun, laughter-filled gatherings with close friends, immersive live events, physical movement, and warm celebratory experiences.'
  }
};

// Detailed Problem Blueprints (Fixes & Prescriptions)
const PROBLEM_BLUEPRINTS = {
  anxiety: {
    title: 'Generalized Anxiety & Overthinking',
    subTitle: 'Your Nervous System is Operating in Constant Anticipatory Alarm',
    neurology: 'Your amygdala (the brain\'s smoke detector) has become hyper-sensitized. It treats imagined future scenarios with the same acute physiological urgency as immediate physical threats. This floods your system with adrenaline and keeps your prefrontal cortex trapped in "what-if" cognitive loops.',
    immediateRescue: {
      name: 'The Physiological Sigh & 5-4-3-2-1 Sensory Reset',
      duration: '3 Minutes',
      steps: [
        'Take two quick breaths through your nose: one deep inhale, followed immediately by a sharp "top-off" inhale.',
        'Release a long, slow sigh through an open mouth (6 to 8 seconds). Repeat 3 times to immediately trigger the parasympathetic vagal brake.',
        'Engage the 5-4-3-2-1 grounding: Name 5 things you can see right now, 4 physical textures you can feel, 3 distinct sounds you can hear, 2 things you can smell, and 1 taste.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Establish a 15-Minute "Worry Window"',
        detail: 'Schedule 5:00 PM to 5:15 PM daily as designated worry time. When worries arise at 11:00 AM, write them down and say: "I will process this at 5:00 PM." 80% of worries lose their urgency before the window arrives.'
      },
      {
        title: 'Caffeine Decoupling & Morning Cortisol Reset',
        detail: 'Delay your first cup of caffeine by 90 minutes after waking. Step outside into natural morning daylight for 10 minutes to reset your circadian adenosine clearance.'
      },
      {
        title: 'Body-First Grounding (Somatic Shakeout)',
        detail: 'Stand up and gently shake out your hands, shoulders, and legs for 60 seconds whenever you notice circular thoughts. Movement discharges stuck sympathetic arousal.'
      }
    ],
    cbtReframe: {
      thought: '"What if everything goes wrong and I ruin everything?"',
      distortion: 'Catastrophizing & Probability Overestimation',
      reframe: '"My mind is trying to protect me by imagining extremes, but thoughts are not facts. What is the most realistic outcome based on past evidence? Even if something goes awry, I have the resources to handle it step by step."'
    },
    mantra: 'I am safe in this present moment. I do not need to solve the future right now.',
    proAdvice: 'If racing anxiety triggers frequent panic attacks or prevents sleep for more than a month, working with a Cognitive Behavioral Therapist (CBT) or Acceptance and Commitment Therapy (ACT) practitioner is highly transformative.'
  },

  burnout: {
    title: 'Burnout & Emotional Exhaustion',
    subTitle: 'Your Internal Battery Is Completely Depleted from Prolonged Unbalanced Output',
    neurology: 'Burnout is not ordinary fatigue; it is allostatic overload. Your hypothalamic-pituitary-adrenal (HPA) axis has been running hot for months, resulting in blunted cortisol, dopamine depletion, and emotional flatlining as the brain enters protective shutdown.',
    immediateRescue: {
      name: 'Radical Low-Stimulation Reset',
      duration: '10 Minutes',
      steps: [
        'Close all computer tabs, mute notifications, and place your phone in another room.',
        'Lie flat on the floor or a firm sofa with your legs elevated on a pillow or wall (Viparita Karani pose).',
        'Place a cool, damp washcloth over your closed eyes and allow your jaw and tongue to go completely limp. Do not try to meditate or be productive.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Build a Non-Negotiable "Buffer Zone"',
        detail: 'Block off 45 minutes between finishing work/obligations and starting personal life. No emails, no domestic demands. Let your brain decompress.'
      },
      {
        title: 'Audit Your Energy Leaks with the "Energy Ledger"',
        detail: 'For 3 days, label your daily tasks with (+) Energizing, (-) Draining, or (=) Neutral. Ruthlessly eliminate or delegate 2 draining tasks that produce zero meaningful value.'
      },
      {
        title: 'Shift from Passive Numbing to Active Restoration',
        detail: 'Doom-scrolling social media exhausts your dopamine circuits further. Replace 30 minutes of scrolling with gentle sensory joy: warm baths, slow instrumental music, or walking without podcasts.'
      }
    ],
    cbtReframe: {
      thought: '"I should be doing more; taking a break means I am lazy."',
      distortion: '"Should" Statement & False Dichotomy',
      reframe: '"Rest is not a reward earned after exhaustion; rest is a biological prerequisite for functioning. Machines that run continuously without maintenance break down. Resting is an act of stewardship."'
    },
    mantra: 'My worth is not measured by my productivity. I give myself permission to pause.',
    proAdvice: 'Burnout requires systemic environmental boundaries, not just self-care. If your workplace or caregiving demands are unsustainable, consider speaking to an occupational psychologist or exploring structured leave.'
  },

  depression: {
    title: 'Depressive Fog & Low Vitality',
    subTitle: 'Your Motivation & Joy Circuits Are Dampened Under Heavy Cognitive Haze',
    neurology: 'Depression involves dysregulation in dopamine and serotonin pathways, coupled with hyperactivity in the brain\'s Default Mode Network (DMN), the circuit responsible for self-referential rumination, guilt, and gloom.',
    immediateRescue: {
      name: 'Micro-Action Rule (The 2-Minute Physical Spark)',
      duration: '2 Minutes',
      steps: [
        'Depression tells you: "Wait until you feel motivated before you move." The neurological reality is: "Action precedes motivation."',
        'Pick the absolute smallest physical action: splash cold water on your face, wash a single cup, or open the window blinds to let sunlight in.',
        'Acknowledge that completing this micro-step in the face of heavy fatigue is a legitimate victory.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Behavioral Activation Scheduling',
        detail: 'Schedule 1 tiny enjoyable or mastery-oriented activity daily (e.g. 5 minutes sketching, stepping outside, listening to an old favorite song), regardless of initial desire.'
      },
      {
        title: 'Direct Morning Sunlight Exposure',
        detail: 'Get 15 minutes of direct morning sunlight into your eyes (without looking directly at the sun) within 1 hour of waking to stimulate retinal ganglion cells and boost mood-regulating neuromodulators.'
      },
      {
        title: 'Compassionate Voice Journaling',
        detail: 'When the internal critic attacks, write down its statement, then rewrite it as if you were speaking to a 7-year-old child who is tired and struggling.'
      }
    ],
    cbtReframe: {
      thought: '"Nothing ever gets better and I have no energy to try."',
      distortion: 'Emotional Reasoning & Fortune Telling',
      reframe: '"I am feeling heavy right now, but feelings are temporary weather systems, not permanent climates. The fact that I feel tired today does not predict my entire future. One gentle step at a time is enough."'
    },
    mantra: 'This heaviness is something I am carrying, not who I am. Better days are ahead.',
    proAdvice: 'Depression is treatable and you do not have to carry it alone. Please reach out to a licensed counselor, physician, or mental health hotline for compassionate, professional care.'
  },

  stress: {
    title: 'Acute Stress & Overwhelm',
    subTitle: 'Cognitive Bandwidth Overload & Executive Function Saturation',
    neurology: 'Your working memory holds 4 to 7 items maximum. When life demands 20 items simultaneously, your prefrontal cortex experiences severe cognitive bottlenecking, triggering elevated cortisol, irritability, and executive paralysis.',
    immediateRescue: {
      name: 'The Brain-Dump & Eisenhower Triage',
      duration: '5 Minutes',
      steps: [
        'Grab a blank piece of paper and write down EVERY single task, worry, and chore spinning in your head until your mind feels completely empty.',
        'Draw a line through anything you cannot control today.',
        'Select ONLY ONE single item that will be your sole focus for the next 25 minutes. Hide everything else from view.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Implement the "Rule of 3" Daily',
        detail: 'Never start a day with a 20-item to-do list. Identify the 3 critical outcomes that truly move the needle. When those 3 are done, the day is considered a success.'
      },
      {
        title: 'Single-Tasking Sanctuary',
        detail: 'Multitasking increases cortisol production by 30%. Close extra browser tabs. Put your phone in "Do Not Disturb" mode during focused work blocks.'
      },
      {
        title: 'Vagus Nerve Reset: Cold Water Exposure',
        detail: 'Submerge your face in a bowl of ice-cold water or splash cold water on your forehead and cheeks for 15 seconds. This stimulates the mammalian dive reflex and drops heart rate.'
      }
    ],
    cbtReframe: {
      thought: '"If I do not get everything done today, disaster will strike."',
      distortion: 'Catastrophizing & All-or-Nothing Thinking',
      reframe: '"Most things on my plate are urgent in feeling, but not critical in reality. What actually happens if this waits until tomorrow? The world will keep spinning, and I will be more capable with a clear mind."'
    },
    mantra: 'I can only do one thing at a time, and that is more than enough.',
    proAdvice: 'Chronic stress damages cardiovascular and immune health over time. Consider stress-reduction coaching, MBSR (Mindfulness-Based Stress Reduction), or restructuring workload.'
  },

  sleep: {
    title: 'Sleep & Somatic Disturbance',
    subTitle: 'Hyper-Aroused Nervous System Impeding Natural Circadian Transition',
    neurology: 'Your brain associates bedtime with problem-solving or anxiety instead of biological surrender. High nocturnal cortisol keeps core body temperature elevated, preventing the natural dip needed for deep restorative slow-wave sleep.',
    immediateRescue: {
      name: 'The 20-Minute "Reset & Return" Rule',
      duration: '20 Minutes',
      steps: [
        'If you are tossing and turning for more than 20 minutes, DO NOT stay in bed watching the clock.',
        'Get out of bed in dim, amber light. Sit in a comfortable chair and read a physical book or listen to calming audio.',
        'Return to bed only when your eyelids feel heavy. This breaks the neurological conditioning linking bed with frustration.'
      ]
    },
    weeklyHabits: [
      {
        title: 'The "Digital Sun-Down" at 9:00 PM',
        detail: 'Blue light from screens suppresses melatonin release by up to 85%. Turn screens off 60 minutes before bed or activate dark-orange blue-light blocking filters.'
      },
      {
        title: 'Bedtime Mental Offload (Worry Journal)',
        detail: 'Keep a notebook on your nightstand. Before lying down, spend 3 minutes writing down tomorrow\'s schedule and any nagging thoughts to signal your brain they are stored safely.'
      },
      {
        title: 'Thermal Core Dip (Warm Shower Hack)',
        detail: 'Take a warm bath or shower 90 minutes before sleep. When you exit, blood rushes to the extremities, causing your core body temperature to rapidly drop, which triggers natural sleepiness.'
      }
    ],
    cbtReframe: {
      thought: '"If I do not fall asleep in 10 minutes, tomorrow will be a total disaster."',
      distortion: 'Catastrophic Fortune Telling',
      reframe: '"Resting my body quietly in darkness still gives my muscles and heart restorative recovery, even if I am not fully asleep yet. Human bodies are remarkably resilient, and I have functioned fine after poor nights before."'
    },
    mantra: 'The day is done. There is nothing left to solve tonight. I release control.',
    proAdvice: 'Cognitive Behavioral Therapy for Insomnia (CBT-I) is the gold standard clinical treatment for chronic sleep issues and is far more effective long-term than sleep medications.'
  },

  imposter: {
    title: 'Imposter Syndrome & Self-Doubt',
    subTitle: 'Perfectionistic Standards Shielding Hidden Fears of Inadequacy',
    neurology: 'The imposter phenomenon stems from an asymmetry in how you process evidence: successes are filtered out as "luck" or "timing," while mistakes are amplified as proof of fundamental inadequacy. This keeps your threat circuitry on high guard.',
    immediateRescue: {
      name: 'The "Evidence Folder" Reality Check',
      duration: '4 Minutes',
      steps: [
        'Open a dedicated note on your phone titled "Fact Bank: Concrete Evidence of Competence."',
        'Review 3 factual, documented successes: degrees earned, projects completed, positive client reviews, or problems you solved.',
        'Remind yourself: Luck does not repeatedly perform consistent complex tasks; your skill did.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Embrace "B+ Quality" as the Standard',
        detail: 'Perfectionism is anxiety in fancy clothing. For 3 low-stakes tasks this week, deliberately stop at 85% completion instead of 100%. Notice that nothing explodes.'
      },
      {
        title: 'Track Success Attributions',
        detail: 'When someone compliments your work, replace "Oh, it was nothing / I got lucky" with a simple: "Thank you, I put a lot of careful thought into that."'
      },
      {
        title: 'Normalize the Learning Curve',
        detail: 'When you feel out of your depth, say: "I feel like a fraud because I am growing at the edge of my comfort zone, not because I am incompetent."'
      }
    ],
    cbtReframe: {
      thought: '"Everyone here is smarter than me; it is only a matter of time before I am exposed."',
      distortion: 'Mind Reading & Discounting the Positive',
      reframe: '"I am comparing my messy internal doubts to everyone else\'s polished external highlight reel. No one knows everything. I earned my seat at this table, and I am allowed to learn as I go."'
    },
    mantra: 'I do not need to be flawless to be worthy and capable.',
    proAdvice: 'Imposter syndrome often flourishes in high-achieving environments with little psychological safety. Connecting with mentors and peers who openly discuss their own vulnerabilities can dissolve the illusion.'
  },

  boundaries: {
    title: 'People-Pleasing & Boundary Fatigue',
    subTitle: 'Your Protective Boundaries Have Dissolved to Maintain External Approval',
    neurology: 'People-pleasing is often a "fawn" trauma/stress response. Your nervous system historically learned that staying safe and loved required monitoring other people\'s emotional states and preemptively accommodating them at your own expense.',
    immediateRescue: {
      name: 'The "24-Hour Buffer" Script',
      duration: 'Instant',
      steps: [
        'Whenever someone asks you for a favor or commitment, eliminate the automatic reflex "Yes."',
        'Use this non-negotiable script: "Thanks for thinking of me! Let me check my current priorities and calendar, and I will get back to you by tomorrow."',
        'This creates critical cognitive space between the external request and your nervous system\'s pleasing reflex.'
      ]
    },
    weeklyHabits: [
      {
        title: 'Practice the "Kind No" Without Over-Explaining',
        detail: 'Over-explaining your reasons invites negotiation. Practice saying: "I won\'t be able to take that on right now, but thank you for asking." Clear and polite.'
      },
      {
        title: 'Check Your Resentment Thermometer',
        detail: 'Whenever you feel angry or bitter toward someone, ask yourself: "Where did I say yes when I really wanted to say no?" Resentment is your boundary alarm.'
      },
      {
        title: 'Embrace the Discomfort of Other People\'s Reactions',
        detail: 'You are responsible for being respectful; you are NOT responsible for managing another adult\'s disappointment when you enforce a reasonable boundary.'
      }
    ],
    cbtReframe: {
      thought: '"If I say no, they will be upset with me and think I am selfish and uncaring."',
      distortion: 'Emotional Reasoning & Mind Reading',
      reframe: '"Saying no to an external demand is saying yes to my own health and integrity. True relationships respect boundaries; relationships that only survive when I sacrifice myself are not healthy."'
    },
    mantra: 'My needs are valid. "No" is a complete and loving sentence.',
    proAdvice: 'If boundary setting causes overwhelming terror or panic, working with a therapist on assertiveness training and inner child reparenting creates deep lasting peace.'
  }
};

/**
 * Score calculation functions
 */
function calculateProblemResults(answers) {
  // answers: { questionId: score }
  const categoryScores = {
    anxiety: 0,
    burnout: 0,
    depression: 0,
    stress: 0,
    sleep: 0,
    imposter: 0,
    boundaries: 0
  };

  const categoryMaxPossible = {
    anxiety: 0,
    burnout: 0,
    depression: 0,
    stress: 0,
    sleep: 0,
    imposter: 0,
    boundaries: 0
  };

  // Tally scores based on questions dataset
  _PROBLEM_QUESTIONS.forEach(q => {
    categoryMaxPossible[q.category] += 3;
    const ansScore = answers[q.id] !== undefined ? answers[q.id] : 0;
    categoryScores[q.category] += ansScore;
  });

  // Calculate percentages
  const percentages = {};
  let totalScore = 0;
  let totalMax = 0;

  Object.keys(categoryScores).forEach(cat => {
    percentages[cat] = Math.round((categoryScores[cat] / categoryMaxPossible[cat]) * 100);
    totalScore += categoryScores[cat];
    totalMax += categoryMaxPossible[cat];
  });

  const overallPercentage = Math.round((totalScore / totalMax) * 100);

  // Sort categories by score descending
  const sortedCategories = Object.keys(categoryScores).sort((a, b) => {
    return percentages[b] - percentages[a];
  });

  const primaryCategory = sortedCategories[0];
  const secondaryCategory = sortedCategories[1];

  let severity = 'Low';
  let severityClass = 'severity-low';
  let severityDescription = 'Balanced & Resilient Baseline. You are currently navigating daily life with healthy psychological bandwidth.';

  if (overallPercentage >= 65 || percentages[primaryCategory] >= 75) {
    severity = 'Elevated';
    severityClass = 'severity-high';
    severityDescription = 'Significant Emotional Strain Detected. Your nervous system is signaling that your current load is exceeding sustainable capacity. Prioritizing active recovery is essential.';
  } else if (overallPercentage >= 35 || percentages[primaryCategory] >= 50) {
    severity = 'Moderate';
    severityClass = 'severity-medium';
    severityDescription = 'Moderate Stress & Fatigue. You are functioning, but carrying noticeable strain in specific areas. Proactive micro-interventions will prevent deeper depletion.';
  }

  const blueprint = PROBLEM_BLUEPRINTS[primaryCategory];
  const secondaryBlueprint = PROBLEM_BLUEPRINTS[secondaryCategory];

  return {
    categoryScores,
    percentages,
    overallPercentage,
    primaryCategory,
    secondaryCategory,
    primaryMeta: (_PROBLEM_CATEGORIES && _PROBLEM_CATEGORIES[primaryCategory]) || { id: primaryCategory, name: primaryCategory, icon: '🧠', color: '#6366f1', description: '' },
    secondaryMeta: (_PROBLEM_CATEGORIES && _PROBLEM_CATEGORIES[secondaryCategory]) || { id: secondaryCategory, name: secondaryCategory, icon: '🧠', color: '#8b5cf6', description: '' },
    severity,
    severityClass,
    severityDescription,
    blueprint,
    secondaryBlueprint,
    sortedCategories
  };
}

function calculatePersonalityResults(answers) {
  // answers: { questionId: { trait: 'E', weight: 2 } }
  const traitScores = {
    E: 0,
    I: 0,
    N: 0,
    S: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  };

  _PERSONALITY_QUESTIONS.forEach(q => {
    const selected = answers[q.id];
    if (selected && selected.trait && selected.weight) {
      traitScores[selected.trait] += selected.weight;
    }
  });

  // Determine dominant poles
  const EI = traitScores.E >= traitScores.I ? 'E' : 'I';
  const NS = traitScores.N >= traitScores.S ? 'N' : 'S';
  const TF = traitScores.T >= traitScores.F ? 'T' : 'F';
  const JP = traitScores.J >= traitScores.P ? 'J' : 'P';

  const fourLetterCode = `${EI}${NS}${TF}${JP}`;

  // Dimension percentages
  const totalEI = (traitScores.E + traitScores.I) || 1;
  const totalNS = (traitScores.N + traitScores.S) || 1;
  const totalTF = (traitScores.T + traitScores.F) || 1;
  const totalJP = (traitScores.J + traitScores.P) || 1;

  const ratios = {
    E: Math.round((traitScores.E / totalEI) * 100),
    I: Math.round((traitScores.I / totalEI) * 100),
    N: Math.round((traitScores.N / totalNS) * 100),
    S: Math.round((traitScores.S / totalNS) * 100),
    T: Math.round((traitScores.T / totalTF) * 100),
    F: Math.round((traitScores.F / totalTF) * 100),
    J: Math.round((traitScores.J / totalJP) * 100),
    P: Math.round((traitScores.P / totalJP) * 100)
  };

  // Map 4-letter or dominant dimensions to our 8 core archetypes
  let matchedKey = 'HARMONIZER';

  if (NS === 'N' && TF === 'T' && JP === 'J') {
    matchedKey = 'ARCHITECT'; // INTJ / ENTJ
  } else if (EI === 'E' && NS === 'N' && JP === 'P') {
    matchedKey = 'PIONEER'; // ENFP / ENTP
  } else if (EI === 'I' && NS === 'N') {
    matchedKey = 'CONTEMPLATOR'; // INFJ / INTP
  } else if (NS === 'S' && TF === 'T' && JP === 'P') {
    matchedKey = 'CATALYST'; // ESTP / ISTP
  } else if (EI === 'I' && TF === 'F') {
    matchedKey = 'DREAMER'; // INFP / ISFP
  } else if (NS === 'S' && JP === 'J') {
    matchedKey = 'PROTECTOR'; // ISFJ / ISTJ
  } else if (EI === 'E' && NS === 'S') {
    matchedKey = 'COMMUNICATOR'; // ESFP / ESTJ
  } else {
    matchedKey = 'HARMONIZER'; // ENFJ / ESFJ
  }

  const archetype = PERSONALITY_ARCHETYPES[matchedKey];

  return {
    fourLetterCode,
    matchedKey,
    archetype,
    traitScores,
    ratios,
    dominantAxes: {
      energy: EI === 'E' ? `Extraverted (${ratios.E}%)` : `Introverted (${ratios.I}%)`,
      lens: NS === 'N' ? `Visionary / Intuitive (${ratios.N}%)` : `Grounded / Practical (${ratios.S}%)`,
      decisions: TF === 'T' ? `Analytical / Logic (${ratios.T}%)` : `Empathetic / Heart (${ratios.F}%)`,
      lifestyle: JP === 'J' ? `Structured / Methodical (${ratios.J}%)` : `Spontaneous / Fluid (${ratios.P}%)`
    }
  };
}

/**
 * Cross-Synthesis: Intersects personality archetype with current primary challenge
 */
function generateCrossSynthesis(problemKey, archetypeKey) {
  const synthesisMatrix = {
    HARMONIZER: {
      anxiety: 'As an Empathetic Harmonizer, your anxiety often centers on relationship dynamics, fear of upsetting others, or hyper-vigilance about social acceptance. Your antidote is recognizing that you cannot control how other people feel, and learning to sit comfortably with temporary tension.',
      burnout: 'You are vulnerable to "compassion fatigue." You pour from an empty cup because saying no feels painful. Your recovery requires radical energetic boundaries: treating your energy as sacred, not as communal property.',
      depression: 'When you feel depressed, you often hide behind a bright smile so you don’t burden anyone else. Your healing breakthrough occurs when you let someone else support and hold space for you.',
      stress: 'You absorb stress from your entire environment like an emotional sponge. Step away from toxic group chats and allow yourself periods of isolated silence to discharge other people\'s energy.',
      sleep: 'Nighttime is when your brain reviews every interaction from the day, worrying if someone felt slighted. Use self-compassion mantras before bed.',
      imposter: 'You tend to credit everyone else on your team while erasing your own crucial contributions. Practice claiming your legitimate accomplishments.',
      boundaries: 'This is your primary lifelong growth edge. Remember: Boundaries are the distance at which you can love both yourself and others simultaneously.'
    },
    ARCHITECT: {
      anxiety: 'Your anxiety manifests as "paralysis by analysis." You try to calculate every 10-step contingency to eliminate uncertainty. Your fix is somatic: moving out of your head and into physical sensations, accepting that uncertainty is inherent to life.',
      burnout: 'You drive yourself ruthlessly toward perfection, viewing rest as an inconvenient logistical inefficiency. You must reframe rest as strategic recovery that keeps your brain functioning at peak performance.',
      depression: 'You tend to intellectualize depressive feelings, seeking a logical equation to fix it. Allow yourself to simply feel without needing an immediate algorithmic solution.',
      stress: 'When stressed, you become hypercritical and micromanage everything. Delegate, let low-priority tasks stay imperfect, and take a step back from the control tower.',
      sleep: 'Your active brain wants to solve tomorrow\'s problems at midnight. Keep a notepad by your bed to park ideas outside your working memory.',
      imposter: 'Because your standards are astronomically high, you view anything less than flawlessness as incompetence. Learn to celebrate a 90% execution.',
      boundaries: 'You generally have clear intellectual boundaries, but may struggle with emotional tolerance when others do not meet your high standards.'
    },
    PIONEER: {
      anxiety: 'Your racing visionary mind generates endless possibilities — and your anxiety turns those into catastrophic "what-if" branches. Anchor yourself in physical grounding and pick ONE concrete task.',
      burnout: 'You burn out from over-committing to exciting projects and neglecting physical self-care. Practice saying: "That is a brilliant idea, but not for this season of my life."',
      depression: 'When depression hits, you feel suffocated by routine and lose your creative spark. Seek small, low-pressure sparks of novelty: walk a new neighborhood or learn something whimsical.',
      stress: 'You scatter in ten directions at once when overwhelmed. Put away all devices and focus on just one physical micro-task to restore your executive flow.',
      sleep: 'Late-night creative ideas keep your dopamine firing. Implement a strict "screens off" ritual 60 minutes before bedtime.',
      imposter: 'Because you jump between interests, you may fear you are a "jack of all trades, master of none." Remember that your associative synthesis is your superpower.',
      boundaries: 'You struggle to say no to new ideas and collaborations. Guard your schedule as fiercely as you guard your freedom.'
    },
    CONTEMPLATOR: {
      anxiety: 'You experience anxiety as existential dread and intense internal rumination. Break the loop by talking to a trusted friend or engaging in vigorous physical movement.',
      burnout: 'Sensory overload and prolonged superficial socializing deeply drain your nervous system. You need deep, restorative quiet in low-sensory environments.',
      depression: 'You can spiral into dark philosophical nihilism. Counteract this by finding grounded, simple tactile rituals: cooking, planting, or petting an animal.',
      stress: 'Under stress, you retreat into your shell and shut down communication. Let loved ones know you just need temporary quiet, not that you are abandoning them.',
      sleep: 'Your philosophical mind wakes up at 2 AM. Avoid reading intense or heavy topics right before bed; choose light, soothing fiction or nature audio.',
      imposter: 'You feel misunderstood or like an outsider. Recognize that your depth and quiet wisdom are rare gifts in a fast-paced world.',
      boundaries: 'You often tolerate boundary violations silently until you abruptly slam the emotional door. Practice expressing minor preferences earlier.'
    },
    CATALYST: {
      anxiety: 'You experience anxiety physically: fidgeting, restlessness, and an urge to escape or take drastic action. Channel that energy into high-intensity physical workouts or hands-on projects.',
      burnout: 'You push your body to physical limits and ignore early warning fatigue signs until you crash. Schedule non-negotiable physical rest days.',
      depression: 'You may mask emotional pain with thrill-seeking, work, or distractions. Slow down and allow yourself to talk honestly about what hurts.',
      stress: 'Under stress, you can become blunt, impatient, and reactive. Practice the 10-second pause before responding to frustrating messages.',
      sleep: 'Physical exhaustion usually helps you sleep, but chronic tension can cause restlessness. Use progressive muscle relaxation before bed.',
      imposter: 'You focus on pragmatic outcomes; if something feels overly theoretical or corporate, you may feel out of place. Trust your practical troubleshooting genius.',
      boundaries: 'You have natural boundaries with strangers, but may avoid addressing deep emotional conflicts with those closest to you.'
    },
    DREAMER: {
      anxiety: 'Your rich imagination can invent vivid emotional scenarios of rejection or failure. Ground yourself in factual reality and creative expression.',
      burnout: 'Working in environments that violate your authentic values drains your spirit faster than physical labor. Seek value-aligned projects and gentle sanctuaries.',
      depression: 'Depression feels like a poetic sadness that pulls you inward. Gentle creative expression (writing, painting) without judgment can act as a bridge back to life.',
      stress: 'You freeze and experience executive paralysis under chaotic demands. Break your mountain down into a single gentle pebble of action.',
      sleep: 'Emotional sensitivity can cause vivid, restless dreams or sleep onset anxiety. Herbal teas, warm baths, and calming instrumental soundscapes are your allies.',
      imposter: 'You often undervalue your gentle, empathetic qualities because the world rewards loud aggression. Your quiet empathy is deeply needed.',
      boundaries: 'You dislike conflict so intensely that you swallow your own desires. Remember that honest boundaries preserve friendships; silent martyrdom destroys them.'
    },
    PROTECTOR: {
      anxiety: 'You worry about worst-case disruptions to family, security, or financial stability. Challenge these catastrophizing thoughts with historical evidence of your resilience.',
      burnout: 'You carry the silent domestic or organizational load of everyone around you. You must ask for tangible help and let others share the weight.',
      depression: 'You hide your struggle behind dependable competence. Reach out to someone you trust and tell them: "I am having a hard time right now."',
      stress: 'Unpredictable changes and chaotic disruptions spike your stress. Create small predictable daily rituals that anchor your sense of control.',
      sleep: 'You mentally tick through tomorrow\'s errands and checklists at night. Write them on paper before bed to give your mind permission to sleep.',
      imposter: 'You downplay your immense organizational skill as "just common sense." Acknowledge how much value your steady dependability creates.',
      boundaries: 'You feel immense guilt when saying no to family or close friends. Reframe saying no as protecting your longevity so you can continue to care.'
    },
    COMMUNICATOR: {
      anxiety: 'Your anxiety often manifests as social anxiety or fear of missing out and losing relevance. Disconnect from social media and reconnect with one grounding friend.',
      burnout: 'You exhaust yourself performing and entertaining for others even when you feel empty. Give yourself permission to be quiet and unentertaining.',
      depression: 'Loneliness and feeling unseen trigger deep emotional drops for you. Seek genuine, intimate one-on-one connection rather than superficial crowd buzz.',
      stress: 'You become frantic and talkative when stressed, seeking instant reassurance. Practice deep belly breathing in solitude to self-soothe.',
      sleep: 'High sensory stimulation late into the evening disrupts your melatonin. Dim the lights and swap screens for calming acoustic sounds at night.',
      imposter: 'You worry that if people see you without your charm or humor, they won\'t like you. Your authentic vulnerability is far more lovable than a performance.',
      boundaries: 'You fear saying no because you don\'t want to disappoint anyone. True friends celebrate your boundaries.'
    }
  };

  const defaultSynthesis = 'By understanding your personality wiring, you can stop fighting your natural instincts and instead craft coping mechanisms tailored specifically to your psychological blueprint.';

  const archetypeDict = synthesisMatrix[archetypeKey] || synthesisMatrix.HARMONIZER;
  return archetypeDict[problemKey] || defaultSynthesis;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PERSONALITY_ARCHETYPES,
    PROBLEM_BLUEPRINTS,
    calculateProblemResults,
    calculatePersonalityResults,
    generateCrossSynthesis
  };
}

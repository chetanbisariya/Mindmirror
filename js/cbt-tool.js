/**
 * MindMirror - Cognitive Distortion Catalog & CBT Thought De-Tangler
 */

const COGNITIVE_DISTORTIONS = [
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    icon: '🌋',
    desc: 'Assuming the absolute worst-case scenario will inevitably happen, blowing problems out of proportion.'
  },
  {
    id: 'all_or_nothing',
    name: 'All-or-Nothing Thinking',
    icon: '⚖️',
    desc: 'Viewing situations in black-and-white extremes. If something is not 100% perfect, you consider it a total failure.'
  },
  {
    id: 'mind_reading',
    name: 'Mind Reading',
    icon: '🔮',
    desc: 'Assuming you know what others are thinking about you (usually negative), without any verifiable factual evidence.'
  },
  {
    id: 'emotional_reasoning',
    name: 'Emotional Reasoning',
    icon: '💔',
    desc: 'Believing that because you feel a certain way, it must be the objective truth ("I feel worthless, therefore I am worthless").'
  },
  {
    id: 'should_statements',
    name: '"Should" & "Must" Statements',
    icon: '📏',
    desc: 'Torturing yourself with rigid rules ("I should never struggle," "I must always please everyone"), generating guilt and resentment.'
  },
  {
    id: 'discounting_positive',
    name: 'Discounting the Positive',
    icon: '🧹',
    desc: 'Rejecting good experiences, achievements, or compliments by insisting they "don\'t count" or were "just luck."'
  },
  {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    icon: '🔁',
    desc: 'Taking a single negative event and viewing it as an endless, permanent pattern of defeat ("This always happens to me").'
  }
];

const CBT_PRELOADED_EXAMPLES = [
  {
    title: 'Work / Performance Anxiety',
    originalThought: 'I fumbled my words during the meeting. Everyone thinks I am an incompetent fraud and my boss will fire me.',
    distortions: ['catastrophizing', 'mind_reading', 'all_or_nothing'],
    evidenceAgainst: 'I delivered the project on time, my boss thanked me yesterday, and stumbling over a word is normal human speech.',
    friendAdvice: 'I would tell my friend: nobody remembers your single stumble, they were listening to the content.',
    reframedThought: 'I had one awkward moment, but a stumble does not erase my expertise or performance. Mistakes are human and I am doing good work.'
  },
  {
    title: 'Social / Relationship Insecurity',
    originalThought: 'My friend took 6 hours to reply to my text. They must be sick of me and our friendship is ending.',
    distortions: ['mind_reading', 'catastrophizing', 'emotional_reasoning'],
    evidenceAgainst: 'They have a demanding job and often go offline during busy days. We had a great phone call earlier this week.',
    friendAdvice: 'People have their own busy lives. A delayed message has nothing to do with your worth or friendship.',
    reframedThought: 'Their delay is almost certainly about their busy day, not about me. I choose not to fabricate catastrophic stories in the absence of evidence.'
  },
  {
    title: 'Perfectionism & Procrastination',
    originalThought: 'I missed my morning workout and ate dessert, so my whole healthy routine is ruined and I have zero self-discipline.',
    distortions: ['all_or_nothing', 'overgeneralization'],
    evidenceAgainst: 'I worked out 4 days this week and ate wholesome meals for lunch. One slip is a blip, not a lifestyle collapse.',
    friendAdvice: 'Consistency is about averages over months, not perfection in 24 hours. Enjoy the dessert and get back on track tonight.',
    reframedThought: 'One missed workout does not cancel my weeks of healthy habits. Progress is about resilience, not unbroken perfection.'
  }
];

const CRISIS_RESOURCES = [
  {
    country: 'United States & Canada',
    badge: '24/7 Free & Confidential',
    name: 'Suicide & Crisis Lifeline',
    contact: 'Call or Text 988',
    url: 'https://988lifeline.org'
  },
  {
    country: 'United Kingdom',
    badge: '24/7 Free',
    name: 'Samaritans & NHS Mental Health',
    contact: 'Call 111 (NHS) or 116 123 (Samaritans)',
    url: 'https://www.samaritans.org'
  },
  {
    country: 'India',
    badge: 'Government Helpline',
    name: 'KIRAN National Mental Health Helpline / Vandrevala',
    contact: 'Call 1800-599-0019 or +91 9999 666 555',
    url: 'https://www.vandrevalafoundation.com'
  },
  {
    country: 'Australia',
    badge: '24/7 Crisis Support',
    name: 'Lifeline Australia',
    contact: 'Call 13 11 14',
    url: 'https://www.lifeline.org.au'
  },
  {
    country: 'International / Worldwide',
    badge: 'Global Directory',
    name: 'Befrienders Worldwide & Find A Helpline',
    contact: 'Over 130 countries supported',
    url: 'https://findahelpline.com'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COGNITIVE_DISTORTIONS,
    CBT_PRELOADED_EXAMPLES,
    CRISIS_RESOURCES
  };
}

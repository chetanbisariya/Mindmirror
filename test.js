/**
 * MindMirror - Verification & Test Suite
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Testing MindMirror Application Components ---');

// 1. Test Questions
const { PROBLEM_CATEGORIES, PROBLEM_QUESTIONS, PERSONALITY_QUESTIONS } = require('./js/questions.js');
console.log(`[PASS] Loaded ${Object.keys(PROBLEM_CATEGORIES).length} problem categories`);
console.log(`[PASS] Loaded ${PROBLEM_QUESTIONS.length} problem screening questions`);
console.log(`[PASS] Loaded ${PERSONALITY_QUESTIONS.length} personality archetype questions`);

assert(PROBLEM_QUESTIONS.length === 12, 'Expected 12 problem questions');
assert(PERSONALITY_QUESTIONS.length === 8, 'Expected 8 personality questions');

// Validate problem question structure
PROBLEM_QUESTIONS.forEach(q => {
  assert(q.id && q.category && q.question && Array.isArray(q.options), `Invalid problem question: ${q.id}`);
  assert(PROBLEM_CATEGORIES[q.category], `Missing category config for: ${q.category}`);
  assert(q.options.length === 4, `Question ${q.id} should have 4 options`);
});

// Validate personality question structure
PERSONALITY_QUESTIONS.forEach(q => {
  assert(q.id && q.dimension && q.question && Array.isArray(q.options), `Invalid personality question: ${q.id}`);
  q.options.forEach(opt => {
    assert(opt.trait && opt.weight, `Option missing trait/weight in question ${q.id}`);
  });
});

// 2. Test Scoring Engine
const {
  PERSONALITY_ARCHETYPES,
  PROBLEM_BLUEPRINTS,
  calculateProblemResults,
  calculatePersonalityResults,
  generateCrossSynthesis
} = require('./js/engine.js');

console.log(`[PASS] Loaded ${Object.keys(PERSONALITY_ARCHETYPES).length} personality archetypes`);
console.log(`[PASS] Loaded ${Object.keys(PROBLEM_BLUEPRINTS).length} problem blueprints`);

// Test problem results with simulated anxiety answers
const mockAnxietyAnswers = {
  p1: 3, p2: 3, // Anxiety questions high
  p3: 0, p4: 0,
  p5: 0, p6: 0,
  p7: 1, p8: 0,
  p9: 1, p10: 0,
  p11: 0, p12: 0
};

const probResult = calculateProblemResults(mockAnxietyAnswers);
assert.strictEqual(probResult.primaryCategory, 'anxiety', 'Primary should be anxiety');
assert(probResult.percentages.anxiety === 100, 'Anxiety should be 100%');
assert(probResult.blueprint.immediateRescue.name, 'Blueprint immediate rescue missing');
assert(probResult.blueprint.weeklyHabits.length === 3, 'Expected 3 weekly habits');
console.log(`[PASS] Problem calculation test succeeded (Primary: ${probResult.primaryCategory}, Severity: ${probResult.severity})`);

// Test personality results with simulated introvert/architect answers
const mockPersonalityAnswers = {
  pers_1: { trait: 'I', weight: 2 },
  pers_2: { trait: 'I', weight: 2 },
  pers_3: { trait: 'N', weight: 2 },
  pers_4: { trait: 'N', weight: 1 },
  pers_5: { trait: 'T', weight: 2 },
  pers_6: { trait: 'T', weight: 2 },
  pers_7: { trait: 'J', weight: 2 },
  pers_8: { trait: 'J', weight: 1 }
};

const persResult = calculatePersonalityResults(mockPersonalityAnswers);
assert.strictEqual(persResult.fourLetterCode, 'INTJ', 'Should match INTJ');
assert.strictEqual(persResult.matchedKey, 'ARCHITECT', 'Should match ARCHITECT archetype');
assert(persResult.archetype.strengths.length > 0, 'Archetype should have strengths');
console.log(`[PASS] Personality calculation test succeeded (Type: ${persResult.fourLetterCode}, Archetype: ${persResult.archetype.name})`);

// Test Cross-Synthesis
const synthesis = generateCrossSynthesis('anxiety', 'ARCHITECT');
assert(typeof synthesis === 'string' && synthesis.length > 50, 'Cross synthesis failed');
console.log(`[PASS] Cross-Synthesis test succeeded: "${synthesis.slice(0, 60)}..."`);

// 3. Test CBT Tool
const { COGNITIVE_DISTORTIONS, CBT_PRELOADED_EXAMPLES, CRISIS_RESOURCES } = require('./js/cbt-tool.js');
assert(COGNITIVE_DISTORTIONS.length >= 7, 'Expected at least 7 cognitive distortions');
assert(CBT_PRELOADED_EXAMPLES.length >= 3, 'Expected at least 3 preloaded CBT examples');
assert(CRISIS_RESOURCES.length >= 4, 'Expected global crisis resources');
console.log(`[PASS] CBT Tool data test succeeded (${COGNITIVE_DISTORTIONS.length} distortions, ${CRISIS_RESOURCES.length} crisis directories)`);

// 4. File Structure Check
const requiredFiles = [
  'index.html',
  'standalone.html',
  'server.js',
  'start.bat',
  'css/main.css',
  'css/components.css',
  'js/questions.js',
  'js/engine.js',
  'js/breath-pacer.js',
  'js/cbt-tool.js',
  'js/app.js'
];

requiredFiles.forEach(f => {
  const fullPath = path.join(__dirname, f);
  assert(fs.existsSync(fullPath), `Required file missing: ${f}`);
});
console.log(`[PASS] All ${requiredFiles.length} core files verified!`);

console.log('\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<\n');

import {writeFileSync} from 'node:fs';
import {week3Lessons,week3Guides,week3Contracts,week3Methods} from '../src/week3-content.js';
import {week3Questions} from '../src/week3-questions.js';
import {week3Exam} from '../src/week3-exam.js';
import {week3Plan} from '../src/week3-plan.js';
import {syntaxTrees} from '../src/week3-visuals.js';
writeFileSync(process.argv[2]||'/tmp/week3-data.json',JSON.stringify({lessons:week3Lessons,guides:week3Guides,contracts:week3Contracts,methods:week3Methods,questions:week3Questions,exam:week3Exam,plan:week3Plan,trees:syntaxTrees}));

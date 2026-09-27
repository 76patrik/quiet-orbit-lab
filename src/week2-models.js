// The same finite examples power the reader, labs, exercises and correctness checks.
export const suffixNfa = {
  states:['p','q','r'], alphabet:['0','1'], start:'p', accept:['r'],
  transitions:{p:{0:['p','q'],1:['p']},q:{0:[],1:['r']},r:{0:[],1:[]}}
};
// Transcribed from Aufgaben (1).pdf, PDF page 6; checked against the diagram.
export const exercise6Nfa = {
  states:['q0','q1','q2'], alphabet:['0','2','4'], start:'q0', accept:['q2'],
  transitions:{q0:{'':['q2'],4:['q1']},q1:{2:['q2']},q2:{0:['q0','q2']}}
};
// The sheet calls this a NEA, but every state has exactly one a/b successor.
export const exercise7Dfa = {
  states:['q1','q2','q3','q4','q5','q6','q7','q8'], alphabet:['a','b'], start:'q1', accept:['q8'],
  transitions:{q1:{a:'q2',b:'q3'},q2:{a:'q6',b:'q4'},q3:{a:'q5',b:'q6'},q4:{a:'q2',b:'q6'},q5:{a:'q6',b:'q3'},q6:{a:'q8',b:'q7'},q7:{a:'q8',b:'q7'},q8:{a:'q8',b:'q8'}}
};
export const suffixDfa = {
  states:['A','B','C'], alphabet:['0','1'], start:'A', accept:['C'],
  transitions:{A:{0:'B',1:'A'},B:{0:'B',1:'C'},C:{0:'B',1:'A'}}
};
export const exercise8Dfa = {
  states:['S','A','B','X'], alphabet:['a','b'], start:'S', accept:['B'],
  transitions:{S:{a:'A',b:'X'},A:{a:'A',b:'B'},B:{a:'B',b:'B'},X:{a:'X',b:'X'}}
};
export const examNfa = {
  states:['s','u','v','f'], alphabet:['0','1'], start:'s', accept:['f'],
  transitions:{s:{'':['u']},u:{0:['u'],1:['v']},v:{0:['f']},f:{0:['f'],1:['f']}}
};
export const examDfa = {
  states:['A','B','C','D','E','U'], alphabet:['0','1'], start:'A', accept:['D','E'],
  transitions:{A:{0:'B',1:'C'},B:{0:'B',1:'D'},C:{0:'B',1:'E'},D:{0:'B',1:'D'},E:{0:'B',1:'E'},U:{0:'U',1:'U'}}
};
export const nfaLabel = states => states.length ? `{${states.join(', ')}}` : '∅';

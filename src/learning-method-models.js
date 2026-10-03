// Exact machines for the independent workshop tasks, distinct from worked lesson examples.
const machine=(name,alphabet,start,accept,transitions)=>({name,alphabet,start,accept,transitions,states:Object.keys(transitions)});
const binary=['0','1'],ab=['a','b'];
export const methodMachines={
 dfa:machine('Endet auf 1',binary,'N',['J'],{N:{0:'N',1:'J'},J:{0:'N',1:'J'}}),
 parity:machine('Gerade Anzahl Nullen',binary,'G',['G'],{G:{0:'U',1:'G'},U:{0:'G',1:'U'}}),
 alternate:machine('Kein aa',ab,'N',['N','A'],{N:{a:'A',b:'N'},A:{a:'X',b:'N'},X:{a:'X',b:'X'}}),
 complement:machine('Komplement von a⁺',ab,'S',['S','X'],{S:{a:'A',b:'X'},A:{a:'A',b:'X'},X:{a:'X',b:'X'}}),
 grammar:machine('1*0',binary,'S',['F'],{S:{0:'F',1:'S'},F:{0:'X',1:'X'},X:{0:'X',1:'X'}}),
 transfer:machine('@ und mindestens ein a/b',['@','a','b'],'S',['B'],{S:{'@':'H',a:'X',b:'X'},H:{'@':'X',a:'B',b:'B'},B:{'@':'X',a:'B',b:'B'},X:{'@':'X',a:'X',b:'X'}}),
 determinize:machine('Erreichbarer Potenzmengen-DEA',binary,'A',['C'],{A:{0:'A',1:'B'},B:{0:'C',1:'B'},C:{0:'A',1:'B'}}),
 minimize:machine('Minimaler Quotientenautomat',binary,'S',['F'],{S:{0:'N',1:'N'},N:{0:'N',1:'F'},F:{0:'N',1:'F'}}),
 'regular-grammar':machine('Beginnt mit b und enthält a',ab,'S',['B'],{S:{a:'X',b:'A'},A:{a:'B',b:'A'},B:{a:'B',b:'B'},X:{a:'X',b:'X'}})
};

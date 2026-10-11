"""Generate the week-three companion from the same checked lesson data as the app.
Export /tmp/week3-data.json from the week3-* JS modules before running.
Requires reportlab. Original course PDFs are not embedded.
"""
import json,sys,html
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Table,TableStyle,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing,Line,Circle,String
D=json.load(open(sys.argv[1] if len(sys.argv)>1 else '/tmp/week3-data.json'))
out=sys.argv[2] if len(sys.argv)>2 else 'assets/Lernskript_Woche_3_Theoretische_Informatik.pdf'
pdfmetrics.registerFont(TTFont('DV','/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('DV',normal='DV',bold='DVB')
styles=getSampleStyleSheet()
for key in ['Normal','BodyText','Heading1','Heading2','Heading3','Title']:
 styles[key].fontName='DV'
styles['Normal'].fontSize=9.5;styles['Normal'].leading=14
styles['BodyText'].fontSize=9.5;styles['BodyText'].leading=14;styles['BodyText'].spaceAfter=8
for key,size in [('Title',28),('Heading1',22),('Heading2',14),('Heading3',11)]:
 styles[key].fontName='DVB';styles[key].fontSize=size;styles[key].leading=size*1.3;styles[key].textColor=HexColor('#25463c');styles[key].spaceBefore=12;styles[key].spaceAfter=9
styles.add(ParagraphStyle('Small',fontName='DV',fontSize=8,leading=11,textColor=HexColor('#55646a'),spaceAfter=7))
S=[]
def p(text,style='BodyText'):return Paragraph(html.escape(str(text)).replace('\n','<br/>'),styles[style])
def add(text,style='BodyText'):S.append(p(text,style))
def heading(n,t):add(n,'Small');add(t,'Heading1')
def steps(rows):
 for i,x in enumerate(rows,1):add(f'{i}. {x}')
def table(rows,widths=None):
 t=Table([[p(x,'Small') for x in r] for r in rows],colWidths=widths or [110,365],hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),HexColor('#e7eee9')),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#cad6cf')),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),6)]));S.append(t);S.append(Spacer(1,10))
def trees(trees):
 drawing=Drawing(475,190)
 for idx,root in enumerate(trees):
  points=[];edges=[];count=[0]
  def place(node,depth):
   children=[place(c,depth+1) for c in node.get('children',[])]
   x=sum(c[0] for c in children)/len(children) if children else idx*245+20+count[0]*40
   if not children:count[0]+=1
   v=(x,170-depth*38,node['label']);points.append(v)
   edges.extend((v,c) for c in children);return v
  place(root,0)
  for a,b in edges:drawing.add(Line(a[0],a[1],b[0],b[1],strokeColor=HexColor('#738a7b')))
  for x,y,label in points:
   drawing.add(Circle(x,y,9,fillColor=HexColor('#ffffff'),strokeColor=HexColor('#25463c')))
   drawing.add(String(x,y-3,label,fontName='DV',fontSize=9,textAnchor='middle',fillColor=HexColor('#25463c')))
 S.append(drawing)
def answer(q):
 if q['type']=='choice':return q['options'][q['answer']]
 if q['type']=='set':return '{'+', '.join(q['answer'])+'}' if q['answer'] else '∅'
 return str(q.get('answer',''))
heading('ORBIT · THEORETISCHE INFORMATIK · WOCHE 3','Grenzen verstehen.\nStruktur erkennen.')
add('Lernskript mit Erklärungen, gerechneten Beispielen, 41 Kurzaufgaben, vier vollständigen Eigenaufträgen und einem 20-Punkte-Wochencheck.')
add('05.–11. Oktober 2026 · Klausurvorbereitung für den 20. November · Stand 07.10.2026','Small')
add('So arbeitest du mit diesem Skript','Heading2')
steps(['Vorwissen aktivieren: Paritäts-DEA, Grammatikregeln, ε und ∅ ohne Vorlage erklären.','Pro Kapitel die Begriffe lesen und das gemeinsame Beispiel selbst nachzeichnen.','Den Eigenauftrag ohne Lösung bearbeiten. Die Lösungen stehen getrennt im Anhang.','Nach Fehlern: ersten falschen Schritt markieren, Regel erklären, Miniübung in der App lösen, später eine neue Variante bearbeiten.'])
add('Deine vier Etappen','Heading2')
for l in D['lessons']:add(l['title'])
add('Wissen frei abrufen, selbst rechnen und begründen sind getrennte Ziele. Offene Beweise, Bäume und Grammatiken werden anhand von Kriterien selbst bewertet; diese Bewertung ist kein automatischer Kompetenznachweis.','Small')
S.append(PageBreak());heading('DEIN ABLAUF','Acht Stunden mit Wiederholung')
table([['Einheit','Auftrag']]+[[f"{r['day']} · {r['minutes']} Min.",r['task']] for r in D['plan']])
add('Mittwoch frei/Puffer; Pausen zusätzlich. Bei späterem Start die Reihenfolge verschieben, keine erledigte Einheit voraussetzen. Wiederhole nach etwa 1, 3, 7 und 14 Tagen innerhalb der Lernzeit.','Small')
for idx,l in enumerate(D['lessons'],1):
 g=D['guides'][l['id']];c=D['contracts'][l['id']]
 S.append(PageBreak());heading(f'KAPITEL {idx:02d}',l['title']);add(l['intro'])
 add('Deine Lernziele','Heading2');add('Wissen: '+c['recall'][0]);add('Anwenden: '+g['goal']);add('Begründen: '+g['check'])
 for h,text in l['sections']:add(h,'Heading3');add(text)
 add('Fundstellen: '+l['source'],'Small')
 S.append(PageBreak());heading(f'KAPITEL {idx:02d} · GEMEINSAM','Einmal vollständig durchrechnen')
 add(g['worked']['prompt']);steps(g['worked']['steps'])
 if l['id']=='syntax':trees(D['trees']['guided']);add('Beide Blattwörter: a+a*a. Links Addition an der Wurzel, rechts Multiplikation.','Small')
 if l['id']=='cnf':table([['Variable','Rechte Seiten in CNF'],['S0','AC | AB | ε'],['S','AC | AB'],['C','SB'],['A','a'],['B','b']]);add('Start S0; Σ={a,b}, V={S0,S,C,A,B}. S0 kommt niemals rechts vor.','Small')
 if l['id']=='limits':table([['Zustand','Übergänge / Annahme'],['G','a→U, b→G; Start und akzeptierend'],['U','a→G, b→U; nicht akzeptierend']])
 if l['id']=='pumping':table([['Teil','Erklärung'],['x','Präfix nur aus a, eventuell ε'],['y=aᵏ','1≤k≤p, nichtleer, ganz im ersten Block'],['z','Übrige a und alle p b'],['xy⁰z','a^(p−k)bᵖ, ungleiche Anzahlen']])
 add('Das Verfahren merken','Heading2');steps(g['recipe']);add('Typischer Fehler: '+l['trap'])
 S.append(PageBreak());heading(f'KAPITEL {idx:02d} · OHNE VORLAGE','Jetzt bist du dran')
 add('A · Wissen frei abrufen','Heading2');add(c['recall'][0]+': Schreibe die Regeln und Voraussetzungen aus dem Gedächtnis auf.')
 add('B · Vollständiger Eigenauftrag','Heading2');add(D['methods'][l['id']]['prompt']);add('Notiere Zwischenstände, nicht nur das Endergebnis. Zeichnungen auf Papier; Lösung im Anhang. Bei Bedarf in der App erst mit Starthilfe, dann mit weniger Hilfe und schließlich allein rechnen.','Small')
 S.append(Spacer(1,42));add('C · Begründen','Heading2');add(g['check']);S.append(Spacer(1,35))
 add('Deine Fehlernotiz','Heading2');add('Mein erster unsicherer Schritt: ____________________________________\nDie richtige Regel in meinen Worten: ______________________________\nNächste Variante und Wiederholungstermin: _________________________')
 qs=[q for q in D['questions'] if q['lesson']==l['id']]
 chunk=6 if len(qs)==11 else 5
 for offset in range(0,len(qs),chunk):
  S.append(PageBreak());heading(f'KAPITEL {idx:02d} · KURZAUFGABEN',f'Üben und entscheiden · {offset+1}–{min(offset+chunk,len(qs))}')
  for j,q in enumerate(qs[offset:offset+chunk],offset+1):
   block=[p(f'{j}. {q["prompt"]}','Heading3')]
   if q['type']=='choice':block += [p(f'{chr(65+k)}) {v}') for k,v in enumerate(q['options'])]
   else:block += [p('Deine Antwort: ________________________________________')]
   block += [Spacer(1,12)];S.append(KeepTogether(block))
S.append(PageBreak());heading('WOCHENCHECK · 20 PUNKTE','Was bleibt ohne Vorlage?')
add('50 Minuten bearbeiten, anschließend 25 Minuten auswerten. 4 Punkte automatisch prüfbare Ergebnisse, 16 Punkte freie Lösungen mit Selbstbewertung. Eigene Trainingsmarke: 16/20 und beide CNF-Aufgaben bearbeiten. Kein offizieller Notenschlüssel.')
for i,q in enumerate(D['exam']['questions'],1):
 add(f'{i}. {q["prompt"]} ({q["points"]} P.)','Heading3')
 if q['type']=='choice':
  for k,v in enumerate(q['options']):add(f'{chr(65+k)}) {v}')
 if q['type']=='open':add('Ausführlicher Lösungsweg auf einem eigenen Blatt.','Small')
S.append(PageBreak());heading('VERGLEICHSLÖSUNGEN','Erst nach dem eigenen Versuch')
add('Gleichwertige fachlich korrekte Lösungen zählen. Nach dem Aufdecken ist eine sofortige Wiederholung Lernen mit Unterstützung, kein neuer unabhängiger Erfolg. Schreibe einen Merksatz und übe an einem späteren Tag eine andere Variante.')
for l in D['lessons']:
 add(l['title'],'Heading2');add('Abrufwissen: '+D['contracts'][l['id']]['recall'][1]);add('Eigenauftrag','Heading3');steps(D['methods'][l['id']]['steps']);add('Begründung: '+D['guides'][l['id']]['answer'])
 if l['id']=='syntax':trees(D['trees']['solo'])
 for q in [q for q in D['questions'] if q['lesson']==l['id']]:
  n=[x['id'] for x in D['questions'] if x['lesson']==l['id']].index(q['id'])+1
  add(f'{n}. {answer(q)} — {q["explanation"]}','Small')
 S.append(PageBreak())
heading('WOCHENCHECK · VERGLEICH','Schritte ehrlich bewerten')
for i,q in enumerate(D['exam']['questions'],1):
 add(f'{i}. {q["section"]} · {q["points"]} Punkte','Heading3');add(q['solution'])
 for r in q.get('rubric',[]):add(f'{r["points"]} P.: {r["text"]}','Small')
add('Was du danach machst','Heading2');steps(['Fehler nach Begriff, Notation, Verfahren, Rechenschritt, Begründung oder Zeit sortieren.','Die schwächste Aufgabe mit weniger Hilfe erneut aufbauen; danach neue Variante.','CNF-Regeln und ε-Ausnahme ohne Vorlage abrufen. In Woche 4 darauf aufbauend CYK und Kellerautomaten bearbeiten.'])
add('Quellen und Grenzen','Heading2');add('Masterplan, PDF-S. 2–4 und 8; TGI_02_02_RegulaereSprachen, S. 70–81; TGI_03_KontextfreieSprachen, S. 7–33; Aufgaben (1), S. 9, 11, 15, 17; Aufgaben_Loesungen, S. 11, 13, 17, 19–21; Altklausur, S. 10. Alle Angaben sind PDF-Seiten. Eigene Erläuterungen und Übungsvarianten; Original-PDFs sind nicht eingebettet. Fehlerkorrekturen zu Aufgabe 11b und CNF-S. 33 sind in den Kapiteln erläutert. Keine Vorhersage von Aufgaben, Dauer oder Hilfsmitteln der echten Klausur.','Small')
def footer(canvas,doc):
 canvas.setStrokeColor(HexColor('#cad6cf'));canvas.line(55,43,540,43);canvas.setFont('DV',8);canvas.setFillColor(HexColor('#55646a'));canvas.drawString(55,29,'ORBIT · Woche 3 · Theoretische Informatik');canvas.drawRightString(540,29,str(doc.page))
SimpleDocTemplate(out,rightMargin=55,leftMargin=55,topMargin=43,bottomMargin=58,title='Lernskript Woche 3 – Theoretische Informatik',author='Orbit').build(S,onFirstPage=footer,onLaterPages=footer)
print(out)

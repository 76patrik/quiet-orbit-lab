"""Build the printable week-two script from the exact content used by the app.

Requires Python 3, reportlab, Node.js and DejaVu Sans (Debian: fonts-dejavu-core).
Run from any directory: python3 scripts/build-week2-pdf.py [output.pdf]
"""
import json
import os
import subprocess
import sys
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, KeepInFrame,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'assets/Lernskript_Woche_2_Theoretische_Informatik.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
NODE = os.environ.get('CODEX_PRIMARY_RUNTIME_NODE', 'node')
data = json.loads(subprocess.check_output([
    NODE, '--input-type=module', '-e',
    "import {week2Content} from './src/week2-content.js'; console.log(JSON.stringify(week2Content));",
], cwd=ROOT, text=True))
font_dir = Path(os.environ.get('ORBIT_PDF_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
for name, filename in [('Orbit', 'DejaVuSans.ttf'), ('OrbitBold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(font_dir / filename)))
pdfmetrics.registerFontFamily('Orbit', normal='Orbit', bold='OrbitBold', italic='Orbit', boldItalic='OrbitBold')
INK = colors.HexColor('#162C35')
GREEN = colors.HexColor('#397154')
MUTED = colors.HexColor('#53656D')
PALE = colors.HexColor('#EDF5EF')
LINE = colors.HexColor('#D5E1DD')
W, H = A4
CONTENT = W - 100
styles = {
    'body': ParagraphStyle('body', fontName='Orbit', fontSize=10, leading=14, textColor=INK, spaceAfter=8, splitLongWords=True),
    'title': ParagraphStyle('title', fontName='OrbitBold', fontSize=22, leading=27, textColor=INK, spaceAfter=14, keepWithNext=True),
    'small': ParagraphStyle('small', fontName='Orbit', fontSize=8.2, leading=12, textColor=MUTED, spaceAfter=7),
    'eyebrow': ParagraphStyle('eyebrow', fontName='OrbitBold', fontSize=8.4, leading=12, textColor=GREEN, spaceAfter=9, keepWithNext=True),
    'cell': ParagraphStyle('cell', fontName='Orbit', fontSize=8.8, leading=11.5, textColor=INK, spaceAfter=0),
    'cellhead': ParagraphStyle('cellhead', fontName='OrbitBold', fontSize=8.8, leading=11.5, textColor=colors.white, spaceAfter=0),
    'box': ParagraphStyle('box', fontName='Orbit', fontSize=9.4, leading=13, textColor=INK, spaceAfter=0),
    'cover': ParagraphStyle('cover', fontName='OrbitBold', fontSize=39, leading=46, textColor=INK, spaceAfter=25),
    'lead': ParagraphStyle('lead', fontName='Orbit', fontSize=14, leading=21, textColor=MUTED, spaceAfter=20),
}


def para(text, style='body'):
    # Hyphen-minus for prose dashes; mathematical minus signs are preserved.
    text = text.replace('–', '-').replace('—', '-').replace('‑', '-')
    return Paragraph(escape(text), styles[style])


def box(title, text, fill=PALE):
    content = Paragraph(f'<b>{escape(title)}</b><br/>{escape(text)}', styles['box'])
    result = Table([[content]], colWidths=[CONTENT], hAlign='LEFT')
    result.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), fill),
        ('BOX', (0, 0), (-1, -1), .5, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    return [result, Spacer(1, 9)]


def table(columns, rows, widths=None):
    if widths is None:
        # Give long prose descriptions more room than labels and transition cells.
        if columns[-1] == 'Punkte':
            widths = [.13, .73, .14]
        elif len(columns) == 2:
            widths = [.38, .62]
        elif len(columns) == 3:
            widths = [.32, .27, .41]
        else:
            widths = [1 / len(columns)] * len(columns)
    cells = [[para(x, 'cellhead') for x in columns]] + [[para(str(x), 'cell') for x in row] for row in rows]
    t = Table(cells, colWidths=[CONTENT * n for n in widths], repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), INK),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F1F5F4')]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEBELOW', (0, 0), (-1, -1), .35, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return [t, Spacer(1, 9)]


story = []
story += [Spacer(1, 25), para('ORBIT / THEORETISCHE INFORMATIK', 'eyebrow'), Spacer(1, 34)]
story += [para('Woche 02', 'eyebrow'), para('Automaten verstehen.', 'cover'), para(data['subtitle'], 'lead')]
story += [para(data['period'], 'eyebrow'), para(data['introduction'])]
story += box('Dein Lernpaket', '10 Kapitel · 25 Inhaltsseiten · vollständige Originalaufgaben · 10 neue schriftliche Übungen · 40-Punkte-Wochencheck · Vergleichslösungen')
story += [Spacer(1, 12), para('Vom ersten Zustandswechsel zum begründeten Lösungsweg. Mit NEA, ε-Hülle, Potenzmenge, Minimierung, regulärer Grammatik und dem Satz von Kleene.', 'lead')]
story += [para('Stand: 27.09.2026. Ausgerichtet am Masterplan und den bereitgestellten TGI-Unterlagen. Übungszeiten und Punktziele sind eigene Trainingsvorgaben.', 'small'), PageBreak()]
story += [para('DEIN WEG DURCH DAS SKRIPT', 'eyebrow'), para('Erst verstehen, dann selbst lösen.', 'title')]
start_page = 4
toc = []
for chapter in data['chapters']:
    toc.append([chapter['title'], str(start_page)])
    start_page += len(chapter['pages'])
story += table(['Kapitel', 'Seite'], toc, [.86, .14])
story += [para('Am Ende der Woche kannst du …', 'eyebrow')]
for i, goal in enumerate(data['goals'], 1):
    story += [para(f'{i}. {goal}')]
story += box('So nutzt du die Antworten', 'Beantworte die Stop-Fragen zuerst ohne Blick auf die Vergleichsantwort. Die Lösungen der Übungsblätter A und B stehen gesammelt in Kapitel 10. Im App-Leser sind Vergleichsantworten zunächst zugeklappt.')
story += [PageBreak(), para('DEIN WOCHENRHYTHMUS', 'eyebrow'), para('Acht Stunden mit klaren Aufträgen.', 'title')]
story += table(['Tag', 'Zeit', 'Arbeitsauftrag'], data['plan'], [.2, .16, .64])
story += box('Ein 75-Minuten-Block', '10 Minuten abrufen · 15 Minuten Erklärung und Beispiel · 40 Minuten eigene Rechnung · 10 Minuten vergleichen und Fehler notieren. Pausen kommen zusätzlich dazu. Bei Bedarf ersetzt du Lesezeit durch mehr Übung.')
story += [para('Dein Materialbezug', 'eyebrow'), para('Aufgaben 5-8 und 4d bilden den roten Faden. Die NEA- und DEA-Diagramme der Aufgaben 6 und 7 sind hier als vollständige Tabellen transkribiert. Die ursprünglichen Vorlesungs-PDFs brauchst du zum Nachschlagen, nicht zum bloßen Abschreiben.'), PageBreak()]
for chapter in data['chapters']:
    for page in chapter['pages']:
        story += [para(chapter['title'].upper(), 'eyebrow'), para(page['title'], 'title')]
        for b in page['blocks']:
            if b['type'] == 'p':
                story.append(para(b['text']))
            elif b['type'] == 'steps':
                for i, item in enumerate(b['items'], 1):
                    story.append(para(f'{i}. {item}'))
            elif b['type'] == 'table':
                story += table(b['columns'], b['rows'])
            elif b['type'] == 'callout':
                story += box(b['title'], b['text'])
            elif b['type'] == 'checkpoint':
                story += box('Stopp · selbst erklären', b['prompt'], colors.HexColor('#F0EEF7'))
                story += [para('Vergleichsantwort: '+b['answer'], 'small')]
        story.append(PageBreak())
story += [para('ZUM NACHSCHLAGEN', 'eyebrow'), para('Quellen und Fundstellen', 'title')]
story += table(['Unterlage', 'Fundstelle', 'Bezug'], data['sources'], [.39, .23, .38])
story += box('Musterlösungen kritisch lesen', 'Aufgabe 7 wird im Blatt NEA genannt, ist im Diagramm aber bereits deterministisch. In Aufgabe 8d der Lösung (PDF-S. 10) führt B→aA dazu, dass gültige Wörter wie aba fehlen. Kapitel 6 verwendet die korrigierte Regel B→aB.')
story += [para('Die hier ergänzten Übungen und Erklärungen sind eigenständig formuliert. Tabellen und Übergänge werden in der App mit denselben Beispielmodellen geprüft. Die App bietet außerdem 61 neue automatisch prüfbare Aufgaben; sie sind Ergänzungen zum gedruckten Skript.', 'small')]


def decorate(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0, H-9, W, 9, fill=1, stroke=0)
    if doc.page > 1:
        canvas.setFont('Orbit', 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(50, H-37, 'ORBIT / LERNSKRIPT WOCHE 2')
    canvas.setStrokeColor(LINE)
    canvas.line(50, 43, W-50, 43)
    canvas.setFont('Orbit', 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(50, 29, 'THEORETISCHE INFORMATIK · KLAUSURVORBEREITUNG')
    canvas.drawRightString(W-50, 29, str(doc.page))
    canvas.restoreState()


# Each authored content page stays on one printed page. Slightly shrink unusually
# dense tables instead of orphaning a checkpoint or invalidating the contents list.
packed, segment = [], []
for item in story:
    if isinstance(item, PageBreak):
        packed += [KeepInFrame(CONTENT, H-62-59-12, segment, mode='shrink'), PageBreak()]
        segment = []
    else:
        segment.append(item)
if segment:
    packed.append(KeepInFrame(CONTENT, H-62-59-12, segment, mode='shrink'))

doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=44, leftMargin=44,
    topMargin=62, bottomMargin=59, title=data['title'], author='Orbit Lernstudio',
    subject=data['subtitle'], pageCompression=1)
doc.build(packed, onFirstPage=decorate, onLaterPages=decorate)
print(str(OUT))

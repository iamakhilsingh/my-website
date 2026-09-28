from __future__ import annotations

import os
import textwrap
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A5
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "yatharth-medtreat-complete-treatment-guide.pdf"
YATHARTH_LOGO = Path("/Users/akhilsingh/Desktop/logoold.png")
MEDTREAT_LOGO = ROOT / "medtreatindia-new-site" / "assets" / "brand" / "medtreatindia-logo-wordmark-transparent.png"
MEDTREAT_LOGO_DARK = ROOT / "medtreatindia-new-site" / "assets" / "brand" / "medtreatindia-logo-wordmark-dark.png"
ASSET_ROOT = ROOT / "medtreatindia-new-site" / "assets" / "treatments"

W, H = A5
M = 31

NAVY = HexColor("#063B63")
BLUE = HexColor("#06739B")
TEAL = HexColor("#159184")
MINT = HexColor("#DFF3EF")
PALE_BLUE = HexColor("#E7F2F7")
ORANGE = HexColor("#F7A51A")
GOLD = HexColor("#B97A10")
INK = HexColor("#17313E")
MUTED = HexColor("#58707A")
LINE = HexColor("#C9DDE4")
PALE = HexColor("#F5F9FA")
RED = HexColor("#B33A3A")


def register_fonts() -> None:
    regular = "/System/Library/Fonts/Supplemental/Arial.ttf"
    bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    if os.path.exists(regular) and os.path.exists(bold):
        pdfmetrics.registerFont(TTFont("GuideSans", regular))
        pdfmetrics.registerFont(TTFont("GuideSans-Bold", bold))
    else:
        # ReportLab core font fallback.
        pdfmetrics._fonts["GuideSans"] = pdfmetrics.getFont("Helvetica")
        pdfmetrics._fonts["GuideSans-Bold"] = pdfmetrics.getFont("Helvetica-Bold")


def set_font(c: canvas.Canvas, size: float, bold: bool = False, color=INK) -> None:
    c.setFont("GuideSans-Bold" if bold else "GuideSans", size)
    c.setFillColor(color)


def fit_image(path: Path, x: float, y: float, w: float, h: float, c: canvas.Canvas,
              anchor: str = "center", overlay=None) -> None:
    with Image.open(path) as img:
        iw, ih = img.size
    box_ratio = w / h
    img_ratio = iw / ih
    if img_ratio > box_ratio:
        draw_h = h
        draw_w = h * img_ratio
        dx = x - (draw_w - w) / 2
        dy = y
    else:
        draw_w = w
        draw_h = w / img_ratio
        dx = x
        if anchor == "top":
            dy = y + h - draw_h
        else:
            dy = y - (draw_h - h) / 2
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, draw_w, draw_h, mask="auto")
    if overlay:
        c.setFillColor(overlay[0], alpha=overlay[1])
        c.rect(x, y, w, h, stroke=0, fill=1)
    c.restoreState()


def draw_logo_contain(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    with Image.open(path) as img:
        iw, ih = img.size
    s = min(w / iw, h / ih)
    dw, dh = iw * s, ih * s
    c.drawImage(ImageReader(str(path)), x + (w - dw) / 2, y + (h - dh) / 2,
                dw, dh, mask="auto")


def wrap_lines(text: str, width: float, size: float, bold: bool = False) -> list[str]:
    font = "GuideSans-Bold" if bold else "GuideSans"
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        probe = word if not current else f"{current} {word}"
        if pdfmetrics.stringWidth(probe, font, size) <= width:
            current = probe
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def paragraph(c: canvas.Canvas, text: str, x: float, y: float, width: float,
              size: float = 8.0, leading: float | None = None, color=INK,
              bold: bool = False, max_lines: int | None = None) -> float:
    leading = leading or size * 1.35
    lines = wrap_lines(text, width, size, bold)
    if max_lines is not None:
        lines = lines[:max_lines]
    set_font(c, size, bold, color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def bullet_list(c: canvas.Canvas, items: list[str], x: float, y: float, width: float,
                size: float = 7.6, leading: float = 10.3, color=INK,
                gap: float = 3.2) -> float:
    for item in items:
        lines = wrap_lines(item, width - 15, size)
        c.setFillColor(TEAL)
        c.circle(x + 3.5, y + 2.2, 2.1, stroke=0, fill=1)
        set_font(c, size, False, color)
        for idx, line in enumerate(lines):
            c.drawString(x + 13, y, line)
            y -= leading
        y -= gap
    return y


def label(c: canvas.Canvas, text: str, x: float, y: float, color=TEAL) -> None:
    set_font(c, 6.4, True, color)
    c.drawString(x, y, text.upper())


def page_header(c: canvas.Canvas, section: str, page: int, dark: bool = False) -> None:
    if page <= 1 or page == 36:
        return
    color = white if dark else MUTED
    set_font(c, 6.2, True, color)
    c.drawString(M, H - 22, section.upper())
    c.setStrokeColor(Color(color.red, color.green, color.blue, alpha=0.6))
    c.setLineWidth(0.5)
    c.line(M, H - 27, W - M, H - 27)


def page_footer(c: canvas.Canvas, page: int, dark: bool = False) -> None:
    if page in (1, 36):
        return
    color = white if dark else MUTED
    set_font(c, 5.9, False, color)
    c.drawString(M, 18, "Yatharth Hospital treatment pathways | International patient support by MedTreat India")
    set_font(c, 6.4, True, color)
    c.drawRightString(W - M, 18, f"{page:02d}")


def standard_page(c: canvas.Canvas, page: int, section: str, title: str,
                  subtitle: str | None = None, accent=TEAL) -> float:
    c.setFillColor(white)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(accent)
    c.rect(0, H - 8, W, 8, stroke=0, fill=1)
    page_header(c, section, page)
    label(c, section, M, H - 53, accent)
    set_font(c, 23, True, NAVY)
    y = H - 82
    for line in wrap_lines(title, W - 2 * M, 23, True):
        c.drawString(M, y, line)
        y -= 27
    if subtitle:
        y -= 3
        y = paragraph(c, subtitle, M, y, W - 2 * M, 8.6, 12.0, MUTED)
    page_footer(c, page)
    return y - 8


def callout(c: canvas.Canvas, title: str, body: str, x: float, y: float,
            w: float, h: float, fill=PALE_BLUE, accent=BLUE) -> None:
    c.setFillColor(fill)
    c.roundRect(x, y - h, w, h, 8, stroke=0, fill=1)
    c.setFillColor(accent)
    c.roundRect(x, y - h, 4, h, 2, stroke=0, fill=1)
    set_font(c, 8.2, True, NAVY)
    c.drawString(x + 14, y - 18, title)
    paragraph(c, body, x + 14, y - 33, w - 28, 7.3, 9.7, INK)


def draw_icon(c: canvas.Canvas, kind: str, x: float, y: float, s: float, color=TEAL) -> None:
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(max(1.5, s * 0.05))
    if kind == "heart":
        p = c.beginPath(); p.moveTo(x, y + s * .2); p.curveTo(x - s*.48, y+s*.56, x-s*.52, y+s, x-s*.2, y+s); p.curveTo(x, y+s, x, y+s*.82, x, y+s*.78); p.curveTo(x, y+s*.82, x, y+s, x+s*.2, y+s); p.curveTo(x+s*.52, y+s, x+s*.48, y+s*.56, x, y+s*.2); c.drawPath(p, stroke=0, fill=1)
    elif kind == "cross":
        c.roundRect(x - s*.12, y, s*.24, s, s*.05, stroke=0, fill=1)
        c.roundRect(x - s*.5, y+s*.38, s, s*.24, s*.05, stroke=0, fill=1)
    elif kind == "check":
        c.setLineCap(1); c.line(x-s*.38, y+s*.46, x-s*.08, y+s*.18); c.line(x-s*.08, y+s*.18, x+s*.42, y+s*.78)
    elif kind == "plane":
        p = c.beginPath(); p.moveTo(x-s*.46,y+s*.46); p.lineTo(x+s*.45,y+s*.74); p.lineTo(x+s*.12,y+s*.47); p.lineTo(x+s*.28,y+s*.10); p.lineTo(x,y+s*.40); p.lineTo(x-s*.28,y+s*.25); p.close(); c.drawPath(p,stroke=0,fill=1)
    else:
        c.circle(x, y+s*.5, s*.36, stroke=1, fill=0)
        c.circle(x, y+s*.5, s*.09, stroke=0, fill=1)
    c.restoreState()


def photo_page(c: canvas.Canvas, page: int, section: str, title: str, image: str,
               intro: str, columns: list[tuple[str, list[str]]], note: str | None = None,
               accent=TEAL) -> None:
    c.setFillColor(white); c.rect(0, 0, W, H, stroke=0, fill=1)
    fit_image(ASSET_ROOT / image, 0, H - 188, W, 188, c, overlay=(NAVY, .28))
    c.setFillColor(white); c.roundRect(M, H - 176, W - 2*M, 100, 10, stroke=0, fill=1)
    label(c, section, M + 16, H - 101, accent)
    set_font(c, 20.5, True, NAVY)
    yy = H - 126
    for line in wrap_lines(title, W - 2*M - 32, 20.5, True):
        c.drawString(M + 16, yy, line); yy -= 23
    page_header(c, section, page, dark=True)
    y = H - 211
    y = paragraph(c, intro, M, y, W - 2*M, 8.2, 11.2, MUTED)
    y -= 8
    gap = 12
    col_w = (W - 2*M - gap) / 2
    top = y
    for i, (heading, items) in enumerate(columns[:2]):
        x = M + i * (col_w + gap)
        c.setFillColor(PALE if i == 0 else PALE_BLUE)
        c.roundRect(x, 70, col_w, top - 70, 8, stroke=0, fill=1)
        set_font(c, 9.0, True, NAVY); c.drawString(x + 12, top - 20, heading)
        bullet_list(c, items, x + 10, top - 39, col_w - 20, 7.25, 9.4, INK, 2.6)
    if note:
        c.setFillColor(ORANGE); c.rect(M, 52, W - 2*M, 3, stroke=0, fill=1)
        paragraph(c, note, M, 43, W - 2*M, 6.6, 8.5, MUTED, max_lines=2)
    page_footer(c, page)
    c.showPage()


def directory_page(c: canvas.Canvas, page: int, title: str, subtitle: str,
                   items: list[str], start_number: int, section: str, accent=TEAL) -> None:
    y = standard_page(c, page, section, title, subtitle, accent)
    col_gap = 12
    col_w = (W - 2*M - col_gap) / 2
    rows = (len(items) + 1) // 2
    cell_h = min(35, (y - 42) / rows)
    for idx, item in enumerate(items):
        col = idx // rows
        row = idx % rows
        x = M + col * (col_w + col_gap)
        cy = y - row * cell_h
        c.setFillColor(PALE if row % 2 == 0 else PALE_BLUE)
        c.roundRect(x, cy - cell_h + 4, col_w, cell_h - 6, 5, stroke=0, fill=1)
        c.setFillColor(accent)
        c.circle(x + 15, cy - cell_h/2 + 1, 9, stroke=0, fill=1)
        set_font(c, 6.7, True, white)
        c.drawCentredString(x + 15, cy - cell_h/2 - 1.5, str(start_number + idx))
        lines = wrap_lines(item, col_w - 42, 7.2, True)
        set_font(c, 7.2, True, NAVY)
        ty = cy - cell_h/2 + (len(lines)-1)*4 + 1
        for line in lines[:2]:
            c.drawString(x + 31, ty, line); ty -= 8.6
    c.showPage()


SPECIALTIES = [
    "Medicine", "Cardiology", "Neurosciences", "General Surgery",
    "Nephrology & Urology", "Paediatrics", "Gastroenterology", "Pulmonology",
    "Gynaecology", "Orthopaedics & Spine", "Plastic, Reconstructive & Cosmetic Surgery",
    "ENT", "Endocrinology", "Critical Care", "Neurointervention", "Dermatology",
    "Nuclear Medicine", "Cancer & Bone Marrow Transplant", "GI Surgery & Liver Transplant",
    "Robotic Surgery", "Kidney Transplant", "IVF", "Emergency Medicine", "Ophthalmology",
    "Dentistry", "Psychology & Psychiatry", "Physiotherapy & Rehabilitation",
    "Anaesthesiology", "Radiology", "Pathology & Laboratory Medicine", "Nutrition Health",
    "Interventional Spine", "Transfusion Medicine & Cellular Therapy", "Rheumatology",
]

PROCEDURES = [
    "Liver Transplant", "Kidney Transplant", "Bone Marrow Transplant", "CAR T-cell Therapy",
    "Cochlear Implant", "Endoscopy", "Bariatric Surgery", "Gallbladder Removal",
    "Hip Replacement", "Laser Treatment for Piles", "Hysterectomy", "Colonoscopy",
    "ACL Reconstruction", "Robotic Hernia Surgery", "Coronary Angiography", "Radiation Therapy",
    "Myomectomy", "Thrombectomy", "Angioplasty", "Knee Replacement", "Chemotherapy",
    "Coronary Artery Bypass Grafting", "Appendectomy", "Arthroscopy", "Liposuction",
    "Anterior Cervical Discectomy & Fusion", "Circumcision", "Lip Reduction",
    "Deep Brain Stimulation", "Spirometry", "Polysomnography (Sleep Study)",
    "Abdominoplasty (Tummy Tuck)",
]


def build() -> None:
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A5, pageCompression=1)
    c.setTitle("Yatharth Hospital and MedTreat India - Complete Treatment Guide")
    c.setAuthor("MedTreat India")
    c.setSubject("Treatment pathways and international patient planning")

    # 01 - Cover
    fit_image(ASSET_ROOT / "cardiology.jpg", 0, 0, W, H, c, overlay=(NAVY, .62))
    c.setFillColor(ORANGE); c.rect(0, H - 12, W, 12, stroke=0, fill=1)
    c.setFillColor(white); c.roundRect(26, H - 110, W - 52, 62, 10, stroke=0, fill=1)
    draw_logo_contain(c, YATHARTH_LOGO, 38, H - 102, 182, 47)
    c.setStrokeColor(LINE); c.line(230, H - 99, 230, H - 58)
    draw_logo_contain(c, MEDTREAT_LOGO, 243, H - 96, 132, 34)
    set_font(c, 8, True, MINT); c.drawString(31, H - 154, "PATIENT INFORMATION GUIDE")
    set_font(c, 31, True, white)
    c.drawString(31, H - 196, "COMPLETE")
    c.drawString(31, H - 231, "TREATMENT")
    c.setFillColor(ORANGE); c.rect(31, H - 246, 108, 5, stroke=0, fill=1)
    set_font(c, 21, False, white); c.drawString(31, H - 276, "PATHWAYS")
    paragraph(c, "Specialties, procedures, international patient planning and recovery guidance in one A5 handbook.", 31, H - 310, 310, 10.2, 14.2, white)
    c.setFillColor(Color(1,1,1,alpha=.14)); c.roundRect(31, 52, W - 62, 62, 8, stroke=0, fill=1)
    set_font(c, 7.8, True, white); c.drawString(45, 94, "HOSPITAL CARE")
    set_font(c, 8.6, False, white); c.drawString(45, 78, "Yatharth Super Speciality Hospitals")
    set_font(c, 7.8, True, MINT); c.drawString(45, 61, "INTERNATIONAL PATIENT SUPPORT")
    set_font(c, 8.6, False, white); c.drawString(215, 61, "MedTreat India")
    c.showPage()

    # 02 - Welcome
    y = standard_page(c, 2, "Welcome", "One guide. Every major care pathway.",
                      "A clear starting point for patients and families comparing treatment in India.")
    c.setFillColor(PALE_BLUE); c.roundRect(M, y-116, W-2*M, 112, 10, stroke=0, fill=1)
    draw_icon(c, "cross", M+33, y-91, 34, TEAL)
    set_font(c, 10, True, NAVY); c.drawString(M+67, y-27, "What this guide covers")
    bullet_list(c, ["34 Yatharth specialty areas", "32 named procedures in the current Yatharth directory", "18 treatment categories supported on MedTreat India's patient platform"], M+64, y-47, W-2*M-80, 7.5, 9.6)
    y -= 134
    callout(c, "Built for orientation, not self-diagnosis", "Use this guide to organize questions, reports and travel plans. A registered doctor must confirm diagnosis, treatment, eligibility, risks and recovery time.", M, y, W-2*M, 74, MINT, TEAL)
    callout(c, "Estimates are case-specific", "Hospital stay, implants, medicines, ICU needs, companion stay and follow-up vary by patient. Ask for a written estimate with inclusions, exclusions and validity.", M, y-87, W-2*M, 74, PALE_BLUE, BLUE)
    set_font(c, 6.4, False, MUTED); c.drawString(M, 47, "Scope verified against current directories on 12 September 2026.")
    c.showPage()

    # 03 - Contents
    y = standard_page(c, 3, "Contents", "Find the pathway you need", "The booklet moves from choosing care to treatment planning, travel and follow-up.")
    contents = [
        ("04-06", "How the care journey works"), ("07-08", "Complete speciality directory"),
        ("09-10", "Current procedure directory"), ("11-30", "Speciality care pathways"),
        ("31", "Transplant pathway and legal review"), ("32", "Understanding a package estimate"),
        ("33", "Medical travel checklist"), ("34", "Hospital stay and follow-up"),
        ("35", "Locations, contacts and sources"), ("36", "Back cover"),
    ]
    for i, (num, name) in enumerate(contents):
        yy = y - i*37
        c.setFillColor(PALE if i%2==0 else PALE_BLUE); c.roundRect(M, yy-27, W-2*M, 29, 6, stroke=0, fill=1)
        set_font(c, 8.5, True, TEAL); c.drawString(M+12, yy-17, num)
        set_font(c, 8.4, True, NAVY); c.drawString(M+61, yy-17, name)
    c.showPage()

    # 04 - Roles
    y = standard_page(c, 4, "Care partnership", "Who does what?", "Clear roles help patients know where medical decisions end and coordination support begins.")
    col_w=(W-2*M-12)/2
    for i,(head,accent,items) in enumerate([
        ("Yatharth Hospital", BLUE, ["Doctor consultation and clinical review", "Diagnosis, treatment plan and consent", "Surgery, medicines, nursing and diagnostics", "Hospital estimate and final billing", "Discharge summary and clinical follow-up plan"]),
        ("MedTreat India", TEAL, ["Organizes reports and case information", "Coordinates hospital or doctor opinion requests", "Helps patients compare practical pathways", "Supports estimate discussion and travel planning", "Assists communication before and after treatment"]),
    ]):
        x=M+i*(col_w+12); c.setFillColor(PALE_BLUE if i==0 else MINT); c.roundRect(x,y-230,col_w,226,10,stroke=0,fill=1)
        c.setFillColor(accent); c.circle(x+25,y-31,13,stroke=0,fill=1); draw_icon(c,"check",x+25,y-39,17,white)
        set_font(c,10,True,NAVY); c.drawString(x+46,y-34,head)
        bullet_list(c,items,x+13,y-63,col_w-26,7.35,9.8,INK,4)
    callout(c,"Important","MedTreat India is a medical travel assistance platform. It does not diagnose, prescribe, guarantee outcomes or replace direct advice from the treating hospital.",M,y-246,W-2*M,70,HexColor('#FFF3DD'),ORANGE)
    c.showPage()

    # 05 - Journey
    y = standard_page(c, 5, "Patient journey", "From first message to follow-up", "A typical pathway has six decision points. Complex cases may need extra reviews.")
    steps=[("01","Share reports","Diagnosis notes, scans, current medicines and key questions."),("02","Clinical review","A hospital team reviews the case and may request more tests."),("03","Plan and estimate","Confirm recommended treatment, doctor, hospital unit and written scope."),("04","Prepare travel","Arrange medical visa, companion, funds, stay and translated records."),("05","Treat and recover","Complete evaluation, consent, procedure and early rehabilitation."),("06","Follow up","Carry discharge records and confirm remote or in-person review timing.")]
    for i,(n,h,b) in enumerate(steps):
        yy=y-i*58; c.setFillColor(TEAL if i%2==0 else BLUE); c.circle(M+18,yy-20,17,stroke=0,fill=1)
        set_font(c,7.5,True,white); c.drawCentredString(M+18,yy-22.5,n)
        set_font(c,9,True,NAVY); c.drawString(M+49,yy-15,h)
        paragraph(c,b,M+49,yy-30,W-M-(M+49),7.25,9.3,MUTED,max_lines=2)
        if i<5: c.setStrokeColor(LINE); c.setLineWidth(1.2); c.line(M+18,yy-38,M+18,yy-55)
    c.showPage()

    # 06 - Reports
    y = standard_page(c, 6, "Before review", "What to send first", "Good information produces a more useful clinical opinion and a more realistic provisional estimate.")
    groups=[("Patient summary",["Full name, age, sex and country", "Main diagnosis and symptoms", "Relevant medical history and allergies"]),("Medical records",["Recent doctor notes and discharge summaries", "Lab reports with dates and units", "Imaging reports plus DICOM files when available"]),("Current treatment",["Medicines with dose and frequency", "Previous procedures, surgery or chemotherapy", "Dialysis details or implant information, if relevant"]),("Planning details",["Preferred travel window", "Patient and companion passport copies only when needed for hospital invitation", "Three questions you most want the doctor to answer"])]
    for i,(head,items) in enumerate(groups):
        x=M+(i%2)*((W-2*M-12)/2+12); yy=y-(i//2)*164; bw=(W-2*M-12)/2
        c.setFillColor(PALE if i%2==0 else PALE_BLUE); c.roundRect(x,yy-147,bw,143,8,stroke=0,fill=1)
        set_font(c,9,True,NAVY); c.drawString(x+12,yy-23,head)
        bullet_list(c,items,x+10,yy-45,bw-20,7.15,9.3,INK,3)
    set_font(c,6.3,False,MUTED); c.drawString(M,43,"Share records through an approved secure channel. Do not send passwords or unrelated identity documents.")
    c.showPage()

    # 07-10 directories
    directory_page(c,7,"Speciality directory","Centres of Excellence and other speciality services listed by Yatharth.",SPECIALTIES[:17],1,"Treatment directory",TEAL)
    directory_page(c,8,"Speciality directory","Continued. Availability can differ by hospital location and doctor roster.",SPECIALTIES[17:],18,"Treatment directory",BLUE)
    directory_page(c,9,"Procedure directory","Named procedures in Yatharth's current public procedure directory.",PROCEDURES[:16],1,"Procedure directory",ORANGE)
    directory_page(c,10,"Procedure directory","Continued. A doctor must confirm whether a procedure is suitable for your case.",PROCEDURES[16:],17,"Procedure directory",GOLD)

    # 11-30 treatment pathways
    photo_page(c,11,"Cardiac sciences","Heart and vascular care","cardiology.jpg","For chest pain, blocked arteries, valve disease, rhythm problems or surgical review, begin with a cardiology assessment and current investigations.",[("Common pathways",["Cardiology consultation and second opinion","ECG, echocardiography and relevant blood tests","Coronary angiography and angioplasty","CABG and valve surgery assessment","Thrombectomy or vascular review when indicated"]),("Bring for review",["Recent ECG and echocardiogram","Angiography images and report","Medication list, including blood thinners","Cardiac surgery or stent records","Kidney function and diabetes results"])],"Emergency chest pain, breathlessness, fainting or stroke symptoms require urgent local emergency care.",BLUE)
    photo_page(c,12,"Mobility care","Orthopaedics, joints, spine and rheumatology","orthopedics.jpg","Care may include non-surgical management, image-guided treatment, rehabilitation or surgery depending on pain, function and imaging.",[("Common pathways",["Knee and hip replacement evaluation","Arthroscopy and ACL reconstruction","Fracture and sports injury care","Interventional spine and ACDF review","Rheumatology assessment for inflammatory disease"]),("Planning questions",["Is surgery necessary now?","What implant or technique is proposed?","How long is protected walking required?","What rehabilitation is included?","When is air travel safe after surgery?"])],"Ask whether implant cost, physiotherapy, walking aids and thrombosis prevention are included in the estimate.",TEAL)
    photo_page(c,13,"Brain and spine","Neurosciences and neurointervention","neurology-v3.jpg","Neurology evaluates brain, nerve and muscle conditions; neurosurgery and neurointervention address selected surgical or catheter-based problems.",[("Common pathways",["Stroke, epilepsy and movement disorder review","Brain or spine tumour assessment","Deep brain stimulation evaluation","Neurointerventional thrombectomy","Complex spine and nerve surgery review"]),("Bring for review",["MRI or CT reports plus image files","EEG, EMG or nerve-conduction results","Symptom timeline and video, if useful","Current anti-seizure or neurologic medicines","Previous surgery and pathology records"])],"New weakness, facial droop, speech trouble, severe sudden headache or loss of consciousness is an emergency.",BLUE)
    photo_page(c,14,"Cancer care","Oncology, BMT and cellular therapy","cancer-treatment.jpg","Cancer care is multidisciplinary. The correct pathway depends on confirmed pathology, stage, previous treatment, organ function and patient goals.",[("Treatment pathways",["Medical oncology and chemotherapy","Surgical oncology assessment","Radiation therapy and nuclear medicine","Bone marrow transplant evaluation","CAR T-cell therapy review for eligible cases"]),("Essential records",["Biopsy and pathology report; blocks/slides if requested","PET-CT, CT or MRI images and reports","Treatment summary and chemotherapy details","Molecular or genetic test results","Recent blood counts, liver and kidney tests"])],"No outcome, response rate or total cost can be confirmed without specialist review and staging.",ORANGE)
    photo_page(c,15,"Digestive health","Gastroenterology and endoscopy","wellness-prevention.jpg","Digestive symptoms may require medical evaluation, imaging, endoscopy or surgery. Start with a clear symptom and investigation history.",[("Common pathways",["Upper GI endoscopy and colonoscopy","Liver, pancreas and bowel disease review","Inflammatory bowel disease assessment","Gallstone and reflux evaluation","Nutrition and medication planning"]),("Bring for review",["Endoscopy or colonoscopy reports and images","Biopsy or pathology results","Ultrasound, CT or MRI reports","Liver function and viral marker results","Current diet, symptoms and medicines"])],"Ask whether bowel preparation, anaesthesia, biopsy, pathology and post-procedure observation are included.",TEAL)
    photo_page(c,16,"Surgical care","GI, bariatric and general surgery","wellness-prevention.jpg","General and GI surgery may be open, laparoscopic or robotic. The approach depends on diagnosis, complexity, previous surgery and surgeon review.",[("Common procedures",["Bariatric or metabolic surgery","Gallbladder removal","Appendectomy","Hernia repair, including robotic options","Laser treatment for piles"]),("Estimate checklist",["Surgeon and anaesthesia fees","Operating room and consumables","Staplers, mesh or special devices","Room or ICU category and included days","Dietician and post-discharge follow-up"])],"Weight-loss surgery requires nutritional, medical and psychological assessment plus long-term follow-up.",ORANGE)
    photo_page(c,17,"Transplant care","Liver transplant pathway","liver-transplant.jpg","Liver transplant assessment considers disease severity, anatomy, infection status, cancer criteria when relevant, donor suitability and legal approval.",[("Recipient review",["Diagnosis and MELD-related laboratory data","CT or MRI liver imaging","Endoscopy and cardiac assessment","Infection and cancer screening","Prior admissions and complication history"]),("Donor and planning",["Potential living donor details and relationship","Blood group and initial health history","Independent donor evaluation and consent","Hospital authorization process","Expected local stay and follow-up schedule"])],"Donor eligibility, legal approval, timing and package scope are decided only by the transplant team and authorities.",TEAL)
    photo_page(c,18,"Kidney care","Nephrology, urology and kidney transplant","kidney-transplant.jpg","Care ranges from medical kidney disease and dialysis planning to stone, prostate and reconstructive urology, as well as transplant evaluation.",[("Common pathways",["Chronic kidney disease and dialysis review","Kidney transplant evaluation","Stone and urinary obstruction treatment","Prostate and bladder assessment","Urologic surgery and follow-up"]),("Transplant records",["Dialysis schedule and access details","Blood group and recent infection screening","Potential donor relationship and health summary","HLA or crossmatch reports, if already done","Cardiac evaluation and current medicines"])],"Never stop dialysis or immunosuppressive medicine without direct instructions from the treating team.",BLUE)
    photo_page(c,19,"Medical care","Medicine and endocrinology","wellness-prevention.jpg","Internal medicine coordinates complex adult conditions. Endocrinology focuses on hormone and metabolic disorders that can affect treatment readiness.",[("Common pathways",["Diabetes and hypertension management","Thyroid, adrenal and pituitary disorders","Metabolic and electrolyte problems","Fever, infection and multisystem assessment","Pre-operative medical optimization"]),("Bring for review",["Recent laboratory trends, not only one result","Home blood pressure or glucose records","Medicine list and allergies","Previous admissions and diagnoses","Relevant scans and specialist notes"])],"Medication changes should be made by a clinician who knows the patient's full history.",TEAL)
    photo_page(c,20,"Breathing and intensive care","Pulmonology, sleep and critical care","wellness-prevention.jpg","Pulmonology evaluates lungs and sleep-related breathing; critical care supports unstable or high-risk patients within hospital care.",[("Common pathways",["Asthma, COPD and infection review","Spirometry and lung-function testing","Sleep study for suspected sleep apnoea","Bronchoscopy or chest imaging review","Critical care planning for complex surgery"]),("Bring for review",["Chest CT or X-ray images and reports","Spirometry or sleep study results","Oxygen use and saturation records","Smoking and exposure history","Current inhalers and medicines"])],"Severe breathlessness, blue lips, confusion or low oxygen requires immediate emergency assessment.",BLUE)
    photo_page(c,21,"Women's health","Gynaecology","ivf-fertility.jpg","Gynaecology care spans diagnosis, medical treatment and surgery for uterine, ovarian and pelvic conditions.",[("Common pathways",["Hysterectomy assessment","Myomectomy for fibroids","Endometriosis and pelvic pain review","Abnormal bleeding evaluation","Minimally invasive or robotic gynaecologic surgery"]),("Bring for review",["Ultrasound or MRI pelvis","Pap smear and biopsy reports","Blood counts and hormone tests","Pregnancy and surgery history","Fertility goals and current medicines"])],"Ask how the proposed treatment may affect fertility, menopause, recovery and future screening.",ORANGE)
    photo_page(c,22,"Reproductive care","IVF and fertility","ivf-fertility.jpg","Fertility treatment should follow an individual assessment of both partners, prior cycles, age, diagnosis and reproductive goals.",[("Common pathways",["Fertility consultation and diagnostic work-up","Ovulation induction or IUI review","IVF or ICSI planning","Embryology and genetic-testing discussion","Fertility preservation counselling"]),("Bring for review",["Prior cycle summaries and embryology records","AMH and other hormone tests","Ultrasound and tubal evaluation","Semen analysis","Relevant genetic or infection screening"])],"Success cannot be guaranteed. Confirm consent, medicine, lab, freezing, storage and follow-up costs in writing.",TEAL)
    photo_page(c,23,"Children's care","Paediatrics and neonatal pathways","wellness-prevention.jpg","Children need age-appropriate assessment, dosing, consent and family-centred planning. Complex cases may involve several paediatric specialties.",[("Common pathways",["General paediatric consultation","Neonatal and high-risk infant care","Paediatric surgery review","Growth, nutrition and developmental support","Vaccination and preventive care"]),("Bring for review",["Birth and neonatal history","Growth chart and vaccination record","Current weight and medicine doses","Prior admission and surgery records","Scans, laboratory results and school concerns"])],"For a sick child with breathing difficulty, dehydration, seizures or reduced responsiveness, seek urgent local care.",BLUE)
    photo_page(c,24,"Hearing and airway","ENT and cochlear implant","wellness-prevention.jpg","ENT evaluates ear, nose, throat, voice and airway conditions. Cochlear implant assessment requires detailed hearing tests and rehabilitation planning.",[("Common pathways",["Ear and hearing disorder care","Sinus, nasal and throat surgery","Voice and swallowing evaluation","Cochlear implant assessment","Head and neck lesion review"]),("Bring for review",["Audiogram and hearing-aid history","CT or MRI temporal bone, if performed","ENT examination and endoscopy notes","Speech and language assessment","Previous surgery or infection history"])],"Confirm device model, mapping sessions, speech therapy and long-term maintenance in the written plan.",ORANGE)
    photo_page(c,25,"Vision and oral health","Ophthalmology and dentistry","eye-treatment.jpg","Eye and dental treatment can often be planned in short visits, but complex surgery or medical conditions may extend the stay.",[("Eye pathways",["Cataract and lens surgery","Retina and glaucoma care","Cornea and refractive evaluation","Eye imaging and pressure testing","Post-operative drop and review schedule"]),("Dental pathways",["Implants and restorative dentistry","Oral surgery and infection care","Smile correction and prosthodontics","Imaging and staged treatment plans","Healing time before final crowns or travel"])],"Ask whether lenses, implants, prostheses, imaging, laboratory work and return visits are included.",BLUE)
    photo_page(c,26,"Skin and reconstruction","Plastic, cosmetic and dermatology care","wellness-prevention.jpg","Reconstructive and cosmetic plans should separate medical need, realistic goals, scars, recovery time and revision policy.",[("Common pathways",["Reconstructive surgery after injury or cancer","Liposuction and body contouring","Abdominoplasty and lip reduction","Scar and wound care","Medical and procedural dermatology"]),("Questions to ask",["Who is a suitable candidate?","Where will scars be placed?","What garments or wound care are required?","How long before flying or exercise?","What is the policy for complications or revision?"])],"Before-and-after images are not guarantees. Confirm surgeon credentials and procedure-specific risks.",ORANGE)
    photo_page(c,27,"Acute care","Emergency medicine and anaesthesiology","heart-surgery.jpg","Emergency teams stabilize urgent illness or injury. Anaesthesiology assesses safety and manages pain and vital functions during procedures.",[("Emergency pathways",["Triage and resuscitation","Trauma, stroke and cardiac response","Urgent imaging and laboratory testing","Critical care referral when needed","Transfer or admission coordination"]),("Pre-anaesthesia review",["Medical history and airway assessment","Allergies and prior anaesthesia problems","Blood thinners, diabetes drugs and supplements","Fasting and medicine instructions","Post-anaesthesia observation plan"])],"For an active emergency, use the nearest emergency service. Do not wait for medical-travel coordination.",RED)
    photo_page(c,28,"Diagnostics and therapy","Radiology, laboratory and cellular services","wellness-prevention.jpg","Diagnostic departments support nearly every treatment plan. Tests should answer a clinical question and be interpreted by the treating team.",[("Diagnostic services",["Radiology and image-guided procedures","Pathology and laboratory medicine","Nuclear medicine imaging and therapy","Cardiac and pulmonary investigations","Pre-operative and infection screening"]),("Blood and cellular care",["Transfusion medicine and blood-component support","Cellular therapy coordination","Compatibility and immunology testing","Apheresis when clinically indicated","Cold-chain and sample-handling requirements"])],"Confirm whether outside images, pathology slides or samples are accepted and how they should be transported.",BLUE)
    photo_page(c,29,"Recovery and wellbeing","Rehabilitation, nutrition and mental health","wellness-prevention.jpg","Recovery is part of treatment, not an afterthought. Plan mobility, nutrition, mental health and caregiver needs before admission.",[("Support pathways",["Physiotherapy and rehabilitation","Nutrition assessment and therapeutic diets","Psychology and psychiatry","Pain and function goals","Preventive health screening"]),("Discharge planning",["Home exercise or therapy schedule","Diet and fluid instructions","Wound, catheter or device care","Warning signs and emergency contact route","Return-to-work, school and travel advice"])],"Ask which follow-up services can be completed remotely after returning home.",TEAL)
    photo_page(c,30,"Advanced techniques","Robotic and minimally invasive surgery","neurosurgery.jpg","Robotic, laparoscopic, endoscopic and image-guided techniques may reduce incision size in suitable cases, but they are not automatically better for every patient.",[("Where used",["GI and general surgery","Urology and kidney procedures","Gynaecologic surgery","Orthopaedic navigation and spine procedures","Selected head, neck and thoracic surgery"]),("Decision factors",["Surgeon experience with the proposed technique","Patient anatomy and previous surgery","Conversion-to-open plan","Special devices and consumable cost","Expected benefit for this specific patient"])],"Choose the procedure based on clinical suitability and team expertise, not technology labels alone.",ORANGE)

    # 31 - Transplant legal pathway
    y=standard_page(c,31,"Transplant planning","Clinical, donor and legal review","Living-donor transplantation requires separate recipient and donor assessment plus authorization before surgery.")
    phases=[("Recipient assessment",["Diagnosis, organ function and medical fitness","Infection, cancer and cardiac screening","Compatibility testing as directed"]),("Donor assessment",["Independent medical and psychosocial evaluation","Relationship and voluntary consent verification","Anatomy and organ-function testing"]),("Authorization",["Identity and relationship documents","Hospital transplant committee process","Country-specific embassy or government documents when required"]),("After approval",["Final surgical and anaesthesia clearance","Written package scope and contingency plan","Follow-up, medicines and local-stay schedule"])]
    for i,(head,items) in enumerate(phases):
        x=M+(i%2)*((W-2*M-12)/2+12); yy=y-(i//2)*151; bw=(W-2*M-12)/2
        c.setFillColor(MINT if i%2==0 else PALE_BLUE); c.roundRect(x,yy-136,bw,132,8,stroke=0,fill=1)
        set_font(c,8.8,True,NAVY); c.drawString(x+12,yy-22,head)
        bullet_list(c,items,x+10,yy-43,bw-20,7.0,9.0,INK,3)
    paragraph(c,"Do not book surgery or non-refundable travel until the transplant team confirms clinical suitability and required authorizations. Document requirements can change and must be verified directly with the hospital's transplant and international-patient teams.",M,55,W-2*M,6.6,8.4,MUTED,max_lines=4)
    c.showPage()

    # 32 - Estimate
    y=standard_page(c,32,"Financial planning","Read the package estimate carefully","A package is a defined scope, not a guarantee that no additional medical needs will arise.")
    left=["Doctor and surgeon professional fees","Procedure, operating room and anaesthesia","Defined room or ICU category and number of days","Routine medicines and consumables listed","Specific implants, devices or blood products if named","Included investigations and follow-up visits"]
    right=["Extra stay, ICU escalation or complications","Unrelated specialist consultations","High-cost medicines, implants or special devices not named","Additional procedures or change in treatment plan","Post-discharge medicines, tests and accommodation","Taxes, travel, food for companion and currency charges unless stated"]
    col_w=(W-2*M-12)/2
    for i,(head,items,fill,accent) in enumerate([("Confirm as included",left,MINT,TEAL),("Check as excluded or extra",right,HexColor('#FFF3DD'),ORANGE)]):
        x=M+i*(col_w+12); c.setFillColor(fill); c.roundRect(x,y-264,col_w,260,9,stroke=0,fill=1)
        set_font(c,9,True,NAVY); c.drawString(x+12,y-23,head)
        bullet_list(c,items,x+10,y-48,col_w-20,6.95,8.9,INK,3.1)
    callout(c,"Before paying","Confirm currency, validity period, cancellation or refund terms, deposit schedule, accepted payment methods and who can approve a revised estimate.",M,y-280,W-2*M,67,PALE_BLUE,BLUE)
    c.showPage()

    # 33 - Travel
    y=standard_page(c,33,"International patients","Medical travel checklist","Requirements differ by nationality, diagnosis and treatment. Verify every item before ticketing.")
    groups=[("Travel documents",["Passport valid for the required period","Correct medical visa and attendant visa, if applicable","Hospital invitation or support letter","Travel insurance and medical coverage details"]),("Clinical records",["English translations where needed","Original reports plus digital backups","Medicine supply in original packaging","Doctor contact and emergency summary"]),("Stay and logistics",["Airport transfer and accessible transport","Accommodation near the treating hospital","Food, mobility and caregiver requirements","Funds and payment method confirmed"]),("Before departure",["Hospital appointment reconfirmed","Fit-to-fly advice for current condition","Vaccination or infection precautions reviewed","Emergency plan for deterioration before travel"])]
    for i,(head,items) in enumerate(groups):
        yy=y-i*82; c.setFillColor(PALE if i%2==0 else PALE_BLUE); c.roundRect(M,yy-72,W-2*M,68,8,stroke=0,fill=1)
        draw_icon(c,"plane" if i in (0,2) else "check",M+24,yy-55,22,TEAL if i%2==0 else BLUE)
        set_font(c,8.6,True,NAVY); c.drawString(M+48,yy-20,head)
        bullet_list(c,items,M+46,yy-37,W-2*M-58,6.65,8.2,INK,1.4)
    paragraph(c,"Passport copies and medical documents contain sensitive data. Share only through the hospital or MedTreat India channel agreed for your case.",M,46,W-2*M,6.4,8.1,MUTED,max_lines=2)
    c.showPage()

    # 34 - Stay / follow up
    y=standard_page(c,34,"Recovery plan","Hospital stay to safe return home","Length of stay varies. Use milestones rather than a fixed number of days to judge readiness.")
    stages=[("Before admission",["Complete requested investigations","Review consent, fasting and medicine instructions","Confirm room category and attendant policy"]),("During admission",["Ask for daily goals and expected milestones","Track medicines, devices and rehabilitation","Request interpreter support if needed"]),("Before discharge",["Collect summary, prescriptions and reports","Understand wounds, diet, activity and warning signs","Confirm emergency contact and next review"]),("Before flying home",["Obtain fit-to-fly advice","Plan mobility, medicines and infection precautions","Carry records and essential medicines in hand luggage"]),("After return",["Share scheduled tests and updates","Attend local or remote follow-up","Seek urgent care for warning signs rather than waiting online"])]
    for i,(head,items) in enumerate(stages):
        yy=y-i*68; c.setFillColor(TEAL if i%2==0 else BLUE); c.roundRect(M,yy-55,88,51,7,stroke=0,fill=1)
        set_font(c,8.1,True,white); lines=wrap_lines(head,68,8.1,True); ty=yy-22
        for line in lines: c.drawString(M+10,ty,line); ty-=9.5
        bullet_list(c,items,M+103,yy-14,W-M-(M+103),6.65,8.15,INK,1.2)
    c.showPage()

    # 35 - Contacts / sources
    y=standard_page(c,35,"Contacts and sources","Plan with verified information","Hospital location, doctor roster and service availability can change. Reconfirm before travel.")
    set_font(c,9,True,NAVY); c.drawString(M,y,"Yatharth Hospital locations listed in the current directory")
    y-=20
    locations=["Greater Noida","Noida","Noida Extension","Jhansi Orchha","Faridabad - Sector 88","New Delhi - Model Town","Faridabad - Sector 20","Agra","Gurugram - listed as forthcoming on the directory"]
    cols=[locations[:5],locations[5:]]; cw=(W-2*M-12)/2
    for i,items in enumerate(cols): bullet_list(c,items,M+i*(cw+12),y,cw,7.1,9.0,INK,2)
    y-=116
    callout(c,"Yatharth Hospitals","Official website: www.yatharthhospitals.com\nGeneral number shown on the website: +91 88005 50057",M,y,W-2*M,60,PALE_BLUE,BLUE)
    callout(c,"MedTreat India","International patient planning: www.medtreatindia.com\nEmail: support@medtreatindia.com",M,y-71,W-2*M,60,MINT,TEAL)
    set_font(c,8.3,True,NAVY); c.drawString(M,y-151,"Sources used for scope")
    srcs=["Yatharth Hospitals - Our Specialities: yatharthhospitals.com/our-specialities/","Yatharth Hospitals - Procedures: yatharthhospitals.com/procedures/","Yatharth Hospitals - Plan Your Visit: yatharthhospitals.com/plan-a-trip","MedTreat India - Treatments: medtreatindia.com/treatments","MedTreat India - International Patients: medtreatindia.com/international-patients"]
    bullet_list(c,srcs,M,y-169,W-2*M,6.45,8.0,INK,1.4)
    paragraph(c,"Revision date: 12 September 2026. This guide is educational and does not replace a doctor, an official hospital estimate, consent forms, visa advice or transplant authorization requirements.",M,47,W-2*M,6.2,7.8,MUTED,max_lines=3)
    c.showPage()

    # 36 - Back cover
    c.setFillColor(NAVY); c.rect(0,0,W,H,stroke=0,fill=1)
    c.setFillColor(BLUE); c.circle(W+10,H-45,150,stroke=0,fill=1)
    c.setFillColor(TEAL); c.circle(W-2,H-38,105,stroke=0,fill=1)
    c.setFillColor(ORANGE); c.circle(38,30,92,stroke=0,fill=1)
    c.setFillColor(white); c.roundRect(31,H-147,W-62,95,12,stroke=0,fill=1)
    draw_logo_contain(c,YATHARTH_LOGO,49,H-134,W-98,58)
    draw_logo_contain(c,MEDTREAT_LOGO_DARK,69,H-215,W-138,49)
    set_font(c,18,True,white); c.drawCentredString(W/2,H-268,"START WITH YOUR REPORTS")
    paragraph(c,"Share the diagnosis, recent investigations and your main questions to begin a structured treatment-planning conversation.",59,H-297,W-118,9.1,12.6,white)
    c.setFillColor(Color(1,1,1,alpha=.12)); c.roundRect(58,115,W-116,105,9,stroke=0,fill=1)
    set_font(c,7.4,True,MINT); c.drawCentredString(W/2,195,"MEDTREAT INDIA")
    set_font(c,10.2,True,white); c.drawCentredString(W/2,173,"support@medtreatindia.com")
    set_font(c,9,False,white); c.drawCentredString(W/2,153,"www.medtreatindia.com")
    set_font(c,6.4,False,white); c.drawCentredString(W/2,130,"Medical decisions are made by registered doctors and hospitals.")
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()

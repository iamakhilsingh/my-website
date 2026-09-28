from __future__ import annotations

import re
from pathlib import Path

from PIL import Image
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A5
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "pdf" / "yatharth-treatment-guides"
LOGO = Path("/Users/akhilsingh/Desktop/logoold.png")
IMAGES = ROOT / "medtreatindia-new-site" / "assets" / "treatments"
INTERNATIONAL_IMAGES = ROOT / "medtreatindia-new-site" / "assets" / "images"
INTERNATIONAL_SUPPORT = INTERNATIONAL_IMAGES / "patient-support.jpg"

W, H = A5
M = 31
NAVY = HexColor("#06456C")
BLUE = HexColor("#08749B")
TEAL = HexColor("#139486")
PALE = HexColor("#F4F8F9")
PALE_BLUE = HexColor("#E5F1F5")
MINT = HexColor("#DDF2EE")
ORANGE = HexColor("#F9A61A")
INK = HexColor("#17313E")
MUTED = HexColor("#5A717A")
LINE = HexColor("#CADCE2")
RED = HexColor("#B03A3A")


def fonts():
    pdfmetrics.registerFont(TTFont("YReg", "/System/Library/Fonts/Supplemental/Arial.ttf"))
    pdfmetrics.registerFont(TTFont("YBold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))


def font(c, size, bold=False, color=INK):
    c.setFont("YBold" if bold else "YReg", size)
    c.setFillColor(color)


def wrap(text, width, size, bold=False):
    name = "YBold" if bold else "YReg"
    lines, cur = [], ""
    for word in text.split():
        probe = word if not cur else cur + " " + word
        if pdfmetrics.stringWidth(probe, name, size) <= width:
            cur = probe
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def para(c, text, x, y, width, size=8, leading=None, color=INK, bold=False, max_lines=None):
    leading = leading or size * 1.35
    lines = wrap(text, width, size, bold)
    if max_lines:
        lines = lines[:max_lines]
    font(c, size, bold, color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def bullets(c, items, x, y, width, size=7.6, leading=10.1, gap=3, dot=TEAL):
    for item in items:
        lines = wrap(item, width - 15, size)
        c.setFillColor(dot)
        c.circle(x + 3.5, y + 2, 2.1, stroke=0, fill=1)
        font(c, size, False, INK)
        for line in lines:
            c.drawString(x + 13, y, line)
            y -= leading
        y -= gap
    return y


def fit_image(c, path, x, y, w, h, overlay=None):
    with Image.open(path) as im:
        iw, ih = im.size
    ir, br = iw / ih, w / h
    if ir > br:
        dh, dw = h, h * ir
        dx, dy = x - (dw - w) / 2, y
    else:
        dw, dh = w, w / ir
        dx, dy = x, y - (dh - h) / 2
    c.saveState()
    p = c.beginPath(); p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(ImageReader(str(path)), dx, dy, dw, dh, mask="auto")
    if overlay:
        c.setFillColor(overlay[0], alpha=overlay[1]); c.rect(x, y, w, h, stroke=0, fill=1)
    c.restoreState()


def logo(c, x, y, w, h):
    with Image.open(LOGO) as im:
        iw, ih = im.size
    s = min(w / iw, h / ih)
    dw, dh = iw * s, ih * s
    c.drawImage(ImageReader(str(LOGO)), x + (w-dw)/2, y + (h-dh)/2, dw, dh, mask="auto")


def header(c, section, page, dark=False):
    if page in (1, 13):
        return
    color = white if dark else MUTED
    font(c, 6.2, True, color)
    c.drawString(M, H-21, section.upper())
    c.setStrokeColor(Color(color.red, color.green, color.blue, alpha=.55))
    c.setLineWidth(.55); c.line(M, H-27, W-M, H-27)


def footer(c, page, dark=False):
    if page in (1, 13):
        return
    color = white if dark else MUTED
    font(c, 5.9, False, color)
    c.drawString(M, 18, "Yatharth Super Speciality Hospitals | Patient Guide")
    font(c, 6.4, True, color); c.drawRightString(W-M, 18, f"{page:02d}")


def title_page(c, page, section, title, subtitle=None, accent=TEAL):
    c.setFillColor(white); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(accent); c.rect(0, H-8, W, 8, stroke=0, fill=1)
    header(c, section, page)
    font(c, 6.6, True, accent); c.drawString(M, H-53, section.upper())
    size = 22 if len(title) < 40 else 19
    font(c, size, True, NAVY)
    y = H-82
    for line in wrap(title, W-2*M, size, True):
        c.drawString(M, y, line); y -= size*1.17
    if subtitle:
        y -= 3; y = para(c, subtitle, M, y, W-2*M, 8.4, 11.3, MUTED)
    footer(c, page)
    return y-9


def card(c, title, items, x, y, w, h, fill=PALE, accent=TEAL, size=7.25):
    c.setFillColor(fill); c.roundRect(x, y-h, w, h, 8, stroke=0, fill=1)
    c.setFillColor(accent); c.roundRect(x, y-h, 4, h, 2, stroke=0, fill=1)
    font(c, 8.8, True, NAVY); c.drawString(x+14, y-21, title)
    bullets(c, items, x+11, y-43, w-22, size, size*1.28, 2.7, accent)


def two_cards(c, y, left_title, left_items, right_title, right_items, height=260):
    gap = 12; cw = (W-2*M-gap)/2
    card(c, left_title, left_items, M, y, cw, height, PALE, TEAL)
    card(c, right_title, right_items, M+cw+gap, y, cw, height, PALE_BLUE, BLUE)


def info_strip(c, title, body, x, y, w, h, accent=ORANGE):
    c.setFillColor(HexColor("#FFF3DD")); c.roundRect(x, y-h, w, h, 7, stroke=0, fill=1)
    c.setFillColor(accent); c.roundRect(x, y-h, 4, h, 2, stroke=0, fill=1)
    font(c, 7.7, True, NAVY); c.drawString(x+13, y-17, title)
    para(c, body, x+13, y-31, w-26, 6.75, 8.5, MUTED)


CATEGORY = {
    "organ": {
        "tests": ["Blood group and routine blood tests", "Organ function, infection and cancer screening", "Heart and lung fitness assessment", "Cross-sectional imaging as directed", "Separate donor evaluation and compatibility testing"],
        "prep": ["Recipient and potential donor reviewed independently", "Current medicines and dialysis or prior treatment documented", "Nutrition, infection and dental concerns addressed", "Blood products and ICU planning discussed", "Authorization documents verified before surgery"],
        "selection": ["Severity and urgency of organ disease", "Medical fitness for major surgery", "Suitable donor or allocation pathway", "Compatibility and anatomy", "Ability to follow long-term medicines and monitoring"],
        "monitor": ["Organ function and blood tests", "Infection and rejection surveillance", "Pain, wound and mobility", "Drug levels when applicable", "Long-term specialist follow-up"],
        "risks": ["Bleeding, infection or blood clots", "Delayed or impaired graft function", "Rejection or vascular complications", "Medicine side effects", "Need for additional procedures or longer stay"],
        "stay": "Major transplant care usually requires an extended local stay for evaluation, surgery and early follow-up. The transplant team confirms timing only after review.",
    },
    "cell": {
        "tests": ["Complete blood count and organ function", "Bone marrow, pathology and disease-status review", "HLA typing or cellular-therapy eligibility tests", "Infection screening", "Heart and lung assessment when indicated"],
        "prep": ["Previous chemotherapy and response summarized", "Donor or cell-source planning completed when relevant", "Fertility preservation discussed when relevant", "Central-line and transfusion planning", "Infection precautions and caregiver plan reviewed"],
        "selection": ["Confirmed diagnosis and current disease status", "Prior treatments and response", "Availability of suitable donor or cell product", "Organ function and infection risk", "Ability to remain near the hospital for monitoring"],
        "monitor": ["Blood counts and organ function", "Infection and fever surveillance", "Transfusion and medicine requirements", "Graft, immune or cellular response as applicable", "Long-term vaccination and follow-up plan"],
        "risks": ["Serious infection and low blood counts", "Bleeding or transfusion reactions", "Immune complications", "Organ toxicity", "Need for ICU care or readmission"],
        "stay": "Cellular and marrow treatments may require weeks near the hospital and strict follow-up. Exact admission and local-stay periods are case-specific.",
    },
    "cardiac": {
        "tests": ["ECG and echocardiography", "Blood counts, kidney function and clotting tests", "Coronary imaging or angiography when indicated", "Chest imaging and anaesthesia assessment", "Review of diabetes and blood-thinner medicines"],
        "prep": ["Symptoms and prior cardiac events documented", "Current medicines reconciled", "Allergies and kidney risks discussed", "Fasting and medicine instructions provided by the team", "Consent includes planned treatment and alternatives"],
        "selection": ["Symptoms and severity of blocked or diseased vessels", "Heart function and valve status", "Anatomy and number of vessels involved", "Other illnesses and surgical risk", "Expected benefit versus medicines or alternative procedures"],
        "monitor": ["Heart rhythm, blood pressure and oxygen", "Access site or surgical wound", "Kidney function and blood counts", "Walking and breathing exercises", "Cardiac rehabilitation and medicine review"],
        "risks": ["Bleeding or access-site complications", "Contrast-related kidney injury", "Rhythm problems, heart attack or stroke", "Infection or blood clots", "Need for urgent surgery or further intervention"],
        "stay": "Same-day care may be possible for selected tests; interventions and surgery need longer observation. The cardiology team confirms travel timing.",
    },
    "oncology": {
        "tests": ["Confirmed biopsy and pathology review", "Stage-appropriate CT, MRI or PET imaging", "Blood counts and liver or kidney function", "Prior treatment summary", "Molecular or radiation-planning tests when indicated"],
        "prep": ["Treatment intent and alternatives discussed", "Current medicines and infections reviewed", "Nutrition and fertility concerns considered", "Venous access or immobilization planning when relevant", "Emergency contact and side-effect plan explained"],
        "selection": ["Cancer type, stage and biology", "Prior treatments and response", "Patient fitness and organ function", "Treatment goal and expected benefit", "Ability to complete the planned schedule and follow-up"],
        "monitor": ["Blood counts and organ function", "Treatment response and side effects", "Nutrition, hydration and infection", "Pain and symptom control", "Scheduled imaging and oncology follow-up"],
        "risks": ["Fatigue, nausea or appetite changes", "Low blood counts and infection", "Skin, tissue or organ-specific effects", "Blood clots or treatment reactions", "Need for dose changes, admission or supportive care"],
        "stay": "Cancer treatment may be a single visit, repeated outpatient cycles or an admission. The oncology plan determines the required local stay.",
    },
    "ortho": {
        "tests": ["Standing X-rays or MRI as appropriate", "Blood counts, kidney function and clotting tests", "Heart and anaesthesia assessment", "Infection and dental review when relevant", "Mobility, home and rehabilitation assessment"],
        "prep": ["Pain, function and non-surgical treatments reviewed", "Implant or fixation plan discussed", "Blood-thinner and diabetes instructions confirmed", "Walking aid and caregiver arranged", "Physiotherapy goals set before admission"],
        "selection": ["Pain and loss of function", "Imaging findings and joint or tissue damage", "Response to medicines, injections and physiotherapy", "Age, activity goals and medical fitness", "Ability to participate in rehabilitation"],
        "monitor": ["Pain, wound and swelling", "Walking or movement milestones", "Blood-clot prevention", "Physiotherapy progression", "Follow-up imaging when indicated"],
        "risks": ["Infection, bleeding or blood clots", "Stiffness or persistent pain", "Nerve or vessel injury", "Implant, fixation or healing problems", "Need for further surgery"],
        "stay": "Outpatient procedures may need brief observation; joint replacement or spine surgery usually requires admission and rehabilitation before travel.",
    },
    "general": {
        "tests": ["Blood counts, organ function and clotting tests", "Ultrasound, CT, endoscopy or other relevant imaging", "Heart and anaesthesia assessment", "Infection screening", "Review of prior abdominal surgery and medicines"],
        "prep": ["Diagnosis and alternative treatments confirmed", "Fasting and bowel preparation only as instructed", "Blood-thinner and diabetes plan confirmed", "Open, laparoscopic or robotic approach discussed", "Post-operative diet and mobility plan explained"],
        "selection": ["Severity and frequency of symptoms", "Imaging or endoscopic findings", "Risk of complications without treatment", "Fitness for anaesthesia and surgery", "Expected benefit of the proposed approach"],
        "monitor": ["Pain, wound and vital signs", "Diet, bowel and urinary function", "Walking and breathing exercises", "Laboratory tests when indicated", "Pathology and follow-up review"],
        "risks": ["Bleeding, infection or blood clots", "Injury to nearby organs", "Leak, obstruction or delayed bowel function", "Conversion to open surgery", "Need for drainage, readmission or further surgery"],
        "stay": "Many procedures need a short admission, but complex or open surgery may require longer recovery. Travel clearance is individualized.",
    },
    "gyn": {
        "tests": ["Blood counts and pregnancy testing when applicable", "Pelvic ultrasound or MRI", "Cervical, endometrial or pathology review when indicated", "Heart and anaesthesia assessment", "Fertility goals and prior surgery reviewed"],
        "prep": ["Reason for surgery and alternatives discussed", "Effect on fertility and menstruation clarified", "Blood-thinner and diabetes instructions confirmed", "Open, laparoscopic or robotic approach reviewed", "Recovery, lifting and intimacy restrictions explained"],
        "selection": ["Symptoms, bleeding and pain", "Size and location of disease", "Fertility and family-planning goals", "Prior treatment response", "Medical fitness and preferred surgical approach"],
        "monitor": ["Bleeding, pain and vital signs", "Urinary and bowel function", "Wound and infection signs", "Mobility and blood-clot prevention", "Pathology and gynaecology follow-up"],
        "risks": ["Bleeding, infection or blood clots", "Injury to bladder, ureter or bowel", "Adhesions or persistent symptoms", "Effect on fertility depending on procedure", "Need for open or additional surgery"],
        "stay": "Minimally invasive surgery may allow a shorter admission; open or complex surgery requires longer recovery before flying.",
    },
    "diagnostic": {
        "tests": ["Clinical history and reason for the test", "Relevant prior imaging or laboratory results", "Allergy, pregnancy and medicine review", "Kidney function or clotting tests when needed", "Anaesthesia assessment if sedation is planned"],
        "prep": ["Follow only the written fasting or medicine instructions", "Bring prior reports and image files", "Arrange an attendant if sedation is used", "Confirm bowel, airway or contrast preparation", "Plan transport after sedation"],
        "selection": ["The clinical question the test should answer", "Whether a simpler test is adequate", "Need for biopsy, contrast or sedation", "Relevant medical risks", "How results will change treatment"],
        "monitor": ["Vital signs during recovery", "Pain, bleeding or reaction symptoms", "Return of alertness after sedation", "Preliminary and final report process", "Follow-up with the referring doctor"],
        "risks": ["Bleeding or infection", "Sedation or allergic reaction", "Contrast-related effects when used", "Perforation or organ injury for invasive tests", "Incomplete test or need for repeat testing"],
        "stay": "Most diagnostic procedures are day-care, but sedation, biopsy or medical risk may require longer observation.",
    },
    "ent": {
        "tests": ["ENT examination and audiology", "Hearing-aid history and speech assessment", "CT or MRI when indicated", "Routine blood tests and anaesthesia assessment", "Vaccination review as directed by the implant team"],
        "prep": ["Expected hearing benefit and limitations discussed", "Device options and maintenance reviewed", "Speech and hearing rehabilitation planned", "Medicine and fasting instructions confirmed", "Long-term mapping visits arranged"],
        "selection": ["Type and severity of hearing loss", "Benefit from appropriately fitted hearing aids", "Inner-ear and nerve anatomy", "Medical fitness for surgery", "Commitment to device programming and rehabilitation"],
        "monitor": ["Wound, pain and balance", "Device activation and mapping", "Hearing and speech progress", "Infection precautions", "Long-term audiology follow-up"],
        "risks": ["Bleeding, infection or wound problems", "Dizziness or taste disturbance", "Facial nerve injury", "Device failure or limited benefit", "Need for revision or ongoing rehabilitation"],
        "stay": "Surgery is usually followed by short observation, but activation and mapping occur later. Plan enough local time for the team's schedule.",
    },
    "cosmetic": {
        "tests": ["Medical history and physical examination", "Blood counts, organ function and clotting tests", "Heart and anaesthesia assessment", "Nicotine use and wound-healing risk review", "Photographs and procedure-specific measurements"],
        "prep": ["Realistic goals and alternatives discussed", "Scars, garments and swelling explained", "Medicine and nicotine instructions confirmed", "Home support and wound care arranged", "Revision and complication policy reviewed"],
        "selection": ["Stable health and realistic expectations", "Skin quality and anatomy", "Weight stability when relevant", "Non-smoking or surgeon-defined nicotine plan", "Ability to follow activity and garment restrictions"],
        "monitor": ["Pain, swelling and wound healing", "Compression garment or dressing care", "Fluid balance and mobility", "Scar and symmetry review", "Scheduled photo and clinic follow-up"],
        "risks": ["Bleeding, infection or fluid collection", "Contour, symmetry or scar concerns", "Numbness or delayed healing", "Blood clots or anaesthesia complications", "Need for revision surgery"],
        "stay": "Observation ranges from day-care to admission. Flying, exercise and garment timing must be cleared by the surgeon.",
    },
    "neuro": {
        "tests": ["Neurology and neurosurgery assessment", "MRI or CT image review", "Medication response and symptom diary", "Neuropsychology or movement testing when indicated", "Routine blood tests and anaesthesia assessment"],
        "prep": ["Symptoms and treatment goals documented", "Device expectations and alternatives discussed", "Medicine adjustments only as directed", "Imaging-guided surgical plan confirmed", "Programming and long-term follow-up arranged"],
        "selection": ["Confirmed diagnosis", "Symptoms despite optimized medical therapy", "Expected functional benefit", "Imaging and cognitive or psychiatric suitability", "Ability to attend programming and follow-up"],
        "monitor": ["Neurologic examination and wound", "Device function and programming", "Medicine and symptom response", "Mood, cognition and mobility", "Long-term battery and hardware follow-up"],
        "risks": ["Bleeding, infection or stroke", "Hardware or lead problems", "Speech, balance or mood changes", "Seizure or neurologic deficit", "Need for reprogramming or revision"],
        "stay": "The surgical admission is followed by staged programming and medicine review. International patients need a clear local and remote follow-up plan.",
    },
    "pulmonary": {
        "tests": ["Respiratory history and examination", "Current inhalers and recent infection review", "Oxygen saturation and chest imaging when indicated", "Allergy and medicine review", "Sleep or lung-function questionnaire"],
        "prep": ["Follow test-specific inhaler instructions only from the team", "Avoid heavy meals or stimulants if instructed", "Bring CPAP or respiratory devices when requested", "Wear comfortable clothing", "Report current infection or worsening breathlessness"],
        "selection": ["Symptoms and clinical question", "Ability to perform breathing manoeuvres", "Need for daytime lung-function or overnight sleep testing", "Current respiratory stability", "How results will change treatment"],
        "monitor": ["Test quality and repeatability", "Oxygen level and symptoms", "Sleep stages and breathing events when applicable", "Final specialist interpretation", "Treatment and device follow-up"],
        "risks": ["Temporary breathlessness, cough or dizziness", "Skin irritation from sensors", "Poor sleep or incomplete recording", "Need to repeat an inadequate study", "Unexpected low oxygen requiring medical review"],
        "stay": "Spirometry is usually a brief outpatient test; polysomnography generally requires an overnight monitored stay.",
    },
}


TREATMENTS = [
    ("Liver Transplant", "liver-transplant", "organ", "liver-transplant.jpg", "Replacement of a severely diseased liver with a healthy donor liver after multidisciplinary and legal assessment.", ["Decompensated chronic liver disease", "Selected liver cancers within transplant criteria", "Acute liver failure in suitable cases", "Metabolic or inherited liver disease"], ["Living-donor liver transplant", "Deceased-donor liver transplant", "Adult or paediatric transplant pathways"], ["Donor liver removal and recipient hepatectomy", "Donor liver implanted and blood vessels connected", "Bile drainage reconstructed", "ICU monitoring and immunosuppression begin"]),
    ("Kidney Transplant", "kidney-transplant", "organ", "kidney-transplant.jpg", "Placement of a healthy donor kidney for suitable patients with end-stage kidney disease.", ["End-stage kidney disease", "Dialysis-dependent kidney failure", "Pre-emptive transplant in selected patients", "Suitable living or deceased-donor pathway"], ["Living-related or living-donor transplant", "ABO-compatible or selected ABO-incompatible pathway", "Paired exchange where available", "Deceased-donor transplant"], ["Donor nephrectomy when living donation is used", "Donor kidney placed in the lower abdomen", "Blood vessels connected to pelvic vessels", "Ureter connected to the bladder"]),
    ("Bone Marrow Transplant", "bone-marrow-transplant", "cell", "bone-marrow-transplant.jpg", "Use of blood-forming stem cells to restore marrow function after conditioning treatment.", ["Selected leukaemias and lymphomas", "Multiple myeloma", "Aplastic anaemia and marrow-failure disorders", "Selected inherited or immune disorders"], ["Autologous transplant using the patient's cells", "Allogeneic transplant using donor cells", "Matched related, unrelated or haploidentical pathways"], ["Stem cells collected from patient or donor", "Conditioning chemotherapy with or without radiation", "Stem cells infused through a vein", "Protective monitoring continues until count recovery"]),
    ("CAR T-cell Therapy", "car-t-cell-therapy", "cell", "cancer-treatment.jpg", "Personalized cellular therapy in which selected T cells are modified to recognize a cancer target.", ["Selected relapsed or refractory blood cancers", "Disease matching an approved CAR T target", "Adequate organ function", "Ability to remain near the treating centre"], ["Commercial or centre-specific CAR T pathway", "Bridging therapy when required", "Inpatient or closely monitored infusion pathway"], ["T cells collected by apheresis", "Cells manufactured and quality checked", "Lymphodepleting treatment given", "CAR T cells infused with close monitoring"]),
    ("Cochlear Implant", "cochlear-implant", "ent", "wellness-prevention.jpg", "An implanted hearing device for selected people with severe hearing loss who receive limited benefit from hearing aids.", ["Severe or profound sensorineural hearing loss", "Limited benefit from well-fitted hearing aids", "Suitable inner-ear anatomy", "Commitment to hearing rehabilitation"], ["Unilateral or bilateral implantation", "Paediatric or adult pathway", "Staged or simultaneous bilateral treatment"], ["Implant placed under the skin behind the ear", "Electrode array inserted into the cochlea", "Wound allowed to heal", "External processor activated and mapped later"]),
    ("Endoscopy", "endoscopy", "diagnostic", "wellness-prevention.jpg", "A flexible camera examination of the upper digestive tract, with biopsy or treatment when indicated.", ["Persistent upper abdominal pain or reflux", "Difficulty swallowing", "Bleeding, anaemia or vomiting", "Surveillance or biopsy of known disease"], ["Diagnostic upper GI endoscopy", "Endoscopy with biopsy", "Therapeutic procedures such as dilation or bleeding control"], ["Throat prepared and sedation used when planned", "Flexible scope passed through the mouth", "Oesophagus, stomach and duodenum examined", "Biopsy or treatment performed if consented"]),
    ("Bariatric Surgery", "bariatric-surgery", "general", "wellness-prevention.jpg", "Metabolic and weight-loss surgery for selected patients after medical, nutritional and psychological assessment.", ["Severe obesity meeting clinical criteria", "Obesity-related diabetes or sleep apnoea", "Unsuccessful structured non-surgical weight management", "Readiness for lifelong diet and follow-up"], ["Sleeve gastrectomy", "Gastric bypass", "Other metabolic procedures selected by the team"], ["Procedure usually performed laparoscopically or robotically", "Stomach size and/or intestinal pathway modified", "Leak testing performed as appropriate", "Staged liquid-to-solid diet begins after surgery"]),
    ("Gallbladder Removal Surgery", "gallbladder-removal", "general", "wellness-prevention.jpg", "Removal of the gallbladder, most often for symptomatic stones or inflammation.", ["Repeated gallstone pain", "Acute or chronic cholecystitis", "Gallstone complications", "Selected gallbladder polyps or other disease"], ["Laparoscopic cholecystectomy", "Robotic cholecystectomy", "Open surgery when clinically required"], ["Small abdominal ports placed", "Gallbladder separated from ducts and vessels", "Gallbladder removed", "Open conversion used if needed for safety"]),
    ("Hip Replacement Surgery", "hip-replacement", "ortho", "hip-replacement.jpg", "Replacement of damaged hip-joint surfaces to reduce pain and improve function.", ["Advanced hip arthritis", "Femoral-head damage or selected fractures", "Severe pain affecting daily life", "Inadequate relief from non-surgical care"], ["Total hip replacement", "Partial hip replacement in selected fractures", "Primary or revision replacement"], ["Damaged femoral head removed", "Socket prepared and cup implanted", "Stem and ball components placed", "Stability checked before closure"]),
    ("Laser Treatment for Piles", "laser-treatment-for-piles", "general", "wellness-prevention.jpg", "Minimally invasive treatment options for selected symptomatic haemorrhoids after examination.", ["Bleeding or prolapsing haemorrhoids", "Persistent symptoms despite conservative care", "Pain or hygiene problems", "Confirmed diagnosis excluding other causes"], ["Laser haemorrhoid treatment", "Haemorrhoidectomy or stapled options when indicated", "Treatment of associated fissure or fistula only if separately planned"], ["Anaesthesia selected for the procedure", "Haemorrhoidal tissue treated with laser energy", "Bleeding controlled", "Bowel and pain-care plan started"]),
    ("Uterus Removal Surgery (Hysterectomy)", "hysterectomy", "gyn", "ivf-fertility.jpg", "Removal of the uterus for selected benign or cancer-related conditions after discussing alternatives and fertility impact.", ["Fibroids with significant symptoms", "Abnormal bleeding not controlled otherwise", "Adenomyosis, prolapse or chronic pain in selected cases", "Cancer or pre-cancer treatment"], ["Total or subtotal hysterectomy", "Laparoscopic, robotic, vaginal or open approach", "Removal or preservation of ovaries based on indication"], ["Uterus separated from supporting tissues", "Blood supply controlled", "Uterus removed through planned approach", "Specimen sent for pathology"]),
    ("Colonoscopy", "colonoscopy", "diagnostic", "wellness-prevention.jpg", "Camera examination of the colon for symptoms, screening, surveillance, biopsy or polyp removal.", ["Bowel bleeding or unexplained anaemia", "Persistent change in bowel habits", "Cancer screening or surveillance", "Inflammatory bowel disease assessment"], ["Diagnostic colonoscopy", "Colonoscopy with biopsy", "Polyp removal or bleeding treatment"], ["Bowel preparation completed as prescribed", "Flexible scope passed through the colon", "Lining examined and images recorded", "Biopsy or polyp removal performed if consented"]),
    ("ACL Reconstruction Surgery", "acl-reconstruction", "ortho", "knee-replacement.jpg", "Reconstruction of a torn anterior cruciate ligament to restore knee stability in selected patients.", ["Symptomatic knee instability", "Sports or activity goals requiring stability", "Associated meniscus or cartilage injury", "Failure of structured rehabilitation alone"], ["Hamstring, patellar or quadriceps tendon graft", "Autograft or selected allograft pathway", "Single-bundle or other surgeon-selected technique"], ["Arthroscopy confirms internal knee findings", "Bone tunnels prepared", "Graft passed and fixed", "Meniscus or cartilage treated if separately planned"]),
    ("Robotic Hernia Surgery", "robotic-hernia-surgery", "general", "wellness-prevention.jpg", "Robot-assisted minimally invasive repair of selected abdominal-wall or groin hernias.", ["Painful or enlarging hernia", "Recurrent or bilateral hernia", "Complex abdominal-wall defect", "Risk of obstruction after surgical review"], ["Robotic groin-hernia repair", "Robotic ventral or incisional-hernia repair", "Mesh or tissue repair selected by defect"], ["Small ports and robotic instruments placed", "Hernia contents reduced", "Defect closed when appropriate", "Mesh positioned and secured if indicated"]),
    ("Coronary Angiography", "coronary-angiography", "cardiac", "cardiology.jpg", "Catheter-based X-ray imaging of the heart arteries using contrast dye.", ["Suspected coronary artery disease", "Abnormal stress test", "Acute coronary syndrome", "Planning before selected heart procedures"], ["Radial-wrist access", "Femoral-groin access", "Diagnostic study with possible separate consent for intervention"], ["Local anaesthetic at access site", "Catheter guided to coronary arteries", "Contrast injected while X-ray images are recorded", "Access site closed and monitored"]),
    ("Radiation Therapy", "radiation-therapy", "oncology", "cancer-treatment.jpg", "Focused radiation used to treat or control cancer while limiting dose to nearby normal tissues.", ["Curative treatment for selected cancers", "Treatment before or after surgery", "Symptom relief or disease control", "Combined treatment with chemotherapy when indicated"], ["External-beam radiation", "Stereotactic or highly conformal techniques", "Brachytherapy for selected sites"], ["Planning scan and immobilization completed", "Target and organs at risk outlined", "Dose plan quality checked", "Treatment delivered over one or multiple sessions"]),
    ("Myomectomy", "myomectomy", "gyn", "ivf-fertility.jpg", "Removal of uterine fibroids while preserving the uterus.", ["Heavy bleeding or anaemia", "Pain or pressure symptoms", "Selected fertility-related fibroids", "Large or growing fibroids after specialist review"], ["Hysteroscopic myomectomy", "Laparoscopic or robotic myomectomy", "Open abdominal myomectomy"], ["Fibroid location confirmed", "Fibroids removed through the planned approach", "Uterine muscle repaired", "Specimens sent for pathology"]),
    ("Thrombectomy", "thrombectomy", "cardiac", "neurology-v3.jpg", "Urgent catheter or surgical removal of a blood clot in selected blocked vessels, including certain strokes.", ["Large-vessel ischaemic stroke within suitable criteria", "Selected limb or other arterial blockage", "Severe symptoms with salvageable tissue", "Imaging confirming a treatable clot"], ["Mechanical catheter thrombectomy", "Aspiration or device-assisted clot removal", "Surgical thrombectomy in selected vessels"], ["Emergency imaging and team assessment", "Catheter guided to the blocked vessel", "Clot removed or flow restored", "Stroke or vascular unit monitoring follows"]),
    ("Angioplasty", "angioplasty", "cardiac", "cardiology.jpg", "Catheter treatment to open narrowed or blocked coronary arteries, usually with a stent.", ["Heart attack or unstable coronary syndrome", "Significant coronary narrowing with symptoms", "Persistent angina despite medicines", "Anatomy suitable for catheter treatment"], ["Balloon angioplasty", "Drug-eluting or other stent placement", "Imaging-guided complex intervention when indicated"], ["Catheter introduced through wrist or groin", "Wire passed across the narrowing", "Balloon expands the artery", "Stent placed when required and flow checked"]),
    ("Knee Replacement Surgery", "knee-replacement", "ortho", "knee-replacement.jpg", "Replacement of severely damaged knee-joint surfaces to reduce pain and improve mobility.", ["Advanced knee arthritis", "Severe pain or deformity", "Reduced walking and daily function", "Insufficient relief from non-surgical treatment"], ["Total knee replacement", "Partial knee replacement for selected disease", "Primary or revision replacement"], ["Damaged surfaces removed", "Femoral and tibial components positioned", "Plastic spacer and patellar treatment selected", "Alignment, stability and movement checked"]),
    ("Chemotherapy", "chemotherapy", "oncology", "cancer-treatment.jpg", "Anti-cancer medicines given alone or with surgery, radiation, immunotherapy or targeted treatment.", ["Treatment of blood cancers or solid tumours", "Pre-operative or post-operative treatment", "Disease control or symptom relief", "Regimen matched to pathology and stage"], ["Intravenous chemotherapy", "Oral anti-cancer medicines", "Regional or protocol-specific treatment"], ["Regimen and dose calculated", "Pre-treatment checks and supportive medicines given", "Medicine administered with monitoring", "Blood tests and side effects reviewed before later cycles"]),
    ("Coronary Artery Bypass Surgery (CABG)", "cabg", "cardiac", "heart-surgery.jpg", "Open or selected minimally invasive surgery that creates new routes around severely narrowed heart arteries.", ["Significant multi-vessel coronary disease", "Left-main or complex disease", "Diabetes with suitable anatomy", "Symptoms or risk not adequately addressed by other treatment"], ["On-pump CABG", "Off-pump CABG", "Selected minimally invasive or arterial-graft strategies"], ["Chest opened through planned approach", "Healthy artery or vein grafts prepared", "Grafts connected beyond blocked arteries", "Heart function and blood flow assessed before closure"]),
    ("Appendectomy", "appendectomy", "general", "wellness-prevention.jpg", "Removal of an inflamed appendix, usually as urgent treatment for appendicitis.", ["Clinical and imaging diagnosis of appendicitis", "Perforated or complicated appendicitis", "Appendix mass managed surgically when indicated", "Persistent symptoms with specialist confirmation"], ["Laparoscopic appendectomy", "Open appendectomy", "Drainage or staged treatment for selected complicated cases"], ["Appendix identified through small ports or incision", "Blood supply and base controlled", "Appendix removed", "Abdomen washed or drained if required"]),
    ("Arthroscopy Surgery", "arthroscopy", "ortho", "orthopedics.jpg", "Keyhole joint surgery used to inspect and treat selected cartilage, ligament or tendon problems.", ["Meniscus or cartilage injury", "Shoulder tendon or instability problems", "Loose bodies or joint locking", "Symptoms not improving with non-surgical care"], ["Knee arthroscopy", "Shoulder arthroscopy", "Other joint arthroscopy in selected cases"], ["Camera and instruments inserted through small portals", "Joint examined systematically", "Planned repair, trimming or reconstruction performed", "Portals closed and rehabilitation begins"]),
    ("Liposuction Surgery", "liposuction", "cosmetic", "wellness-prevention.jpg", "Body-contouring surgery that removes localized fat; it is not a treatment for general obesity.", ["Localized fat deposits resistant to lifestyle measures", "Stable weight and good skin quality", "Realistic contour goals", "Medical fitness for surgery"], ["Suction-assisted liposuction", "Power-assisted or ultrasound-assisted techniques", "Small-area or multi-area treatment"], ["Treatment areas marked", "Fluid solution infiltrated", "Fat removed through small cannulas", "Compression garment applied"]),
    ("Anterior Cervical Discectomy and Fusion (ACDF) Surgery", "acdf-surgery", "ortho", "spine-surgery.jpg", "Neck surgery that removes a damaged disc and fuses selected cervical levels to relieve nerve or spinal-cord pressure.", ["Cervical disc herniation with nerve compression", "Spinal-cord compression or myelopathy", "Persistent arm pain or weakness", "Failure of appropriate non-surgical care"], ["Single-level or multi-level ACDF", "Graft or cage with plate fixation", "Alternative cervical procedures when more suitable"], ["Neck approached from the front", "Disc and compressive material removed", "Cage or graft placed", "Fusion stabilized with selected fixation"]),
    ("Circumcision Surgery", "circumcision", "general", "wellness-prevention.jpg", "Surgical removal of the foreskin for medical, cultural or personal reasons after assessment and consent.", ["Pathological phimosis", "Recurrent foreskin infection", "Scarring or hygiene problems", "Patient or guardian-requested procedure after counselling"], ["Conventional surgical circumcision", "Device-assisted technique where appropriate", "Adult or paediatric pathway"], ["Local or general anaesthesia selected", "Foreskin measured and removed", "Bleeding controlled", "Edges closed and dressing applied"]),
    ("Lip Reduction Surgery", "lip-reduction", "cosmetic", "wellness-prevention.jpg", "Aesthetic surgery to reduce lip volume while preserving shape, movement and sensation as far as possible.", ["Disproportionate lip volume", "Congenital or acquired enlargement", "Stable and realistic aesthetic goals", "Medical fitness and healthy oral tissues"], ["Upper-lip reduction", "Lower-lip reduction", "Combined staged or single-session approach"], ["Planned tissue marked inside the lip", "Excess tissue removed", "Lip shape balanced", "Incision closed within the mouth"]),
    ("Deep Brain Stimulation (DBS) Surgery", "deep-brain-stimulation", "neuro", "neurosurgery.jpg", "Implantation of electrodes and a pulse generator to modulate selected brain circuits.", ["Parkinson's disease with medication-responsive symptoms and fluctuations", "Essential tremor", "Selected dystonia", "Other indications only after specialist review"], ["Awake or asleep DBS workflow", "Unilateral or bilateral electrode placement", "Different brain targets selected by diagnosis"], ["Imaging used to plan the target", "Electrodes placed through small skull openings", "Pulse generator implanted under the skin", "Device programmed after surgery"]),
    ("Spirometry Test", "spirometry", "pulmonary", "wellness-prevention.jpg", "A breathing test that measures how much and how quickly air can be exhaled.", ["Suspected asthma or COPD", "Unexplained breathlessness or cough", "Monitoring known lung disease", "Pre-operative respiratory assessment"], ["Baseline spirometry", "Pre- and post-bronchodilator testing", "Serial monitoring"], ["Nose clip and mouthpiece fitted", "Patient breathes in fully", "Air blown out hard and fast", "Several acceptable attempts recorded"]),
    ("Polysomnography (Sleep Study) Test", "sleep-study", "pulmonary", "wellness-prevention.jpg", "Overnight monitoring of sleep, breathing, oxygen, heart rhythm and body movements.", ["Suspected obstructive sleep apnoea", "Loud snoring with daytime sleepiness", "Unexplained night-time oxygen drops", "Selected movement or sleep-behaviour disorders"], ["Full attended laboratory polysomnography", "Split-night diagnostic and PAP-titration study", "Other sleep testing when clinically suitable"], ["Sensors placed on scalp, face, chest and limbs", "Breathing and oxygen monitored overnight", "Video or audio recorded when indicated", "Sleep specialist interprets the study"]),
    ("Abdominoplasty (Tummy Tuck) Surgery", "abdominoplasty", "cosmetic", "wellness-prevention.jpg", "Body-contouring surgery that removes excess abdominal skin and may tighten the abdominal wall.", ["Excess skin after weight loss or pregnancy", "Abdominal-wall laxity", "Stable weight and realistic goals", "No near-term pregnancy plan after counselling"], ["Full abdominoplasty", "Mini abdominoplasty", "Extended procedure or combined liposuction when appropriate"], ["Excess skin marked and removed", "Abdominal wall tightened when indicated", "Navel repositioned in a full procedure", "Drains and compression garment used as planned"]),
]


def build_guide(item):
    name, slug, category, image, intro, indications, types, steps = item
    cfg = CATEGORY[category]
    path = OUT_DIR / f"yatharth-{slug}-guide.pdf"
    c = canvas.Canvas(str(path), pagesize=A5, pageCompression=1)
    c.setTitle(f"{name} - Yatharth Hospital Patient Guide")
    c.setAuthor("Yatharth Super Speciality Hospitals")
    c.setSubject(f"Patient information guide for {name}")

    # 01 Cover - closely follows the supplied A5 reference booklet structure.
    # Every booklet uses the image assigned to its own treatment or speciality.
    fit_image(c, IMAGES/image, 0, H-185, W, 185, overlay=(NAVY, .25))
    c.setFillColor(NAVY); c.rect(0, 0, W, H-183, stroke=0, fill=1)
    c.setFillColor(BLUE); c.rect(0, 0, 13, H, stroke=0, fill=1)
    c.setFillColor(ORANGE); c.rect(13, H-10, W-13, 10, stroke=0, fill=1)
    c.setFillColor(white); c.roundRect(31, H-101, 184, 48, 8, stroke=0, fill=1)
    logo(c, 41, H-95, 164, 36)
    font(c, 7, True, MINT); c.drawString(35, H-228, "YATHARTH PATIENT GUIDE")
    size = 29 if len(name) < 24 else 23 if len(name) < 43 else 19
    font(c, size, True, white)
    y = H-268
    for line in wrap(name.upper(), W-70, size, True):
        c.drawString(35, y, line); y -= size*1.12
    c.setFillColor(ORANGE); c.rect(35, y-2, 118, 5, stroke=0, fill=1)
    font(c, 18, False, white); c.drawString(35, y-31, "Guide")
    para(c, "Evaluation, procedure, recovery, international patient planning and package questions.", 35, y-60, W-72, 8.9, 12.1, white)
    font(c, 6.2, False, MINT); c.drawString(35, 34, "Yatharth Super Speciality Hospitals | September 2026")
    c.showPage()

    # 02 Introduction
    y = title_page(c, 2, "Introduction", name, intro)
    fit_image(c, IMAGES/image, M, 87, W-2*M, 215, overlay=(NAVY, .08))
    c.setFillColor(white); c.roundRect(M+17, 110, W-2*M-34, 74, 8, stroke=0, fill=1)
    font(c, 8.6, True, NAVY); c.drawString(M+31, 163, "Purpose of this guide")
    para(c, "This booklet helps patients and families understand a typical care pathway. It does not confirm eligibility, price, hospital stay or outcome. Those are decided after direct clinical review.", M+31, 146, W-2*M-62, 7.25, 9.5, INK)
    c.showPage()

    # 03 Indications and types
    y = title_page(c, 3, "Treatment overview", "When it may be considered", "A specialist confirms the diagnosis and whether this treatment is appropriate.")
    two_cards(c, y, "Common indications", indications, "Treatment types or pathways", types, 252)
    info_strip(c, "Important", "The presence of an indication does not mean treatment is automatically suitable. Age, anatomy, disease stage, previous treatment, other illnesses and patient preference all matter.", M, y-269, W-2*M, 63)
    c.showPage()

    # 04 Evaluation
    y = title_page(c, 4, "Medical evaluation", "Tests and specialist review", "The team may add or remove tests based on the patient's condition and proposed treatment.")
    card(c, "Typical evaluation", cfg["tests"], M, y, W-2*M, 226, PALE_BLUE, BLUE, 7.5)
    card(c, "Always bring", ["Recent doctor notes and diagnosis", "Reports with dates and units", "Imaging reports plus DICOM files when available", "Current medicines, allergies and prior procedures", "Passport details only when required for international-patient processing"], M, y-242, W-2*M, 178, MINT, TEAL, 7.4)
    c.showPage()

    # 05 Preparation
    y = title_page(c, 5, "Before treatment", "Preparation and admission", "Follow only the individualized written instructions issued by the treating and anaesthesia teams.")
    card(c, "Preparation checklist", cfg["prep"], M, y, W-2*M, 238, PALE, TEAL, 7.55)
    info_strip(c, "Medicines and fasting", "Do not stop blood thinners, diabetes medicines, steroids, seizure medicines or other prescribed treatment unless the responsible clinician gives specific instructions.", M, y-254, W-2*M, 67, ORANGE)
    info_strip(c, "Tell the team promptly", "Report fever, infection, new breathing trouble, chest pain, pregnancy possibility, recent hospital admission or any major change before travelling or admission.", M, y-333, W-2*M, 67, RED)
    c.showPage()

    # 06 Selection
    y = title_page(c, 6, "Treatment planning", "How the team selects a pathway", "Clinical decisions balance likely benefit, risk, alternatives and the patient's goals.")
    card(c, "Key decision factors", cfg["selection"], M, y, W-2*M, 223, MINT, TEAL, 7.5)
    card(c, "Questions to ask", ["What is the goal of this treatment?", "What alternatives are reasonable?", "What result is realistic for this patient?", "What are the major risks and warning signs?", "What would change the plan or total estimate?"], M, y-239, W-2*M, 183, PALE_BLUE, BLUE, 7.5)
    c.showPage()

    # 07 Procedure
    y = title_page(c, 7, "Procedure", "How it is usually performed", "The final technique, anaesthesia and devices are selected by the treating team.")
    for i, step in enumerate(steps, 1):
        yy = y - (i-1)*66
        c.setFillColor(TEAL if i%2 else BLUE); c.circle(M+21, yy-21, 18, stroke=0, fill=1)
        font(c, 9, True, white); c.drawCentredString(M+21, yy-24, str(i))
        c.setFillColor(PALE if i%2 else PALE_BLUE); c.roundRect(M+50, yy-50, W-M-(M+50), 48, 7, stroke=0, fill=1)
        para(c, step, M+63, yy-22, W-M-(M+63)-12, 7.7, 10, INK, max_lines=3)
    info_strip(c, "Technique may change", "Safety findings during treatment can require a different device, additional procedure, conversion to open surgery, longer monitoring or referral to another specialist.", M, y-283, W-2*M, 67)
    c.showPage()

    # 08 Recovery
    y = title_page(c, 8, "After treatment", "Recovery, monitoring and follow-up", "Discharge depends on clinical milestones, not only a planned number of days.")
    two_cards(c, y, "Monitoring", cfg["monitor"], "Possible risks", cfg["risks"], 255)
    info_strip(c, "Seek urgent help", "Use the hospital's emergency route or nearest emergency service for severe pain, breathing difficulty, heavy bleeding, fainting, new weakness, persistent vomiting, confusion, high fever or rapidly worsening symptoms.", M, y-272, W-2*M, 68, RED)
    c.showPage()

    # 09 International documents - dedicated international-patient photography.
    y = title_page(c, 9, "International patients", "Documents to prepare", "The hospital team must verify country-specific and treatment-specific requirements before travel.")
    fit_image(c, INTERNATIONAL_SUPPORT, M, y-86, W-2*M, 76, overlay=(NAVY, .10))
    left = ["Valid passport for patient and attendant", "Correct medical and attendant visas", "Hospital invitation or support letter", "Recent medical reports in English", "Travel and medical insurance details"]
    right = ["Diagnosis and treatment summary", "Imaging files and pathology material if requested", "Current prescriptions and allergy list", "Emergency contact and caregiver details", "Transplant relationship and authorization documents when applicable"]
    two_cards(c, y-97, "Travel documents", left, "Clinical documents", right, 190)
    info_strip(c, "Protect personal information", "Share passports and medical records only through the Yatharth channel confirmed for the case. Do not send passwords, payment PINs or unrelated identity documents.", M, y-300, W-2*M, 58)
    c.showPage()

    # 10 Stay and inclusions
    y = title_page(c, 10, "Package planning", "Hospital stay and inclusions", cfg["stay"])
    included = ["Treating-team fees specifically listed", "Procedure or test named in the estimate", "Defined room or ICU category and included days", "Routine medicines and consumables listed", "Named implant, device, blood product or special medicine", "Included investigations and follow-up consultations"]
    card(c, "Confirm each inclusion in writing", included, M, y, W-2*M, 258, MINT, TEAL, 7.45)
    info_strip(c, "A provisional estimate is not a final bill", "Changes in diagnosis, medical condition, technique, implant, ICU need or length of stay can change the total. Ask who can approve a revised estimate.", M, y-275, W-2*M, 67)
    c.showPage()

    # 11 Exclusions
    y = title_page(c, 11, "Package planning", "Common exclusions or additional charges", "Exact exclusions depend on the written estimate issued for this patient.")
    exclusions = ["Stay beyond the included room or ICU days", "Treatment of complications or unrelated conditions", "Cross-consultations not named in the package", "High-cost medicines, implants or devices not listed", "Additional procedures, investigations or pathology", "Post-discharge medicines, tests or rehabilitation", "Travel, accommodation and companion expenses", "Applicable taxes or payment-processing charges"]
    card(c, "Check before payment", exclusions, M, y, W-2*M, 331, HexColor("#FFF3DD"), ORANGE, 7.45)
    para(c, "Keep the estimate, receipts, consent forms, implant labels, discharge summary and final itemized bill.", M, 55, W-2*M, 6.8, 8.7, MUTED)
    c.showPage()

    # 12 Admin and travel support
    y = title_page(c, 12, "Planning your visit", "Financial, visa and accommodation guidance", "Confirm arrangements with Yatharth's International Patient Services before booking non-refundable travel.")
    groups = [
        ("Payment", ["Confirm currency and estimate validity", "Use hospital-approved payment routes", "Keep proof of every payment"]),
        ("Visa", ["Request the correct hospital support letter", "Use the visa category required for treatment", "Check extension requirements early"]),
        ("Accommodation", ["Choose a stay near the treating hospital", "Confirm accessibility and caregiver needs", "Plan extra days for unexpected review"]),
        ("Language and food", ["Request interpreter support in advance", "Share dietary or religious requirements", "Follow the clinical diet after treatment"]),
    ]
    bw = (W-2*M-12)/2
    for i, (heading, items) in enumerate(groups):
        x = M + (i%2)*(bw+12); yy = y - (i//2)*164
        card(c, heading, items, x, yy, bw, 146, MINT if i%2==0 else PALE_BLUE, TEAL if i%2==0 else BLUE, 7.05)
    font(c, 6.6, True, NAVY); c.drawString(M, 47, "Yatharth Hospitals: www.yatharthhospitals.com | General number shown online: +91 88005 50057")
    c.showPage()

    # 13 Back cover
    c.setFillColor(NAVY); c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(BLUE); c.circle(W+12, H-38, 148, stroke=0, fill=1)
    c.setFillColor(TEAL); c.circle(W-3, H-30, 105, stroke=0, fill=1)
    c.setFillColor(ORANGE); c.rect(0, 0, W, 9, stroke=0, fill=1)
    c.setFillColor(white); c.roundRect(38, H-173, W-76, 102, 12, stroke=0, fill=1)
    logo(c, 61, H-156, W-122, 68)
    font(c, 18 if len(name)<38 else 15, True, white)
    yy = H-226
    for line in wrap(name.upper(), W-90, 18 if len(name)<38 else 15, True):
        c.drawCentredString(W/2, yy, line); yy -= 21
    font(c, 10.5, False, MINT); c.drawCentredString(W/2, yy-10, "Patient Guide")
    c.setFillColor(Color(1,1,1,alpha=.12)); c.roundRect(50, 124, W-100, 104, 9, stroke=0, fill=1)
    font(c, 7.3, True, MINT); c.drawCentredString(W/2, 202, "YATHARTH SUPER SPECIALITY HOSPITALS")
    font(c, 10.2, True, white); c.drawCentredString(W/2, 178, "www.yatharthhospitals.com")
    font(c, 9.4, False, white); c.drawCentredString(W/2, 155, "+91 88005 50057")
    font(c, 6.3, False, white); c.drawCentredString(W/2, 134, "Treatment decisions and estimates require direct clinical review.")
    c.save()
    return path


def main():
    fonts()
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    paths = [build_guide(item) for item in TREATMENTS]
    if len(paths) != 32:
        raise RuntimeError(f"Expected 32 guides, built {len(paths)}")
    for path in paths:
        print(path)


if __name__ == "__main__":
    main()

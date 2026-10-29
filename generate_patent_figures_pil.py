from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("patent_drawings", exist_ok=True)

# Attempt to load a default TrueType font or fallback
try:
    font_title = ImageFont.truetype("arial.ttf", 36)
    font_bold = ImageFont.truetype("arialbd.ttf", 22)
    font_reg = ImageFont.truetype("arial.ttf", 18)
    font_small = ImageFont.truetype("arial.ttf", 15)
    font_num = ImageFont.truetype("arialbd.ttf", 24)
except Exception:
    font_title = font_bold = font_reg = font_small = font_num = ImageFont.load_default()

def draw_arrow(draw, start, end, width=3, arrow_size=12):
    # draw line
    draw.line([start, end], fill="black", width=width)
    x1, y1 = start
    x2, y2 = end
    # simple vertical or horizontal arrow head
    if x1 == x2: # vertical
        if y2 > y1: # downwards
            draw.polygon([(x2, y2), (x2 - arrow_size, y2 - arrow_size*1.5), (x2 + arrow_size, y2 - arrow_size*1.5)], fill="black")
        else: # upwards
            draw.polygon([(x2, y2), (x2 - arrow_size, y2 + arrow_size*1.5), (x2 + arrow_size, y2 + arrow_size*1.5)], fill="black")
    elif y1 == y2: # horizontal
        if x2 > x1: # rightwards
            draw.polygon([(x2, y2), (x2 - arrow_size*1.5, y2 - arrow_size), (x2 - arrow_size*1.5, y2 + arrow_size)], fill="black")
        else:
            draw.polygon([(x2, y2), (x2 + arrow_size*1.5, y2 - arrow_size), (x2 + arrow_size*1.5, y2 + arrow_size)], fill="black")

def draw_box(draw, bbox, num_tag, lines, corner_radius=10, fill_bg="white"):
    x0, y0, x1, y1 = bbox
    draw.rounded_rectangle(bbox, radius=corner_radius, outline="black", width=3, fill=fill_bg)
    # Number tag in top-right
    draw.text((x1 - 65, y0 + 10), str(num_tag), fill="black", font=font_num)
    # Text lines centered
    total_h = len(lines) * 26
    start_y = y0 + (y1 - y0 - total_h) / 2
    for i, line in enumerate(lines):
        # measure text width
        try:
            w = draw.textlength(line, font=font_reg)
        except:
            w = len(line) * 9
        cx = x0 + (x1 - x0 - w) / 2
        draw.text((cx, start_y + i * 26), line, fill="black", font=font_reg)

# ==================== FIGURE 1 ====================
img1 = Image.new("RGB", (1400, 1800), "white")
draw1 = ImageDraw.Draw(img1)

# Title
draw1.text((700, 50), "FIG. 1", fill="black", font=font_title, anchor="mm")

# 100: Ingestion
draw_box(draw1, (250, 120, 1150, 260), "100", [
    "DATA INGESTION SUBSYSTEM",
    "(101 Transaction Streams, 102 KYC Identity Profiles, 103 Historical Alert Records)"
])
draw_arrow(draw1, (700, 260), (700, 340))

# 110: Preprocessing
draw_box(draw1, (250, 340, 1150, 480), "110", [
    "DATA PREPROCESSING & NORMALIZATION ENGINE",
    "(111 Cleaning & Schema Normalizer, 112 Aggregator, 113 Windowed Feature Mapper)"
])
draw_arrow(draw1, (700, 480), (700, 560))

# 120: Risk Detection Engine
draw_box(draw1, (250, 560, 1150, 710), "120", [
    "RULE-BASED SUSPICIOUS PATTERN DETECTION ENGINE",
    "(121 Rapid Movement, 122 Structuring/Smurfing, 123 Income Mismatch, 124 Cross-Border Risk)"
])

# Splits to 130 and 150
draw_arrow(draw1, (450, 710), (450, 800))
draw_arrow(draw1, (950, 710), (950, 800))

# 130: RAG Knowledge Engine
draw_box(draw1, (120, 800, 680, 1020), "130", [
    "RETRIEVAL-AUGMENTED GENERATION",
    "(RAG) KNOWLEDGE ENGINE",
    "- 131 Vector Database (ChromaDB)",
    "- 132 Regulatory Guidelines & AML Typology Store",
    "- 133 Cosine Similarity Ranking Module"
])

# 150: Audit Trail Vault
draw_box(draw1, (720, 800, 1280, 1020), "150", [
    "AUDIT TRAIL & LOGGING VAULT",
    "- 151 Triggered Rules & Threshold Snapshots",
    "- 152 Mapped Transaction Evidence Records",
    "- 153 Complete Prompt Snapshot & Model Version"
])

# Merge to 140
draw_arrow(draw1, (400, 1020), (400, 1120))
draw_arrow(draw1, (1000, 1020), (1000, 1120))

# 140: LLM Narrative Generator
draw_box(draw1, (250, 1120, 1150, 1280), "140", [
    "LLM-BASED SAR NARRATIVE GENERATION ENGINE",
    "(141 Evidence Context Synthesizer, 142 Structured Prompt Assembler,",
    "143 Regulator-Compliant Narrative Drafting Engine)"
])
draw_arrow(draw1, (700, 1280), (700, 1370))

# 160: Human Review Console
draw_box(draw1, (250, 1370, 1150, 1530), "160", [
    "HUMAN-IN-THE-LOOP COMPLIANCE ANALYST CONSOLE",
    "(161 Interactive Evidence Visualizer, 162 Narrative Editor & Annotation Tool,",
    "163 Dual-Control Approval & Regulatory E-Filing Dispatcher)"
])

# Bidirectional audit loop line from 160 back to 150
draw1.line([(1150, 1450), (1330, 1450), (1330, 910), (1280, 910)], fill="black", width=2)
draw1.polygon([(1280, 910), (1295, 903), (1295, 917)], fill="black")

img1.save("patent_drawings/figure_1_system_architecture.png")


# ==================== FIGURE 2 ====================
img2 = Image.new("RGB", (1400, 2000), "white")
draw2 = ImageDraw.Draw(img2)
draw2.text((700, 50), "FIG. 2", fill="black", font=font_title, anchor="mm")

steps = [
    ("200", ["INGESTING HETEROGENEOUS TRANSACTION ALERTS,", "KYC PROFILES, AND ACCOUNT HISTORICAL RECORDS"], 120),
    ("202", ["PREPROCESSING & TEMPORAL GROUPING OF TRANSACTIONS", "BY UNIQUE CUSTOMER IDENTIFIER"], 280),
    ("204", ["COMPUTING MULTI-FACTOR SUSPICIOUS BEHAVIORAL SCORES", "ACROSS RULE-BASED PATTERN DETECTORS"], 440),
    ("206", ["DOES COMPUTED RISK SCORE SATISFY SUSPICION THRESHOLD?", "(BRANCHING: YES / NO)"], 600),
    ("208", ["CONVERTING SUSPICIOUS CONTEXT INTO HIGH-DIMENSIONAL", "VECTOR EMBEDDINGS VIA PRE-TRAINED TRANSFORMER"], 810),
    ("210", ["RETRIEVING TOP-K MATCHED AML TYPOLOGIES & TEMPLATES", "FROM VECTOR REPOSITORY USING COSINE SIMILARITY"], 970),
    ("212", ["SYNTHESIZING COMPOSITE REGULATORY-COMPLIANT PROMPT", "FEATURING HARD FACTUAL GROUNDING CONSTRAINTS"], 1130),
    ("214", ["GENERATING STANDARDIZED NARRATIVE VIA LLM &", "COMMITTING CORRESPONDING SYSTEM REASONING TO AUDIT LOG"], 1290),
    ("216", ["PRESENTING DRAFT TO HUMAN COMPLIANCE ANALYST FOR", "INSPECTION, EDITING, AND REGULATORY SUBMISSION APPROVAL"], 1450),
    ("218", ["FINAL REGULATORY REPORT EXPORT AND IMMUTABLE", "ARCHIVAL IN AUDIT TRAIL REPOSITORY"], 1610)
]

for tag, lines, y in steps:
    if tag == "206": # Decision Diamond
        draw2.polygon([(700, y), (1100, y+75), (700, y+150), (300, y+75)], outline="black", fill="white")
        draw2.line([(700, y), (1100, y+75), (700, y+150), (300, y+75), (700, y)], fill="black", width=3)
        draw2.text((1115, y+65), "206", fill="black", font=font_num)
        draw2.text((700, y+60), lines[0], fill="black", font=font_reg, anchor="mm")
        draw2.text((700, y+90), lines[1], fill="black", font=font_reg, anchor="mm")
        
        # YES arrow downwards
        draw_arrow(draw2, (700, y+150), (700, y+210))
        draw2.text((720, y+175), "YES", fill="black", font=font_bold)
        
        # NO arrow sideways to logging/termination
        draw2.line([(1100, y+75), (1280, y+75), (1280, 200), (1050, 200)], fill="black", width=2)
        draw2.polygon([(1050, 200), (1065, 193), (1065, 207)], fill="black")
        draw2.text((1140, y+50), "NO (NORMAL / LOG)", fill="black", font=font_bold)
    else:
        draw_box(draw2, (250, y, 1150, y+120), tag, lines)
        if tag != "218" and tag != "204":
            draw_arrow(draw2, (700, y+120), (700, y+160))
        elif tag == "204":
            draw_arrow(draw2, (700, y+120), (700, 600))

img2.save("patent_drawings/figure_2_operational_flowchart.png")


# ==================== FIGURE 3 ====================
img3 = Image.new("RGB", (1400, 1400), "white")
draw3 = ImageDraw.Draw(img3)
draw3.text((700, 50), "FIG. 3", fill="black", font=font_title, anchor="mm")

# Subsystem 300: Offline Indexing
draw3.rounded_rectangle((100, 110, 650, 800), radius=15, outline="black", width=2, fill="white")
draw3.text((375, 150), "300: OFFLINE KNOWLEDGE INDEXING", fill="black", font=font_bold, anchor="mm")

draw_box(draw3, (150, 200, 600, 320), "301", [
    "REGULATORY DIRECTIVES &",
    "AML TYPOLOGY REPOSITORY"
])
draw_arrow(draw3, (375, 320), (375, 390))

draw_box(draw3, (150, 390, 600, 510), "302", [
    "SENTENCE TRANSFORMER",
    "EMBEDDING GENERATOR"
])
draw_arrow(draw3, (375, 510), (375, 580))

draw_box(draw3, (150, 580, 600, 720), "303", [
    "VECTOR EMBEDDING DATABASE",
    "(CHROMADB HIGH-DIMENSIONAL INDEX)"
])


# Subsystem 310: Online Retrieval
draw3.rounded_rectangle((750, 110, 1300, 800), radius=15, outline="black", width=2, fill="white")
draw3.text((1025, 150), "310: ONLINE CONTEXT RETRIEVAL", fill="black", font=font_bold, anchor="mm")

draw_box(draw3, (800, 200, 1250, 320), "311", [
    "DETECTED SUSPICIOUS SIGNALS &",
    "TRANSACTION EVIDENCE CONTEXT"
])
draw_arrow(draw3, (1025, 320), (1025, 390))

draw_box(draw3, (800, 390, 1250, 510), "312", [
    "REAL-TIME QUERY VECTOR",
    "TRANSFORMER ENCODER"
])
draw_arrow(draw3, (1025, 510), (1025, 580))

draw_box(draw3, (800, 580, 1250, 720), "313", [
    "COSINE SIMILARITY SEARCH",
    "& TOP-K MATCHING ENGINE"
])

# Vector retrieval link from 303 to 313
draw3.line([(600, 650), (800, 650)], fill="black", width=3)
draw3.polygon([(800, 650), (785, 642), (785, 658)], fill="black")

# Both feed into 320
draw3.line([(1025, 720), (1025, 870), (700, 870), (700, 930)], fill="black", width=3)
draw3.polygon([(700, 930), (692, 915), (708, 915)], fill="black")

# 320: Prompt Assembler
draw_box(draw3, (200, 930, 1200, 1150), "320", [
    "COMPOSITE STRUCTURED PROMPT SYNTHESIS SUBSYSTEM",
    "Assembles: 321 Customer KYC Profile + 322 Flagged Transaction Evidence +",
    "323 Top-K Retrieved AML Typologies + 324 Regulatory Narrative Template Rules"
])

# 330: Prompt dispatched to LLM
draw_arrow(draw3, (700, 1150), (700, 1230))
draw_box(draw3, (350, 1230, 1050, 1340), "330", [
    "LARGE LANGUAGE MODEL (LLM) INFERENCE ENGINE",
    "(Generates Standardized Fact-Grounded SAR Narrative)"
])

img3.save("patent_drawings/figure_3_rag_retrieval_engine.png")


# ==================== FIGURE 4 ====================
img4 = Image.new("RGB", (1400, 1400), "white")
draw4 = ImageDraw.Draw(img4)
draw4.text((700, 50), "FIG. 4", fill="black", font=font_title, anchor="mm")

# Upstream feeds 401 & 402
draw_box(draw4, (150, 120, 620, 280), "401", [
    "RULE-BASED DETECTION ENGINE",
    "- Triggered Suspicion Indicator IDs",
    "- Transaction Evidence Record IDs"
])

draw_box(draw4, (780, 120, 1250, 280), "402", [
    "RAG & LLM SYNTHESIS ENGINE",
    "- Retrieved Regulatory Typology References",
    "- Raw Assembled Prompt Snapshot"
])

draw_arrow(draw4, (385, 280), (550, 400))
draw_arrow(draw4, (1015, 280), (850, 400))

# 400: Immutable Audit Vault
draw_box(draw4, (200, 400, 1200, 680), "400", [
    "IMMUTABLE AUDIT TRAIL LOGGING VAULT (400)",
    "- 410 Cryptographically-Timestamped Event Registry",
    "- 420 Direct Transaction Evidence-to-Typology Traceability Matrix",
    "- 430 Full Prompt Snapshot & LLM Seed/Configuration Ledger",
    "- 440 Generated Draft Versioning & Post-Edit Delta Tracking"
])

# Interactive Link to Human Console 450
draw3.line([(580, 680), (580, 800)], fill="black", width=3) # down
draw4.polygon([(580, 800), (572, 785), (588, 785)], fill="black")

draw4.line([(820, 800), (820, 680)], fill="black", width=3) # up (feedback/logging)
draw4.polygon([(820, 680), (812, 695), (828, 695)], fill="black")

draw4.text((530, 740), "Audit Feed", fill="black", font=font_small)
draw4.text((850, 740), "Analyst Edits & Sign-off", fill="black", font=font_small)

# 450: Analyst Console
draw_box(draw4, (200, 800, 1200, 1100), "450", [
    "HUMAN-IN-THE-LOOP COMPLIANCE ANALYST CONSOLE (450)",
    "- 451 Transaction Evidence Inspection & Explainability Visualizer",
    "- 452 In-line SAR Narrative Editor & Typology Verification Module",
    "- 453 Analyst Override, Comment Insertion & Rejection Handling",
    "- 454 Cryptographic Multi-Signer Regulatory Submission Trigger"
])

# 460: External Regulators
draw_arrow(draw4, (700, 1100), (700, 1200))
draw_box(draw4, (350, 1200, 1050, 1320), "460", [
    "REGULATORY AUTHORITIES / FIU DISPATCH REPOSITORY",
    "(Secure, Explainable, Complete Regulatory-Ready Filing)"
])

img4.save("patent_drawings/figure_4_audit_and_human_loop.png")

print("All 4 formal patent drawings successfully generated via Pillow!")

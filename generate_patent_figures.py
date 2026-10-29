import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("patent_drawings", exist_ok=True)

# ----------------- FIGURE 1: Overall System Architecture -----------------
fig, ax = plt.subplots(figsize=(11, 14), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 140)
ax.axis('off')

# Title
ax.text(50, 135, "FIG. 1", fontsize=18, fontweight='bold', ha='center', va='center', family='sans-serif')

def draw_box(x, y, w, h, num, text_lines, is_sub=False):
    style = "round,pad=0.3" if is_sub else "square,pad=0.2"
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle=style, linewidth=1.5, edgecolor='black', facecolor='white')
    ax.add_patch(rect)
    ax.text(x + w - 4, y + h - 3, str(num), fontsize=11, fontweight='bold', ha='right', va='top', family='sans-serif')
    
    # Text lines
    total_lines = len(text_lines)
    start_y = y + h/2.0 + (total_lines - 1) * 1.5
    for i, line in enumerate(text_lines):
        ax.text(x + w/2.0, start_y - i * 3.2, line, fontsize=10, ha='center', va='center', family='sans-serif')

def draw_arrow(x1, y1, x2, y2):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(facecolor='black', edgecolor='black', width=1.2, headwidth=6, headlength=7))

# 100: Input Data Layer
draw_box(15, 115, 70, 14, 100, ["INPUT DATA INGESTION SUBSYSTEM", "(Transaction Records 101, KYC Profile 102, Alert History 103)"])

# Arrow 100 -> 110
draw_arrow(50, 115, 50, 104)

# 110: Data Preprocessing
draw_box(15, 90, 70, 14, 110, ["DATA PREPROCESSING AND NORMALIZATION ENGINE", "(Cleaning 111, Duplicate Removal 112, Customer Aggregation 113)"])

# Arrow 110 -> 120
draw_arrow(50, 90, 50, 79)

# 120: Risk Detection Engine
draw_box(15, 65, 70, 14, 120, ["RULE-BASED SUSPICIOUS PATTERN DETECTION ENGINE", "(Structuring 121, Velocity 122, Income Mismatch 123, Cross-Border 124)"])

# Two arrows from 120: to 130 and to 150
draw_arrow(35, 65, 35, 54)
draw_arrow(65, 65, 65, 54)

# 130: RAG Knowledge Engine (Left)
draw_box(8, 38, 40, 16, 130, ["RETRIEVAL-AUGMENTED", "GENERATION (RAG) ENGINE", "(Vector DB 131, AML Typologies 132,", "Cosine Similarity Search 133)"])

# 150: Audit Trail Logging Subsystem (Right)
draw_box(52, 38, 40, 16, 150, ["AUDIT TRAIL & LOGGING", "SUBSYSTEM", "(Rule Trigger Logs 151, Evidence Txn 152,", "Prompt Snapshot & Versioning 153)"])

# Arrows from 130 and 120 into 140 (LLM Generator)
draw_arrow(28, 38, 38, 26)
draw_arrow(72, 38, 62, 26)

# 140: LLM-Based SAR Narrative Generator
draw_box(15, 12, 70, 14, 140, ["LLM-BASED SAR NARRATIVE GENERATION ENGINE", "(Context Grounding 141, Regulator-Compliant Narrative Drafting 142)"])

# Arrow from 140 to 160
draw_arrow(50, 12, 50, 2)
# Arrow feedback to 150 (audit trail)
ax.annotate('', xy=(85, 38), xytext=(85, 19),
            arrowprops=dict(facecolor='black', edgecolor='black', width=1.0, headwidth=5, headlength=6, linestyle='dashed'))
ax.plot([70, 85], [19, 19], 'k--', linewidth=1.0)

# 160: Human-in-the-Loop Review
# At the bottom or outside
fig.text(0.5, 0.02, "160: HUMAN-IN-THE-LOOP COMPLIANCE ANALYST REVIEW & APPROVAL INTERFACE", ha='center', fontsize=10, fontweight='bold', family='sans-serif')

plt.tight_layout()
plt.savefig("patent_drawings/figure_1_system_architecture.png", bbox_inches='tight')
plt.close()

# ----------------- FIGURE 2: Detailed Workflow / Flowchart -----------------
fig, ax = plt.subplots(figsize=(11, 15), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 150)
ax.axis('off')

ax.text(50, 145, "FIG. 2", fontsize=18, fontweight='bold', ha='center', va='center', family='sans-serif')

steps = [
    (200, ["200", "INGEST TRANSACTION ALERTS,", "KYC PROFILES, AND ACCOUNT HISTORIES"], 134),
    (202, ["202", "PREPROCESS & AGGREGATE TRANSACTIONS", "BY CUSTOMER IDENTIFIER"], 118),
    (204, ["204", "EVALUATE MULTI-FACTOR AML SUSPICION RULES", "(STRUCTURING, VELOCITY, MISMATCH)"], 102),
    (206, ["206", "IS SUSPICION THRESHOLD EXCEEDED?", "(COMPUTE WEIGHTED SUSPICION SCORE)"], 86),
    (208, ["208", "GENERATE HIGH-DIMENSIONAL QUERY EMBEDDING", "VIA SENTENCE TRANSFORMER"], 70),
    (210, ["210", "RETRIEVE TOP-K MATCHED AML TYPOLOGIES &", "TEMPLATES FROM VECTOR DATABASE VIA COSINE METRIC"], 54),
    (212, ["212", "CONSTRUCT COMPOSITE STRUCTURED PROMPT", "GROUNDED IN EVIDENCE AND REGULATORY KNOWLEDGE"], 38),
    (214, ["214", "GENERATE REGULATOR-READY DRAFT NARRATIVE &", "AUTOMATICALLY COMMIT REASONING TO AUDIT LOG"], 22),
    (216, ["216", "INTERACTIVE ANALYST AUDIT, EDITING, AND", "CRYPTOGRAPHIC/AUDIT APPROVAL FOR REGULATORY FILING"], 6)
]

for num, lines, y in steps:
    # diamond for decision 206
    if num == 206:
        poly = patches.Polygon([[50, y+8], [80, y+4], [50, y], [20, y+4]],
                               closed=True, edgecolor='black', facecolor='white', linewidth=1.5)
        ax.add_patch(poly)
        ax.text(50, y+4, "\n".join(lines[1:]), ha='center', va='center', fontsize=8.5, family='sans-serif')
        ax.text(82, y+5, "206", ha='left', va='center', fontsize=10, fontweight='bold', family='sans-serif')
    else:
        rect = patches.FancyBboxPatch((15, y), 70, 9, boxstyle="square,pad=0.2", edgecolor='black', facecolor='white', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(50, y+4.5, "\n".join(lines[1:]), ha='center', va='center', fontsize=8.5, family='sans-serif')
        ax.text(82, y+4.5, str(num), ha='left', va='center', fontsize=10, fontweight='bold', family='sans-serif')

# Arrows
draw_arrow(50, 134, 50, 127)
draw_arrow(50, 118, 50, 111)
draw_arrow(50, 102, 50, 94)
# Decision arrows
draw_arrow(50, 86, 50, 79)
ax.text(52, 82, "YES", fontsize=9, fontweight='bold', family='sans-serif')

# Decision NO arrow
ax.annotate('', xy=(88, 134), xytext=(80, 90),
            arrowprops=dict(facecolor='black', edgecolor='black', width=1.0, headwidth=5, headlength=6))
ax.text(82, 92, "NO (DISCARD / LOG NORMAL)", fontsize=8, family='sans-serif')

draw_arrow(50, 70, 50, 63)
draw_arrow(50, 54, 50, 47)
draw_arrow(50, 38, 50, 31)
draw_arrow(50, 22, 50, 15)

plt.tight_layout()
plt.savefig("patent_drawings/figure_2_operational_flowchart.png", bbox_inches='tight')
plt.close()

# ----------------- FIGURE 3: RAG Retrieval & Prompt Assembly Engine -----------------
fig, ax = plt.subplots(figsize=(12, 10), dpi=300)
ax.set_xlim(0, 120)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(60, 96, "FIG. 3", fontsize=18, fontweight='bold', ha='center', va='center', family='sans-serif')

# Offline Indexing Subsystem (Left)
rect1 = patches.FancyBboxPatch((5, 45), 45, 45, boxstyle="square,pad=0.3", edgecolor='black', facecolor='none', linewidth=1.5, linestyle='--')
ax.add_patch(rect1)
ax.text(27.5, 87, "300: KNOWLEDGE INDEXING SUBSYSTEM", ha='center', fontsize=9, fontweight='bold')

draw_box(8, 72, 39, 10, 301, ["REGULATORY GUIDELINES &", "AML TYPOLOGY REPOSITORY"])
draw_arrow(27.5, 72, 27.5, 66)
draw_box(8, 56, 39, 10, 302, ["SENTENCE TRANSFORMER", "EMBEDDING ENGINE"])
draw_arrow(27.5, 56, 27.5, 50)
draw_box(8, 40, 39, 10, 303, ["CHROMA VECTOR DATABASE", "(INDEXED TYPOLOGY VECTORS)"])

# Online Query & Assembly Subsystem (Right)
rect2 = patches.FancyBboxPatch((55, 30), 60, 60, boxstyle="square,pad=0.3", edgecolor='black', facecolor='none', linewidth=1.5, linestyle='--')
ax.add_patch(rect2)
ax.text(85, 87, "310: ONLINE CONTEXT RETRIEVAL SUBSYSTEM", ha='center', fontsize=9, fontweight='bold')

draw_box(60, 72, 50, 10, 311, ["TRANSACTION EVIDENCE & RISK SIGNALS"])
draw_arrow(85, 72, 85, 66)
draw_box(60, 56, 50, 10, 312, ["QUERY VECTOR GENERATOR"])
draw_arrow(85, 56, 85, 50)
draw_box(60, 40, 50, 10, 313, ["COSINE SIMILARITY SEARCH ENGINE", "(TOP-K MATCHING)"])

# Connecting Vector DB to Similarity Search
draw_arrow(47, 45, 60, 45)

# Prompt Synthesis Block
draw_arrow(85, 40, 85, 25)
draw_box(30, 8, 65, 15, 320, [
    "STRUCTURED LLM PROMPT SYNTHESIZER",
    "Evidence Context (321) + KYC Profile (322) +",
    "Retrieved Typologies (323) + Template Constraints (324)"
])

plt.tight_layout()
plt.savefig("patent_drawings/figure_3_rag_retrieval_engine.png", bbox_inches='tight')
plt.close()

# ----------------- FIGURE 4: Audit Trail & Human Verification Loop -----------------
fig, ax = plt.subplots(figsize=(12, 10), dpi=300)
ax.set_xlim(0, 120)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(60, 96, "FIG. 4", fontsize=18, fontweight='bold', ha='center', va='center', family='sans-serif')

draw_box(10, 70, 40, 18, 401, [
    "SUSPICIOUS ACTIVITY",
    "DETECTION ENGINE",
    "- Triggered Rules Log",
    "- Anomaly Score & Flags"
])

draw_box(70, 70, 40, 18, 402, [
    "RAG RETRIEVAL &",
    "LLM GENERATOR",
    "- Query Vector Snapshots",
    "- Raw Prompt & Draft Narrative"
])

# Audit Vault (Center)
draw_box(30, 38, 60, 18, 400, [
    "IMMUTABLE AUDIT TRAIL LOGGING VAULT (400)",
    "- Rule IDs & Evidence Txn Mapping (410)",
    "- Cosine Similarity & Document Source Links (420)",
    "- Prompt Snapshot & Narrative Versioning (430)"
])

draw_arrow(30, 70, 45, 56)
draw_arrow(90, 70, 75, 56)

# Human Review Layer
draw_box(30, 6, 60, 18, 450, [
    "HUMAN-IN-THE-LOOP COMPLIANCE CONSOLE (450)",
    "- Interactive Evidence Inspector (451)",
    "- Narrative Editor & Typology Corroborator (452)",
    "- Cryptographic Approval & Submission Action (453)"
])

# Bi-directional arrow between Audit Vault and Human Review Console
draw_arrow(55, 38, 55, 24)
draw_arrow(65, 24, 65, 38)

plt.tight_layout()
plt.savefig("patent_drawings/figure_4_audit_and_human_loop.png", bbox_inches='tight')
plt.close()

print("All patent drawings generated successfully in patent_drawings/ folder!")

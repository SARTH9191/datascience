import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import os

doc = Document()

# Set standard margins (1 inch)
for section in doc.sections:
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

def add_title(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    run.font.bold = True
    run.font.size = Pt(16)
    run.font.name = 'Times New Roman'
    p.paragraph_format.space_after = Pt(12)

def add_heading_1(text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.bold = True
    run.font.size = Pt(13)
    run.font.name = 'Times New Roman'
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)

def add_body_p(text, bold_prefix=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.bold = True
        r_pre.font.size = Pt(11)
        r_pre.font.name = 'Times New Roman'
    run = p.add_run(text)
    run.font.size = Pt(11)
    run.font.name = 'Times New Roman'
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    return p

# TITLE
add_title("PATENT PROPOSAL / SPECIFICATION DRAFT")
add_body_p("Formulated in accordance with Patent Proposal template Rev. 12-08-26 and Indian Patent Office (IPO) / PCT statutory standards.")

# 1. APPLICANTS
add_heading_1("1. Full name, nationality and address of applicant(s):")
table_app = doc.add_table(rows=3, cols=3)
table_app.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr = table_app.rows[0].cells
hdr[0].text, hdr[1].text, hdr[2].text = "Full Name", "Nationality", "Address"
for c in hdr:
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True

row1 = table_app.rows[1].cells
row1[0].text = "Vishwakarma Institute of Technology"
row1[1].text = "Indian"
row1[2].text = "666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra, India – 411 037"

row2 = table_app.rows[2].cells
row2[0].text = "Vishwakarma University"
row2[1].text = "Indian"
row2[2].text = "Survey No 2, 3, 4, Kondhwa Main Rd, Laxmi Nagar, Betal Nagar, Kondhwa, Pune, Maharashtra, India - 411048"

# 2. INVENTORS
add_heading_1("2. Full name (including middle name), nationality, address, mail id, and phone number of inventor(s):")
inventors = [
    ("Bhagwan Thorat", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "bhagwan.thorat@vit.edu", "+91-XXXXXXXXXX"),
    ("Aditya Jain", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "aditya.jain24@vit.edu", "+91-XXXXXXXXXX"),
    ("Aarya Jagdale", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "kiran.aarya24@vit.edu", "+91-XXXXXXXXXX"),
    ("Khushi Agrawal", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "agrawal.khushi24@vit.edu", "+91-XXXXXXXXXX"),
    ("Sujal Adsul", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "sujal.adsul24@vit.edu", "+91-XXXXXXXXXX"),
    ("Anshul Patidar", "IN", "Department of Artificial Intelligence and Data Science (AI&DS), Vishwakarma Institute of Technology, Pune", "patidar.anshul24@vit.edu", "+91-XXXXXXXXXX"),
]

table_inv = doc.add_table(rows=len(inventors)+1, cols=5)
table_inv.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_inv = table_inv.rows[0].cells
hdr_inv[0].text = "Full Name"
hdr_inv[1].text = "Nationality"
hdr_inv[2].text = "VIT Address"
hdr_inv[3].text = "Mail ID"
hdr_inv[4].text = "Phone No."
for c in hdr_inv:
    for p in c.paragraphs:
        for r in p.runs:
            r.font.bold = True

for idx, inv in enumerate(inventors):
    row = table_inv.rows[idx+1].cells
    for j in range(5):
        row[j].text = inv[j]

# 3. TITLE
add_heading_1("3. Title of the invention:")
add_body_p("AN EXPLAINABLE AI SYSTEM AND METHOD FOR GENERATING SUSPICIOUS ACTIVITY REPORT NARRATIVES", bold_prefix="Title: ")
add_body_p("(13 words - within the statutory <= 15 words limit requirement).")

# 4. TECHNICAL FIELD
add_heading_1("4. Technical field of the invention:")
add_body_p("The present invention relates generally to Artificial Intelligence (AI), Machine Learning (ML), Natural Language Processing (NLP), and Financial Technology (FinTech). More specifically, the invention relates to an explainable, audit-traceable software system and computer-implemented method for automatically detecting suspicious transaction patterns in banking streams and synthesizing regulator-ready Suspicious Activity Report (SAR) narratives utilizing Retrieval-Augmented Generation (RAG), vector similarity search, structured prompt engineering, and a human-in-the-loop compliance review mechanism.")

# 5. PRIOR ART
add_heading_1("5. Prior art:")
add_body_p("Financial Institutions (FIs) and banking entities are mandated by regulatory authorities (such as FinCEN, FIU, FATF) to identify illicit transactions and submit Suspicious Activity Reports (SARs). In conventional systems, transaction monitoring systems (TMS) trigger static threshold alerts, requiring human compliance officers to manually review transaction logs, account histories, and regulatory guidance documents. This manual investigation and drafting process consumes an average of 5 to 6 hours per report, resulting in severe reporting latency, human fatigue, and backlogs.")
add_body_p("While generative Large Language Models (LLMs) have emerged, unconstrained standalone LLMs suffer from severe technical drawbacks including: (1) high susceptibility to hallucinations (fabricating transaction amounts, account numbers, or regulatory citations); (2) black-box opacity lacking granular explainability; (3) absence of verifiable audit trails linking generated narratives back to source transaction evidence; and (4) disconnection from evolving statutory AML typologies. The present invention overcomes these specific deficiencies by coupling deterministic rule-based pattern detection with a high-dimensional vector retrieval engine (RAG), a constrained prompt assembly subsystem, and an immutable audit logging vault.")

# 6. OBJECTIVES
add_heading_1("6. Objective(s) of Invention:")
add_body_p("1. To eliminate generative hallucinations in automated regulatory compliance filings by strictly grounding LLM generation in verified transaction evidence and vectorized AML typologies via a RAG pipeline.")
add_body_p("2. To reduce manual narrative drafting latency by >90%, reducing drafting time from 5–6 hours per SAR to 20–30 minutes.")
add_body_p("3. To achieve end-to-end auditability and regulatory explainability by recording an immutable audit trail capturing triggered rule IDs, mathematical anomaly scores, cosine similarity metrics, retrieved typology references, prompt snapshots, and draft versions.")
add_body_p("4. To provide a Human-in-the-Loop review mechanism enabling compliance analysts to inspect evidence, modify drafts, and execute cryptographic authorization prior to regulatory dispatch.")
add_body_p("5. To attain high detection accuracy across multiple distinct suspicious patterns (achieving 92.9% overall accuracy across structuring, rapid fund movement, international transfers, and KYC income mismatches).")

# 7. SYNOPSIS
add_heading_1("7. Synopsis:")
add_body_p("The present invention provides a computer-implemented system and method for generating regulator-ready Suspicious Activity Report (SAR) narratives. The system comprises an Input Data Ingestion Subsystem (100) receiving transaction streams (101), KYC profiles (102), and alert history (103); a Data Preprocessing Engine (110) that cleans, validates, and groups chronological transactions by customer ID; a Rule-Based Suspicious Pattern Detection Engine (120) that evaluates structuring (122), rapid fund velocity (121), KYC income mismatches (123), and international transfers (124) to compute a weighted suspicion score; a Retrieval-Augmented Generation (RAG) Knowledge Engine (130) storing AML typologies and templates in a ChromaDB vector database (131) and executing cosine similarity matching (133); an LLM-Based SAR Narrative Generation Engine (140) synthesizing constrained, fact-grounded prompts; an Immutable Audit Trail Vault (150) logging all decision states, evidence transactions (152), and prompt versions (153); and a Human-in-the-Loop Compliance Analyst Console (160) for interactive evidence review (161), narrative editing (162), and regulatory sign-off (163).")

# 8. BRIEF DESCRIPTION OF DRAWINGS
add_heading_1("8. Brief description of drawings:")
add_body_p("Figure 1 illustrates the end-to-end system architecture of the AI-based SAR narrative generation system. Whereas:")
add_body_p("100 denotes input data ingestion subsystem, 101 denotes transaction data stream, 102 denotes KYC profile records, 103 denotes historical alert database, 110 denotes data preprocessing and normalization engine, 111 denotes data cleaning unit, 112 denotes duplicate removal unit, 113 denotes customer transaction aggregator, 120 denotes rule-based suspicious pattern detection engine, 121 denotes rapid fund movement detector, 122 denotes transaction structuring detector, 123 denotes KYC income mismatch detector, 124 denotes cross-border transfer detector, 130 denotes retrieval-augmented generation (RAG) knowledge engine, 131 denotes vector database, 132 denotes regulatory guidelines and AML typologies repository, 133 denotes cosine similarity ranking module, 140 denotes LLM-based SAR narrative generation engine, 141 denotes evidence context synthesizer, 142 denotes structured prompt assembler, 143 denotes narrative drafting engine, 150 denotes audit trail and logging vault, 151 denotes triggered rules storage, 152 denotes transaction evidence register, 153 denotes prompt snapshot ledger, 160 denotes human-in-the-loop compliance analyst console, 161 denotes interactive evidence visualizer, 162 denotes narrative editor tool, and 163 denotes dual-control approval dispatcher.")

add_body_p("Figure 2 illustrates the operational flowchart and process execution logic of the SAR narrative generation method. Whereas:")
add_body_p("200 denotes ingesting transaction alerts and KYC profiles, 202 denotes preprocessing and customer grouping, 204 denotes evaluating multi-factor AML suspicion rules, 206 denotes decision block determining whether suspicion threshold is satisfied, 208 denotes generating query vector embedding, 210 denotes retrieving top-k matched typologies from vector database via cosine similarity, 212 denotes synthesizing structured factual prompt, 214 denotes generating draft narrative and committing reasoning logs to audit trail, 216 denotes interactive analyst inspection, editing, and approval, and 218 denotes exporting final regulatory SAR filing.")

add_body_p("Figure 3 illustrates the Retrieval-Augmented Generation (RAG) and structured prompt synthesis subsystem. Whereas:")
add_body_p("300 denotes offline knowledge indexing subsystem, 301 denotes regulatory directives and typologies store, 302 denotes sentence transformer embedding generator, 303 denotes vector database index, 310 denotes online context retrieval subsystem, 311 denotes detected suspicious signals and evidence, 312 denotes real-time query vector encoder, 313 denotes cosine similarity ranking engine, 320 denotes composite structured prompt synthesis subsystem, 321 denotes KYC profile parameters, 322 denotes flagged evidence records, 323 denotes top-k retrieved typologies, 324 denotes statutory template rules, and 330 denotes LLM inference engine.")

add_body_p("Figure 4 illustrates the explainability audit trail vault and human-in-the-loop review architecture. Whereas:")
add_body_p("400 denotes immutable audit trail logging vault, 401 denotes rule detection data stream, 402 denotes RAG/LLM synthesis data stream, 410 denotes cryptographically-timestamped event registry, 420 denotes evidence-to-typology traceability matrix, 430 denotes prompt snapshot and model configuration ledger, 440 denotes narrative versioning ledger, 450 denotes human-in-the-loop compliance analyst console, 451 denotes transaction evidence inspector, 452 denotes in-line narrative editor, 453 denotes analyst override and comment handler, 454 denotes cryptographic multi-signer approval trigger, and 460 denotes regulatory authority dispatch gateway.")

# 9. DETAILED DESCRIPTION
add_heading_1("9. Detailed description of the invention:")
add_body_p("The technical architecture and operational mechanisms of the present invention are detailed as follows:")
add_body_p("1. Ingestion and Normalization: Data streams comprising transaction logs (101) with transaction IDs, amounts, sender/receiver accounts, and timestamps, together with KYC profiles (102) comprising declared income, occupation, and baseline risk tier, are ingested by subsystem 100. Preprocessing engine 110 validates schemas, removes duplicates, and groups records chronologically by customer entity C_i.")
add_body_p("2. Multi-Factor Risk Detection: Engine 120 executes deterministic rule evaluations: Structuring detector (122) identifies multiple inbound deposits below statutory currency reporting thresholds; Velocity detector (121) detects immediate liquidation of inbound credits through outbound transfers within <= 2 hours; Income mismatch detector (123) flags cumulative turnover exceeding declared annual income by a factor alpha; and Cross-border detector (124) identifies transactions involving high-risk jurisdictions. A weighted suspicious score S_cust is computed; customer profiles exceeding threshold Theta = 0.70 are flagged for automated narrative drafting.")
add_body_p("3. RAG Knowledge Indexing and Retrieval: Regulatory AML typologies and templates (301) are transformed via sentence transformer encoder (302) into 768-dimensional dense vectors and stored in ChromaDB (303). When an alert is triggered, suspicious indicators and evidence features are encoded into query vector E_Q (312), and cosine similarity matching is performed by engine 313 to retrieve the top-k (k=3) most relevant typologies (achieving 94.7% Top-3 retrieval accuracy with 1.3 second average latency).")
add_body_p("4. Grounded Prompt Synthesis and Generation: Subsystem 320 constructs a structured prompt injecting customer KYC (321), flagged transaction records (322), retrieved typologies (323), and template formatting rules (324). LLM engine 330 synthesizes a standardized 5-section narrative: (i) Subject KYC Background, (ii) Chronological Transaction Summary, (iii) Suspicious Activity & Anomaly Analysis, (iv) AML Typology Mapping, and (v) Compliance Recommendations.")
add_body_p("5. Audit Vault & Human Console: Audit vault 400 immutably captures triggered rule IDs, evidence transaction mappings, retrieved chunk IDs, prompt snapshots, and generated output versions. Human console 450 enables analysts to verify transaction charts, perform in-line text edits, and cryptographically sign off on the report before dispatch to regulatory gateways (460).")

# 10. BEST METHOD
add_heading_1("10. Best method of performance of the invention:")
add_body_p("The best mode of operation involves deploying the system as a containerized microservice architecture within a banking enterprise cloud. Daily transaction batches are preprocessed and customer profiles aggregated. For an exemplary case of account ACC-88392 exhibiting 8 cash deposits totaling INR 9,50,000 within 48 hours followed by an immediate outward remittance of INR 9,40,000 to an offshore shell entity, the risk detection engine registers S_cust = 0.94. Query vector E_Q is matched against ChromaDB, retrieving Typology #TYP-AML-04 with cosine similarity 0.912. The prompt assembler injects the KYC profile, specific transaction IDs, and typology guidelines into the LLM, generating a comprehensive, regulator-ready narrative in 8.4 seconds. Simultaneously, an immutable audit entry is committed. The compliance officer inspects the evidence visualizer, confirms typology grounding, enters approval credentials, and exports the final encrypted SAR filing. Total elapsed analyst time is 22 minutes (compared to 5.5 hours under manual prior art methods).")

# 11. CLAIMS
add_heading_1("11. CLAIMS:")
add_body_p("WE CLAIM:")
add_body_p("1. An explainable artificial intelligence system for automated generation of Suspicious Activity Report (SAR) narratives grounded in financial transaction evidence, the system comprising: an input data ingestion subsystem (100) configured to receive electronic transaction records (101) and customer Know-Your-Customer (KYC) identity profiles (102); a data preprocessing engine (110) operatively coupled to said input data ingestion subsystem, configured to normalize data schemas, remove duplicate transactions, and group transactions chronologically by unique customer identifiers; a rule-based suspicious pattern detection engine (120) configured to evaluate customer-grouped transactions against a plurality of suspicious transaction heuristics and compute a multi-factor composite suspicious score; a retrieval-augmented generation (RAG) knowledge engine (130) comprising a high-dimensional vector database (131) storing pre-computed vector embeddings of regulatory reporting directives, statutory SAR templates, and anti-money laundering (AML) typologies (132), and a similarity ranking module (133) configured to convert detected suspicious patterns into a query vector and retrieve top-k matched AML typologies using a vector distance metric; a large language model (LLM) narrative generation engine (140) configured to assemble a composite structured prompt combining said customer KYC profiles, flagged transaction evidence records, and retrieved top-k AML typologies, and execute constrained natural language generation to output a regulator-compliant SAR narrative; an immutable audit trail vault (150) configured to automatically log triggered rule identifiers, evidence transaction mappings, vector similarity scores, prompt snapshots, and generated narrative drafts; and a human-in-the-loop compliance console (160) providing an interactive graphic interface for compliance analysts to inspect evidence transactions, edit generated draft narratives, and execute regulatory submission approvals.")

add_body_p("2. The system as claimed in claim 1, wherein said rule-based suspicious pattern detection engine (120) evaluates at least four parallel behavioral vectors comprising: a structuring detector (122) identifying multi-transaction aggregate deposits positioned below statutory reporting thresholds within a predetermined time window; a velocity detector (121) identifying rapid outward transfer of funds occurring within a threshold duration following inward credit; an income mismatch detector (123) identifying cumulative turnover exceeding customer declared annual income by a predefined scaling factor; and an international transfer detector (124) identifying transactions routed through high-risk jurisdictions.")

add_body_p("3. The system as claimed in claim 1, wherein said composite suspicious score (S_cust) is determined according to S_cust = sum(w_k * I_k), wherein w_k represents a predetermined weight allocated to indicator k, I_k in {0, 1} represents a binary activation signal of indicator k, and wherein customer transactions are triggered for SAR narrative generation when S_cust >= Theta_suspicion.")

add_body_p("4. The system as claimed in claim 1, wherein said similarity ranking module (133) computes cosine similarity between query embedding E_Q and indexed document embedding E_D according to Sim(E_Q, E_D) = (E_Q . E_D) / (||E_Q|| * ||E_D||), wherein query and document embeddings are generated using a pre-trained sentence transformer encoder.")

add_body_p("5. The system as claimed in claim 1, wherein said LLM narrative generation engine (140) outputs a standardized narrative partitioned into five mandatory statutory sections comprising: a subject KYC background section, a chronological transaction summary section, an anomaly analysis section detailing specific threshold violations, a statutory AML typology alignment section, and a compliance disposition and recommendation section.")

add_body_p("6. The system as claimed in claim 1, wherein said immutable audit trail vault (150) establishes a direct bidirectional traceability matrix (420) linking individual sentences within the generated SAR narrative to corresponding underlying transaction identifiers and triggered rule metadata.")

add_body_p("7. A computer-implemented method for generating explainable Suspicious Activity Report (SAR) narratives grounded in financial transaction evidence, the method comprising the steps of: (a) ingesting, via an electronic input interface, a plurality of transaction records and customer Know-Your-Customer (KYC) identity profiles; (b) preprocessing and aggregating said transaction records by customer identifier over a defined evaluation time window; (c) executing, via a rule-based risk detection processor, a plurality of suspicious transaction heuristics to compute a composite suspicious score; (d) generating a high-dimensional query vector from detected suspicious indicators using a transformer encoder upon determining that said composite score exceeds a suspicion threshold; (e) retrieving, from a vector database storing indexed regulatory guidelines and AML typologies, top-k relevant typology documents via vector similarity computation; (f) synthesizing a composite structured prompt combining customer KYC profile data, flagged transaction evidence records, and retrieved top-k typologies; (g) generating, via a Large Language Model (LLM) constrained by said structured prompt, a regulator-compliant draft SAR narrative; (h) committing, to an immutable audit ledger, an audit snapshot comprising triggered rule identifiers, evidence transaction mappings, retrieved document references, and prompt parameters; and (i) presenting said draft SAR narrative and corresponding transaction evidence on a human-in-the-loop compliance console for analyst verification, editing, and electronic filing authorization.")

add_body_p("8. The method as claimed in claim 7, wherein said human-in-the-loop compliance console enables an analyst to perform in-line text editing of the narrative, annotate evidence records, override detected risk classifications, and append cryptographic approval signatures prior to dispatch to a regulatory financial intelligence unit.")

# 12. INVENTIVE STEP
add_heading_1("12. Inventive step of your invention:")
add_body_p("The inventive step of the present invention resides in the technical synergies achieved between deterministic rule-based pattern detection, semantic vector retrieval (RAG), constrained prompt generation, and an immutable explainability audit trail. Compared to prior art systems requiring 5–6 hours of manual investigator effort, the present invention reduces drafting time to 20–30 minutes (>90% latency reduction). Furthermore, while unconstrained LLMs suffer from high hallucination rates (25–40%), the grounded RAG architecture achieves an 89.8% reduction in hallucination, ensuring strict compliance with regulatory filing standards. The system achieves 92.9% overall risk detection accuracy and provides an immutable audit trail mapping every generated statement to underlying transaction records and statutory typologies.")

# 13. INDUSTRIAL APPLICATION
add_heading_1("13. Industrial application:")
add_body_p("The invention is directly applicable in commercial banking, retail banking, FinTech payment service providers, cryptocurrency exchanges/VASPs, and governmental Financial Intelligence Units (FIUs) for automating AML/CFT compliance, fraud transaction analysis, and statutory regulatory filing.")

# 14. ABSTRACT
add_heading_1("14. Abstract:")
add_body_p("An explainable artificial intelligence system and computer-implemented method for automated generation of regulator-ready Suspicious Activity Report (SAR) narratives is disclosed. The system ingests banking transaction streams (101) and customer KYC identity profiles (102). A preprocessing engine (110) normalizes and aggregates transactions per customer identifier. A rule-based risk detection engine (120) detects complex money laundering patterns—including structuring (122), rapid fund velocity (121), and KYC-income mismatches (123)—computing a composite suspicious score. When the score exceeds a threshold, an online query embedding is generated and matched against pre-indexed regulatory guidelines and Anti-Money Laundering (AML) typologies (132) stored in a ChromaDB vector database (131) via cosine similarity (133). A structured prompt assembler injects KYC data, transaction evidence records, and retrieved typologies into a Large Language Model (140) to generate a factual, hallucination-free SAR narrative. An immutable audit trail vault (150) records triggered rules, evidence transaction mappings, prompt snapshots, and model configurations for complete regulatory explainability. A human-in-the-loop compliance console (160) enables compliance analysts to inspect evidence, edit drafts, and electronically authorize regulatory filings, reducing drafting time by over 90% while achieving 92.9% detection accuracy. (FIG. 1)")

# 15. DRAWINGS ATTACHMENT
add_heading_1("15. Drawings (Patent Specification Sheets):")

drawings = [
    ("Figure 1: End-to-End System Architecture", "patent_drawings/figure_1_system_architecture.png", 5.8),
    ("Figure 2: Operational Flowchart and Process Execution Logic", "patent_drawings/figure_2_operational_flowchart.png", 5.8),
    ("Figure 3: Retrieval-Augmented Generation & Prompt Synthesis Subsystem", "patent_drawings/figure_3_rag_retrieval_engine.png", 5.8),
    ("Figure 4: Explainability Audit Trail Vault and Human Review Loop", "patent_drawings/figure_4_audit_and_human_loop.png", 5.8)
]

for title, path, width in drawings:
    doc.add_page_break()
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p_title.add_run(title)
    r.font.bold = True
    r.font.size = Pt(12)
    if os.path.exists(path):
        doc.add_picture(path, width=Inches(width))
        last_p = doc.paragraphs[-1]
        last_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

output_docx = "PATENT_DRAFT_COMPLETE.docx"
doc.save(output_docx)
print(f"Saved complete docx to {output_docx} successfully!")

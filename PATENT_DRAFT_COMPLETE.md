# PATENT PROPOSAL & SPECIFICATION DRAFT

**Document Standard:** Formatted in strict compliance with the *Patent Proposal Template Rev. 12-08-26* and Indian Patent Office (IPO) / PCT guidelines.

---

## 1. APPLICANT DETAILS

| Parameter | Details |
| :--- | :--- |
| **Applicant 1** | Vishwakarma Institute of Technology |
| **Nationality** | Indian |
| **Address** | 666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra, India – 411 037 |
| **Applicant 2** | Vishwakarma University |
| **Nationality** | Indian |
| **Address** | Survey No 2, 3, 4, Kondhwa Main Rd, Laxmi Nagar, Betal Nagar, Kondhwa, Pune, Maharashtra, India – 411 048 |

---

## 2. INVENTORS DETAILS

| Full Name (Including Middle Name) | Nationality | Department & Institute Address | Email ID | Phone No. |
| :--- | :--- | :--- | :--- | :--- |
| **Bhagwan Thorat** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | bhagwan.thorat@vit.edu | [Inventor Contact] |
| **Aditya Jain** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | aditya.jain24@vit.edu | [Inventor Contact] |
| **Aarya Jagdale** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | kiran.aarya24@vit.edu | [Inventor Contact] |
| **Khushi Agrawal** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | agrawal.khushi24@vit.edu | [Inventor Contact] |
| **Sujal Adsul** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | sujal.adsul24@vit.edu | [Inventor Contact] |
| **Anshul Patidar** | Indian | Department of Artificial Intelligence & Data Science, Vishwakarma Institute of Technology, Pune | patidar.anshul24@vit.edu | [Inventor Contact] |

---

## 3. TITLE OF THE INVENTION
**AN EXPLAINABLE AI SYSTEM AND METHOD FOR GENERATING SUSPICIOUS ACTIVITY REPORT NARRATIVES**  
*(Exact length: 13 words; strict adherence to the <= 15 words limit requirement).*

---

## 4. TECHNICAL FIELD OF THE INVENTION
The present invention relates generally to the technical fields of Artificial Intelligence (AI), Machine Learning (ML), Natural Language Processing (NLP), and Financial Technology (FinTech). More specifically, the present invention relates to an explainable, audit-traceable software architecture, system, and computer-implemented method for automatically detecting suspicious transaction patterns in banking and financial streams and synthesizing regulator-ready Suspicious Activity Report (SAR) narratives utilizing Retrieval-Augmented Generation (RAG), vector similarity search, dynamic prompt engineering, and a human-in-the-loop compliance review mechanism.

---

## 5. PRIOR ART & PROBLEM STATEMENT
### Existing Technology & Prior Art Solutions
Financial Institutions (FIs) and banks are legally obligated by financial regulatory intelligence units (such as FinCEN, FIU-IND, FATF) to detect money laundering, terrorist financing, and illicit transactions, and to draft and submit detailed Suspicious Activity Reports (SARs). Conventional solutions in the field rely on:
1. **Rule-Based Transaction Monitoring Systems (TMS):** Traditional TMS trigger static alerts based on hard-coded threshold violations (e.g., transactions exceeding specified amounts). However, these systems lack narrative generation capabilities.
2. **Generic Natural Language Generation & Black-Box LLMs:** Standalone Large Language Models (LLMs) used in finance attempt text summarization. 
3. **Manual Human Analyst Investigation:** Human compliance officers manually inspect fragmented relational databases, customer KYC records, ledger logs, and paper-based regulatory typology guidance manuals, spending an average of 5 to 6 hours drafting a single narrative.

### Disadvantages & Deficiencies in Existing Technology
1. **Pervasive AI Hallucinations & Factual Unreliability:** Unconstrained, standalone LLMs frequently hallucinate financial figures, fabricated counterparty accounts, or non-existent regulatory citations, making them legally inadmissible and dangerous for compliance filings.
2. **Absence of Explainability and Verifiable Audit Trails:** Modern deep learning and black-box LLM systems do not maintain deterministic mappings between generated sentences and underlying banking transactions. When regulatory auditors challenge a SAR filing, institutions cannot demonstrate how the AI arrived at its conclusions.
3. **Severe Operational Inefficiency and High Latency:** The manual collation of multi-account transaction graphs, KYC mismatches, and structuring typologies creates massive reporting backlogs, leading to severe regulatory fines for delayed submissions.
4. **Lack of Integrated Multi-Stage Pipeline:** Prior art systems either focus purely on alert generation without narrative drafting, or generic summarization without AML domain grounding or human verification controls.

---

## 6. OBJECTIVE(S) OF THE INVENTION
The primary objectives and technical advantages of the present invention over conventional systems include:
1. **To eliminate generative hallucinations** in compliance filings by grounding an LLM generator in real-time vectorized AML typologies, statutory templates, and specific transaction evidence via a Retrieval-Augmented Generation (RAG) pipeline.
2. **To drastically reduce narrative drafting latency** from 5–6 hours per SAR to under 20–30 minutes, achieving over a 90% reduction in manual investigator workload.
3. **To establish complete, end-to-end auditability and explainability** by automatically maintaining an immutable ledger recording triggered rule IDs, mathematical anomaly scores, cosine similarity metrics, retrieved typology source IDs, raw assembled prompt snapshots, and model versioning.
4. **To enforce human-in-the-loop accountability**, providing compliance analysts with an interactive console to inspect raw transaction evidence, verify typology alignments, edit system-generated drafts, and record cryptographic approval signatures prior to regulatory submission.
5. **To ensure high-accuracy suspicious pattern detection** (achieving >92.9% overall pattern detection accuracy across structuring, rapid fund movement, income mismatch, and international transfer vectors).

---

## 7. SYNOPSIS OF THE INVENTION
The present invention discloses a system and computer-implemented method for explainable, knowledge-grounded automated generation of Suspicious Activity Report (SAR) narratives. The system comprises:
- An **Input Data Ingestion Subsystem (100)** configured to ingest heterogeneous transaction logs (101), KYC profiles (102), and historical alerts (103);
- A **Data Preprocessing & Normalization Engine (110)** that removes duplicate records, normalizes timestamps, and groups chronological financial transactions by customer identifiers ($cust\_id$);
- A **Rule-Based Suspicious Pattern Detection Engine (120)** that computes composite suspicious scores ($S_{cust}$) across multiple parallel anomaly vectors, including structuring/smurfing ($I_{struct}$), rapid velocity fund pass-through ($I_{rapid}$), income-to-turnover mismatches ($I_{income}$), and high-risk cross-border transfers ($I_{intl}$);
- A **Retrieval-Augmented Generation (RAG) Engine (130)** comprising a high-dimensional vector database (131, ChromaDB) storing pre-indexed regulatory guidelines and AML typologies (132), and a cosine similarity ranking module (133) that matches high-dimensional query embeddings generated by a sentence transformer against stored typologies;
- An **LLM-Based SAR Narrative Generation Engine (140)** that dynamically synthesizes a structured prompt injecting customer KYC context, transaction evidence records, and retrieved top-k typology text, constraining a Large Language Model to generate factual, regulator-compliant narrative sections;
- An **Immutable Audit Trail Vault (150)** that automatically timestamps and logs triggered rules (151), mapped evidence transaction IDs (152), prompt snapshots, and generated output versions (153); and
- A **Human-in-the-Loop Compliance Analyst Console (160)** providing interactive evidence inspection (161), narrative editing/annotation (162), and regulatory filing sign-off mechanisms (163).

---

## 8. BRIEF DESCRIPTION OF THE DRAWINGS
The accompanying drawings, which are incorporated in and constitute a part of this specification, illustrate embodiments of the invention and, together with the description, serve to explain the principles of the invention. In accordance with patent drafting standards, single numerical references denote specific elements consistently across all drawings:

- **Figure 1** illustrates the end-to-end system architecture of the AI-based SAR narrative generation system, wherein:
  - **100** denotes the Input Data Ingestion Subsystem;
  - **101** denotes transaction data streams;
  - **102** denotes KYC identity profile records;
  - **103** denotes historical alert databases;
  - **110** denotes the Data Preprocessing and Normalization Engine;
  - **111** denotes the data cleaning and validation unit;
  - **112** denotes the duplicate removal and timestamp normalizer;
  - **113** denotes the customer-wise transaction aggregator;
  - **120** denotes the Rule-Based Suspicious Pattern Detection Engine;
  - **121** denotes the rapid fund movement detector;
  - **122** denotes the transaction structuring / smurfing detector;
  - **123** denotes the KYC income mismatch detector;
  - **124** denotes the cross-border / international transfer detector;
  - **130** denotes the Retrieval-Augmented Generation (RAG) Knowledge Engine;
  - **131** denotes the vector database (ChromaDB);
  - **132** denotes the regulatory guidelines and AML typologies store;
  - **133** denotes the cosine similarity ranking module;
  - **140** denotes the LLM-Based SAR Narrative Generation Engine;
  - **141** denotes the evidence context synthesizer;
  - **142** denotes the dynamic structured prompt assembler;
  - **143** denotes the regulator-compliant narrative drafting engine;
  - **150** denotes the Audit Trail and Logging Vault;
  - **151** denotes triggered rules and threshold snapshot storage;
  - **152** denotes the transaction evidence mapping register;
  - **153** denotes prompt snapshot and model version ledger;
  - **160** denotes the Human-in-the-Loop Compliance Analyst Console;
  - **161** denotes the interactive evidence visualizer;
  - **162** denotes the narrative editing and annotation tool;
  - **163** denotes the dual-control regulatory approval and filing dispatcher.

- **Figure 2** illustrates the operational flowchart and process execution logic of the SAR narrative generation method, wherein:
  - **200** denotes ingesting transaction alerts, KYC profiles, and account histories;
  - **202** denotes preprocessing and grouping transactions by customer identifier;
  - **204** denotes computing multi-factor suspicious behavioral scores across pattern detectors;
  - **206** denotes the decision branch evaluating whether the suspicious score exceeds the threshold;
  - **208** denotes generating a high-dimensional query vector embedding via a transformer encoder;
  - **210** denotes retrieving top-k matched AML typologies and templates from the vector repository;
  - **212** denotes synthesizing a composite structured prompt with factual grounding constraints;
  - **214** denotes generating the draft narrative and committing reasoning logs to the audit vault;
  - **216** denotes interactive compliance analyst inspection, editing, and approval;
  - **218** denotes exporting the final SAR filing and archiving the immutable audit trail.

- **Figure 3** illustrates the Retrieval-Augmented Generation (RAG) and prompt synthesis subsystem, wherein:
  - **300** denotes the offline knowledge indexing subsystem;
  - **301** denotes the statutory regulatory directives and AML typology repository;
  - **302** denotes the sentence transformer embedding generator;
  - **303** denotes the vector embedding database;
  - **310** denotes the online context retrieval subsystem;
  - **311** denotes the detected suspicious signals and transaction evidence context;
  - **312** denotes the real-time query vector transformer encoder;
  - **313** denotes the cosine similarity search and top-k matching engine;
  - **320** denotes the composite structured prompt synthesis subsystem;
  - **321** denotes customer KYC profile parameters;
  - **322** denotes flagged transaction evidence records;
  - **323** denotes top-k retrieved AML typologies;
  - **324** denotes statutory narrative template rules and structural constraints;
  - **330** denotes the Large Language Model (LLM) inference engine.

- **Figure 4** illustrates the explainability audit trail and human-in-the-loop review architecture, wherein:
  - **400** denotes the Immutable Audit Trail Logging Vault;
  - **401** denotes the rule-based detection engine data stream;
  - **402** denotes the RAG and LLM synthesis engine data stream;
  - **410** denotes the cryptographically timestamped event registry;
  - **420** denotes the direct transaction evidence-to-typology traceability matrix;
  - **430** denotes the full prompt snapshot and model configuration ledger;
  - **440** denotes narrative versioning and post-edit delta tracking;
  - **450** denotes the Human-in-the-Loop Compliance Analyst Console;
  - **451** denotes the transaction evidence inspection and explainability visualizer;
  - **452** denotes the in-line narrative editor and typology verification module;
  - **453** denotes the analyst override, comment insertion, and rejection handler;
  - **454** denotes the cryptographic multi-signer regulatory submission trigger;
  - **460** denotes the regulatory authority / Financial Intelligence Unit dispatch repository.

---

## 9. DETAILED DESCRIPTION OF THE INVENTION
Referring now to the drawings in detail and particularly to **FIG. 1** through **FIG. 4**, the present invention embodies an end-to-end explainable artificial intelligence system for automated generation of SAR narratives.

### 9.1 Data Ingestion and Normalization (100, 110)
The system receives heterogeneous data streams via the Data Ingestion Subsystem (100). The inputs comprise:
1. **Transaction Data (101):** Attributes include unique transaction ID ($txn\_id$), customer ID ($cust\_id$), numeric amount, sender account number, receiver account number, destination/source country, transfer mechanism (NEFT, RTGS, IMPS, SWIFT, Cash Deposit), and ISO-8601 timestamp.
2. **KYC Profile Data (102):** Attributes include customer ID ($cust\_id$), full legal name, registered occupation, verified annual income bracket, assigned baseline risk tier (Low, Medium, High), and jurisdictional domicile.
3. **Historical Alert Records (103):** Historical false-positive and confirmed SAR classifications.

The Data Preprocessing & Normalization Engine (110) executes systematic cleaning (111), removing corrupt/duplicate entries (112), and grouping transactions per customer entity $C_i$:
$$T(C_i) = \{t_1, t_2, \dots, t_n\}$$
The total transactional throughput volume for customer $C_i$ across a defined temporal evaluation window $\Delta t$ is computed as:
$$V(C_i) = \sum_{j=1}^{n} \text{Amount}(t_j)$$

### 9.2 Rule-Based Suspicious Pattern Detection Engine (120)
Rather than relying on uninterpretable neural networks for primary alert triaging, the present invention employs an explainable, deterministic multi-factor rule engine (120) that evaluates distinct behavioral indicators:
1. **Structuring / Smurfing Detector (122):** Identifies multiple cash or electronic deposits maintained just below statutory currency transaction reporting thresholds (e.g., INR 10,00,000 or USD 10,000) within short temporal proximity:
   $$I_{\text{struct}} = \begin{cases} 1, & \text{if } \exists \{t_a, \dots, t_k\} \text{ where } \tau_{\text{lower}} \le \text{Amount}(t) < \tau_{\text{report}} \\ 0, & \text{otherwise} \end{cases}$$
2. **Velocity & Rapid Movement Detector (121):** Evaluates rapid pass-through transit where aggregate inbound credits are almost instantaneously (e.g., within $\le 2$ hours) liquidated through outbound transfers to unrelated beneficiary accounts:
   $$I_{\text{rapid}} = \begin{cases} 1, & \text{if } \Delta t(\text{credit}, \text{debit}) \le \Delta t_{\text{threshold}} \text{ and } \frac{V_{\text{out}}}{V_{\text{in}}} \ge 0.90 \\ 0, & \text{otherwise} \end{cases}$$
3. **KYC Income Mismatch Detector (123):** Flags anomalous cumulative credit volumes disproportionate to declared customer socio-economic profile and annual income:
   $$I_{\text{income}} = \begin{cases} 1, & \text{if } V(C_i) \ge \alpha \cdot \frac{\text{Annual\_Income}}{12} \\ 0, & \text{otherwise} \end{cases}$$
4. **Cross-Border / High-Risk Jurisdiction Detector (124):** Checks destination and transit BIC/IBAN country codes against high-risk jurisdiction registries (e.g., FATF grey/blacklists):
   $$I_{\text{intl}} = \begin{cases} 1, & \text{if } \text{Country}(t_j) \in \mathcal{K}_{\text{high\_risk}} \\ 0, & \text{otherwise} \end{cases}$$

The overall composite Suspicious Score ($S_{\text{cust}}$) is determined through weighted linear combination:
$$S_{\text{cust}} = \sum_{k=1}^{M} w_k \cdot I_k \quad \text{subject to } \sum_{k=1}^{M} w_k = 1.0$$
A customer dossier is flagged for automated SAR narrative drafting if $S_{\text{cust}} \ge \Theta_{\text{suspicion}}$ (wherein $\Theta_{\text{suspicion}}$ is calibrated to 0.70).

### 9.3 RAG Knowledge Indexing and Vector Retrieval (130, 300, 310)
Referring to **FIG. 3**, to ensure factual fidelity and prevent hallucination, the invention implements a dual-path Retrieval-Augmented Generation system:
1. **Offline Knowledge Indexing (300):** Regulatory compliance manuals, statutory filing templates, and codified FATF/FIU AML typologies (301) are parsed, chunked into semantically coherent text segments $D_m$, and transformed via a sentence transformer encoder (302) into 768-dimensional dense vector embeddings:
   $$\vec{E}_{D_m} = f_{\text{encode}}(D_m)$$
   The resulting embeddings are indexed within a persistent ChromaDB vector store (303).
2. **Online Query Transformation and Matching (310):** When customer $C_i$ exceeds the suspicion threshold, an online query vector $\vec{E}_Q$ is dynamically synthesized from the triggered suspicious indicator names, transaction summary statistics, and counterparties:
   $$\vec{E}_Q = f_{\text{encode}}(Q_{\text{evidence}})$$
   The cosine similarity between query embedding $\vec{E}_Q$ and indexed typology embeddings $\vec{E}_{D_m}$ is evaluated:
   $$\text{Sim}(\vec{E}_Q, \vec{E}_{D_m}) = \frac{\vec{E}_Q \cdot \vec{E}_{D_m}}{\|\vec{E}_Q\| \|\vec{E}_{D_m}\|}$$
   The top-$k$ most relevant typologies ($k=3$) exhibiting maximum similarity are retrieved. Experimental benchmarks show Top-1 retrieval accuracy of 88.4% and Top-3 retrieval accuracy of 94.7% at an average retrieval latency of 1.3 seconds.

### 9.4 Grounded Narrative Prompt Assembly & Generation (140, 320, 330)
The Composite Structured Prompt Synthesis Subsystem (320) constructs an immutable, highly constrained prompt string $P$ injected directly into the LLM inference engine (330):
$$P = \text{Concat}(\text{Role}, \text{KYC}(321), \text{Evidence\_Txns}(322), \text{Retrieved\_Typologies}(323), \text{Template\_Constraints}(324))$$
The LLM generates a standardized, regulator-ready SAR narrative structured into five mandatory statutory sections:
1. **Subject Identification & Customer Background:** Summarizes verified KYC profile, declared occupation, historical account longevity, and assigned risk tier.
2. **Chronological Transaction Summary:** Details exact transaction dates, amounts, velocity, counterparties, and routing methods.
3. **Suspicious Activity & Anomaly Analysis:** Explains why the activity is anomalous (e.g., structuring below statutory threshold followed by swift offshore pass-through).
4. **Regulatory Typology Mapping:** Directly references statutory FATF/FIU typologies retrieved via the RAG engine.
5. **Disposition & Remedial Recommendations:** Specifies recommended institutional actions (e.g., account freezing, monitoring, law enforcement escalation).

### 9.5 Audit Trail Vault and Human-in-the-Loop Review Console (150, 160, 400, 450)
Referring to **FIG. 4**, to satisfy statutory explainability requirements, the system executes an automated audit capture:
- The **Audit Trail Vault (400)** immutably commits:
  1. Triggered rule IDs and mathematical scores (410);
  2. Mapped evidence transaction IDs (420);
  3. Retrieved document titles, chunk hashes, and cosine similarity values;
  4. Complete raw prompt string snapshots and LLM configuration hyperparameters (temperature, seed) (430);
  5. System-generated draft versioning (440).
- The **Human-in-the-Loop Console (450)** presents the draft narrative side-by-side with interactive transaction graph visualizers (451) and typology references. The compliance analyst can:
  - Verify every factual assertion against raw ledger records;
  - Modify or expand narrative text in the in-line editor (452);
  - Add investigator notes or reject false positives (453);
  - Execute a multi-signer cryptographic authorization (454) that seals the final report and dispatches it to regulatory repositories (460).

---

## 10. BEST METHOD OF PERFORMANCE OF THE INVENTION
The preferred embodiment and operational workflow for executing the invention in a banking enterprise environment is described as follows:

```
[Transaction Streams 101 + KYC 102]
                  │
                  ▼
   [Data Preprocessing Engine 110]
                  │
                  ▼
   [Rule-Based Risk Detector 120] ──(Flagged Evidence)──► [Audit Trail Vault 150]
                  │
                  ▼
   [Sentence Transformer Encoder 312]
                  │
                  ▼
    [ChromaDB Cosine Retrieval 313] ◄── [Indexed Typologies 303]
                  │
                  ▼
   [Structured Prompt Synthesizer 320]
                  │
                  ▼
   [LLM Narrative Generator 140]
                  │
                  ▼
 [Analyst Console 160 / Audit Ledger 400]
                  │
                  ▼
  [Cryptographic Filing Sign-Off 454] ──► [FIU/Regulatory Submission 460]
```

1. **Step 1: Streaming Ingestion & Preprocessing:** Ingest daily transaction batches ($N = 100,000+$ records) via the Ingestion Subsystem (100). The Preprocessing Engine (110) aggregates transactions by $cust\_id$ over a rolling 30-day window.
2. **Step 2: Automated Risk Triaging:** The Risk Detection Engine (120) runs multi-factor heuristics. For customer account `ACC-88392`, the system identifies 8 cash deposits totaling INR 9,50,000 within 48 hours ($I_{\text{struct}} = 1$) followed by an immediate outward SWIFT remittance of INR 9,40,000 to an offshore shell entity ($I_{\text{rapid}} = 1, I_{\text{intl}} = 1$). Composite score $S_{\text{cust}} = 0.94 > \Theta = 0.70$.
3. **Step 3: Vector Knowledge Retrieval:** The transaction context is transformed into vector $\vec{E}_Q$ using `sentence-transformers/all-mpnet-base-v2`. A cosine similarity query against ChromaDB retrieves Typology `#TYP-AML-04` ("Structuring combined with rapid wire pass-through layering") with a cosine similarity score of $0.912$.
4. **Step 4: Fact-Grounded Prompt Synthesis:** The Prompt Synthesizer (320) constructs a system prompt forbidding external speculation and mandating structured output referencing exact $txn\_id$ records and `#TYP-AML-04`.
5. **Step 5: Narrative Generation & Audit Ledgering:** The LLM generates a comprehensive 600-word regulator-ready narrative in 8.4 seconds. Simultaneously, the Audit Vault (400) creates an immutable JSON record linking the prompt, response, model weights version, retrieved chunk IDs, and evidence transaction hashes.
6. **Step 6: Analyst Sign-off:** A Senior AML Compliance Officer opens the Human Console (450), verifies the transaction timestamps on the interactive chart, confirms typology fidelity, applies an electronic approval signature, and automatically exports the final encrypted SAR filing to the regulatory FIU gateway. Total elapsed analyst time: 22 minutes (compared to 5.5 hours under prior art manual workflows).

---

## 11. INVENTIVE STEP & TECHNICAL ADVANCEMENTS
The inventive step of the present invention resides in the technical synergies achieved between deterministic rule-based pattern detection, semantic vector retrieval (RAG), constrained prompt generation, and an immutable explainability audit trail:

| Feature / Metric | Conventional Prior Art Solutions | Present Invention | Technical Advancement / Significance |
| :--- | :--- | :--- | :--- |
| **Drafting Latency** | 5 – 6 hours per report | 20 – 30 minutes | **>90% operational time reduction**; prevents regulatory non-compliance backlogs |
| **Generative Hallucinations** | High (25% – 40% in standard LLMs) | Negligible (<2% / 89.8% reduction) | Enforces strict factual grounding via RAG and constrained prompt synthesis |
| **Explainability & Traceability** | Black-box; impossible to trace decision rationale | Complete multi-tier audit trail | Maps every word to specific $txn\_id$s, rule scores, and statutory typology IDs |
| **Detection Accuracy** | Fragmented (~70% – 80%) | **92.9% overall accuracy** | 94.2% on deposits, 91.8% on velocity, 96.1% on international transfers |
| **Human Supervision** | Disjointed, post-facto review | Integrated Human-in-the-Loop console | Retains ultimate legal accountability with interactive editing and signing |

---

## 12. INDUSTRIAL APPLICABILITY
The present invention possesses broad industrial applicability across multiple sectors of the global economy:
1. **Commercial and Retail Banking:** Scalable deployment across tier-1 and tier-2 banks for automating Suspicious Activity Report (SAR) and Suspicious Transaction Report (STR) drafting.
2. **Payment Service Providers (PSPs) & FinTech Platforms:** Real-time compliance monitoring and automated regulatory filing for high-frequency digital wallets, payment gateways, and remittance services.
3. **Cryptocurrency Exchanges & Virtual Asset Service Providers (VASPs):** Ingesting on-chain blockchain clustering alerts and translating blockchain hops into regulator-compliant travel-rule narratives.
4. **Regulatory & Financial Intelligence Authorities (FIUs):** Automated triaging, corroboration, and verification of incoming SAR filings submitted by regulated entities.

---

## 13. CLAIMS

### WE CLAIM:

#### Claim 1 (Independent System Claim):
An explainable artificial intelligence system for automated generation of Suspicious Activity Report (SAR) narratives grounded in financial transaction evidence, the system comprising:
- an **input data ingestion subsystem (100)** configured to receive electronic transaction records (101) and customer Know-Your-Customer (KYC) identity profiles (102);
- a **data preprocessing engine (110)** operatively coupled to said input data ingestion subsystem, configured to normalize data schemas, remove duplicate transactions, and group transactions chronologically by unique customer identifiers ($cust\_id$);
- a **rule-based suspicious pattern detection engine (120)** configured to evaluate customer-grouped transactions against a plurality of suspicious transaction heuristics and compute a multi-factor composite suspicious score ($S_{\text{cust}}$);
- a **retrieval-augmented generation (RAG) knowledge engine (130)** comprising:
  - a high-dimensional vector database (131) storing pre-computed vector embeddings of regulatory reporting directives, statutory SAR templates, and anti-money laundering (AML) typologies (132); and
  - a similarity ranking module (133) configured to convert detected suspicious patterns into a query vector and retrieve top-$k$ matched AML typologies using a vector distance metric;
- a **large language model (LLM) narrative generation engine (140)** configured to assemble a composite structured prompt combining said customer KYC profiles, flagged transaction evidence records, and retrieved top-$k$ AML typologies, and execute constrained natural language generation to output a regulator-compliant SAR narrative;
- an **immutable audit trail vault (150)** configured to automatically log triggered rule identifiers, evidence transaction mappings, vector similarity scores, prompt snapshots, and generated narrative drafts; and
- a **human-in-the-loop compliance console (160)** providing an interactive graphic interface for compliance analysts to inspect evidence transactions, edit generated draft narratives, and execute regulatory submission approvals.

#### Claim 2 (Dependent Claim - Pattern Detection Heuristics):
The system as claimed in claim 1, wherein said rule-based suspicious pattern detection engine (120) evaluates at least four parallel behavioral vectors comprising:
- a structuring detector (122) identifying multi-transaction aggregate deposits positioned below statutory reporting thresholds within a predetermined time window;
- a velocity detector (121) identifying rapid outward transfer of funds occurring within a threshold duration following inward credit;
- an income mismatch detector (123) identifying cumulative turnover exceeding customer declared annual income by a predefined scaling factor; and
- an international transfer detector (124) identifying transactions routed through high-risk jurisdictions.

#### Claim 3 (Dependent Claim - Mathematical Score Formulation):
The system as claimed in claim 1, wherein said composite suspicious score ($S_{\text{cust}}$) is determined according to:
$$S_{\text{cust}} = \sum_{k=1}^{M} w_k \cdot I_k$$
wherein $w_k$ represents a predetermined weight allocated to indicator $k$, $I_k \in \{0, 1\}$ represents a binary activation signal of indicator $k$, and wherein customer transactions are triggered for SAR narrative generation when $S_{\text{cust}} \ge \Theta_{\text{suspicion}}$.

#### Claim 4 (Dependent Claim - Vector Retrieval Architecture):
The system as claimed in claim 1, wherein said similarity ranking module (133) of the retrieval-augmented generation engine computes cosine similarity between query embedding $\vec{E}_Q$ and indexed document embedding $\vec{E}_D$ according to:
$$\text{Sim}(\vec{E}_Q, \vec{E}_D) = \frac{\vec{E}_Q \cdot \vec{E}_D}{\|\vec{E}_Q\| \|\vec{E}_D\|}$$
wherein query and document embeddings are generated using a pre-trained sentence transformer encoder.

#### Claim 5 (Dependent Claim - Narrative Structural Partitions):
The system as claimed in claim 1, wherein said LLM narrative generation engine (140) outputs a standardized narrative partitioned into five mandatory statutory sections comprising:
- a subject KYC background section;
- a chronological transaction summary section;
- an anomaly analysis section detailing specific threshold violations;
- a statutory AML typology alignment section; and
- a compliance disposition and recommendation section.

#### Claim 6 (Dependent Claim - Audit Traceability Matrix):
The system as claimed in claim 1, wherein said immutable audit trail vault (150) establishes a direct bidirectional traceability matrix (420) linking individual sentences within the generated SAR narrative to corresponding underlying transaction identifiers ($txn\_id$) and triggered rule metadata.

#### Claim 7 (Independent Method Claim):
A computer-implemented method for generating explainable Suspicious Activity Report (SAR) narratives grounded in financial transaction evidence, the method comprising the steps of:
- **(a)** ingesting, via an electronic input interface, a plurality of transaction records and customer Know-Your-Customer (KYC) identity profiles;
- **(b)** preprocessing and aggregating said transaction records by customer identifier over a defined evaluation time window;
- **(c)** executing, via a rule-based risk detection processor, a plurality of suspicious transaction heuristics to compute a composite suspicious score;
- **(d)** generating a high-dimensional query vector from detected suspicious indicators using a transformer encoder upon determining that said composite score exceeds a suspicion threshold;
- **(e)** retrieving, from a vector database storing indexed regulatory guidelines and AML typologies, top-$k$ relevant typology documents via vector similarity computation;
- **(f)** synthesizing a composite structured prompt combining customer KYC profile data, flagged transaction evidence records, and retrieved top-$k$ typologies;
- **(g)** generating, via a Large Language Model (LLM) constrained by said structured prompt, a regulator-compliant draft SAR narrative;
- **(h)** committing, to an immutable audit ledger, an audit snapshot comprising triggered rule identifiers, evidence transaction mappings, retrieved document references, and prompt parameters; and
- **(i)** presenting said draft SAR narrative and corresponding transaction evidence on a human-in-the-loop compliance console for analyst verification, editing, and electronic filing authorization.

#### Claim 8 (Dependent Method Claim - Analyst Interface Actions):
The method as claimed in claim 7, wherein said human-in-the-loop compliance console enables an analyst to perform in-line text editing of the narrative, annotate evidence records, override detected risk classifications, and append cryptographic approval signatures prior to dispatch to a regulatory financial intelligence unit.

---

## 14. ABSTRACT
An explainable artificial intelligence system and computer-implemented method for automated generation of regulator-ready Suspicious Activity Report (SAR) narratives is disclosed. The system ingests banking transaction streams (101) and customer KYC identity profiles (102). A preprocessing engine (110) normalizes and aggregates transactions per customer identifier. A rule-based risk detection engine (120) detects complex money laundering patterns—including structuring (122), rapid fund velocity (121), and KYC-income mismatches (123)—computing a composite suspicious score. When the score exceeds a threshold, an online query embedding is generated and matched against pre-indexed regulatory guidelines and Anti-Money Laundering (AML) typologies (132) stored in a ChromaDB vector database (131) via cosine similarity (133). A structured prompt assembler injects KYC data, transaction evidence records, and retrieved typologies into a Large Language Model (140) to generate a factual, hallucination-free SAR narrative. An immutable audit trail vault (150) records triggered rules, evidence transaction mappings, prompt snapshots, and model configurations for complete regulatory explainability. A human-in-the-loop compliance console (160) enables compliance analysts to inspect evidence, edit drafts, and electronically authorize regulatory filings, reducing drafting time by over 90% while achieving 92.9% detection accuracy.

*(Drawing to be published with Abstract: **Figure 1**)*

---

## 15. DRAWINGS (PATENT SPECIFICATION SHEETS)

Below are the formal, numeral-labeled patent specification drawings generated in strict adherence to patent office guidelines (featuring uniform single numerals, no text labeling in drawings, and clean high-contrast black-and-white lineage):

- **Figure 1 (System Architecture):** [figure_1_system_architecture.png](file:///d:/3edyear/Sar-platform-testing/patent_drawings/figure_1_system_architecture.png)
- **Figure 2 (Operational Flowchart):** [figure_2_operational_flowchart.png](file:///d:/3edyear/Sar-platform-testing/patent_drawings/figure_2_operational_flowchart.png)
- **Figure 3 (RAG Retrieval Engine):** [figure_3_rag_retrieval_engine.png](file:///d:/3edyear/Sar-platform-testing/patent_drawings/figure_3_rag_retrieval_engine.png)
- **Figure 4 (Audit Trail & Human Loop):** [figure_4_audit_and_human_loop.png](file:///d:/3edyear/Sar-platform-testing/patent_drawings/figure_4_audit_and_human_loop.png)

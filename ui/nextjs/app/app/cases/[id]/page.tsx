'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sarApi, SARCase, AccountAuditTrail, SARReportData } from '@/lib/api';
import { RiskBadge, StatusBadge } from '@/components/RiskBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  ArrowLeft, Download, FileText, CheckCircle, XCircle, Loader,
  Copy, Check, Lock, Clock, Shield, AlertTriangle, ChevronDown, ChevronUp, User, Play
} from 'lucide-react';

const TABS = ['Overview', 'Risk Analysis', 'SAR Report', 'Compliance', 'Audit Trail'];

/* ── shared card style using CSS variables ── */
const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 20,
};

const surfaceStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '10px 14px',
};

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<SARCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('Overview');
  const [running, setRunning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [groqLabel, setGroqLabel] = useState('');
  const [analyst, setAnalyst] = useState('Analyst-1');
  const [approving, setApproving] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [accountHistory, setAccountHistory] = useState<AccountAuditTrail | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  /* ── Editable SAR Report state ── */
  const [reportData, setReportData] = useState<SARReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  /* ── Collapsible accordion sections ── */
  const [secOpen, setSecOpen] = useState<Record<string, boolean>>({
    filing: true, subject: false, typology: false, narrative: true
  });

  const reportRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: string) =>
    setSecOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const reload = async () => {
    try { setData(await sarApi.getCase(id)); } catch { /* 404 */ }
    setLoading(false);
  };
  useEffect(() => { reload(); }, [id]);

  const runPipeline = async () => {
    if (!data || running) return;
    setRunning(true);
    try {
      await sarApi.runPipeline(id);
      await reload();
    } catch (e) {
      console.error(e);
      alert('Pipeline failed');
    } finally {
      setRunning(false);
    }
  };

  const generateNarrative = async () => {
    if (!data?.normalized || generating) return;
    setGenerating(true);
    setGroqLabel('Generating...');
    try {
      await sarApi.runPipeline(id);
      await reload();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
      setGroqLabel('');
    }
  };

  useEffect(() => {
    if (tab === 'SAR Report' && data?.risk_assessment && !reportData) {
      setReportLoading(true);
      sarApi.getReportData(id).then(setReportData).finally(() => setReportLoading(false));
    }
  }, [tab, data, id, reportData]);

  const updateReport = (field: keyof SARReportData, value: unknown) => {
    setReportData(prev => prev ? { ...prev, [field]: value } as SARReportData : null);
  };

  const handleTypologyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    updateReport('typology', val);
    const codeMap: Record<string, string> = {
      'Structuring': 'Structuring (excl. smurfing)',
      'Layering': 'Layering',
      'Rapid Movement': 'Rapid Movement of Funds',
      'Smurfing': 'Smurfing',
      'High-Risk Geography': 'Transaction with High-Risk Geography',
      'TBML': 'Trade-Based Money Laundering',
      'Crypto Layering': 'Crypto Layering',
    };
    updateReport('typology_code', codeMap[val] || '');
  };

  const saveReport = async () => {
    if (!reportData) return;
    setSaving(true);
    try {
      await sarApi.saveReportData(id, reportData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save report:', err);
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    if (!data || !reportData) return;
    setPdfDownloading(true);
    try {
      const blob = await sarApi.downloadPdfFromServer(id, reportData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SAR-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to generate PDF. Please ensure all report data is valid.');
    } finally {
      setPdfDownloading(false);
    }
  };

  /* ── Approve / dismiss ── */
  const approveCase = async () => {
    if (!analyst.trim()) return alert('Enter analyst name');
    setApproving(true);
    try {
      await sarApi.approveCase(id, analyst);
      await reload();
    } catch (e) { console.error(e); } finally { setApproving(false); }
  };
  const dismissCase = async () => {
    setDismissing(true);
    try {
      await sarApi.dismissCase(id);
      await reload();
    } catch (e) { console.error(e); } finally { setDismissing(false); }
  };

  /* ── Loading / not found ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <Loader style={{ width: 18, height: 18, color: 'var(--brand)', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ color: 'var(--text-faint)', fontSize: 13, marginBottom: 12 }}>Case not found</p>
      <button onClick={() => router.push('/app/cases')} style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>← Back to cases</button>
    </div>
  );

  const risk       = data.risk_assessment;
  const narrative  = data.narrative;
  const compliance = data.compliance;
  const audit      = data.audit;
  const errors     = data.error_log.filter(e => !e.error.includes('Neo4j write failed'));

  const reviewedCount = reportData ? [
    reportData.section_filing_reviewed,
    reportData.section_subject_reviewed,
    reportData.section_typology_reviewed,
    reportData.section_narrative_reviewed,
  ].filter(Boolean).length : 0;

  const canDownload = reviewedCount === 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back */}
      <button onClick={() => router.push('/app/cases')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, width: 'fit-content' }}>
        <ArrowLeft style={{ width: 13, height: 13 }} /> All Cases
      </button>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 className="mono" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{id}</h1>
            <StatusBadge status={data.status} />
            {risk && <RiskBadge tier={risk.risk_tier} />}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {data.normalized?.subject_name ?? 'Unknown'} · ${data.normalized?.total_amount_usd?.toLocaleString() ?? '0'} · {data.audit_trail.length} events
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {!data.normalized && (
            <button onClick={runPipeline} disabled={running}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brand)', color: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', opacity: running ? 0.6 : 1 }}>
              {running ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <Play style={{ width: 13, height: 13 }} />}
              {running ? 'Running…' : 'Run Pipeline'}
            </button>
          )}
          {data.normalized && !narrative && risk?.risk_tier !== 'green' && (
            <button onClick={generateNarrative} disabled={generating}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--purple-dim)', border: '1px solid var(--purple-border)', color: 'var(--purple)', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: generating ? 0.6 : 1 }}>
              {generating ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <FileText style={{ width: 13, height: 13 }} />}
              {generating ? groqLabel : 'Generate Narrative'}
            </button>
          )}
          {narrative && data.status === 'in_review' && (
            <>
              <input value={analyst} onChange={e => setAnalyst(e.target.value)} placeholder="Analyst name"
                style={{ fontSize: 12, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }} />
              <button onClick={approveCase} disabled={approving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--green-dim)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {approving ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <CheckCircle style={{ width: 13, height: 13 }} />}
                Approve &amp; File
              </button>
              <button onClick={dismissCase} disabled={dismissing}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--red-dim)', border: '1px solid var(--red-border)', color: 'var(--red)', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>
                {dismissing ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <XCircle style={{ width: 13, height: 13 }} />}
                Dismiss
              </button>
            </>
          )}
          {narrative && (
            <button onClick={downloadPDF}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--green-dim)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
              <Download style={{ width: 13, height: 13 }} /> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`tab ${tab === t ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Shield style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Pipeline Status</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Agent 1 — Ingestion',    done: !!data.normalized },
                { label: 'Agent 2 — Risk Score',   done: !!risk },
                { label: 'Agent 3 — Narrative',    done: !!narrative },
                { label: 'Agent 4 — Compliance',   done: !!compliance },
                { label: 'Agent 5 — Audit Hash',   done: !!audit },
                { label: 'Agent 6 — Human Review', done: !!data.analyst_approved_by },
              ].map(({ label, done }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {done
                    ? <CheckCircle style={{ width: 14, height: 14, color: 'var(--green)', flexShrink: 0 }} />
                    : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border)', flexShrink: 0 }} />}
                  <span style={{ fontSize: 12, color: done ? 'var(--text-secondary)' : 'var(--text-faint)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <FileText style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Transaction Data</span>
            </div>
            {data.raw_transaction ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Object.entries(data.raw_transaction).slice(0, 10).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{k.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>No data</span>}
          </div>

          {errors.length > 0 && (
            <div style={{ ...card, borderColor: 'var(--amber-border)', gridColumn: '1/-1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle style={{ width: 14, height: 14, color: 'var(--amber)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Pipeline Warnings</span>
              </div>
              {errors.map((e, i) => (
                <div key={i} style={{ fontSize: 12, padding: '6px 0', borderBottom: i < errors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>{e.agent}</span>
                  <span style={{ color: 'var(--amber)' }}>{e.error}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ RISK ANALYSIS ══ */}
      {tab === 'Risk Analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!risk ? <EmptyPanel msg="Run pipeline to see risk analysis" /> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div style={{ ...card, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {(risk.risk_score * 100).toFixed(0)}<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>%</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk Score</div>
                </div>
                <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RiskBadge tier={risk.risk_tier} size="lg" />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Risk Tier</div>
                </div>
                <div style={{ ...card, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--purple)', marginBottom: 4, textTransform: 'capitalize' }}>{risk.matched_typology}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Matched Typology</div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{(risk.typology_confidence * 100).toFixed(0)}% conf</div>
                </div>
              </div>

              {Object.keys(risk.shap_values).length > 0 && (
                <div style={card}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>SHAP Feature Importance</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={Object.entries(risk.shap_values).slice(0, 8).map(([k, v]) => ({ name: k.replace(/_/g, ' '), value: Math.abs(v as number), raw: v as number }))}
                      layout="vertical" margin={{ left: 0, right: 16 }}>
                      <XAxis type="number" tick={{ fill: 'var(--text-faint)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={150} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }}
                        formatter={(v: unknown, _: unknown, p: { payload?: { raw: number } }) => [Number(p.payload?.raw ?? v).toFixed(4), 'SHAP']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {Object.values(risk.shap_values).slice(0, 8).map((v, i) => (
                          <Cell key={i} fill={(v as number) > 0 ? 'var(--brand)' : 'var(--red)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand)', display: 'inline-block' }} /> Increases risk
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--red)', display: 'inline-block' }} /> Decreases risk
                    </div>
                  </div>
                </div>
              )}

              {risk.signals.length > 0 && (
                <div style={card}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Risk Signals</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {risk.signals.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                        <AlertTriangle style={{ width: 13, height: 13, color: 'var(--amber)', flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)', textTransform: 'capitalize', marginBottom: 3 }}>{s.signal_type}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══ SAR REPORT (EDITABLE) ══ */}
      {tab === 'SAR Report' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {risk?.risk_tier === 'green' ? (
            <div style={{ ...card, textAlign: 'center', padding: 56 }}>
              <Shield style={{ display: 'inline-block', color: 'var(--green)', width: 26, height: 26, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 500 }}>SAR Filing Not Required</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>This case was classified as GREEN (Low Risk). Regulatory reporting is automatically bypassed.</p>
            </div>
          ) : reportLoading ? (
            <div style={{ ...card, textAlign: 'center', padding: 56 }}>
              <Loader style={{ display: 'inline-block', color: 'var(--text-muted)', width: 24, height: 24, animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>Loading report data...</p>
            </div>
          ) : !reportData ? (
            <div style={{ ...card, textAlign: 'center', padding: 56 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Generate report data by running the pipeline.</p>
            </div>
          ) : (
            <>
              {/* Progress + actions bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div className="progress-bar-fill" style={{ width: `${(reviewedCount / 4) * 100}%`, background: canDownload ? 'var(--green)' : 'var(--brand)' }} />
                  </div>
                  {reviewedCount}/4 sections reviewed
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {saveSuccess && <span style={{ fontSize: 12, color: 'var(--green)', alignSelf: 'center', marginRight: 8 }}>Saved ✓</span>}
                  <button onClick={saveReport} disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                    {saving ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <FileText style={{ width: 13, height: 13 }} />}
                    Save Draft
                  </button>
                  <button onClick={downloadPDF} disabled={!canDownload || pdfDownloading}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: canDownload ? 'var(--green-dim)' : 'var(--bg-surface)', border: `1px solid ${canDownload ? 'var(--green-border)' : 'transparent'}`, color: canDownload ? 'var(--green)' : 'var(--text-muted)', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: canDownload ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                    {pdfDownloading ? <Loader style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <Download style={{ width: 13, height: 13 }} />}
                    Download PDF
                  </button>
                </div>
              </div>

              <div ref={reportRef} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* A. Filing & Institution Info */}
                <Sec title="Section A — Filing & Institution Info" open={secOpen.filing} onToggle={() => toggleSection('filing')}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '4px 0 12px 0' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Filing Institution Name</label>
                      <input value={reportData.filing_institution_name} onChange={e => updateReport('filing_institution_name', e.target.value)} className="input-dark" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Filing Institution Address</label>
                      <input value={reportData.filing_institution_address} onChange={e => updateReport('filing_institution_address', e.target.value)} className="input-dark" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Filing Date</label>
                      <input type="date" value={reportData.filing_date} onChange={e => updateReport('filing_date', e.target.value)} className="input-dark" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Period Start</label>
                        <input type="date" value={reportData.report_period_start} onChange={e => updateReport('report_period_start', e.target.value)} className="input-dark" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Period End</label>
                        <input type="date" value={reportData.report_period_end} onChange={e => updateReport('report_period_end', e.target.value)} className="input-dark" />
                      </div>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: reportData.section_filing_reviewed ? 'var(--green)' : 'var(--text-secondary)', cursor: 'pointer', marginTop: 8 }}>
                    <input type="checkbox" checked={reportData.section_filing_reviewed} onChange={e => updateReport('section_filing_reviewed', e.target.checked)} style={{ accentColor: 'var(--green)' }} />
                    I have reviewed the filing and institution information.
                  </label>
                </Sec>

                {/* B. Subject & Transaction Info */}
                <Sec title="Section B — Subject & Transaction Info" open={secOpen.subject} onToggle={() => toggleSection('subject')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0 12px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <KV label="Subject Name" value={reportData.subject_name} />
                      <KV label="Subject ID / Account" value={reportData.subject_account_id} mono />
                      <KV label="Total Suspicious Amount" value={`$${reportData.total_amount_usd.toLocaleString()}`} />
                      <KV label="Identifying Number" value={reportData.subject_id_number || 'N/A'} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Transaction Types Involved</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {reportData.transaction_types.map((t: string, i: number) => (
                          <span key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 4, fontSize: 11, color: 'var(--text-secondary)' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Geographies Involved</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {reportData.geographies_involved.map((g: string, i: number) => (
                          <span key={i} style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', padding: '4px 10px', borderRadius: 4, fontSize: 11, color: 'var(--blue-light)' }}>{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: reportData.section_subject_reviewed ? 'var(--green)' : 'var(--text-secondary)', cursor: 'pointer', marginTop: 8 }}>
                    <input type="checkbox" checked={reportData.section_subject_reviewed} onChange={e => updateReport('section_subject_reviewed', e.target.checked)} style={{ accentColor: 'var(--green)' }} />
                    I have reviewed the subject and transaction summary.
                  </label>
                </Sec>

                {/* C. Fraud Typology */}
                <Sec title="Section C — Fraud Typology & Classification" open={secOpen.typology} onToggle={() => toggleSection('typology')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0 12px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Primary Typology</label>
                        <select value={reportData.typology} onChange={handleTypologyChange} className="input-dark" style={{ appearance: 'auto' }}>
                          <option value="Unknown">Unknown</option>
                          <option value="Structuring">Structuring</option>
                          <option value="Layering">Layering</option>
                          <option value="Rapid Movement">Rapid Movement</option>
                          <option value="High-Risk Geography">High-Risk Geography</option>
                          <option value="Smurfing">Smurfing</option>
                          <option value="TBML">Trade-Based ML</option>
                          <option value="Crypto Layering">Crypto Layering</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>FinCEN Code</label>
                        <input value={reportData.typology_code} readOnly className="input-dark" style={{ opacity: 0.6 }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Typology Description</label>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-surface)', padding: 12, borderRadius: 8, border: '1px solid var(--border)', margin: 0 }}>
                        {reportData.typology_description || 'No description available.'}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Suspicion Reason (Visible on PDF)</label>
                      <textarea value={reportData.suspicion_reason} onChange={e => updateReport('suspicion_reason', e.target.value)} className="input-dark" style={{ resize: 'vertical', minHeight: 60 }} />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: reportData.section_typology_reviewed ? 'var(--green)' : 'var(--text-secondary)', cursor: 'pointer', marginTop: 8 }}>
                    <input type="checkbox" checked={reportData.section_typology_reviewed} onChange={e => updateReport('section_typology_reviewed', e.target.checked)} style={{ accentColor: 'var(--green)' }} />
                    I confirm the typology classification is accurate.
                  </label>
                </Sec>

                {/* D. AI Narrative */}
                <Sec title="Section D — Suspicious Activity Information (Narrative)" open={secOpen.narrative} onToggle={() => toggleSection('narrative')}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0 12px 0' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Narrative Body</label>
                        <span style={{ fontSize: 10, color: 'var(--purple)', background: 'var(--purple-dim)', padding: '2px 8px', borderRadius: 4 }}>AI Generated</span>
                      </div>
                      <textarea value={reportData.narrative_body} onChange={e => updateReport('narrative_body', e.target.value)} className="input-dark" style={{ resize: 'vertical', minHeight: 250, lineHeight: 1.6 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase' }}>Analyst Internal Notes (Not included in filing)</label>
                      <textarea value={reportData.analyst_notes} onChange={e => updateReport('analyst_notes', e.target.value)} className="input-dark" style={{ resize: 'vertical', minHeight: 60 }} placeholder="Add any private notes for the audit trail..." />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: reportData.section_narrative_reviewed ? 'var(--green)' : 'var(--text-secondary)', cursor: 'pointer', marginTop: 8 }}>
                    <input type="checkbox" checked={reportData.section_narrative_reviewed} onChange={e => updateReport('section_narrative_reviewed', e.target.checked)} style={{ accentColor: 'var(--green)' }} />
                    I have reviewed and approved the AI-generated narrative.
                  </label>
                </Sec>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ COMPLIANCE ══ */}
      {tab === 'Compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!compliance ? <EmptyPanel msg="Compliance runs after pipeline execution" /> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { label: 'BSA Compliant',  ok: compliance.bsa_compliant },
                  { label: 'All Fields',     ok: compliance.all_fields_complete },
                  { label: 'FinCEN Format',  ok: compliance.fincen_format_valid },
                ].map(({ label, ok }) => (
                  <div key={label} style={{ ...card, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {ok
                      ? <CheckCircle style={{ width: 15, height: 15, color: 'var(--green)' }} />
                      : <XCircle style={{ width: 15, height: 15, color: 'var(--red)' }} />}
                    <span style={{ fontSize: 12, fontWeight: 500, color: ok ? 'var(--green)' : 'var(--red)' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={card}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Compliance Issues</h3>
                {compliance.compliance_issues.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: 13 }}>
                    <CheckCircle style={{ width: 15, height: 15 }} /> All 8 AML compliance rules passed
                  </div>
                ) : compliance.compliance_issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '10px 0', borderBottom: i < compliance.compliance_issues.length - 1 ? '1px solid var(--border)' : 'none', fontSize: 12 }}>
                    <XCircle style={{ width: 13, height: 13, color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{issue}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ AUDIT TRAIL ══ */}
      {tab === 'Audit Trail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.audit_trail.length === 0 ? <EmptyPanel msg="No audit events — run the pipeline first" /> : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {data.audit_trail.map((entry, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--blue-light)', flexShrink: 0 }}>{i + 1}</div>
                    {i < data.audit_trail.length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 8 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{entry.agent}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{(entry.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{entry.action}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-faint)' }}>
                      <Clock style={{ width: 11, height: 11 }} />
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {audit && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Lock style={{ width: 14, height: 14, color: 'var(--green)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Immutable SHA256 Hash</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <code className="mono code-block" style={{ flex: 1 }}>{audit.immutable_hash}</code>
                <button onClick={() => { navigator.clipboard.writeText(audit.immutable_hash); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ padding: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}>
                  {copied ? <Check style={{ width: 15, height: 15, color: 'var(--green)' }} /> : <Copy style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />}
                </button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 8 }}>Immutable — cannot be modified or deleted</div>
            </div>
          )}

          {/* Account History Section */}
          {data.normalized && data.normalized.subject_account_ids.length > 0 && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User style={{ width: 14, height: 14, color: 'var(--brand)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Account History</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— {data.normalized.subject_account_ids[0]}</span>
                </div>
                <button
                  onClick={async () => {
                    const acctId = data.normalized!.subject_account_ids[0];
                    setLoadingHistory(true);
                    setHistoryError('');
                    try {
                      const trail = await sarApi.getAccountAuditTrail(acctId);
                      setAccountHistory(trail);
                    } catch (e: unknown) {
                      setHistoryError(e instanceof Error ? e.message : 'No history found');
                    }
                    setLoadingHistory(false);
                  }}
                  style={{ fontSize: 11, padding: '5px 12px', background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', borderRadius: 8, color: 'var(--blue-light)', cursor: 'pointer' }}
                >
                  {loadingHistory ? 'Loading…' : 'View All Cases for This Account'}
                </button>
              </div>

              {historyError && (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px', background: 'var(--bg-surface)', borderRadius: 8 }}>{historyError}</div>
              )}

              {accountHistory && (
                <div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 10, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total cases: <strong style={{ color: 'var(--text-primary)' }}>{accountHistory.total_cases}</strong></span>
                    <span style={{ color: 'var(--red)' }}>SAR required: <strong>{accountHistory.total_sar_required}</strong></span>
                    <span style={{ color: 'var(--text-muted)' }}>Dismissed: <strong>{accountHistory.total_dismissed}</strong></span>
                    <span style={{ color: 'var(--text-secondary)' }}>Avg score: <strong style={{ color: 'var(--amber)' }}>{(accountHistory.risk_score_avg * 100).toFixed(0)}%</strong></span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {accountHistory.cases.map((c, i) => (
                      <details key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        <summary style={{ padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, listStyle: 'none' }}>
                          <span style={{ fontFamily: 'monospace', color: 'var(--brand)', fontSize: 11 }}>{c.case_id}</span>
                          <RiskBadge tier={c.risk_tier as never} />
                          <StatusBadge status={c.status as never} />
                          <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 11 }}>${c.total_amount_usd.toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                        </summary>
                        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, paddingTop: 12 }}>Typology: <span style={{ color: 'var(--text-secondary)' }}>{c.typology}</span></div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                            {c.agent_decisions.map((d, j) => (
                              <div key={j} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', padding: '4px 0', borderTop: j > 0 ? '1px solid var(--border)' : 'none' }}>
                                <span style={{ color: 'var(--brand)', minWidth: 100, flexShrink: 0 }}>{d.agent}</span>
                                <span style={{ color: 'var(--text-muted)', flex: 1 }}>{d.action?.slice(0, 80)}{(d.action?.length ?? 0) > 80 ? '…' : ''}</span>
                                <span style={{ color: 'var(--text-faint)' }}>{((d.confidence ?? 0) * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                          {c.immutable_hash && (
                            <code className="code-block" style={{ fontSize: 10, display: 'block' }}>
                              SHA256: {c.immutable_hash}
                            </code>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function EmptyPanel({ msg }: { msg: string }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '64px 20px', textAlign: 'center', color: 'var(--text-faint)', fontSize: 13 }}>
      {msg}
    </div>
  );
}

function Sec({ title, children, open = false, onToggle }: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 12 }}>
      <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
        {open ? <ChevronUp style={{ width: 12, height: 12, color: 'var(--text-faint)' }} /> : <ChevronDown style={{ width: 12, height: 12, color: 'var(--text-faint)' }} />}
      </button>
      {open && <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 4 }}>{children}</div>}
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <span style={{ fontSize: 10, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>{label.replace(/_/g, ' ')}</span>
      <span className={mono ? 'mono' : ''} style={{ fontSize: 12, textAlign: 'right', color: mono ? 'var(--brand)' : 'var(--text-secondary)' }}>{value}</span>
    </div>
  );
}

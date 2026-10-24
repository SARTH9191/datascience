'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sarApi } from '@/lib/api';
import { RiskBadge } from '@/components/RiskBadge';
import { Play, Loader, CheckCircle, Zap, ArrowRight, Info, Shield } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'structuring' as const,
    title: 'Operation Threshold',
    tag: 'Structuring',
    tier: 'red',
    amount: '$49,000',
    desc: 'ACC-9812 splits $49,000 into 5 transfers of $9,800 each in 24 hours — just below the BSA $10k CTR threshold.',
    facts: ['5 transactions in 24 hours', '$9,800 each (below $10k)', 'Offshore geography', 'High-risk merchant'],
    note: 'Judges: SHAP chart with amount_usd as top feature, BSA threshold flag, auto-generated FIU-IND narrative.',
  },
  {
    id: 'layering' as const,
    title: 'Project Shadow',
    tag: 'Layering / Wire Fraud',
    tier: 'red',
    amount: '$180,000',
    desc: 'Transfers through 4 jurisdictions — Cayman + Panama — via crypto merchant with a dormant reactivated account.',
    facts: ['4 cross-border jurisdictions', 'Cayman + Panama routing', 'Crypto merchant', 'Dormant account reactivated'],
    note: 'Judges: Multi-jurisdiction flag, geography risk signal, immutable audit hash.',
  },
  {
    id: 'smurfing' as const,
    title: 'Operation Scatter',
    tag: 'Smurfing Pattern',
    tier: 'amber',
    amount: '$28,000',
    desc: '8 connected accounts deposit round-number amounts ($2k–$5k) to a central account on the same day.',
    facts: ['8 connected accounts', 'Round-number deposits', 'Same-day coordination', 'transaction_frequency top SHAP feature'],
    note: 'Judges: round-number flag, network pattern, multiple compliance issues.',
  },
];

type ScenarioId = 'structuring' | 'layering' | 'smurfing';
interface Result { case_id: string; risk_tier: string; }

export default function DemoPage() {
  const router = useRouter();
  const [running, setRunning] = useState<ScenarioId | 'all' | null>(null);
  const [step, setStep] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, Result>>({});

  const runOne = async (id: ScenarioId) => {
    if (results[id]) { router.push(`/app/cases/${results[id].case_id}`); return; }
    setRunning(id);
    setStep(s => ({ ...s, [id]: 'Simulating transaction data…' }));
    try {
      const sim = await sarApi.simulateScenario(id);
      setStep(s => ({ ...s, [id]: 'Running 6-agent pipeline…' }));
      const pipe = await sarApi.runPipeline(sim.case_id);
      setStep(s => ({ ...s, [id]: 'Generating Groq AI narrative…' }));
      await sarApi.generateNarrative(sim.case_id);
      setStep(s => ({ ...s, [id]: '✓ Complete' }));
      setResults(r => ({ ...r, [id]: { case_id: sim.case_id, risk_tier: pipe.risk_tier } }));
    } catch (e) {
      setStep(s => ({ ...s, [id]: '✗ Error' }));
      console.error(e);
    }
    setRunning(null);
  };

  const runAll = async () => {
    setRunning('all');
    for (const s of SCENARIOS) {
      if (!results[s.id]) await runOne(s.id);
    }
    setRunning(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 999, background: 'var(--purple-dim)', border: '1px solid var(--purple-border)', color: 'var(--purple)', fontSize: 11, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Judge Demo Mode
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Demo Center</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 500 }}>
          3 pre-loaded AML scenarios. Each runs the full pipeline — XGBoost scoring, Groq AI narrative, PDF report — in under 30 seconds.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button id="run-all-btn" onClick={runAll} disabled={!!running}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand)', color: '#fff', padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', opacity: running ? 0.6 : 1 }}>
          {running === 'all' ? <Loader style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> : <Zap style={{ width: 15, height: 15 }} />}
          {running === 'all' ? 'Running All Scenarios…' : 'Run All 3 Scenarios'}
        </button>

        <button id="refresh-pipeline-btn"
          onClick={async () => {
            setRunning('all');
            try {
              const res = await sarApi.refreshPipeline();
              alert(res.message);
              window.location.reload();
            } catch { alert('Refresh failed'); }
            setRunning(null);
          }}
          disabled={!!running}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: running ? 0.6 : 1 }}>
          <Loader style={{ width: 15, height: 15, animation: running ? 'spin 1s linear infinite' : 'none' }} />
          Full System Refresh
        </button>

        <button id="train-model-btn"
          onClick={async () => {
            setRunning('all');
            try {
              const res = await sarApi.trainModel();
              alert(res.message);
            } catch { alert('Training failed'); }
            setRunning(null);
          }}
          disabled={!!running}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--green-dim)', border: '1px solid var(--green-border)', color: 'var(--green)', padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: running ? 0.6 : 1 }}>
          <Shield style={{ width: 15, height: 15 }} />
          Start Model Training
        </button>
      </div>

      {/* Scenario Cards */}
      {SCENARIOS.map(s => {
        const result = results[s.id];
        const isRunning = running === s.id;
        return (
          <div key={s.id} style={{
            background: 'var(--bg-card)',
            border: `1px solid ${result ? 'var(--brand-border)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            transition: 'border-color 0.2s',
            boxShadow: 'var(--shadow-card)',
          }}>
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <RiskBadge tier={s.tier} size="sm" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.tag}</span>
                </div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{s.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{s.amount}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total</div>
              </div>
            </div>

            {/* Facts grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {s.facts.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Judge note */}
            <div style={{ display: 'flex', gap: 8, background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', borderRadius: 10, padding: '8px 12px', marginBottom: 16 }}>
              <Info style={{ width: 13, height: 13, color: 'var(--brand)', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: 'var(--blue-light)', lineHeight: 1.6 }}>{s.note}</span>
            </div>

            {/* Action */}
            {result ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)', fontSize: 13, fontWeight: 500 }}>
                  <CheckCircle style={{ width: 15, height: 15 }} /> Pipeline complete
                </div>
                <code className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>{result.case_id}</code>
                <RiskBadge tier={result.risk_tier} size="sm" />
                <button onClick={() => router.push(`/app/cases/${result.case_id}`)}
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', borderRadius: 8, padding: '8px 14px', color: 'var(--brand)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                  View Full Report <ArrowRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ) : isRunning ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Loader style={{ width: 14, height: 14, color: 'var(--brand)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--blue-light)' }}>{step[s.id]}</span>
                <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--brand), var(--purple))', width: '65%', borderRadius: 2 }} />
                </div>
              </div>
            ) : (
              <button onClick={() => runOne(s.id)} disabled={!!running}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--brand)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: running ? 0.5 : 1 }}>
                <Play style={{ width: 13, height: 13 }} /> Run {s.title}
              </button>
            )}
          </div>
        );
      })}

      {/* Judge guide */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Shield style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Judge Demo Script (6 steps)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            ['Run All 3 Scenarios', 'Click the button above — all 3 cases run in ~30 seconds.'],
            ['Open Operation Threshold', '"View Full Report" → Risk Analysis tab → SHAP chart shows amount_usd as top driver.'],
            ['View SAR Report', 'SAR Report tab → 8-part FIU-IND form auto-filled by Groq llama3.'],
            ['Download PDF', '"Download PDF" → regulatory-ready PDF downloads instantly.'],
            ['Check Audit Trail', 'Audit Trail tab → SHA256 immutable hash + agent timeline.'],
            ['Approve & File', 'Type analyst name → "Approve & File" → status changes to FILED.'],
          ].map(([title, desc], n) => (
            <div key={n} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--blue-light)', flexShrink: 0, marginTop: 2 }}>{n + 1}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

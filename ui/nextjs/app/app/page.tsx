'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sarApi, CaseSummary } from '@/lib/api';
import { RiskBadge, StatusBadge } from '@/components/RiskBadge';
import {
  Activity, FileText, AlertTriangle, CheckCircle,
  Shield, Zap, ArrowRight, Clock, Play, TrendingUp, RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    sarApi.getCases().then(setCases).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const total = cases.length;
  const red   = cases.filter(c => ['red', 'critical'].includes(c.risk_tier)).length;
  const amber = cases.filter(c => c.risk_tier === 'amber').length;
  const filed = cases.filter(c => c.status === 'filed').length;

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
    boxShadow: 'var(--shadow-card)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>AI-powered SAR pipeline · FIU-IND STR · XGBoost + Groq</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setLoading(true);
              sarApi.refreshPipeline(300).then(() => load()).catch(() => setLoading(false));
            }}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--brand-dim)', border: '1px solid var(--brand-border)',
              borderRadius: 8, color: 'var(--brand)', fontSize: 12, padding: '7px 12px',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}
          >
            <Zap style={{ width: 13, height: 13 }} /> Load Batch (300)
          </button>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="animate-fade-up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Cases',  value: total, icon: FileText,      color: 'var(--brand)',  bg: 'var(--brand-dim)'  },
          { label: 'High Risk',    value: red,   icon: AlertTriangle, color: 'var(--red)',    bg: 'var(--red-dim)'    },
          { label: 'Amber Alerts', value: amber, icon: Activity,      color: 'var(--amber)',  bg: 'var(--amber-dim)'  },
          { label: 'Filed SARs',   value: filed, icon: CheckCircle,   color: 'var(--green)',  bg: 'var(--green-dim)'  },
        ].map(m => (
          <div key={m.label} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon style={{ width: 15, height: 15, color: m.color }} />
              </div>
              <TrendingUp style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: m.color, marginBottom: 2 }}>{loading ? '—' : m.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Empty CTA */}
      {!loading && total === 0 && (
        <div className="animate-fade-up-2" style={{ ...card, textAlign: 'center', padding: 48, background: 'linear-gradient(135deg, var(--brand-dim) 0%, var(--bg-card) 80%)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Zap style={{ width: 20, height: 20, color: 'var(--brand)' }} />
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Initialize Typology Simulation</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Execute standard AML typology scenarios to process and evaluate end-to-end pipeline cases.</p>
          <Link href="/app/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand)', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            <Play style={{ width: 14, height: 14 }} /> Launch Scenario Simulator
          </Link>
        </div>
      )}

      {/* Pipeline */}
      <div className="animate-fade-up-2" style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Shield style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>6-Agent SAR Pipeline</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { n: '01', name: 'Ingestion',  color: 'var(--brand)'  },
            { n: '02', name: 'Risk Score', color: 'var(--purple)' },
            { n: '03', name: 'Narrative',  color: '#06b6d4'        },
            { n: '04', name: 'Compliance', color: 'var(--amber)'  },
            { n: '05', name: 'Audit',      color: 'var(--green)'  },
            { n: '06', name: 'Review',     color: 'var(--red)'    },
          ].map((s, i, arr) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', textAlign: 'center', minWidth: 80 }}>
                <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: s.color, marginBottom: 3 }}>{s.n}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>{s.name}</div>
              </div>
              {i < arr.length - 1 && <span style={{ color: 'var(--border)', fontSize: 14, flexShrink: 0 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cases */}
      {!loading && total > 0 && (
        <div className="animate-fade-up-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Cases</span>
            </div>
            <Link href="/app/cases" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>
              View all <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          {cases.slice(0, 6).map((c, i) => (
            <Link key={c.case_id} href={`/app/cases/${c.case_id}`}
              className="row-hover"
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderTop: i > 0 ? '1px solid var(--border)' : 'none', textDecoration: 'none' }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 500, width: 140, flexShrink: 0 }}>{c.case_id}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <RiskBadge tier={c.risk_tier} size="sm" />
                <StatusBadge status={c.status} />
                <span suppressHydrationWarning style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-faint)' }}>
                  <Clock style={{ width: 11, height: 11 }} />
                  {c.last_updated !== 'Unknown' ? new Date(c.last_updated).toLocaleTimeString() : '—'}
                </span>
                <ArrowRight style={{ width: 13, height: 13, color: 'var(--text-faint)' }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

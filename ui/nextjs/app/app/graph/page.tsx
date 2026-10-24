'use client';
import { useEffect, useState } from 'react';
import { sarApi } from '@/lib/api';
import { Network, AlertTriangle, Shield, RefreshCw, GitBranch } from 'lucide-react';

const badge = (label: string, color: string, bg: string) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, color, background: bg, letterSpacing: 1, textTransform: 'uppercase' as const }}>
    {label}
  </span>
);

const SIG_MAP: Record<string, { label: string; color: string; bg: string }> = {
  'FAN_IN_SMURFING':    { label: 'Fan-In Smurfing', color: 'var(--red)',        bg: 'var(--red-dim)'    },
  'PASS_THROUGH':       { label: 'Pass-Through',    color: 'var(--amber)',      bg: 'var(--amber-dim)'  },
  'LAYERING_SUSPECTED': { label: 'Layering',        color: 'var(--purple)',     bg: 'var(--purple-dim)' },
  'CLEAN':              { label: 'Clean',            color: 'var(--green)',      bg: 'var(--green-dim)'  },
};

export default function GraphExplorer() {
  const [caseIds, setCaseIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    sarApi.getCases()
      .then(cases => setCaseIds(cases.slice(0, 30).map(c => c.case_id)))
      .catch(() => {})
      .finally(() => setLoadingCases(false));
  }, []);

  const analyze = (id: string) => {
    setSelected(id);
    setLoading(true);
    setGraphData(null);
    sarApi.getGraphContext(id)
      .then(setGraphData)
      .catch(() => setGraphData(null))
      .finally(() => setLoading(false));
  };

  const g = graphData?.graph_analysis;
  const f = graphData?.fan_in_analysis;
  const sig = g ? SIG_MAP[g.graph_signature] ?? SIG_MAP['CLEAN'] : null;

  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 20,
    boxShadow: 'var(--shadow-card)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Graph Explorer</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Multi-hop upstream funding network · 4-hop Neo4j traversal · Fan-In smurfing detection</p>
      </div>

      {/* Case selector */}
      <div style={card}>
        <p style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Select a Case to Analyze</p>
        {loadingCases ? (
          <p style={{ color: 'var(--text-faint)', fontSize: 12 }}>Loading cases…</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {caseIds.map(id => (
              <button key={id} onClick={() => analyze(id)}
                style={{
                  fontSize: 11, fontFamily: 'monospace', padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                  border: `1px solid ${selected === id ? 'var(--brand-border)' : 'var(--border)'}`,
                  background: selected === id ? 'var(--brand-dim)' : 'var(--bg-surface)',
                  color: selected === id ? 'var(--blue-light)' : 'var(--text-muted)',
                  transition: 'all var(--transition)',
                }}>
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Graph Result */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-faint)' }}>
          <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
          <p style={{ fontSize: 13 }}>Running 4-hop graph traversal…</p>
        </div>
      )}

      {graphData && g && f && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Graph Signature Card */}
          <div style={{ ...card, gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <GitBranch size={18} color="var(--blue-light)" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Graph Signature — {graphData.case_id}</span>
              </div>
              {sig && badge(sig.label, sig.color, sig.bg)}
            </div>
            {/* Visual graph representation */}
            <div style={{ position: 'relative', height: 160, background: 'var(--bg-surface)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
              {/* Upstream nodes */}
              {Array.from({ length: Math.min(f.fan_in_count, 8) }).map((_, i) => {
                const angle = (i / Math.min(f.fan_in_count, 8)) * Math.PI * 2;
                const x = 50 + 35 * Math.cos(angle);
                const y = 50 + 35 * Math.sin(angle);
                return (
                  <div key={i} style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)',
                    width: 24, height: 24, borderRadius: '50%',
                    background: g.smurfing_indicator ? 'var(--red-dim)' : 'var(--brand-dim)',
                    border: `1px solid ${g.smurfing_indicator ? 'var(--red)' : 'var(--brand)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: 'var(--text-primary)',
                  }}>S{i + 1}</div>
                );
              })}
              {/* Center target node */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--green-dim)', border: '2px solid var(--green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: 'var(--green)', fontWeight: 700,
              }}>TARGET</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {[
                { label: 'Pass-Through Score',    value: `${(g.pass_through_score * 100).toFixed(1)}%`, highlight: g.pass_through_score > 0.65 },
                { label: 'Upstream Cash Deposits', value: g.upstream_cash_deposit_count },
                { label: 'Unique States',          value: g.upstream_unique_states?.length ?? 0 },
                { label: 'Hops Analyzed',          value: g.hops_analyzed },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ padding: 12, background: 'var(--bg-surface)', borderRadius: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? 'var(--red)' : 'var(--blue-light)', marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fan-In Analysis */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Network size={16} color="var(--purple)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Fan-In Detection</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: f.typology_match !== 'NORMAL' ? 'var(--red)' : 'var(--green)', marginBottom: 4 }}>
              {f.fan_in_count} senders
            </div>
            <div style={{ marginBottom: 12 }}>{badge(f.typology_match, f.typology_match !== 'NORMAL' ? 'var(--red)' : 'var(--green)', f.typology_match !== 'NORMAL' ? 'var(--red-dim)' : 'var(--green-dim)')}</div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.description}</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Cross-State',       val: f.cross_state_flag },
                { label: 'Cross-City',        val: f.cross_city_flag },
                { label: 'Sequential Timing', val: f.sequential_timing_flag },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ color: val ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>{val ? 'YES' : 'NO'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>Low KYC Ratio</span>
                <span style={{ color: f.low_kyc_ratio > 0.5 ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>{(f.low_kyc_ratio * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Smurfing Indicator */}
          <div style={{ ...card, borderColor: g.smurfing_indicator ? 'var(--red-border)' : 'var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <AlertTriangle size={16} color={g.smurfing_indicator ? 'var(--red)' : 'var(--text-muted)'} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Smurfing Indicator</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: g.smurfing_indicator ? 'var(--red)' : 'var(--green)', marginBottom: 8 }}>
              {g.smurfing_indicator ? 'ACTIVE' : 'CLEAR'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(g.upstream_unique_states || []).slice(0, 5).map((st: string) => (
                <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{st}</span>
                </div>
              ))}
              {g.upstream_unique_states?.length > 5 && (
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>+{g.upstream_unique_states.length - 5} more states</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

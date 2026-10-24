'use client';
import { useEffect, useState } from 'react';
import { sarApi } from '@/lib/api';
import { Tag, RefreshCw, TrendingUp } from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  'MONEY_MULE_RAPID_CASHOUT':    'var(--red)',
  'LAYERING_CRYPTO_OFFLOAD':     'var(--purple)',
  'PASS_THROUGH_IMMEDIATE':      'var(--amber)',
  'SMURFING_INFLOW_AGGREGATION': '#fb923c',
};

const badge = (code: string | null) => {
  if (!code) return <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>— No Match</span>;
  const color = COLOR_MAP[code] ?? 'var(--blue-light)';
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, color, background: `color-mix(in srgb, ${color} 12%, transparent)`, letterSpacing: 1, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}>
      {code.replace(/_/g, ' ')}
    </span>
  );
};

const RollupBar = ({ label, value, total }: { label: string; value: number; total: number }) => {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>{label}</span><span>INR {value.toLocaleString('en-IN')}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--brand), var(--purple))' }} />
      </div>
    </div>
  );
};

export default function TypologyPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [registry, setRegistry] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'cases' | 'registry'>('cases');

  const load = async () => {
    setLoading(true);
    try {
      const [caseList, regData] = await Promise.all([
        sarApi.getCases(),
        sarApi.getTypologyRegistry(),
      ]);
      setCases(caseList.slice(0, 20));
      setRegistry(regData?.typologies ?? []);

      const top10 = caseList.slice(0, 10);
      const typologyResults = await Promise.allSettled(
        top10.map(c => sarApi.getTypology(c.case_id).then(d => ({ id: c.case_id, data: d })))
      );
      const map: Record<string, any> = {};
      typologyResults.forEach(r => { if (r.status === 'fulfilled') map[r.value.id] = r.value.data; });
      setResults(map);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Typology Reports</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>FIU-IND AML typology classification · ML-MULE · ML-LAYER · ML-PASS · ML-SMRF</p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {(['cases', 'registry'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 7, cursor: 'pointer', border: 'none',
              background: activeTab === t ? 'var(--brand-dim)' : 'transparent',
              color: activeTab === t ? 'var(--blue-light)' : 'var(--text-muted)',
            }}>
            {t === 'cases' ? 'Case Analysis' : 'Typology Registry'}
          </button>
        ))}
      </div>

      {activeTab === 'cases' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Case ID', 'Typology Code', 'FIU-IND Code', 'Risk Weight', 'Rolling 90d (INR)', 'Breach'].map(h => (
                  <th key={h} className="th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="td"><div className="shimmer" style={{ height: 12, borderRadius: 4, width: '70%' }} /></td>
                    ))}
                  </tr>
                ))
              ) : cases.map((c, i) => {
                const d = results[c.case_id];
                const tm = d?.typology_match;
                const rw = d?.rolling_windows;
                return (
                  <tr key={c.case_id} className="row-hover" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                    <td className="td"><span className="mono" style={{ color: 'var(--brand)', fontSize: 12 }}>{c.case_id}</span></td>
                    <td className="td">{badge(tm?.typology_code ?? null)}</td>
                    <td className="td"><span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tm?.fiu_ind_code ?? '—'}</span></td>
                    <td className="td">
                      {tm ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ height: 4, width: `${(tm.risk_weight ?? 0) * 60}px`, background: 'var(--red)', borderRadius: 4, minWidth: 8 }} />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tm.risk_weight?.toFixed(2) ?? '—'}</span>
                        </div>
                      ) : <span style={{ color: 'var(--text-faint)', fontSize: 11 }}>—</span>}
                    </td>
                    <td className="td">
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {rw ? `₹${(rw['90d_total'] ?? 0).toLocaleString('en-IN')}` : '—'}
                      </span>
                    </td>
                    <td className="td">
                      {rw ? (
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                          color: rw['90d_breach'] ? 'var(--red)' : 'var(--green)',
                          background: rw['90d_breach'] ? 'var(--red-dim)' : 'var(--green-dim)',
                        }}>
                          {rw['90d_breach'] ? 'BREACH' : 'CLEAR'}
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'registry' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {registry.map((t: any) => {
            const color = COLOR_MAP[t.typology_code] ?? 'var(--blue-light)';
            return (
              <div key={t.typology_code} style={{ background: 'var(--bg-card)', border: `1px solid var(--border)`, borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Tag size={14} color={color} />
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color, fontWeight: 700 }}>
                    {t.fiu_ind_typology_code}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>
                    weight: <strong style={{ color: 'var(--amber)' }}>{t.risk_weight?.toFixed(2)}</strong>
                  </span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {t.typology_code.split('_').map((w: string) => w[0] + w.slice(1).toLowerCase()).join(' ')}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{t.description}</p>
                <p style={{ fontSize: 10, color: 'var(--text-faint)', fontStyle: 'italic' }}>{t.regulatory_reference}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

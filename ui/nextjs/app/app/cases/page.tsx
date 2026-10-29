'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { sarApi, CaseSummary } from '@/lib/api';
import { RiskBadge, StatusBadge } from '@/components/RiskBadge';
import { Search, RefreshCw, ArrowRight, SlidersHorizontal } from 'lucide-react';

const TIERS = ['all', 'red', 'amber', 'green', 'pending'];

export default function CasesPage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('all');

  const load = () => {
    setLoading(true);
    sarApi.getCases().then(setCases).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    return (c.case_id.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q))
      && (tier === 'all' || c.risk_tier === tier || (tier === 'pending' && (c.status === 'pending' || c.risk_tier === 'pending')));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>All Cases</h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cases.length} case{cases.length !== 1 ? 's' : ''} in memory</p>
        </div>
        <button onClick={load}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}>
          <RefreshCw style={{ width: 13, height: 13 }} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--text-faint)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search case ID or subject…"
            className="input-dark" style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px' }}>
          <SlidersHorizontal style={{ width: 13, height: 13, color: 'var(--text-faint)', marginRight: 6 }} />
          {TIERS.map(t => (
            <button key={t} onClick={() => setTier(t)}
              style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', border: 'none',
                background: tier === t ? 'var(--brand-dim)' : 'transparent',
                color: tier === t ? 'var(--blue-light)' : 'var(--text-muted)',
                transition: 'all 0.1s',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Case ID', 'Subject', 'Risk', 'Status', 'Updated', ''].map(h => (
                <th key={h} className="th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="td">
                      <div className="shimmer" style={{ height: 13, borderRadius: 4, width: `${55 + j * 8}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-faint)', fontSize: 13 }}>
                {cases.length === 0 ? 'No cases loaded — execute a scenario simulation or refresh feed' : 'No matches'}
              </td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c.case_id} className="row-hover" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <td className="td"><span className="mono" style={{ color: 'var(--brand)', fontSize: 12, fontWeight: 500 }}>{c.case_id}</span></td>
                <td className="td" style={{ maxWidth: 130 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-secondary)' }}>{c.subject}</span></td>
                <td className="td"><RiskBadge tier={c.risk_tier} size="sm" /></td>
                <td className="td"><StatusBadge status={c.status} /></td>
                <td suppressHydrationWarning className="td" style={{ color: 'var(--text-faint)', fontSize: 11 }}>
                  {c.last_updated !== 'Unknown' ? new Date(c.last_updated).toLocaleDateString() : '—'}
                </td>
                <td className="td">
                  <Link href={`/app/cases/${c.case_id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>
                    Open <ArrowRight style={{ width: 12, height: 12 }} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

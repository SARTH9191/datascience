'use client';
import { useEffect, useState } from 'react';
import { sarApi } from '@/lib/api';
import { RefreshCw, User, Hash } from 'lucide-react';

const EVENT_COLORS: Record<string, { color: string; bg: string }> = {
  'PII_STRIPPED':      { color: 'var(--purple)',     bg: 'var(--purple-dim)'   },
  'SAR_APPROVED':      { color: 'var(--green)',      bg: 'var(--green-dim)'    },
  'CASE_REJECTED':     { color: 'var(--red)',        bg: 'var(--red-dim)'      },
  'CASE_OPEN':         { color: 'var(--blue-light)', bg: 'var(--blue-dim)'     },
  'PAGE_VIEW':         { color: 'var(--text-muted)', bg: 'rgba(82,82,91,0.1)' },
  'GRAPH_ACCESS':      { color: 'var(--amber)',      bg: 'var(--amber-dim)'    },
  'STR_EXPORTED':      { color: '#fb923c',           bg: 'rgba(251,146,60,0.12)' },
  'AUDIT_QUERIED':     { color: 'var(--text-faint)', bg: 'rgba(63,63,70,0.1)' },
  'PII_VIEW_UNMASKED': { color: 'var(--red)',        bg: 'var(--red-dim)'      },
  'SESSION_TERMINATED':{ color: 'var(--red)',        bg: 'var(--red-dim)'      },
  'AUDIT_LOG':         { color: 'var(--blue-light)', bg: 'var(--blue-dim)'     },
};

const EVT_ICON: Record<string, string> = {
  'PII_STRIPPED': '🔒', 'SAR_APPROVED': '✅', 'CASE_REJECTED': '❌',
  'CASE_OPEN': '📂', 'PAGE_VIEW': '👁', 'GRAPH_ACCESS': '🕸',
  'STR_EXPORTED': '📄', 'PII_VIEW_UNMASKED': '🔓', 'SESSION_TERMINATED': '🚫',
};

function EventBadge({ type }: { type: string }) {
  const c = EVENT_COLORS[type] ?? { color: 'var(--text-muted)', bg: 'rgba(113,113,122,0.12)' };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, color: c.color, background: c.bg, whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
      {EVT_ICON[type] ?? '•'} {type.replace(/_/g, ' ')}
    </span>
  );
}

export default function AuditTrailPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    setLoading(true);
    sarApi.getAuditTrail(200)
      .then(d => setEntries(d?.entries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    sarApi.logAuditEvent({
      user_id: 'analyst-demo', user_role: 'ANALYST_L2',
      event_type: 'PAGE_VIEW', metadata: { page: '/app/audit' },
    }).catch(() => {});
  }, []);

  const filtered = entries.filter(e =>
    !filter ||
    e.event_type?.toLowerCase().includes(filter.toLowerCase()) ||
    e.user_role?.toLowerCase().includes(filter.toLowerCase()) ||
    e.case_id?.toLowerCase().includes(filter.toLowerCase())
  );

  const piiCount  = entries.filter(e => e.event_type === 'PII_STRIPPED').length;
  const approvals = entries.filter(e => e.event_type === 'SAR_APPROVED').length;
  const piiViews  = entries.filter(e => e.event_type === 'PII_VIEW_UNMASKED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Audit Trail</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Append-only · SHA-256 tamper-sealed · PMLA 2002 compliant</p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, padding: '7px 12px', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Events',       value: entries.length, color: 'var(--blue-light)', bg: 'var(--blue-dim)'   },
          { label: 'PII Strips',         value: piiCount,       color: 'var(--purple)',     bg: 'var(--purple-dim)' },
          { label: 'SAR Approvals',      value: approvals,      color: 'var(--green)',      bg: 'var(--green-dim)'  },
          { label: 'Unmasked PII Views', value: piiViews,       color: 'var(--red)',        bg: 'var(--red-dim)'    },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: s.bg, marginBottom: 10 }} />
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{loading ? '—' : s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <input
        value={filter} onChange={e => setFilter(e.target.value)}
        placeholder="Filter by event type, role, or case ID…"
        className="input-dark"
      />

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, display: 'flex', gap: 12 }}>
              <div className="shimmer" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="shimmer" style={{ height: 12, width: '40%', borderRadius: 4, marginBottom: 6 }} />
                <div className="shimmer" style={{ height: 10, width: '70%', borderRadius: 4 }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: 'var(--text-faint)', fontSize: 13 }}>
            {entries.length === 0 ? 'No audit events yet. Activity will appear here as the platform is used.' : 'No events match your filter.'}
          </div>
        ) : filtered.map((entry, i) => (
          <div key={i} className="row-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'background var(--transition)' }}>
            {/* Avatar */}
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-dim)', border: '1px solid var(--brand-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={13} color="var(--blue-light)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <EventBadge type={entry.event_type} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.user_role}</span>
                <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 'auto' }}>
                  {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {entry.case_id && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Case: <code style={{ color: 'var(--brand)' }}>{entry.case_id}</code>
                  </span>
                )}
                {entry.pii_categories_found?.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--purple)' }}>
                    PII: {entry.pii_categories_found.join(', ')}
                  </span>
                )}
                {entry.metadata && typeof entry.metadata === 'object' && Object.keys(entry.metadata).length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                    {JSON.stringify(entry.metadata)}
                  </span>
                )}
              </div>
            </div>
            {/* Hash chip */}
            {entry.entry_hash && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Hash size={10} color="var(--text-faint)" />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-faint)' }}>{entry.entry_hash.slice(0, 8)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Play, Shield, ExternalLink,
  Network, Tag, ClipboardList, Sun, Moon, Activity
} from 'lucide-react';
import { useZeroTrustSession } from './ZeroTrustGate';

const NAV_CORE = [
  { href: '/app',        icon: LayoutDashboard, label: 'Dashboard',  exact: true },
  { href: '/app/cases',  icon: FileText,        label: 'All Cases'              },
  { href: '/app/demo',   icon: Play,            label: 'Demo Center'            },
];
const NAV_INTEL = [
  { href: '/app/graph',    icon: Network,      label: 'Graph Explorer'   },
  { href: '/app/typology', icon: Tag,          label: 'Typology Reports' },
  { href: '/app/audit',    icon: ClipboardList, label: 'Audit Trail'    },
];

/* ─── Backend status pill ─────────────────────────────────── */
function BackendPill() {
  const [s, setS] = useState<'checking' | 'online' | 'offline'>('checking');
  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(() => setS('online'))
      .catch(() => setS('offline'));
  }, []);
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '7px 11px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span className={`status-dot ${s}`} />
      <span style={{ fontSize: 11, fontWeight: 500, color: s === 'online' ? 'var(--green)' : s === 'offline' ? 'var(--red)' : 'var(--text-muted)' }}>
        {s === 'checking' ? 'Connecting…' : s === 'online' ? 'API Online' : 'API Offline'}
      </span>
      <Activity style={{ width: 11, height: 11, marginLeft: 'auto', color: s === 'online' ? 'var(--green)' : 'var(--text-faint)', opacity: 0.7 }} />
    </div>
  );
}

/* ─── Theme toggle ───────────────────────────────────────── */
function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sar-theme');
    if (saved === 'light') {
      document.documentElement.classList.add('light');
      setLight(true);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle('light', next);
    localStorage.setItem('sar-theme', next ? 'light' : 'dark');
  }, [light]);

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      title={light ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {light
        ? <Moon style={{ width: 14, height: 14 }} />
        : <Sun  style={{ width: 14, height: 14 }} />}
    </button>
  );
}

/* ─── Nav section label ───────────────────────────────────── */
function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10,
      color: 'var(--text-faint)',
      padding: '0 8px',
      marginBottom: 6,
      marginTop: 16,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      fontWeight: 700,
    }}>
      {children}
    </div>
  );
}

/* ─── AppShell ─────────────────────────────────────────────── */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const session  = useZeroTrustSession();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const navLink = (href: string, Icon: React.ElementType, label: string, exact?: boolean) => {
    const active = isActive(href, exact);
    return (
      <Link
        key={href}
        href={href}
        className={`nav-link ${active ? 'active' : ''}`}
        style={{ marginBottom: 2 }}
      >
        <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
        {label}
      </Link>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar-bg" style={{ width: 224, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Logo + theme toggle */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border-sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
            }}>
              <Shield style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>SAR Platform</div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>AML Intelligence</div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* User session */}
        {session && (
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-sidebar)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{session.name}</div>
            <span style={{
              fontSize: 10, color: 'var(--purple)',
              background: 'var(--purple-dim)', padding: '2px 7px',
              borderRadius: 4, fontFamily: 'monospace',
              border: '1px solid var(--purple-border)',
            }}>
              {session.role}
            </span>
          </div>
        )}

        {/* Backend health */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-sidebar)' }}>
          <BackendPill />
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <NavLabel>Core</NavLabel>
          {NAV_CORE.map(({ href, icon: Icon, label, exact }) => navLink(href, Icon, label, exact))}

          <NavLabel>Intelligence</NavLabel>
          {NAV_INTEL.map(({ href, icon: Icon, label }) => navLink(href, Icon, label))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-sidebar)' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none',
            marginBottom: 14, transition: 'color var(--transition)',
          }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
            onMouseOut={e  => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}>
            <ExternalLink style={{ width: 13, height: 13 }} />
            Back to Home
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              ['XGBoost + SHAP', 'var(--brand)'],
              ['Neo4j Graph', 'var(--amber)'],
              ['4 AML Typologies', 'var(--green)'],
              ['PII Stripping', 'var(--purple)'],
            ].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 940, margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

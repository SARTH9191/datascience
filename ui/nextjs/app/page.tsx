'use client';

import Link from 'next/link';
import {
  Shield, ArrowRight, Zap, Lock, BarChart2, FileText, CheckCircle,
  Activity, Play, Network, Tag, ClipboardList, Database, Cpu, ChevronRight, Layers
} from 'lucide-react';

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      color: '#f3f4f6',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Dynamic Background Glows */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 1200,
        height: 520,
        background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(37, 99, 235, 0.22), transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Top Navigation */}
      <nav style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '14px 24px'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(37, 99, 235, 0.45)'
            }}>
              <Shield style={{ width: 18, height: 18, color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                SAR Platform
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                AML Intelligence Suite
              </div>
            </div>
          </Link>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'none', alignItems: 'center', gap: 20 }} className="desktop-nav">
              <Link href="/app" style={{ fontSize: 13, color: '#d1d5db', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                Dashboard
              </Link>
              <Link href="/app/cases" style={{ fontSize: 13, color: '#d1d5db', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                Cases
              </Link>
              <Link href="/app/graph" style={{ fontSize: 13, color: '#d1d5db', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                Graph Explorer
              </Link>
              <Link href="/app/audit" style={{ fontSize: 13, color: '#d1d5db', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                Audit Trail
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: 11,
                fontWeight: 600
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                Core Active
              </div>

              <Link href="/app" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 9,
                background: '#2563eb',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 16px rgba(37, 99, 235, 0.4)',
                transition: 'all 0.2s'
              }}>
                Open Console <ChevronRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '72px 24px 60px 24px',
        maxWidth: 1040,
        margin: '0 auto',
        textAlign: 'center',
        zIndex: 1
      }}>
        {/* Compliance pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 24,
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(37, 99, 235, 0.12)'
        }}>
          <Zap style={{ width: 14, height: 14, color: '#38bdf8' }} />
          Autonomous AML Intelligence · FIU-IND STR Regulator Compliant
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.6rem)',
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1.08,
          color: '#ffffff',
          marginBottom: 22
        }}>
          Automated Suspicious Activity Reports,<br />
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Powered by Multi-Agent AI.
          </span>
        </h1>

        {/* Hero Description */}
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
          color: '#9ca3af',
          maxWidth: 720,
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          End-to-end regulatory compliance automation. XGBoost risk scoring with explainable SHAP features,
          multi-hop graph traversal, automated narrative generation, and official filing PDFs.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 64
        }}>
          <Link href="/app" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 24px rgba(37, 99, 235, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}>
            Open Analyst Dashboard
            <ArrowRight style={{ width: 16, height: 16 }} />
          </Link>

          <Link href="/app/demo" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '13px 24px',
            borderRadius: 12,
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#f3f4f6',
            fontSize: 15,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'background 0.2s, border-color 0.2s'
          }}>
            <Play style={{ width: 14, height: 14, color: '#60a5fa' }} />
            Scenario Simulator
          </Link>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          maxWidth: 920,
          margin: '0 auto'
        }}>
          {[
            { value: '6 AI Agents', label: 'Autonomous LangGraph Pipeline', color: '#60a5fa' },
            { value: '8 AML Rules', label: 'PMLA 2002 & FinCEN Typologies', color: '#a78bfa' },
            { value: '< 30 Seconds', label: 'Raw Ingestion to Regulatory PDF', color: '#34d399' },
            { value: 'SHA-256', label: 'Cryptographically Immutable Audit', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 14,
              padding: '20px 18px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive System Pipeline Architecture */}
      <section style={{
        maxWidth: 1040,
        margin: '0 auto',
        padding: '20px 24px 72px 24px'
      }}>
        <div style={{
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(3, 7, 18, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: 20,
          padding: '36px 32px',
          boxShadow: '0 8px 36px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#60a5fa', marginBottom: 4 }}>
                Pipeline Execution Engine
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff' }}>
                End-to-End Autonomous SAR Lifecycle
              </h2>
            </div>
            <Link href="/app" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#60a5fa',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none'
            }}>
              View Live Queue <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12
          }}>
            {[
              { num: '01', title: 'Ingestion', desc: 'Vector Parsing & Normalization', icon: Database, color: '#3b82f6' },
              { num: '02', title: 'Risk Score', desc: 'XGBoost + SHAP Features', icon: BarChart2, color: '#8b5cf6' },
              { num: '03', title: 'Narrative', desc: 'Structured AI Generation', icon: FileText, color: '#06b6d4' },
              { num: '04', title: 'Compliance', desc: 'FinCEN / FIU Validation', icon: Shield, color: '#f59e0b' },
              { num: '05', title: 'Audit Seal', desc: 'SHA-256 Immutable Hash', icon: Lock, color: '#10b981' },
              { num: '06', title: 'Filing', desc: 'Official PDF Export', icon: CheckCircle, color: '#ef4444' },
            ].map((step, idx) => (
              <div key={idx} style={{
                background: 'rgba(2, 6, 23, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: '16px 14px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: step.color, fontFamily: 'monospace' }}>
                    {step.num}
                  </span>
                  <step.icon style={{ width: 15, height: 15, color: step.color }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.35 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Capabilities */}
      <section style={{
        maxWidth: 1040,
        margin: '0 auto',
        padding: '0 24px 72px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            Engineered for Bank Compliance Operations
          </h2>
          <p style={{ fontSize: 14, color: '#9ca3af', maxWidth: 560, margin: '0 auto' }}>
            Production-grade AML intelligence with mathematical explainability, graph network detection, and verifiable audit records.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}>
          {[
            {
              icon: BarChart2,
              title: 'XGBoost ML Risk Scoring',
              desc: 'Trained on high-volume transaction datasets. Automatically yields confidence scores and SHAP feature weight attribution for each flagged anomaly.',
              color: '#3b82f6'
            },
            {
              icon: Network,
              title: 'Neo4j Graph Traversal',
              desc: '4-hop upstream and downstream fund flow analysis. Detects structuring, smurfing aggregations, and rapid cash-out layering networks.',
              color: '#8b5cf6'
            },
            {
              icon: FileText,
              title: 'AI Narrative Generation',
              desc: 'Generates complete 8-part FIU-IND STR reports with chronological event breakdowns, regulatory cross-references, and subject summaries.',
              color: '#06b6d4'
            },
            {
              icon: Lock,
              title: 'Zero-Trust Audit Ledger',
              desc: 'Every agent calculation, prompt, analyst review, and parameter modification is cryptographically hashed with SHA-256 for complete non-repudiation.',
              color: '#10b981'
            }
          ].map((card, i) => (
            <div key={i} style={{
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `color-mix(in srgb, ${card.color} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${card.color} 30%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <card.icon style={{ width: 20, height: 20, color: card.color }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 8 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.55 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        maxWidth: 1040,
        margin: '0 auto',
        padding: '0 24px 80px 24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(17, 24, 39, 0.8) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 20,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
            Ready to explore active cases?
          </h2>
          <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24, maxWidth: 540, margin: '0 auto 24px auto' }}>
            Access the compliance dashboard, examine transaction graphs, run simulation scenarios, and generate regulatory PDFs.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/app" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 26px',
              borderRadius: 10,
              background: '#2563eb',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
            }}>
              Launch Platform Dashboard <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link href="/app/cases" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#e5e7eb',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none'
            }}>
              View All Cases
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield style={{ width: 16, height: 16, color: '#3b82f6' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#ffffff' }}>SAR Platform</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>· FIU-IND / PMLA Compliant</span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            XGBoost ML · Neo4j Graph DB · LangGraph Multi-Agent Engine
          </div>
        </div>
      </footer>
    </div>
  );
}

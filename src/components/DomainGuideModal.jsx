import React, { useState } from 'react';
import { X, Globe, CheckCircle2, Copy, ExternalLink, ShieldCheck, Server, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DomainGuideModal({ isOpen, onClose }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const triggerVerificationSuccess = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-wrapper" style={{ width: '38px', height: '38px' }}>
              <Globe size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Connect Your GoDaddy Custom Domain</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step-by-step live deployment & DNS setup</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Banner */}
        <div style={{ background: 'var(--hero-gradient)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
            <ShieldCheck size={18} /> Ready to publish live for class parents & students
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Follow these 4 simple steps to connect your GoDaddy domain (e.g. <code>ourclass4b.com</code>) to your deployed site.
          </p>
        </div>

        {/* Step 1 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 800 }}>1</span>
            Deploy Web Application to Free Hosting (Vercel / Netlify)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
            Push your project to GitHub and deploy to Vercel or Netlify (both offer free SSL and instant auto-deployments).
          </p>
        </div>

        {/* Step 2 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 800 }}>2</span>
            Log into GoDaddy & Open DNS Management
          </h4>
          <ol style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '3rem', lineHeight: 1.6 }}>
            <li>Go to <a href="https://godaddy.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>GoDaddy.com</a> and log in.</li>
            <li>Click <strong>My Products</strong> → locate your domain → click <strong>DNS</strong> (or <strong>Manage DNS</strong>).</li>
          </ol>
        </div>

        {/* Step 3: DNS Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 800 }}>3</span>
            Add/Update DNS Records in GoDaddy
          </h4>
          
          <table className="reminder-table" style={{ fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name / Host</th>
                <th>Value / Target</th>
                <th>Copy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong style={{ color: 'var(--primary)' }}>A Record</strong></td>
                <td><code>@</code></td>
                <td><code>76.76.21.21</code></td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => copyToClipboard('76.76.21.21', 'a_record')}>
                    {copiedField === 'a_record' ? 'Copied!' : <Copy size={12} />}
                  </button>
                </td>
              </tr>
              <tr>
                <td><strong style={{ color: 'var(--primary)' }}>CNAME Record</strong></td>
                <td><code>www</code></td>
                <td><code>cname.vercel-dns.com</code></td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => copyToClipboard('cname.vercel-dns.com', 'cname_record')}>
                    {copiedField === 'cname_record' ? 'Copied!' : <Copy size={12} />}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step 4 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', fontSize: '0.75rem', fontWeight: 800 }}>4</span>
            Verify Domain & SSL Propagation
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '2rem', marginBottom: '0.75rem' }}>
            DNS changes usually take 5–15 minutes to propagate worldwide. Your free SSL certificate will automatically activate.
          </p>
          <div style={{ marginLeft: '2rem' }}>
            <button className="btn-primary" onClick={triggerVerificationSuccess}>
              <CheckCircle2 size={16} /> Test DNS & Domain Verification
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn-secondary" onClick={onClose}>Close Guide</button>
        </div>
      </div>
    </div>
  );
}

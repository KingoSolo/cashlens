'use client';

import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

type UploadState = 'idle' | 'uploading' | 'error';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [state, setState] = useState<UploadState>('idle');
  const [error, setError] = useState('');

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped);
      setError('');
    } else {
      setError('Please drop a CSV file.');
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError('');
    }
  }

  async function handleSubmit() {
    if (!file) { setError('Please select a CSV file.'); return; }
    if (!businessName.trim()) { setError('Please enter your business name.'); return; }

    setState('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessName', businessName.trim());

    try {
      const data = await api.uploadRaw(formData);
      router.push(
        `/dashboard?businessId=${data.businessId}&name=${encodeURIComponent(data.businessName)}`
      );
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    }
  }

  const year = new Date().getFullYear();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F3F4F6' }}>
      {/* Nav */}
      <header style={{ padding: '20px 32px' }}>
        <span style={{ fontSize: 20, fontWeight: 500, color: '#0A5F4A' }}>CashLens</span>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Headline */}
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: 12 }}>
            Know your numbers. Own your story.
          </h1>
          <p style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>
            Upload your transaction CSV and get a full financial health report in under 30 seconds.
          </p>

          {/* Business name */}
          <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
            Business name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Adaeze Fashion House"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              fontSize: 15,
              color: '#111827',
              background: 'white',
              outline: 'none',
              marginBottom: 16,
            }}
          />

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragOver ? '#0A5F4A' : '#D1D5DB'}`,
              borderRadius: 12,
              background: dragOver ? '#F0FBF8' : 'white',
              height: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginBottom: 16,
              transition: 'all 0.15s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#0A5F4A', wordBreak: 'break-all', padding: '0 16px', textAlign: 'center' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>Click to change file</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#374151' }}>
                  Drop your transactions CSV here
                </p>
                <p style={{ fontSize: 14, color: '#0A5F4A', marginTop: 6, textDecoration: 'underline' }}>
                  or click to browse
                </p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 13, color: '#DC2626', marginBottom: 12 }}>{error}</p>
          )}

          {/* Upload button */}
          <button
            onClick={handleSubmit}
            disabled={state === 'uploading'}
            style={{
              width: '100%',
              height: 48,
              background: state === 'uploading' ? '#5A9E8A' : '#0A5F4A',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: state === 'uploading' ? 'not-allowed' : 'pointer',
              marginBottom: 12,
              transition: 'background 0.15s',
            }}
          >
            {state === 'uploading' ? 'Analysing...' : 'Upload & Analyse →'}
          </button>

          <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>
            No account needed · Your data stays on your device
          </p>
        </div>
      </main>

      {/* Sample download */}
      <div style={{ textAlign: 'center', paddingBottom: 32 }}>
        <a
          href="/adaeze-fashion-house.csv"
          download
          style={{ fontSize: 14, color: '#0A5F4A', textDecoration: 'underline' }}
        >
          Download sample CSV →
        </a>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          background: 'white',
        }}
      >
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Terms of Service', 'Privacy Policy', 'Help Center'].map((link) => (
            <a key={link} href="#" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>
              {link}
            </a>
          ))}
        </nav>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>
          © {year} CashLens Financial. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

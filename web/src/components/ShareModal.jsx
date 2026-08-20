import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

// Set this once the app is live on the Play Store - shown as a CTA on the
// generated share image and used by the "Get the app" button below.
// Leave blank to hide both until the listing is ready.
const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL || '';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://leftover-to-recipe.vercel.app';

const CARD_W = 1080;
const CARD_H = 1350; // 4:5, plays nicely as an IG/FB feed post and a WhatsApp/Messenger attachment

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderCard(recipe) {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#e5f5eb');
  bg.addColorStop(1, '#faf9f6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const pad = 72;
  let y = 100;

  // Brand row
  ctx.font = '64px system-ui, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('🍲', pad, y);
  ctx.fillStyle = '#217a46';
  ctx.font = '600 40px Georgia, serif';
  ctx.fillText('Leftover to Recipe', pad + 88, y - 8);
  y += 70;

  // Badge
  ctx.fillStyle = recipe.isHealthy ? '#2f9e5c' : '#e05f2c';
  const badgeText = recipe.isHealthy ? '🥦 Healthy' : '🍩 Relax';
  ctx.font = '600 30px system-ui, sans-serif';
  const badgeW = ctx.measureText(badgeText).width + 48;
  ctx.beginPath();
  ctx.roundRect(pad, y, badgeW, 56, 28);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badgeText, pad + 24, y + 38);
  y += 110;

  // Title
  ctx.fillStyle = '#1f2a24';
  ctx.font = '700 60px Georgia, serif';
  const titleLines = wrapText(ctx, recipe.title, CARD_W - pad * 2);
  for (const line of titleLines.slice(0, 3)) {
    ctx.fillText(line, pad, y);
    y += 68;
  }
  y += 24;

  // Divider
  ctx.strokeStyle = '#e8e4da';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(CARD_W - pad, y);
  ctx.stroke();
  y += 56;

  // Ingredients heading
  ctx.fillStyle = '#217a46';
  ctx.font = '700 34px system-ui, sans-serif';
  ctx.fillText('Ingredients', pad, y);
  y += 50;

  ctx.fillStyle = '#1f2a24';
  ctx.font = '32px system-ui, sans-serif';
  const shown = recipe.ingredients.slice(0, 8);
  for (const ingredient of shown) {
    const lines = wrapText(ctx, `•  ${ingredient}`, CARD_W - pad * 2);
    for (const line of lines) {
      if (y > CARD_H - 220) break;
      ctx.fillText(line, pad, y);
      y += 46;
    }
  }
  if (recipe.ingredients.length > shown.length) {
    ctx.fillStyle = '#6b7568';
    ctx.fillText(`+ ${recipe.ingredients.length - shown.length} more…`, pad, y);
    y += 46;
  }

  // Footer CTA
  ctx.fillStyle = '#217a46';
  ctx.fillRect(0, CARD_H - 140, CARD_W, 140);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 32px system-ui, sans-serif';
  ctx.fillText('Turn your leftovers into a recipe 🍜', pad, CARD_H - 78);
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillStyle = '#e5f5eb';
  ctx.fillText(PLAY_STORE_URL ? 'Get the app on Google Play' : SITE_URL.replace(/^https?:\/\//, ''), pad, CARD_H - 36);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve({ blob, canvas }), 'image/png'));
}

export default function ShareModal({ recipe, onClose }) {
  const [imageUrl, setImageUrl] = useState('');
  const [blob, setBlob] = useState(null);
  const [copied, setCopied] = useState(false);
  const objectUrlRef = useRef('');

  useEffect(() => {
    let cancelled = false;
    renderCard(recipe).then(({ blob: b }) => {
      if (cancelled) return;
      const url = URL.createObjectURL(b);
      objectUrlRef.current = url;
      setBlob(b);
      setImageUrl(url);
    });
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareText = `${recipe.title} — made from my leftovers with Leftover to Recipe! ${SITE_URL}`;
  const canNativeShare =
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    blob &&
    navigator.canShare({ files: [new File([blob], 'recipe.png', { type: 'image/png' })] });

  async function handleNativeShare() {
    try {
      const file = new File([blob], `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });
      await navigator.share({
        title: recipe.title,
        text: shareText,
        files: [file]
      });
    } catch (err) {
      // User cancelled the share sheet, or the browser rejected it - not an error worth showing.
      if (err?.name !== 'AbortError') {
        console.error('share failed:', err);
      }
    }
  }

  function handleDownload() {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable - non-fatal, the caption is shown on screen too
    }
  }

  const webIntents = [
    {
      name: 'Facebook',
      emoji: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Messenger',
      emoji: '💬',
      url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(SITE_URL)}&app_id=&redirect_uri=${encodeURIComponent(SITE_URL)}`
    },
    {
      name: 'WhatsApp',
      emoji: '🟢',
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel share-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <Icon name="x" size={18} />
        </button>

        <h3>Share this recipe</h3>
        <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
          A shareable image is generated below with the recipe, ready for socials.
        </p>

        <div className="share-preview">
          {imageUrl ? <img src={imageUrl} alt={`${recipe.title} recipe card`} /> : <div className="share-preview-loading">Generating image…</div>}
        </div>

        {canNativeShare && (
          <button type="button" className="btn btn-primary btn-block" onClick={handleNativeShare}>
            <Icon name="share" size={16} /> Share to Instagram, WhatsApp, Messenger…
          </button>
        )}

        <button type="button" className="btn btn-secondary btn-block" onClick={handleDownload} disabled={!imageUrl}>
          <Icon name="download" size={16} /> Download image
        </button>

        {!canNativeShare && (
          <>
            <p className="profile-meta" style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
              Your browser doesn't support the native share sheet — post directly instead, or download the image
              above and attach it to Instagram or WhatsApp manually.
            </p>
            <div className="share-intent-row">
              {webIntents.map((intent) => (
                <a
                  key={intent.name}
                  className="btn btn-outline btn-sm"
                  href={intent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {intent.emoji} {intent.name}
                </a>
              ))}
            </div>
          </>
        )}

        <button type="button" className="link-back" style={{ marginTop: 'var(--space-4)' }} onClick={handleCopyCaption}>
          {copied ? 'Caption copied ✓' : 'Copy caption text'}
        </button>

        {PLAY_STORE_URL && (
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="profile-meta" style={{ display: 'block', marginTop: 'var(--space-2)' }}>
            Get Leftover to Recipe on Google Play →
          </a>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { createShareLink } from '../api.js';

// Set this once the app is live on the Play Store - shown as a CTA on the
// generated share image. Leave blank to hide it until the listing is ready.
const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL || '';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://leftover-to-recipe.vercel.app';

const CARD_W = 1080;
const CARD_H = 1350; // 4:5, plays nicely as an IG/FB feed post and a WhatsApp/Messenger attachment

// A plain <a download> saves to the Downloads/Files location on most mobile
// browsers, not the Photos/gallery app people expect - only the native share
// sheet's "Save Image" action (or a manual long-press on the full image)
// reliably lands in Photos. Route touch devices to "open in a new tab" so
// they get that long-press option instead of a surprise Files download.
const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

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

function truncate(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1);
  }
  return `${t}…`;
}

async function renderCard(recipe, shareUrl) {
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
  const contentW = CARD_W - pad * 2;
  let y = 96;

  // Brand row
  ctx.font = '56px system-ui, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('🍲', pad, y);
  ctx.fillStyle = '#217a46';
  ctx.font = '600 36px Georgia, serif';
  ctx.fillText('Leftover to Recipe', pad + 78, y - 6);
  y += 62;

  // Badge
  ctx.fillStyle = recipe.isHealthy ? '#2f9e5c' : '#e05f2c';
  const badgeText = recipe.isHealthy ? '🥦 Healthy' : '🍩 Relax';
  ctx.font = '600 28px system-ui, sans-serif';
  const badgeW = ctx.measureText(badgeText).width + 44;
  ctx.beginPath();
  ctx.roundRect(pad, y, badgeW, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(badgeText, pad + 22, y + 35);
  y += 96;

  // Title
  ctx.fillStyle = '#1f2a24';
  ctx.font = '700 54px Georgia, serif';
  const titleLines = wrapText(ctx, recipe.title, contentW);
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, pad, y);
    y += 60;
  }
  y += 20;

  // Divider
  ctx.strokeStyle = '#e8e4da';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(CARD_W - pad, y);
  ctx.stroke();
  y += 46;

  // Two-column split: ingredients (left, narrower) + instructions (right, wider)
  const colGap = 40;
  const leftW = Math.round(contentW * 0.36);
  const rightW = contentW - leftW - colGap;
  const rightX = pad + leftW + colGap;
  const sectionTop = y;

  // Ingredients column
  ctx.fillStyle = '#217a46';
  ctx.font = '700 30px system-ui, sans-serif';
  ctx.fillText('Ingredients', pad, y);
  let leftY = y + 44;
  ctx.fillStyle = '#1f2a24';
  ctx.font = '27px system-ui, sans-serif';
  const shownIngredients = recipe.ingredients.slice(0, 7);
  for (const ingredient of shownIngredients) {
    ctx.fillText(`•  ${truncate(ctx, ingredient, leftW - 20)}`, pad, leftY);
    leftY += 40;
  }
  if (recipe.ingredients.length > shownIngredients.length) {
    ctx.fillStyle = '#6b7568';
    ctx.fillText(`+${recipe.ingredients.length - shownIngredients.length} more`, pad, leftY);
    leftY += 40;
  }

  // Instructions column
  ctx.fillStyle = '#217a46';
  ctx.font = '700 30px system-ui, sans-serif';
  ctx.fillText('How to cook', rightX, sectionTop);
  let rightY = sectionTop + 44;
  ctx.font = '26px system-ui, sans-serif';
  const cleanedSteps = recipe.instructions.map((s) => s.replace(/^\d+\.\s*/, ''));
  const stepLimit = sectionTop + 520; // keep clear of the footer band
  for (let i = 0; i < cleanedSteps.length && rightY < stepLimit; i++) {
    ctx.fillStyle = '#217a46';
    ctx.font = '700 26px system-ui, sans-serif';
    ctx.fillText(`${i + 1}.`, rightX, rightY);
    ctx.fillStyle = '#1f2a24';
    ctx.font = '26px system-ui, sans-serif';
    const lines = wrapText(ctx, cleanedSteps[i], rightW - 44).slice(0, 2);
    for (const line of lines) {
      ctx.fillText(line, rightX + 44, rightY);
      rightY += 36;
    }
    rightY += 10;
  }
  if (cleanedSteps.length > 0 && rightY >= stepLimit) {
    ctx.fillStyle = '#6b7568';
    ctx.font = '24px system-ui, sans-serif';
    ctx.fillText('Full steps in the app →', rightX, stepLimit + 10);
  }

  // Footer CTA
  const footerH = shareUrl ? 168 : 132;
  ctx.fillStyle = '#217a46';
  ctx.fillRect(0, CARD_H - footerH, CARD_W, footerH);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 30px system-ui, sans-serif';
  ctx.fillText('Turn your leftovers into a recipe 🍜', pad, CARD_H - footerH + 48);
  ctx.font = '26px system-ui, sans-serif';
  ctx.fillStyle = '#e5f5eb';
  if (shareUrl) {
    ctx.fillText(truncate(ctx, shareUrl.replace(/^https?:\/\//, ''), contentW), pad, CARD_H - footerH + 90);
    if (PLAY_STORE_URL) {
      ctx.fillText('Get the app on Google Play', pad, CARD_H - footerH + 130);
    }
  } else {
    ctx.fillText(PLAY_STORE_URL ? 'Get the app on Google Play' : SITE_URL.replace(/^https?:\/\//, ''), pad, CARD_H - footerH + 90);
  }

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}

export default function ShareModal({ recipe, onClose }) {
  const [imageUrl, setImageUrl] = useState('');
  const [blob, setBlob] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [linkState, setLinkState] = useState('creating'); // creating | ready | failed
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const objectUrlRef = useRef('');

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let url = '';
      try {
        const { id } = await createShareLink(recipe);
        url = `${SITE_URL}/r/${id}`;
      } catch (err) {
        console.error('could not create share link:', err);
      }
      if (cancelled) return;
      setShareUrl(url);
      setLinkState(url ? 'ready' : 'failed');

      const b = await renderCard(recipe, url);
      if (cancelled) return;
      const objectUrl = URL.createObjectURL(b);
      objectUrlRef.current = objectUrl;
      setBlob(b);
      setImageUrl(objectUrl);
    }

    run();
    return () => {
      cancelled = true;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareText = `${recipe.title} — made from my leftovers with Leftover to Recipe!${shareUrl ? ` ${shareUrl}` : ''}`;
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
        url: shareUrl || undefined,
        files: [file]
      });
    } catch (err) {
      // User cancelled the share sheet, or the browser rejected it - not an error worth showing.
      if (err?.name !== 'AbortError') {
        console.error('share failed:', err);
      }
    }
  }

  function handleSaveImage() {
    if (!imageUrl) return;
    if (isTouchDevice) {
      // Opens the raw image so the OS long-press menu ("Save to Photos" /
      // "Add to Photos") is available - a triggered <a download> here lands
      // in Files/Downloads instead, which isn't what people expect.
      window.open(imageUrl, '_blank');
      return;
    }
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }

  async function handleCopyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // clipboard API unavailable - the link is shown on screen too
    }
  }

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch {
      // clipboard API unavailable - non-fatal
    }
  }

  const webIntents = shareUrl
    ? [
        {
          name: 'Facebook',
          emoji: '📘',
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        },
        {
          name: 'Messenger',
          emoji: '💬',
          url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=&redirect_uri=${encodeURIComponent(shareUrl)}`
        },
        {
          name: 'WhatsApp',
          emoji: '🟢',
          url: `https://wa.me/?text=${encodeURIComponent(shareText)}`
        }
      ]
    : [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel share-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
          <Icon name="x" size={18} />
        </button>

        <h3>Share this recipe</h3>
        <p className="profile-meta" style={{ marginBottom: 'var(--space-4)' }}>
          A shareable image is generated below, plus a link straight back to this recipe.
        </p>

        <div className="share-preview">
          {imageUrl ? <img src={imageUrl} alt={`${recipe.title} recipe card`} /> : <div className="share-preview-loading">Generating image…</div>}
        </div>

        {linkState === 'ready' && (
          <div className="share-link-row">
            <input type="text" readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
            <button type="button" className="btn btn-sm btn-outline" onClick={handleCopyLink}>
              {copiedLink ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        )}
        {linkState === 'failed' && (
          <p className="profile-meta" style={{ color: 'var(--color-danger)' }}>
            Couldn't create a shareable link right now — you can still share the image below.
          </p>
        )}

        {canNativeShare && (
          <button type="button" className="btn btn-primary btn-block" onClick={handleNativeShare}>
            <Icon name="share" size={16} /> Share to Instagram, WhatsApp, Messenger…
          </button>
        )}

        <button type="button" className="btn btn-secondary btn-block" onClick={handleSaveImage} disabled={!imageUrl}>
          <Icon name="download" size={16} /> {isTouchDevice ? 'Open image to save to Photos' : 'Download image'}
        </button>

        {!canNativeShare && (
          <>
            <p className="profile-meta" style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
              Your browser doesn't support the native share sheet — post directly instead, or save the image above
              and attach it to Instagram manually.
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
          {copiedCaption ? 'Caption copied ✓' : 'Copy caption text'}
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

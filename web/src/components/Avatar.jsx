// Food-emoji avatars on a soft tinted circle — replaces the old shared
// profile photo. Each person gets a distinct, on-theme look tied to their
// dish rather than a generic headshot.

export default function Avatar({ emoji, bg, size = 48 }) {
  return (
    <span
      className="avatar-emoji"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.5), background: bg }}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}

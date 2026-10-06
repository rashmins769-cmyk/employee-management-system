/**
 * Formats a date string into clean human-readable corporate date
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (_e) {
    return '—';
  }
}

/**
 * Returns initials from full name (e.g. "Sarah Chen" -> "SC")
 */
export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates consistent avatar gradient styling based on employee name
 */
export function getAvatarGradient(name: string): { bg: string; text: string; border: string } {
  const themes = [
    { bg: 'from-blue-600/30 to-indigo-600/30', text: 'text-blue-300', border: 'border-blue-500/30' },
    { bg: 'from-emerald-600/30 to-teal-600/30', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    { bg: 'from-amber-600/30 to-orange-600/30', text: 'text-amber-300', border: 'border-amber-500/30' },
    { bg: 'from-purple-600/30 to-violet-600/30', text: 'text-purple-300', border: 'border-purple-500/30' },
    { bg: 'from-rose-600/30 to-pink-600/30', text: 'text-rose-300', border: 'border-rose-500/30' },
    { bg: 'from-cyan-600/30 to-sky-600/30', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  ];

  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
}

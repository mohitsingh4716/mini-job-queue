// Central status metadata shared across the UI. Colors are expressed as
// Tailwind-friendly classes so every surface stays visually consistent.
export const STATUS_META = {
  PENDING: {
    label: 'Pending',
    dot: 'bg-amber-400',
    text: 'text-amber-300',
    badge: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
    glow: 'shadow-[0_0_12px_-2px_rgba(251,191,36,0.5)]',
  },
  RUNNING: {
    label: 'Running',
    dot: 'bg-sky-400',
    text: 'text-sky-300',
    badge: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
    glow: 'shadow-[0_0_12px_-2px_rgba(56,189,248,0.5)]',
  },
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    badge: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
    glow: 'shadow-[0_0_12px_-2px_rgba(52,211,153,0.5)]',
  },
  FAILED: {
    label: 'Failed',
    dot: 'bg-rose-400',
    text: 'text-rose-300',
    badge: 'bg-rose-400/10 text-rose-300 ring-rose-400/20',
    glow: 'shadow-[0_0_12px_-2px_rgba(251,113,133,0.5)]',
  },
};

// Valid next status actions per current status (mirrors the backend rules).
export const NEXT_ACTIONS = {
  PENDING: ['RUNNING', 'FAILED'],
  RUNNING: ['COMPLETED'],
  COMPLETED: [],
  FAILED: [],
};

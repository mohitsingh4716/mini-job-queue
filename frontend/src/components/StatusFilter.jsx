import { motion } from 'framer-motion';
import { STATUS_META } from '../statusConfig.js';

const FILTERS = ['ALL', 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'];

function StatusFilter({ value, onChange, counts }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.02] p-1">
      {FILTERS.map((status) => {
        const active = value === status;
        const label = status === 'ALL' ? 'All' : STATUS_META[status].label;
        const count = status === 'ALL' ? counts.total : counts[status];
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {active && (
              <motion.span
                layoutId="filterPill"
                className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {status !== 'ALL' && (
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[status].dot}`} />
              )}
              {label}
              <span className="tabular-nums text-xs text-zinc-500">{count}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default StatusFilter;

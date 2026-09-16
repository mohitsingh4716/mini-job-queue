import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber.jsx';
import { STATUS_META } from '../statusConfig.js';

const CARDS = [
  { key: 'total', label: 'Total jobs', dot: 'bg-zinc-400' },
  { key: 'PENDING', label: STATUS_META.PENDING.label, dot: STATUS_META.PENDING.dot },
  { key: 'RUNNING', label: STATUS_META.RUNNING.label, dot: STATUS_META.RUNNING.dot },
  { key: 'COMPLETED', label: STATUS_META.COMPLETED.label, dot: STATUS_META.COMPLETED.dot },
  { key: 'FAILED', label: STATUS_META.FAILED.label, dot: STATUS_META.FAILED.dot },
];

function StatusCounts({ jobs }) {
  const counts = {
    total: jobs.length,
    PENDING: jobs.filter((j) => j.status === 'PENDING').length,
    RUNNING: jobs.filter((j) => j.status === 'RUNNING').length,
    COMPLETED: jobs.filter((j) => j.status === 'COMPLETED').length,
    FAILED: jobs.filter((j) => j.status === 'FAILED').length,
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -3 }}
          className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-colors duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${card.dot}`} />
            <span className="text-xs font-medium text-zinc-400">{card.label}</span>
          </div>
          <div className="text-3xl font-semibold tabular-nums tracking-tight text-zinc-50">
            <AnimatedNumber value={counts[card.key]} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatusCounts;

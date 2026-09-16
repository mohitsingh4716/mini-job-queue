import { motion, AnimatePresence } from 'framer-motion';
import { STATUS_META, NEXT_ACTIONS } from '../statusConfig.js';
import {
  PlayIcon,
  CheckIcon,
  XIcon,
  TrashIcon,
  InboxIcon,
} from './icons.jsx';

const ACTIONS = {
  RUNNING: {
    label: 'Start',
    Icon: PlayIcon,
    cls: 'text-sky-300 ring-sky-400/20 hover:bg-sky-400/10 hover:ring-sky-400/40',
  },
  COMPLETED: {
    label: 'Complete',
    Icon: CheckIcon,
    cls: 'text-emerald-300 ring-emerald-400/20 hover:bg-emerald-400/10 hover:ring-emerald-400/40',
  },
  FAILED: {
    label: 'Fail',
    Icon: XIcon,
    cls: 'text-rose-300 ring-rose-400/20 hover:bg-rose-400/10 hover:ring-rose-400/40',
  },
};

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.round(diff / 1000);
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${meta.glow}`} />
      {meta.label}
    </span>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-zinc-500">
        <InboxIcon width={22} height={22} />
      </div>
      <p className="text-sm font-medium text-zinc-300">No jobs here yet</p>
      <p className="mt-1 text-sm text-zinc-500">
        Create a job above and it will show up right here.
      </p>
    </motion.div>
  );
}

function JobRow({ job, onUpdateStatus, onDelete, busy, flash }) {
  const actions = NEXT_ACTIONS[job.status] || [];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 42, mass: 0.6 }}
      className="overflow-hidden"
    >
      <div
        className={`flex items-center gap-4 px-5 py-3.5 transition-colors duration-700 ${
          flash ? 'bg-accent/[0.07]' : 'hover:bg-white/[0.02]'
        } ${busy ? 'pointer-events-none opacity-50' : ''}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span className="truncate font-medium text-zinc-100">
              {job.title}
            </span>
            <StatusBadge status={job.status} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              {job.type}
            </span>
            <span>·</span>
            <span>{relativeTime(job.createdAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {actions.map((next) => {
            const { label, Icon, cls } = ACTIONS[next];
            return (
              <motion.button
                key={next}
                type="button"
                whileTap={{ scale: 0.94 }}
                disabled={busy}
                onClick={() => onUpdateStatus(job.id, next)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset transition-all duration-200 disabled:opacity-50 ${cls}`}
              >
                <Icon width={13} height={13} />
                {label}
              </motion.button>
            );
          })}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            disabled={busy}
            onClick={() => onDelete(job.id)}
            aria-label="Delete job"
            className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-500 ring-1 ring-inset ring-white/[0.06] transition-all duration-200 hover:bg-rose-400/10 hover:text-rose-300 hover:ring-rose-400/30 disabled:opacity-50"
          >
            <TrashIcon width={14} height={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function JobList({ jobs, onUpdateStatus, onDelete, busyId, flashId }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] shadow-soft">
      {jobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-white/[0.05]">
          <AnimatePresence initial={false}>
            {jobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                onUpdateStatus={onUpdateStatus}
                onDelete={onDelete}
                busy={busyId === job.id}
                flash={flashId === job.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default JobList;

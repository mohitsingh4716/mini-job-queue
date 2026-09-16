import { useEffect, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import StatusCounts from './components/StatusCounts.jsx';
import StatusFilter from './components/StatusFilter.jsx';
import JobForm from './components/JobForm.jsx';
import JobList from './components/JobList.jsx';
import JobListSkeleton from './components/JobListSkeleton.jsx';
import { BoltIcon } from './components/icons.jsx';
import {
  getJobs,
  createJob,
  updateJobStatus,
  deleteJob,
} from './services/jobService.js';

function ConnectionStatus({ online }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-zinc-400">
      <span className="relative flex h-2 w-2">
        {online && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            online ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        />
      </span>
      {online ? 'Connected' : 'Offline'}
    </div>
  );
}

function App() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [flashId, setFlashId] = useState(null);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const flash = (id) => {
    setFlashId(id);
    setTimeout(() => setFlashId((current) => (current === id ? null : current)), 1200);
  };

  const handleCreate = async (job) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await createJob(job);
      await loadJobs();
      if (created && created.id) flash(created.id);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to create job.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setBusyId(id);
    setError('');
    try {
      await updateJobStatus(id, status);
      flash(id);
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setBusyId(null);
      // Always refresh so the UI reflects true server state, even after a
      // rejected transition or a concurrent conflict.
      await loadJobs();
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    setError('');
    try {
      await deleteJob(id);
    } catch (err) {
      setError(err.message || 'Failed to delete job.');
    } finally {
      setBusyId(null);
      await loadJobs();
    }
  };

  const counts = {
    total: jobs.length,
    PENDING: jobs.filter((j) => j.status === 'PENDING').length,
    RUNNING: jobs.filter((j) => j.status === 'RUNNING').length,
    COMPLETED: jobs.filter((j) => j.status === 'COMPLETED').length,
    FAILED: jobs.filter((j) => j.status === 'FAILED').length,
  };

  const visibleJobs =
    filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#08090a]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-indigo-600 text-white shadow-[0_4px_16px_-4px_rgba(99,102,241,0.7)]">
                <BoltIcon width={16} height={16} />
              </div>
              <div className="leading-tight">
                <h1 className="text-sm font-semibold text-zinc-100">Job Queue</h1>
                <p className="text-xs text-zinc-500">Dashboard</p>
              </div>
            </div>
            <ConnectionStatus online={!error} />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">
              Overview
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Create jobs and move them through their lifecycle.
            </p>
          </div>

          <section className="mb-6">
            <StatusCounts jobs={jobs} />
          </section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 shadow-soft sm:p-5"
          >
            <JobForm onCreate={handleCreate} submitting={submitting} />
          </motion.section>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.08] px-4 py-3 text-sm text-rose-200">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={loadJobs}
                    className="shrink-0 rounded-lg border border-rose-400/30 px-3 py-1 font-medium text-rose-200 transition-colors hover:bg-rose-500/15"
                  >
                    Retry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="mb-4 flex items-center justify-between gap-4">
            <StatusFilter value={filter} onChange={setFilter} counts={counts} />
          </section>

          <section>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <JobListSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <JobList
                    jobs={visibleJobs}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                    busyId={busyId}
                    flashId={flashId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;

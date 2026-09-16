import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon } from './icons.jsx';

function JobForm({ onCreate, submitting }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !type.trim()) {
      setError('Both title and type are required.');
      return;
    }
    setError('');
    const ok = await onCreate({ title: title.trim(), type: type.trim() });
    if (ok) {
      setTitle('');
      setType('');
    }
  };

  const inputClass =
    'w-full rounded-lg border border-white/[0.09] bg-white/[0.03] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-200 focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-accent/10';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Send weekly digest emails"
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">
            Type
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="email"
            className={inputClass}
          />
        </div>
        <motion.button
          type="submit"
          disabled={submitting}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-accent to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(99,102,241,0.6)] transition-all duration-200 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
        >
          <PlusIcon width={15} height={15} />
          {submitting ? 'Adding…' : 'Add job'}
        </motion.button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default JobForm;

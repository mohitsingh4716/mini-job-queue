import { useEffect } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

// Smoothly counts from the previous value to the next whenever `value` changes.
function AnimatedNumber({ value }) {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default AnimatedNumber;

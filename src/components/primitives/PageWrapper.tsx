import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex flex-col h-full w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

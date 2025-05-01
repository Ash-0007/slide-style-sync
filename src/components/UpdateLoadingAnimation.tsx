import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cog, FileText, Sparkles, CheckCircle } from 'lucide-react';

const icons = [
  { component: Cog, text: 'Processing...' },
  { component: FileText, text: 'Styling Slides...' },
  { component: Sparkles, text: 'Adding Magic...' },
  { component: CheckCircle, text: 'Finalizing...' },
];

const iconVariants = {
  enter: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const UpdateLoadingAnimation: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 1500); 

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[index].component;
  const currentText = icons[index].text;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index} 
          variants={iconVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex flex-col items-center justify-center"
        >
          <CurrentIcon className="w-16 h-16 mb-4 text-midnight_green animate-pulse" />
          <p className="text-lg font-semibold text-midnight_green">{currentText}</p>
        </motion.div>
      </AnimatePresence>
      {/* Optional: Add a subtle background animation or progress bar here */}
    </div>
  );
};

export default UpdateLoadingAnimation; 
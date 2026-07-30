// Devixa Motion Library - "Project Black Diamond"
// 60 FPS Physics & Motion Presets (Inspired by Linear, Apple & Vercel)

export const springPhysics = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

export const smoothEase = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for snappy response
};

export const cardHoverLift = {
  y: -6,
  scale: 1.01,
  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4), 0 0 20px 0 var(--glass-glow, rgba(168, 85, 247, 0.15))',
};

export const buttonPress = {
  scale: 0.96,
};

export const modalUnfold = {
  initial: { opacity: 0, scale: 0.94, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 10 },
  transition: smoothEase,
};

export const pageSlideIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export const cascadeContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const cascadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: smoothEase },
};

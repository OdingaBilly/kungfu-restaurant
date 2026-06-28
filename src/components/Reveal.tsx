import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** translate direction on enter */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** re-trigger every time it enters the viewport */
  once?: boolean;
}

const offset = 28;

const Reveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: RevealProps) => {
  const reduce = useReducedMotion();

  const hidden = () => {
    if (reduce || direction === "none") return { opacity: 0 };
    const map = {
      up: { y: offset },
      down: { y: -offset },
      left: { x: offset },
      right: { x: -offset },
    } as const;
    return { opacity: 0, ...map[direction] };
  };

  const variants: Variants = {
    hidden: hidden(),
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;

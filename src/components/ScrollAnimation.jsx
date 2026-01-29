import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ScrollAnimation = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.6,
  distance = 50,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionVariants = {
    up: { y: distance, opacity: 0 },
    down: { y: -distance, opacity: 0 },
    left: { x: distance, opacity: 0 },
    right: { x: -distance, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 },
    fade: { opacity: 0 }
  };

  const animateVariants = {
    hidden: directionVariants[direction],
    visible: { 
      x: 0, 
      y: 0, 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animateVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;

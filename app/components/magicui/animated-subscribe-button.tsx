import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedSubscribeButtonProps {
  subscribeStatus?: boolean;
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  subscribeStatus = false,
  children,
  className = "",
}) => {
  return (
    <button
      type="submit"
      className={`relative overflow-hidden rounded-md bg-black text-white font-semibold px-6 h-12 flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full ${className}`}
      aria-pressed={subscribeStatus}
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={subscribeStatus ? "subscribed" : "unsubscribed"}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ display: "flex", alignItems: "center" }}
          >
            {subscribeStatus ? children[1] : children[0]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </button>
  );
}; 
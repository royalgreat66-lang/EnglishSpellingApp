import React from "react";
import { motion } from "motion/react";

interface ConfirmOverlayProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmOverlay: React.FC<ConfirmOverlayProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      id="confirm-overlay"
      className="fixed inset-0 bg-[#2C2C24]/60 backdrop-blur-sm flex justify-center items-center px-4 z-50"
    >
      <motion.div
        id="confirm-box"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="confirm-box bg-[#F0EBE5] max-w-sm w-full p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] text-center border border-[#DED8CF]/40"
      >
        <h3 className="text-xl font-['Fraunces'] font-bold text-[#2C2C24] mb-2">Are you sure?</h3>
        <p className="text-sm text-[#78786C] mb-6 leading-relaxed">
          All your progress will be lost and you will start over from day one.
        </p>
        <div className="confirm-buttons flex gap-3">
          <motion.button
            id="cancel-reset-btn"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-transparent hover:bg-white/50 text-[#78786C] font-bold py-3 px-4 rounded-full transition-all duration-300 ease-out focus:outline-none text-xs uppercase tracking-wider cursor-pointer border border-[#DED8CF]"
          >
            Cancel
          </motion.button>
          <motion.button
            id="confirm-reset-btn"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-[#A85448] hover:bg-[#8F463C] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 ease-out focus:outline-none text-xs uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] cursor-pointer"
          >
            Yes, Overwrite
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
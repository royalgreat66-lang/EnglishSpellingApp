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
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center px-4 z-50 animate-fade-in"
    >
      <motion.div
        id="confirm-box"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="confirm-box bg-white max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center border border-slate-250"
      >
        <h3 className="text-xl font-black text-slate-900 mb-2">Are you sure?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          All your progress will be lost and you will start over from day one.
        </p>
        <div className="confirm-buttons flex gap-3">
          <button
            id="cancel-reset-btn"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition duration-150 focus:outline-none text-xs uppercase tracking-wider cursor-pointer border border-slate-200"
          >
            Cancel
          </button>
          <button
            id="confirm-reset-btn"
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 focus:outline-none text-xs uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer"
          >
            Yes, Overwrite
          </button>
        </div>
      </motion.div>
    </div>
  );
};

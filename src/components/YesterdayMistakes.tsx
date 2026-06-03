import React from "react";
import { motion } from "motion/react";

interface YesterdayMistakesProps {
  words: string[];
  onStartPractice: () => void;
}

export const YesterdayMistakes: React.FC<YesterdayMistakesProps> = ({
  words,
  onStartPractice,
}) => {
  return (
    <motion.div
      id="mistakes-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-[#F0EBE5] rounded-3xl p-6 sm:p-8 mb-6 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] border border-[#DED8CF]/40 relative overflow-hidden flex flex-col"
    >
      {/* Absolute top decorative highlighter bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#5D7052]" />
      
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 id="mistakes-header" className="text-lg font-['Fraunces'] font-bold text-[#2C2C24] flex items-center gap-2 tracking-tight">
          <span>📋</span> Yesterday's Mistakes
        </h2>
        <span className="bg-[#5D7052] text-[#F3F4F1] text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full">
          {words.length} Total
        </span>
      </div>
      
      <p className="text-xs text-[#78786C] mb-6 leading-relaxed">
        Review these words. Mistakes persist in your review list until you spell them correctly:
      </p>
      
      <div id="mistakes-list" className="space-y-2.5 mb-8 max-h-60 overflow-y-auto pr-1">
        {words.map((word, index) => (
          <motion.div
            key={`${word}-${index}`}
            id={`mistake-word-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            className="flex items-center justify-between gap-2 text-xs bg-white/70 border-l-4 border-[#5D7052] border border-[#DED8CF]/30 p-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-['Fraunces'] font-semibold tracking-wide text-[#2C2C24]">{word}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#78786C]">
              Needs Practice
            </span>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        id="start-practice-btn"
        onClick={onStartPractice}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-[#5D7052] hover:bg-[#4E6047] text-[#F3F4F1] font-bold py-4 px-4 rounded-full tracking-wide shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] transition-all duration-300 ease-out focus:outline-none cursor-pointer text-sm"
      >
        Start Today's Practice →
      </motion.button>
    </motion.div>
  );
};
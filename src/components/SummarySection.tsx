import React from "react";
import { motion } from "motion/react";

interface SummarySectionProps {
  correctCount: number;
  incorrectCount: number;
  totalWords: number;
  wrongWords: string[];
  onPracticeMore: () => void;
  onRetryWrong: () => void;
  onConfirmReset: () => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  correctCount,
  incorrectCount,
  totalWords,
  wrongWords,
  onPracticeMore,
  onRetryWrong,
  onConfirmReset,
}) => {
  const scorePercent = Math.round((correctCount / totalWords) * 100);

  return (
    <motion.div
      id="summary-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <h2 id="summary-header" className="text-2xl font-['Fraunces'] font-bold text-center text-[#2C2C24] tracking-tight leading-none mb-4">
        🎉 Practice Complete!
      </h2>

      {/* Summary stats grid */}
      <div className="summary-stats grid grid-cols-3 gap-2 py-5 bg-[#FDFCF8] rounded-3xl shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] border border-[#DED8CF]/40">
        <div id="stat-correct-box" className="stat text-center">
          <span id="correct-count" className="stat-number block text-3xl font-['Fraunces'] font-bold text-[#5D7052]">
            {correctCount}
          </span>
          <span className="stat-label text-[10px] font-bold text-[#78786C] uppercase tracking-wider">
            Correct
          </span>
        </div>
        <div id="stat-incorrect-box" className="stat text-center border-x border-[#DED8CF]/40">
          <span id="wrong-count" className="stat-number block text-3xl font-['Fraunces'] font-bold text-[#A85448]">
            {incorrectCount}
          </span>
          <span className="stat-label text-[10px] font-bold text-[#78786C] uppercase tracking-wider">
            Incorrect
          </span>
        </div>
        <div id="stat-score-box" className="stat text-center">
          <span id="score-percent" className="stat-number block text-3xl font-['Fraunces'] font-bold text-[#5D7052]">
            {scorePercent}%
          </span>
          <span className="stat-label text-[10px] font-bold text-[#78786C] uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>

      {/* Wrong words list */}
      {wrongWords.length > 0 && (
        <motion.div
          id="wrong-words-list"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="bg-[#F0EBE5] rounded-3xl p-5 space-y-3 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] border border-[#DED8CF]/40 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#A85448]" />
          <h3 className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider pl-1">
            Words to review tomorrow:
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {wrongWords.map((word, index) => (
              <div
                key={`${word}-${index}`}
                id={`wrong-word-item-${index}`}
                className="wrong-word-item text-[#A85448] font-bold text-sm bg-white/60 px-3 py-2 rounded-2xl border border-[#DED8CF]/30 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-[#A85448] rounded-full" />
                <span>{word}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Control buttons */}
      <div className="space-y-3 pt-2">
        <motion.button
          id="practice-more-btn"
          onClick={onPracticeMore}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#5D7052] hover:bg-[#4E6047] text-[#F3F4F1] font-extrabold py-4 px-4 rounded-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] transition-all duration-300 ease-out focus:outline-none cursor-pointer text-sm uppercase tracking-wider"
        >
          Practice 10 More Words
        </motion.button>

        {wrongWords.length > 0 && (
          <motion.button
            id="retry-btn"
            onClick={onRetryWrong}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-transparent hover:bg-[#C18C5D]/10 text-[#C18C5D] border-2 border-[#C18C5D] font-extrabold py-4 px-4 rounded-full transition-all duration-300 ease-out focus:outline-none cursor-pointer text-sm uppercase tracking-wider"
          >
            Retry Missed Words
          </motion.button>
        )}

        <motion.button
          id="reset-trigger-btn"
          onClick={onConfirmReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-transparent hover:bg-[#F0EBE5] text-[#78786C] font-bold py-3 px-4 rounded-full transition-all duration-300 ease-out focus:outline-none mt-2 text-xs uppercase tracking-wider cursor-pointer border border-[#DED8CF]"
        >
          Start Over
        </motion.button>
      </div>
    </motion.div>
  );
};
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
    <div id="summary-section" className="space-y-6">
      <h2 id="summary-header" className="text-2xl font-black text-center text-slate-900 tracking-tight leading-none mb-4">
        🎉 Practice Complete!
      </h2>

      {/* Summary stats grid */}
      <div className="summary-stats grid grid-cols-3 gap-2 py-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs">
        <div id="stat-correct-box" className="stat text-center">
          <span id="correct-count" className="stat-number block text-3xl font-black text-emerald-600">
            {correctCount}
          </span>
          <span className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Correct
          </span>
        </div>
        <div id="stat-incorrect-box" className="stat text-center border-x border-slate-200">
          <span id="wrong-count" className="stat-number block text-3xl font-black text-rose-600">
            {incorrectCount}
          </span>
          <span className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Incorrect
          </span>
        </div>
        <div id="stat-score-box" className="stat text-center">
          <span id="score-percent" className="stat-number block text-3xl font-black text-indigo-600">
            {scorePercent}%
          </span>
          <span className="stat-label text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Score
          </span>
        </div>
      </div>

      {/* Wrong words list */}
      {wrongWords.length > 0 && (
        <div
          id="wrong-words-list"
          className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-rose-500" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pl-1">
            Words to review tomorrow:
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {wrongWords.map((word, index) => (
              <div
                key={`${word}-${index}`}
                id={`wrong-word-item-${index}`}
                className="wrong-word-item text-rose-700 font-bold text-sm bg-rose-50/40 px-3 py-2 rounded-xl border border-rose-100/50 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-rose-450 rounded-full" />
                <span>{word}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="space-y-3 pt-2">
        <button
          id="practice-more-btn"
          onClick={onPracticeMore}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-lg shadow-indigo-150 hover:shadow-xl transition duration-150 focus:outline-none cursor-pointer text-sm uppercase tracking-wider"
        >
          Practice 10 More Words
        </button>

        {wrongWords.length > 0 && (
          <button
            id="retry-btn"
            onClick={onRetryWrong}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 px-4 rounded-xl shadow-lg shadow-emerald-150 hover:shadow-xl transition duration-150 focus:outline-none cursor-pointer text-sm uppercase tracking-wider"
          >
            Retry Missed Words
          </button>
        )}

        <button
          id="reset-trigger-btn"
          onClick={onConfirmReset}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold py-3 px-4 rounded-xl transition duration-150 focus:outline-none mt-2 text-xs uppercase tracking-wider cursor-pointer border border-slate-200"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};

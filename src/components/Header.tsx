import React from "react";
import { motion } from "motion/react";
import { Stats } from "../types";

interface HeaderProps {
  sessionDay: number;
  stats: Stats;
  mistakeCount: number;
  isActiveSession: boolean;
  isMistakePractice: boolean;
  onSwitchMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sessionDay,
  stats,
  mistakeCount,
  isActiveSession,
  isMistakePractice,
  onSwitchMode,
}) => {
  return (
    <div id="app-header" className="mb-3 pb-5 border-b border-[#DED8CF]/50">
      {/* Main header row — never wraps, always left icon + right-stacked badges */}
      <div className="flex flex-row flex-nowrap items-start justify-between w-full">
        {/* Left: App logo */}
        <div className="flex-shrink-0">
          <img src="/EnglishSpellingApp/256.png" alt="App Logo" className="w-10 h-10" />
        </div>

        {/* Right: Day badge on top, stats below — pinned to the right */}
        <div className="flex flex-col items-end flex-shrink-0 gap-2">
          <div id="day-badge" className="bg-[#5D7052] text-[#F3F4F1] px-4 py-1.5 rounded-full font-['Fraunces'] font-semibold text-xs uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
            Day <span id="day-number">{sessionDay}</span>
          </div>
          <div id="stats-badge" className="bg-[#F0EBE5] border border-[#DED8CF]/40 py-1.5 px-4 rounded-2xl text-xs font-bold select-none text-[#78786C] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
            <span id="stat-correct-wrapper" className="text-emerald-600">
              ✓ <span id="total-correct">{stats.totalCorrect}</span>
            </span>
            <span className="text-[#DED8CF] mx-2">|</span>
            <span id="stat-incorrect-wrapper" className="text-rose-600">
              ✗ <span id="total-incorrect">{stats.totalIncorrect}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mode-switching button — only shown during an active practice session */}
      {isActiveSession && (
        <div className="flex justify-center mt-3">
          {isMistakePractice ? (
            /* In mistakes mode: show green "Daily Practice" button */
            <motion.button
              id="switch-to-daily-btn"
              onClick={onSwitchMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#5D7052] hover:bg-[#4E6047] text-[#F3F4F1] px-3 py-1.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] transition-all duration-300 ease-out cursor-pointer flex-shrink-0"
            >
              Daily Practice
            </motion.button>
          ) : (
            /* In daily practice mode: show brown "Practice Mistakes (N)" button */
            mistakeCount > 0 && (
              <motion.button
                id="practice-mistakes-btn"
                onClick={onSwitchMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#C18C5D] hover:bg-[#B07A4E] text-[#F3F4F1] px-3 py-1.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] transition-all duration-300 ease-out cursor-pointer flex-shrink-0"
              >
                Practice Mistakes ({mistakeCount})
              </motion.button>
            )
          )}
        </div>
      )}
    </div>
  );
};
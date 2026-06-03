import React from "react";
import { Stats } from "../types";

interface HeaderProps {
  sessionDay: number;
  stats: Stats;
}

export const Header: React.FC<HeaderProps> = ({ sessionDay, stats }) => {
  return (
    <div id="app-header" className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-5 border-b border-[#DED8CF]/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs">S</div>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 justify-between w-full sm:w-auto">
        <div id="day-badge" className="bg-[#5D7052] text-[#F3F4F1] px-4 py-1.5 rounded-full font-['Fraunces'] font-semibold text-xs uppercase tracking-wider shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
          Day <span id="day-number">{sessionDay}</span>
        </div>
        <div id="stats-badge" className="bg-[#F0EBE5] border border-[#DED8CF]/40 py-1.5 px-4 rounded-2xl text-xs font-bold select-none text-[#78786C] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
          <span id="stat-correct-wrapper" className="text-emerald-600">
            ✓ <span id="total-correct">{stats.totalCorrect}</span>
          </span>
          <span className="text-[#DED8CF] mx-2">|</span>
          <span id="stat-corrected-wrapper" className="text-amber-500">
            ↺ <span id="total-corrected">{stats.totalCorrected}</span>
          </span>
          <span className="text-[#DED8CF] mx-2">|</span>
          <span id="stat-incorrect-wrapper" className="text-rose-600">
            ✗ <span id="total-incorrect">{stats.totalIncorrect}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
import React from "react";
import { Stats } from "../types";

interface HeaderProps {
  sessionDay: number;
  stats: Stats;
}

export const Header: React.FC<HeaderProps> = ({ sessionDay, stats }) => {
  return (
    <div id="app-header" className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs">S</div>
        <div>
          <h1 id="app-title" className="font-extrabold text-lg text-slate-900 leading-tight">SpellingMaster</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">React + Vite Migration</p>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 justify-between w-full sm:w-auto">
        <div id="day-badge" className="bg-indigo-600 text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
          Day <span id="day-number">{sessionDay}</span>
        </div>
        <div id="stats-badge" className="bg-slate-50 border border-slate-200 py-1.5 px-4 rounded-full text-xs font-bold select-none text-slate-600">
          <span id="stat-correct-wrapper" className="text-emerald-600">
            ✓ <span id="total-correct">{stats.totalCorrect}</span>
          </span>
          <span className="text-slate-300 mx-2">|</span>
          <span id="stat-corrected-wrapper" className="text-amber-500">
            ↺ <span id="total-corrected">{stats.totalCorrected}</span>
          </span>
          <span className="text-slate-300 mx-2">|</span>
          <span id="stat-incorrect-wrapper" className="text-rose-600">
            ✗ <span id="total-incorrect">{stats.totalIncorrect}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

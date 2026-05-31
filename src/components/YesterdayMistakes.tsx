import React from "react";

interface YesterdayMistakesProps {
  words: string[];
  onStartPractice: () => void;
}

export const YesterdayMistakes: React.FC<YesterdayMistakesProps> = ({
  words,
  onStartPractice,
}) => {
  return (
    <div id="mistakes-section" className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden border border-slate-800 flex flex-col">
      {/* Absolute top decorative highlighter bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
      
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 id="mistakes-header" className="text-lg font-extrabold flex items-center gap-2 tracking-tight">
          <span>📋</span> Yesterday's Mistakes
        </h2>
        <span className="bg-amber-500 text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md text-slate-950">
          {words.length} Total
        </span>
      </div>
      
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        Review these words. Mistakes persist in your review list until you spell them correctly:
      </p>
      
      <div id="mistakes-list" className="space-y-2.5 mb-8 max-h-60 overflow-y-auto pr-1">
        {words.map((word, index) => (
          <div
            key={`${word}-${index}`}
            id={`mistake-word-${index}`}
            className="flex items-center justify-between gap-2 text-xs bg-white/5 border border-white/10 p-4 rounded-xl shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="font-extrabold tracking-wide text-slate-100">{word}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">
              Needs Practice
            </span>
          </div>
        ))}
      </div>
      
      <button
        id="start-practice-btn"
        onClick={onStartPractice}
        className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl tracking-wide hover:bg-indigo-500 active:bg-indigo-700 transition duration-150 shadow-md hover:shadow-indigo-500/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 cursor-pointer text-sm"
      >
        Start Today's Practice →
      </button>
    </div>
  );
};

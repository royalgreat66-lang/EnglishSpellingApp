import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ResultFeedback } from "../types";

interface PracticeSectionProps {
  word: string;
  currentIndex: number;
  totalWords: number;
  wordVisible: boolean;
  onToggleWordVisibility: () => void;
  inputValue: string;
  onInputChange: (val: string) => void;
  feedback: ResultFeedback | null;
  onCheckAnswer: () => void;
  isChecking: boolean;
}

export const PracticeSection: React.FC<PracticeSectionProps> = ({
  word,
  currentIndex,
  totalWords,
  wordVisible,
  onToggleWordVisibility,
  inputValue,
  onInputChange,
  feedback,
  onCheckAnswer,
  isChecking,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus the text input whenever the word index changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isChecking) {
      onCheckAnswer();
    }
  };

  const progressPercentage = ((currentIndex + 1) / totalWords) * 100;

  return (
    <div id="practice-section" className="space-y-6">
      {/* Progress display */}
      <div className="progress">
        <div className="flex justify-between items-center mb-2.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <p id="progress-text">
            Word {currentIndex + 1} of {totalWords}
          </p>
          <p className="text-xs text-slate-400">
            {Math.round(progressPercentage)}% Complete
          </p>
        </div>
        <div className="progress-bar w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
          <motion.div
            id="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
            className="height-100 h-full bg-indigo-600 rounded-full"
          />
        </div>
      </div>

      {/* Word Study Card */}
      <div className="word-card text-center py-10 px-6 bg-white border border-slate-200 rounded-2xl relative overflow-hidden shadow-sm">
        {/* Absolute design indicator stripe */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
        
        <p className="label text-[10px] text-slate-450 font-extrabold uppercase tracking-widest leading-none">
          Study this word
        </p>
        
        <div className="h-24 flex items-center justify-center my-4 overflow-hidden">
          <span
            id="current-word"
            className={`text-4xl sm:text-5xl font-black text-slate-900 tracking-tight transition-all duration-300 ${
              wordVisible ? "blur-0" : "blur-[8px] opacity-25 select-none"
            }`}
          >
            {word}
          </span>
        </div>

        <button
          id="hide-btn"
          onClick={onToggleWordVisibility}
          className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl text-xs shadow-xs hover:bg-slate-100 transition duration-150 mx-auto flex items-center gap-1.5 cursor-pointer"
        >
          {wordVisible ? (
            <>
              <span>👁</span>
              <span>Hide Word</span>
            </>
          ) : (
            <>
              <span>🙈</span>
              <span>Show Word</span>
            </>
          )}
        </button>
      </div>

      {/* Guess Input Form */}
      <div className="space-y-4">
        <p className="instruction text-slate-500 text-xs font-bold uppercase tracking-wider">
          Now type it from memory:
        </p>
        <input
          id="user-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isChecking}
          placeholder="Type the word here..."
          spellCheck="false"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full bg-slate-50 px-6 py-4.5 text-xl sm:text-2xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-800 text-center placeholder:text-slate-350 disabled:bg-slate-100 disabled:text-slate-400 tracking-wide transition-all duration-150"
        />
        <button
          id="check-btn"
          onClick={onCheckAnswer}
          disabled={isChecking}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4.5 px-6 rounded-xl shadow-lg shadow-indigo-150 hover:shadow-xl transition-all duration-150 focus:outline-none cursor-pointer text-base uppercase tracking-wider"
        >
          Check Answer
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          id="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`result p-4 rounded-xl text-center font-bold shadow-md border ${
            feedback.status === "correct"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.text}
        </motion.div>
      )}
    </div>
  );
};

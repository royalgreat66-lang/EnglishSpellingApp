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
    <motion.div
      id="practice-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Progress display */}
      <div className="progress">
        <div className="flex justify-between items-center mb-2.5 text-xs text-[#78786C] font-bold uppercase tracking-wider">
          <p id="progress-text">
            Word {currentIndex + 1} of {totalWords}
          </p>
          <p className="text-xs text-[#78786C]/60">
            {Math.round(progressPercentage)}% Complete
          </p>
        </div>
        <div className="progress-bar w-full h-2 bg-[#F0EBE5] rounded-full overflow-hidden">
          <motion.div
            id="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-[#5D7052] rounded-full"
          />
        </div>
      </div>

      {/* Word Study Card - Hero Element */}
      <div className="word-card text-center py-10 px-6 bg-[#FDFCF8] rounded-3xl relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] border border-[#DED8CF]/40">
        {/* Organic blob shape behind the word for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 organic-blob bg-[#E6DCCD]/30 blur-3xl pointer-events-none" />
        
        <p className="label text-[10px] text-[#78786C] font-extrabold uppercase tracking-widest leading-none relative z-10">
          Study this word
        </p>
        
        <div className="h-24 flex items-center justify-center my-4 overflow-hidden relative z-10">
          <motion.span
            id="current-word"
            key={word + currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`text-4xl sm:text-5xl font-['Fraunces'] font-semibold text-[#2C2C24] tracking-tight transition-all duration-500 ease-out ${
              wordVisible ? "blur-0" : "blur-[8px] opacity-25 select-none"
            }`}
          >
            {word}
          </motion.span>
        </div>

        <button
          id="hide-btn"
          onClick={onToggleWordVisibility}
          className="relative z-10 text-[#5D7052] border-2 border-[#5D7052]/30 bg-transparent hover:bg-[#5D7052]/10 font-bold px-4 py-2 rounded-full text-xs shadow-none hover:shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] transition-all duration-300 ease-out mx-auto flex items-center gap-1.5 cursor-pointer"
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
        <p className="instruction text-[#78786C] text-xs font-bold uppercase tracking-wider">
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
          className="w-full bg-white/50 px-6 py-4.5 text-xl sm:text-2xl font-bold border-2 border-[#DED8CF] rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D7052]/30 focus:border-[#5D7052]/40 text-[#2C2C24] text-center placeholder:text-[#78786C]/50 disabled:bg-[#F0EBE5]/50 disabled:text-[#78786C]/50 tracking-wide transition-all duration-300 ease-out"
        />
        <motion.button
          id="check-btn"
          onClick={onCheckAnswer}
          disabled={isChecking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-[#5D7052] hover:bg-[#4E6047] disabled:bg-[#5D7052]/50 text-[#F3F4F1] font-bold py-4.5 px-6 rounded-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] transition-all duration-300 ease-out focus:outline-none cursor-pointer text-base uppercase tracking-wider"
        >
          Check Answer
        </motion.button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          id="result"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`result p-4 rounded-2xl text-center font-bold shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] border ${
            feedback.status === "correct"
              ? "bg-[#F3F4F1] text-[#5D7052] border-[#5D7052]/30"
              : feedback.status === "empty"
              ? "bg-[#F0EBE5] text-[#A85448] border-[#A85448]/30"
              : "bg-[#F0EBE5] text-[#A85448] border-[#A85448]/30"
          }`}
        >
          {feedback.text}
        </motion.div>
      )}
    </motion.div>
  );
};
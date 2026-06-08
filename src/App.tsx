import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { allWords } from "./words";
import { Stats, AppPhase, ResultFeedback } from "./types";
import { Header } from "./components/Header";
import { PracticeSection } from "./components/PracticeSection";
import { SummarySection } from "./components/SummarySection";
import { ConfirmOverlay } from "./components/ConfirmOverlay";

export default function App() {
  // Core system and badge states
  const [sessionDay, setSessionDay] = useState<number>(1);
  const [stats, setStats] = useState<Stats>({
    totalCorrect: 0,
    totalIncorrect: 0,
  });
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);

  // Navigation phase and reset overlays
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Active training sets session state
  const [dailyWords, setDailyWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<string[]>([]);
  
  // Interactive inputs and visual flags
  const [inputValue, setInputValue] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<ResultFeedback | null>(null);
  
  // Retry, tracking flow, and mistake practice flags
  const [retryMode, setRetryMode] = useState<boolean>(false);
  const [isMistakePractice, setIsMistakePractice] = useState<boolean>(false);

  // Initialize and synchronise state on app start
  useEffect(() => {
    // Check & populate default localStorage key-values
    if (!localStorage.getItem("sessionDay")) {
      localStorage.setItem("sessionDay", "1");
    }
    if (!localStorage.getItem("usedWords")) {
      localStorage.setItem("usedWords", "[]");
    }
    if (!localStorage.getItem("totalCorrect")) {
      localStorage.setItem("totalCorrect", "0");
    }
    if (!localStorage.getItem("totalIncorrect")) {
      localStorage.setItem("totalIncorrect", "0");
    }
    if (!localStorage.getItem("mistakeWords")) {
      localStorage.setItem("mistakeWords", "[]");
    }

    // Retrieve initial values
    const day = parseInt(localStorage.getItem("sessionDay") || "1", 10);
    const correct = parseInt(localStorage.getItem("totalCorrect") || "0", 10);
    const incorrect = parseInt(localStorage.getItem("totalIncorrect") || "0", 10);
    
    let parsedUsed: string[] = [];
    try {
      parsedUsed = JSON.parse(localStorage.getItem("usedWords") || "[]");
    } catch {
      parsedUsed = [];
    }

    let parsedMistakes: string[] = [];
    try {
      parsedMistakes = JSON.parse(localStorage.getItem("mistakeWords") || "[]");
    } catch {
      parsedMistakes = [];
    }

    setSessionDay(day);
    setStats({
      totalCorrect: correct,
      totalIncorrect: incorrect,
    });
    setUsedWords(parsedUsed);
    setMistakeWords(parsedMistakes);
    // If there are accumulated mistake words, show idle screen with choice.
    // Otherwise skip straight to daily practice.
    if (parsedMistakes.length > 0) {
      setPhase("idle");
    } else {
      setupTodayPractice(parsedUsed);
    }
  }, []);

  // Helper to sync mistakeWords to localStorage
  const syncMistakeWords = (updated: string[]) => {
    localStorage.setItem("mistakeWords", JSON.stringify(updated));
    setMistakeWords(updated);
  };

  // Word selection generator helper for daily practice
  const setupTodayPractice = (activeUsedWords: string[]) => {
    // Filter remaining words that haven't been practiced yet
    let remaining = allWords.filter((w) => !activeUsedWords.includes(w));
    let finalUsed = [...activeUsedWords];

    if (remaining.length < 10) {
      // Loop reset logic if word pool is exhausted
      finalUsed = [];
      localStorage.setItem("usedWords", "[]");
      setUsedWords([]);
      remaining = [...allWords];
    }

    // Shuffle and extract next 10 items
    const shuffled = [...remaining].sort(() => 0.5 - Math.random());
    const next10 = shuffled.slice(0, 10);
    const updatedUsed = [...finalUsed, ...next10];

    localStorage.setItem("usedWords", JSON.stringify(updatedUsed));
    setUsedWords(updatedUsed);

    // Load into state
    setDailyWords(next10);
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setWrongWords([]);
    setInputValue("");
    setFeedback(null);
    setRetryMode(false);
    setIsMistakePractice(false);
    setPhase("practice");
  };

  // Handler for starting a daily practice session from idle
  const handleStartDailyPractice = () => {
    setupTodayPractice(usedWords);
  };

  // Handler for starting a mistake practice session
  const handleStartMistakePractice = () => {
    // Take up to 10 oldest words (FIFO) from mistakeWords
    const sessionWords = mistakeWords.slice(0, 10);

    setDailyWords(sessionWords);
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setWrongWords([]);
    setInputValue("");
    setFeedback(null);
    setRetryMode(false);
    setIsMistakePractice(true);
    setPhase("practice");
  };

  // Validate answer checking
  const handleCheckAnswer = () => {
    const trimmedVal = inputValue.trim();
    if (trimmedVal === "") {
      setFeedback({
        status: "empty",
        text: "⚠️ Please type the word before checking!",
      });
      return;
    }

    setIsChecking(true);
    const currentWord = dailyWords[currentWordIndex];
    const isAnswerCorrect = trimmedVal.toLowerCase() === currentWord.toLowerCase();

    if (isAnswerCorrect) {
      setFeedback({
        status: "correct",
        text: "✓ Correct!",
      });
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback({
        status: "incorrect",
        text: `✗ Incorrect. Correct spelling: ${currentWord}`,
      });
      setWrongWords((prev) => [...prev, currentWord]);
    }

    // Auto advancement timer
    setTimeout(() => {
      if (currentWordIndex < dailyWords.length - 1) {
        setCurrentWordIndex((prev) => prev + 1);
        setInputValue("");
        setFeedback(null);
        setIsChecking(false);
      } else {
        // Evaluate overall results of active session
        const finalCorrectCount = isAnswerCorrect ? correctCount + 1 : correctCount;
        const currentWrongWords = isAnswerCorrect 
          ? wrongWords 
          : [...wrongWords, currentWord];

        let updatedStats = { ...stats };

        if (retryMode) {
          // In retry mode, corrected words count as fully correct
          localStorage.setItem(
            "totalCorrect",
            (stats.totalCorrect + finalCorrectCount).toString()
          );
          localStorage.setItem(
            "totalIncorrect",
            Math.max(0, stats.totalIncorrect - finalCorrectCount).toString()
          );

          updatedStats.totalCorrect += finalCorrectCount;
          updatedStats.totalIncorrect = Math.max(0, stats.totalIncorrect - finalCorrectCount);
        } else {
          // Standard additions
          localStorage.setItem(
            "totalCorrect",
            (stats.totalCorrect + finalCorrectCount).toString()
          );
          localStorage.setItem(
            "totalIncorrect",
            (stats.totalIncorrect + currentWrongWords.length).toString()
          );

          updatedStats.totalCorrect += finalCorrectCount;
          updatedStats.totalIncorrect += currentWrongWords.length;
        }

        // --- mistakeWords management ---
        let updatedMistakeWords = [...mistakeWords];

        if (isMistakePractice) {
          // Mistake practice: correct words get removed from mistakeWords permanently
          // Words that were answered correctly during this session
          if (isAnswerCorrect) {
            // currentWord was correct - remove it from mistakeWords
            updatedMistakeWords = updatedMistakeWords.filter(w => w !== currentWord);
          }
          // Wrong words stay in mistakeWords (they're already there)
        } else if (!retryMode) {
          // Regular (non-retry) session: add wrong words to mistakeWords if not already present
          currentWrongWords.forEach((w) => {
            if (!updatedMistakeWords.includes(w)) {
              updatedMistakeWords.push(w);
            }
          });
        }
        // retryMode sessions do NOT touch mistakeWords

        syncMistakeWords(updatedMistakeWords);
        setStats(updatedStats);
        setPhase("summary");
        setIsChecking(false);
      }
    }, 1500);
  };

  // Return to idle after mistake practice summary
  const handleReturnToIdle = () => {
    setIsMistakePractice(false);
    setPhase("idle");
  };

  // Increment Day, load another 10 words
  const handlePracticeMore = () => {
    const nextDay = sessionDay + 1;
    localStorage.setItem("sessionDay", nextDay.toString());
    setSessionDay(nextDay);
    
    setupTodayPractice(usedWords);
  };

  // Enter correction retry loop on misspelled words
  const handleRetryWrongWords = () => {
    setRetryMode(true);
    setDailyWords([...wrongWords]);
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setWrongWords([]);
    setInputValue("");
    setFeedback(null);
    setPhase("practice");
  };

  // Reset progress confirmation actions
  const handleConfirmResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleExecuteReset = () => {
    localStorage.clear();
    
    localStorage.setItem("sessionDay", "1");
    localStorage.setItem("usedWords", "[]");
    localStorage.setItem("totalCorrect", "0");
    localStorage.setItem("totalIncorrect", "0");
    localStorage.setItem("mistakeWords", "[]");

    setSessionDay(1);
    setStats({
      totalCorrect: 0,
      totalIncorrect: 0,
    });
    setUsedWords([]);
    setMistakeWords([]);
    
    setShowResetConfirm(false);
    setIsMistakePractice(false);
    setPhase("idle");
  };

  return (
    <div id="spelling-app-root" className="min-h-screen w-full flex-col sm:flex-row flex sm:justify-center items-stretch sm:items-start sm:px-4 select-none" style={{ minHeight: "100dvh", fontFamily: "var(--font-nunito)", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div id="spelling-container" className="flex-1 sm:flex-none p-6 sm:p-10 sm:py-16 sm:rounded-3xl max-w-lg w-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] sm:border sm:border-[#DED8CF]/50" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Render Header */}
        <Header
          sessionDay={sessionDay}
          stats={stats}
          mistakeCount={mistakeWords.length}
          onPracticeMistakes={handleStartMistakePractice}
        />

        {/* Render Active Stage Screen Phase */}
        {phase === "idle" && (
          <motion.div
            id="idle-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-4 pt-4"
          >
            <motion.button
              id="start-daily-practice-btn"
              onClick={handleStartDailyPractice}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#5D7052] hover:bg-[#4E6047] text-[#F3F4F1] font-extrabold py-5 px-4 rounded-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] transition-all duration-300 ease-out focus:outline-none cursor-pointer text-base uppercase tracking-wider"
            >
              Start Daily Practice
            </motion.button>

            {mistakeWords.length > 0 && (
              <motion.button
                id="practice-mistakes-btn-idle"
                onClick={handleStartMistakePractice}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-[#C18C5D] hover:bg-[#B07A4E] text-[#F3F4F1] font-extrabold py-5 px-4 rounded-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)] transition-all duration-300 ease-out focus:outline-none cursor-pointer text-base uppercase tracking-wider"
              >
                Practice Mistakes ({mistakeWords.length})
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === "practice" && dailyWords.length > 0 && (
          <PracticeSection
            word={dailyWords[currentWordIndex]}
            currentIndex={currentWordIndex}
            totalWords={dailyWords.length}
            inputValue={inputValue}
            onInputChange={setInputValue}
            feedback={feedback}
            onCheckAnswer={handleCheckAnswer}
            isChecking={isChecking}
          />
        )}

        {phase === "summary" && (
          <SummarySection
            correctCount={correctCount}
            incorrectCount={wrongWords.length}
            totalWords={dailyWords.length}
            wrongWords={wrongWords}
            onPracticeMore={handlePracticeMore}
            onRetryWrong={handleRetryWrongWords}
            onConfirmReset={handleConfirmResetClick}
            isMistakePractice={isMistakePractice}
            onFinish={handleReturnToIdle}
          />
        )}

        {/* Modal Overlay Confirmation */}
        {showResetConfirm && (
          <ConfirmOverlay
            onCancel={handleCancelReset}
            onConfirm={handleExecuteReset}
          />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { allWords } from "./words";
import { Stats, AppPhase, ResultFeedback } from "./types";
import { Header } from "./components/Header";
import { YesterdayMistakes } from "./components/YesterdayMistakes";
import { PracticeSection } from "./components/PracticeSection";
import { SummarySection } from "./components/SummarySection";
import { ConfirmOverlay } from "./components/ConfirmOverlay";

export default function App() {
  // Core system and badge states
  const [sessionDay, setSessionDay] = useState<number>(1);
  const [stats, setStats] = useState<Stats>({
    totalCorrect: 0,
    totalCorrected: 0,
    totalIncorrect: 0,
  });
  const [yesterdayMistakes, setYesterdayMistakes] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  // Navigation phase and reset overlays
  const [phase, setPhase] = useState<AppPhase>("review");
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Active training sets session state
  const [dailyWords, setDailyWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<string[]>([]);
  
  // Interactive inputs and visual flags
  const [wordVisible, setWordVisible] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<ResultFeedback | null>(null);
  
  // Retry and tracking flow settings
  const [retryMode, setRetryMode] = useState<boolean>(false);

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
    if (!localStorage.getItem("totalCorrected")) {
      localStorage.setItem("totalCorrected", "0");
    }
    if (!localStorage.getItem("yesterdayMistakes")) {
      localStorage.setItem("yesterdayMistakes", "[]");
    }

    // Retrieve initial values
    const day = parseInt(localStorage.getItem("sessionDay") || "1", 10);
    const correct = parseInt(localStorage.getItem("totalCorrect") || "0", 10);
    const corrected = parseInt(localStorage.getItem("totalCorrected") || "0", 10);
    const incorrect = parseInt(localStorage.getItem("totalIncorrect") || "0", 10);
    
    let parsedUsed: string[] = [];
    try {
      parsedUsed = JSON.parse(localStorage.getItem("usedWords") || "[]");
    } catch {
      parsedUsed = [];
    }

    let parsedMistakes: string[] = [];
    try {
      parsedMistakes = JSON.parse(localStorage.getItem("yesterdayMistakes") || "[]");
    } catch {
      parsedMistakes = [];
    }

    setSessionDay(day);
    setStats({
      totalCorrect: correct,
      totalCorrected: corrected,
      totalIncorrect: incorrect,
    });
    setUsedWords(parsedUsed);
    setYesterdayMistakes(parsedMistakes);

    // If yesterday mistakes exist, show the review stage, otherwise start practice immediately
    if (parsedMistakes.length > 0) {
      setPhase("review");
    } else {
      setupTodayPractice(parsedUsed);
    }
  }, []);

  // Word selection generator helper
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
    setWordVisible(true);
    setInputValue("");
    setFeedback(null);
    setRetryMode(false);
    setPhase("practice");
  };

  // Handler for beginning standard practice after review
  const handleStartPracticeDirect = () => {
    setupTodayPractice(usedWords);
  };

  // Toggle spelling study card text hide/show masking helper
  const handleToggleWordVisibility = () => {
    setWordVisible((prev) => !prev);
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
        setWordVisible(true);
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
          // Corrections updates
          localStorage.setItem(
            "totalCorrected",
            (stats.totalCorrected + finalCorrectCount).toString()
          );
          localStorage.setItem(
            "totalIncorrect",
            Math.max(0, stats.totalIncorrect - finalCorrectCount).toString()
          );

          updatedStats.totalCorrected += finalCorrectCount;
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

        // Save current session failures as tomorrow's review targets
        localStorage.setItem("yesterdayMistakes", JSON.stringify(currentWrongWords));
        setYesterdayMistakes(currentWrongWords);
        
        setStats(updatedStats);
        setPhase("summary");
        setIsChecking(false);
      }
    }, 1500);
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
    setWordVisible(true);
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
    localStorage.setItem("totalCorrected", "0");
    localStorage.setItem("yesterdayMistakes", "[]");

    setSessionDay(1);
    setStats({
      totalCorrect: 0,
      totalCorrected: 0,
      totalIncorrect: 0,
    });
    setUsedWords([]);
    setYesterdayMistakes([]);
    
    setShowResetConfirm(false);
    setupTodayPractice([]);
  };

  return (
    <div id="spelling-app-root" className="min-h-screen w-full flex-col sm:flex-row flex sm:justify-center items-stretch sm:items-start sm:px-4 select-none" style={{ minHeight: "100dvh", fontFamily: "var(--font-nunito)", paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div id="spelling-container" className="flex-1 sm:flex-none p-6 sm:p-10 sm:py-16 sm:rounded-3xl max-w-lg w-full shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] sm:border sm:border-[#DED8CF]/50" style={{ position: "relative", zIndex: 1 }}>
        
        {/* Render Header */}
        <Header sessionDay={sessionDay} stats={stats} />

        {/* Render Active Stage Screen Phase */}
        {phase === "review" && (
          <YesterdayMistakes
            words={yesterdayMistakes}
            onStartPractice={handleStartPracticeDirect}
          />
        )}

        {phase === "practice" && dailyWords.length > 0 && (
          <PracticeSection
            word={dailyWords[currentWordIndex]}
            currentIndex={currentWordIndex}
            totalWords={dailyWords.length}
            wordVisible={wordVisible}
            onToggleWordVisibility={handleToggleWordVisibility}
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

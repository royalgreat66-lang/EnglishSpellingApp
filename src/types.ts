export interface Stats {
  totalCorrect: number;
  totalIncorrect: number;
}

export type AppPhase = "review" | "practice" | "summary";

export interface ResultFeedback {
  status: "correct" | "incorrect" | "empty";
  text: string;
}

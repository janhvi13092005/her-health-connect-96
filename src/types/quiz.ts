
// Types for the symptom quiz
export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  category: "general" | "breast-cancer" | "pcod" | "pcos";
  multiSelect?: boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  riskFactor?: number; // Higher numbers indicate higher risk
}

export interface QuizResult {
  date: string;
  overallRiskLevel: "Low Risk" | "Medium Risk" | "High Risk" | "Needs Further Check";
  categoryResults: {
    [key: string]: {
      riskLevel: "Low Risk" | "Medium Risk" | "High Risk" | "Needs Further Check";
      score: number;
    };
  };
  recommendations: string[];
}

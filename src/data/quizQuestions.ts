
import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  // General Questions
  {
    id: 1,
    question: "What is your age?",
    category: "general",
    options: [
      { id: "1a", text: "Under 30", riskFactor: 1 },
      { id: "1b", text: "30-40", riskFactor: 2 },
      { id: "1c", text: "41-50", riskFactor: 3 },
      { id: "1d", text: "Over 50", riskFactor: 4 },
    ],
  },
  {
    id: 2,
    question: "Do you have a family history of breast cancer, PCOD, or PCOS?",
    category: "general",
    multiSelect: true,
    options: [
      { id: "2a", text: "Family history of breast cancer", riskFactor: 3 },
      { id: "2b", text: "Family history of PCOD", riskFactor: 2 },
      { id: "2c", text: "Family history of PCOS", riskFactor: 2 },
      { id: "2d", text: "No family history of these conditions", riskFactor: 0 },
    ],
  },
  {
    id: 3,
    question: "How would you describe your current weight?",
    category: "general",
    options: [
      { id: "3a", text: "Underweight", riskFactor: 1 },
      { id: "3b", text: "Normal weight", riskFactor: 0 },
      { id: "3c", text: "Slightly overweight", riskFactor: 1 },
      { id: "3d", text: "Significantly overweight", riskFactor: 2 },
    ],
  },
  
  // Breast Cancer Questions
  {
    id: 4,
    question: "Have you noticed any changes in the appearance of your breasts?",
    category: "breast-cancer",
    multiSelect: true,
    options: [
      { id: "4a", text: "Dimpling or puckering of the skin", riskFactor: 4 },
      { id: "4b", text: "Redness or scaling of nipple or breast skin", riskFactor: 4 },
      { id: "4c", text: "Nipple discharge other than breast milk", riskFactor: 3 },
      { id: "4d", text: "Change in size or shape of the breast", riskFactor: 3 },
      { id: "4e", text: "No changes noticed", riskFactor: 0 },
    ],
  },
  {
    id: 5,
    question: "Have you felt any lumps or thickening in your breast or underarm area?",
    category: "breast-cancer",
    options: [
      { id: "5a", text: "Yes, in the breast", riskFactor: 5 },
      { id: "5b", text: "Yes, in the underarm area", riskFactor: 4 },
      { id: "5c", text: "Yes, in both areas", riskFactor: 5 },
      { id: "5d", text: "No", riskFactor: 0 },
    ],
  },
  {
    id: 6,
    question: "How frequently do you perform breast self-examinations?",
    category: "breast-cancer",
    options: [
      { id: "6a", text: "Monthly", riskFactor: 0 },
      { id: "6b", text: "Every few months", riskFactor: 1 },
      { id: "6c", text: "Rarely", riskFactor: 2 },
      { id: "6d", text: "Never", riskFactor: 3 },
    ],
  },
  {
    id: 7,
    question: "When was your last mammogram or breast ultrasound?",
    category: "breast-cancer",
    options: [
      { id: "7a", text: "Within the last year", riskFactor: 0 },
      { id: "7b", text: "1-2 years ago", riskFactor: 1 },
      { id: "7c", text: "More than 2 years ago", riskFactor: 2 },
      { id: "7d", text: "Never had one", riskFactor: 3 },
    ],
  },
  
  // PCOD Questions
  {
    id: 8,
    question: "How would you describe your menstrual cycle?",
    category: "pcod",
    options: [
      { id: "8a", text: "Regular (every 21-35 days)", riskFactor: 0 },
      { id: "8b", text: "Somewhat irregular", riskFactor: 2 },
      { id: "8c", text: "Very irregular or unpredictable", riskFactor: 4 },
      { id: "8d", text: "Absent for extended periods", riskFactor: 5 },
    ],
  },
  {
    id: 9,
    question: "Do you experience unusually heavy bleeding during periods?",
    category: "pcod",
    options: [
      { id: "9a", text: "Yes, regularly", riskFactor: 4 },
      { id: "9b", text: "Sometimes", riskFactor: 2 },
      { id: "9c", text: "Rarely", riskFactor: 1 },
      { id: "9d", text: "No", riskFactor: 0 },
    ],
  },
  {
    id: 10,
    question: "Have you noticed increased hair growth on face, chest, or back?",
    category: "pcod",
    options: [
      { id: "10a", text: "Yes, significant increase", riskFactor: 4 },
      { id: "10b", text: "Yes, slight increase", riskFactor: 3 },
      { id: "10c", text: "No change", riskFactor: 0 },
      { id: "10d", text: "Not applicable", riskFactor: 0 },
    ],
  },
  {
    id: 11,
    question: "Do you experience acne that worsens around your period?",
    category: "pcod",
    options: [
      { id: "11a", text: "Yes, severe acne", riskFactor: 3 },
      { id: "11b", text: "Yes, moderate acne", riskFactor: 2 },
      { id: "11c", text: "Yes, mild acne", riskFactor: 1 },
      { id: "11d", text: "No", riskFactor: 0 },
    ],
  },
  
  // PCOS Questions
  {
    id: 12,
    question: "Have you been diagnosed with or suspect insulin resistance?",
    category: "pcos",
    options: [
      { id: "12a", text: "Yes, diagnosed", riskFactor: 5 },
      { id: "12b", text: "Suspect but not diagnosed", riskFactor: 3 },
      { id: "12c", text: "No", riskFactor: 0 },
      { id: "12d", text: "Don't know", riskFactor: 1 },
    ],
  },
  {
    id: 13,
    question: "Have you experienced rapid weight gain, especially around the abdomen?",
    category: "pcos",
    options: [
      { id: "13a", text: "Yes, significant weight gain", riskFactor: 4 },
      { id: "13b", text: "Yes, moderate weight gain", riskFactor: 3 },
      { id: "13c", text: "Yes, slight weight gain", riskFactor: 2 },
      { id: "13d", text: "No", riskFactor: 0 },
    ],
  },
  {
    id: 14,
    question: "Do you experience skin tags (small growth of skin) or darkening of skin in neck folds or armpits?",
    category: "pcos",
    options: [
      { id: "14a", text: "Yes, both", riskFactor: 4 },
      { id: "14b", text: "Yes, skin tags", riskFactor: 2 },
      { id: "14c", text: "Yes, skin darkening", riskFactor: 2 },
      { id: "14d", text: "No", riskFactor: 0 },
    ],
  },
  {
    id: 15,
    question: "Have you been trying to conceive without success for more than 12 months?",
    category: "pcos",
    options: [
      { id: "15a", text: "Yes", riskFactor: 4 },
      { id: "15b", text: "No, but concerned about fertility", riskFactor: 2 },
      { id: "15c", text: "No, not trying to conceive", riskFactor: 0 },
      { id: "15d", text: "Prefer not to answer", riskFactor: 0 },
    ],
  },
];

export const getGeneralQuestions = () => {
  return quizQuestions.filter(q => q.category === "general");
};

export const getBreastCancerQuestions = () => {
  return quizQuestions.filter(q => q.category === "breast-cancer");
};

export const getPCODQuestions = () => {
  return quizQuestions.filter(q => q.category === "pcod");
};

export const getPCOSQuestions = () => {
  return quizQuestions.filter(q => q.category === "pcos");
};

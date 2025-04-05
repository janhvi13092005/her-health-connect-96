
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import { 
  quizQuestions, 
  getGeneralQuestions,
  getBreastCancerQuestions,
  getPCODQuestions,
  getPCOSQuestions
} from "@/data/quizQuestions";
import { QuizQuestion, QuizOption, QuizResult } from "@/types/quiz";
import { useAuth } from "@/context/AuthContext";

const SymptomQuizPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string[] }>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Organize questions by section
  const generalQuestions = getGeneralQuestions();
  const breastCancerQuestions = getBreastCancerQuestions();
  const pcodQuestions = getPCODQuestions();
  const pcosQuestions = getPCOSQuestions();
  
  // Combined questions for the quiz
  const allQuestions = [
    ...generalQuestions,
    ...breastCancerQuestions,
    ...pcodQuestions,
    ...pcosQuestions
  ];
  
  const currentQuestion = allQuestions[currentStep];
  const progress = (currentStep / allQuestions.length) * 100;

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentStep(0);
    setSelectedAnswers({});
    setQuizResult(null);
  };

  const handleAnswerSelect = (questionId: number, optionId: string, isMultiSelect: boolean = false) => {
    setSelectedAnswers((prev) => {
      // For single select questions, replace the answer
      if (!isMultiSelect) {
        return { ...prev, [questionId]: [optionId] };
      }
      
      // For multi-select questions, toggle the selection
      const currentSelections = prev[questionId] || [];
      const updatedSelections = currentSelections.includes(optionId)
        ? currentSelections.filter(id => id !== optionId)
        : [...currentSelections, optionId];
        
      return { ...prev, [questionId]: updatedSelections };
    });
  };

  const isOptionSelected = (questionId: number, optionId: string) => {
    return (selectedAnswers[questionId] || []).includes(optionId);
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQuestion.id] || selectedAnswers[currentQuestion.id].length === 0) {
      toast({
        title: "Please answer the question",
        description: "Select at least one option to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      evaluateQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const evaluateQuiz = () => {
    // Calculate scores for each category
    const scores = {
      general: 0,
      "breast-cancer": 0,
      pcod: 0,
      pcos: 0
    };
    
    const maxScores = {
      general: 0,
      "breast-cancer": 0,
      pcod: 0,
      pcos: 0
    };
    
    // Calculate maximum possible scores per category
    allQuestions.forEach(question => {
      const category = question.category;
      let categoryMaxScore = 0;
      
      if (question.multiSelect) {
        // For multi-select, sum the highest risk factors
        const sortedOptions = [...question.options].sort((a, b) => 
          (b.riskFactor || 0) - (a.riskFactor || 0)
        );
        // Add the highest risk factors (assuming user selects all high-risk options)
        sortedOptions.forEach(option => {
          if (option.riskFactor && option.riskFactor > 0) {
            categoryMaxScore += option.riskFactor;
          }
        });
      } else {
        // For single-select, take the highest risk factor
        const maxRiskFactor = Math.max(...question.options.map(opt => opt.riskFactor || 0));
        categoryMaxScore = maxRiskFactor;
      }
      
      maxScores[category as keyof typeof maxScores] += categoryMaxScore;
    });
    
    // Calculate user scores
    Object.entries(selectedAnswers).forEach(([questionIdStr, selectedOptionIds]) => {
      const questionId = parseInt(questionIdStr);
      const question = allQuestions.find(q => q.id === questionId);
      
      if (!question) return;
      
      const category = question.category;
      
      selectedOptionIds.forEach(optionId => {
        const option = question.options.find(opt => opt.id === optionId);
        if (option && option.riskFactor) {
          scores[category as keyof typeof scores] += option.riskFactor;
        }
      });
    });
    
    // Determine risk levels for each category
    const categoryResults: { [key: string]: { riskLevel: "Low Risk" | "Medium Risk" | "High Risk" | "Needs Further Check"; score: number } } = {};
    
    Object.entries(scores).forEach(([category, score]) => {
      const maxScore = maxScores[category as keyof typeof maxScores];
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      
      let riskLevel: "Low Risk" | "Medium Risk" | "High Risk" | "Needs Further Check";
      
      if (percentage < 30) {
        riskLevel = "Low Risk";
      } else if (percentage < 60) {
        riskLevel = "Medium Risk";
      } else if (percentage < 80) {
        riskLevel = "High Risk";
      } else {
        riskLevel = "Needs Further Check";
      }
      
      categoryResults[category] = { riskLevel, score };
    });
    
    // Determine overall risk level (take the highest risk level)
    const riskLevels = ["Low Risk", "Medium Risk", "High Risk", "Needs Further Check"];
    let highestRiskIndex = 0;
    
    Object.values(categoryResults).forEach(result => {
      const resultIndex = riskLevels.indexOf(result.riskLevel);
      if (resultIndex > highestRiskIndex) {
        highestRiskIndex = resultIndex;
      }
    });
    
    const overallRiskLevel = riskLevels[highestRiskIndex] as "Low Risk" | "Medium Risk" | "High Risk" | "Needs Further Check";
    
    // Generate recommendations based on risk levels
    const recommendations: string[] = [];
    
    if (categoryResults["breast-cancer"].riskLevel === "High Risk" || categoryResults["breast-cancer"].riskLevel === "Needs Further Check") {
      recommendations.push("Schedule a mammogram or breast ultrasound as soon as possible");
      recommendations.push("Consult with a breast specialist for a comprehensive examination");
    } else if (categoryResults["breast-cancer"].riskLevel === "Medium Risk") {
      recommendations.push("Ensure regular breast self-examinations");
      recommendations.push("Schedule a routine breast screening with your healthcare provider");
    }
    
    if (categoryResults["pcod"].riskLevel === "High Risk" || categoryResults["pcod"].riskLevel === "Needs Further Check" || 
        categoryResults["pcos"].riskLevel === "High Risk" || categoryResults["pcos"].riskLevel === "Needs Further Check") {
      recommendations.push("Consult with an endocrinologist or gynecologist for hormone level testing");
      recommendations.push("Consider an ultrasound to check for ovarian cysts");
    } else if (categoryResults["pcod"].riskLevel === "Medium Risk" || categoryResults["pcos"].riskLevel === "Medium Risk") {
      recommendations.push("Monitor your menstrual cycle and any symptoms");
      recommendations.push("Discuss hormonal health with your doctor at your next check-up");
    }
    
    if (overallRiskLevel === "Needs Further Check") {
      recommendations.push("Connect with a doctor on DocTalk for immediate guidance");
    }
    
    // Create result object
    const result: QuizResult = {
      date: new Date().toISOString(),
      overallRiskLevel,
      categoryResults,
      recommendations
    };
    
    // Save result (if user is logged in)
    if (user) {
      const savedResults = JSON.parse(localStorage.getItem(`doctalk-quiz-results-${user.id}`) || "[]");
      savedResults.push(result);
      localStorage.setItem(`doctalk-quiz-results-${user.id}`, JSON.stringify(savedResults));
    }
    
    setQuizResult(result);
  };

  const renderRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low Risk":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "Medium Risk":
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      case "High Risk":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case "Needs Further Check":
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default:
        return null;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low Risk":
        return "text-green-500";
      case "Medium Risk":
        return "text-amber-500";
      case "High Risk":
        return "text-red-500";
      case "Needs Further Check":
        return "text-red-600";
      default:
        return "";
    }
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center font-gradient">
                Women's Health Symptom Quiz
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Answer a few questions to assess your risk levels for breast cancer, PCOD, and PCOS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-doctalk-lightGray dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">What to expect:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-doctalk-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span>15 questions about your symptoms and health history</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-doctalk-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span>Personalized risk assessment for breast cancer, PCOD, and PCOS</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-doctalk-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span>Recommendations based on your answers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-doctalk-purple mr-2 mt-0.5 flex-shrink-0" />
                    <span>Option to discuss results with a healthcare professional</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>
                    This quiz is for informational purposes only and does not replace medical advice.
                    Always consult with a healthcare professional for proper diagnosis and treatment.
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button size="lg" className="button-gradient" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold font-gradient">Your Results</CardTitle>
              <CardDescription className="text-lg">
                Based on your answers, we've assessed your risk levels for different health concerns.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Risk */}
              <div className={`p-6 rounded-lg border ${
                quizResult.overallRiskLevel === "Low Risk" ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800" :
                quizResult.overallRiskLevel === "Medium Risk" ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800" :
                "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Overall Risk Assessment</h3>
                  <div className="flex items-center">
                    {renderRiskLevelIcon(quizResult.overallRiskLevel)}
                    <span className={`ml-2 font-semibold ${getRiskLevelColor(quizResult.overallRiskLevel)}`}>
                      {quizResult.overallRiskLevel}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {quizResult.overallRiskLevel === "Low Risk" && 
                    "Based on your responses, your risk factors appear to be low. Continue with regular check-ups and health monitoring."}
                  {quizResult.overallRiskLevel === "Medium Risk" && 
                    "Your responses indicate some risk factors that should be monitored. Consider discussing these with a healthcare provider."}
                  {quizResult.overallRiskLevel === "High Risk" && 
                    "Your responses indicate several risk factors that should be evaluated by a healthcare professional soon."}
                  {quizResult.overallRiskLevel === "Needs Further Check" && 
                    "Your responses indicate significant risk factors that require prompt evaluation by a healthcare professional."}
                </p>
              </div>
              
              {/* Category Results */}
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(quizResult.categoryResults).map(([category, result]) => {
                  if (category === "general") return null;
                  
                  const displayCategory = 
                    category === "breast-cancer" ? "Breast Cancer" : 
                    category === "pcod" ? "PCOD" : "PCOS";
                    
                  return (
                    <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{displayCategory}</h4>
                        <div className="flex items-center">
                          {renderRiskLevelIcon(result.riskLevel)}
                          <span className={`ml-2 text-sm font-medium ${getRiskLevelColor(result.riskLevel)}`}>
                            {result.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Recommendations */}
              <div className="bg-doctalk-lightGray dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {quizResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-doctalk-purple mr-2 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>
                    These results are based on your responses and are for informational purposes only.
                    They do not constitute a medical diagnosis. Please consult with a qualified healthcare 
                    professional for proper evaluation and advice.
                  </span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/doctor-connect")}>
                Connect with a Doctor
              </Button>
              <Button onClick={() => handleStartQuiz()}>
                Take Quiz Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-gray-500">
                Question {currentStep + 1} of {allQuestions.length}
              </h2>
              <span className="text-sm font-medium text-gray-500">
                {currentQuestion.category === "general" ? "General Health" :
                 currentQuestion.category === "breast-cancer" ? "Breast Health" :
                 currentQuestion.category === "pcod" ? "PCOD" : "PCOS"}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <CardTitle className="text-xl mt-4">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.multiSelect ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option: QuizOption) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id} 
                      checked={isOptionSelected(currentQuestion.id, option.id)}
                      onCheckedChange={() => handleAnswerSelect(currentQuestion.id, option.id, true)} 
                    />
                    <Label 
                      htmlFor={option.id}
                      className="text-base cursor-pointer flex-grow"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup 
                value={selectedAnswers[currentQuestion.id]?.[0] || ""}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option: QuizOption) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem id={option.id} value={option.id} />
                    <Label 
                      htmlFor={option.id}
                      className="text-base cursor-pointer flex-grow"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="flex items-center"
            >
              {currentStep < allQuestions.length - 1 ? (
                <>
                  Next
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SymptomQuizPage;

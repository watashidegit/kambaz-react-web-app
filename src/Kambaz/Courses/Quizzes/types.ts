export const questionTypes = ["Multiple Choice", "True/False", "Fill in the Blank"] as const;


export type QuestionType = typeof questionTypes[number];


export interface Question {
    _id?: string;
    type: string;
    title?: string;
    questionText: string;
    points: number;
    options?: string[];
    correctAnswer?: number | string; // multiple choice: index, true/false: "true"/"false"
    correctAnswers?: string[];       // for fill in the blank
    caseSensitive?: boolean;
  }

export type QuizType = {
    _id?: string;
    course: string;
    title: string;
    description?: string;
    questions: Question[];
    dueDate?: string;
    timeLimit?: number;
    assignmentGroup?: string;
    quizType?: string;
    attempts?: number;
    multipleAttempts?: boolean;
    shuffleAnswers?: boolean;
    availableFrom?: string;
    availableUntil?: string;
    published?: boolean;
    points?: number;
    oneQuestionAtATime?: boolean;
    webcamRequired?: boolean;
    lockQuestionsAfterAnswering?: boolean;
    showCorrectAnswers?: boolean;
}

export interface QuizAttempt {
    _id?: string;
    quizId: string;
    userId: string;
    answers: Record<string, any>;
    score: number;
    percentageScore?: number;
    submittedAt: string;
    isPreview?: boolean;
}
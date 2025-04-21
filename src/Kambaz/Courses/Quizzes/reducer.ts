import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Quiz {
  _id?: string;
  title: string;
  course: string;
  availableDate?: string;
  untilDate?: string;
  dueDate?: string;
  published?: boolean;
  points?: number;
  questionsCount?: number;
  score?: number | null;
  description?: String;
  quizType: String;
  assignmentGroup: String;
  shuffleAnswer: Boolean;
  timeLimit: Number;
  multipleAttempts: Boolean;
  attempts: number;
  availableFrom: String;
  availableUntil: String;
  oneQuestionAtATime: Boolean;
  webcamRequired: Boolean;
  lockQuestionsAfterAnswering: Boolean;
  showCorrectAnswers: Boolean;
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
};

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },
    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },
    updateQuiz(state, action: PayloadAction<Quiz>) {
      const index = state.quizzes.findIndex(q => q._id === action.payload._id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    },
    deleteQuiz(state, action: PayloadAction<string>) {
      state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
    },
    setCurrentQuiz(state, action: PayloadAction<Quiz | null>) {
      state.currentQuiz = action.payload;
    },
  },
});

export const { setQuizzes, addQuiz, updateQuiz, deleteQuiz, setCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;

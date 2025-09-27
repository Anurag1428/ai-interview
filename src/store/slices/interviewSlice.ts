import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number; // in seconds
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  questions: Question[];
  currentQuestionIndex: number;
  isActive: boolean;
  isPaused: boolean;
  startTime?: string;
  endTime?: string;
  totalTimeSpent: number;
}

interface InterviewState {
  currentSession: InterviewSession | null;
  questions: Question[];
  isGeneratingQuestions: boolean;
  timer: {
    isActive: boolean;
    timeRemaining: number;
    questionId: string | null;
  };
}

const initialState: InterviewState = {
  currentSession: null,
  questions: [],
  isGeneratingQuestions: false,
  timer: {
    isActive: false,
    timeRemaining: 0,
    questionId: null,
  },
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startInterview: (state, action: PayloadAction<{ candidateId: string; questions: Question[] }>) => {
      const { candidateId, questions } = action.payload;
      state.currentSession = {
        id: Date.now().toString(),
        candidateId,
        questions,
        currentQuestionIndex: 0,
        isActive: true,
        isPaused: false,
        startTime: new Date().toISOString(),
        totalTimeSpent: 0,
      };
      state.questions = questions;
    },
    nextQuestion: (state) => {
      if (state.currentSession && state.currentSession.currentQuestionIndex < state.questions.length - 1) {
        state.currentSession.currentQuestionIndex += 1;
      }
    },
    pauseInterview: (state) => {
      if (state.currentSession) {
        state.currentSession.isPaused = true;
        state.timer.isActive = false;
      }
    },
    resumeInterview: (state) => {
      if (state.currentSession) {
        state.currentSession.isPaused = false;
        state.timer.isActive = true;
      }
    },
    endInterview: (state) => {
      if (state.currentSession) {
        state.currentSession.isActive = false;
        state.currentSession.endTime = new Date().toISOString();
        state.timer.isActive = false;
      }
    },
    setTimer: (state, action: PayloadAction<{ timeRemaining: number; questionId: string }>) => {
      state.timer = {
        isActive: true,
        timeRemaining: action.payload.timeRemaining,
        questionId: action.payload.questionId,
      };
    },
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timer.timeRemaining = action.payload;
      if (action.payload <= 0) {
        state.timer.isActive = false;
      }
    },
    stopTimer: (state) => {
      state.timer.isActive = false;
      state.timer.timeRemaining = 0;
      state.timer.questionId = null;
    },
    setGeneratingQuestions: (state, action: PayloadAction<boolean>) => {
      state.isGeneratingQuestions = action.payload;
    },
    restoreSession: (state, action: PayloadAction<InterviewSession>) => {
      state.currentSession = action.payload;
      state.questions = action.payload.questions;
    },
  },
});

export const {
  startInterview,
  nextQuestion,
  pauseInterview,
  resumeInterview,
  endInterview,
  setTimer,
  updateTimer,
  stopTimer,
  setGeneratingQuestions,
  restoreSession,
} = interviewSlice.actions;

export default interviewSlice.reducer;


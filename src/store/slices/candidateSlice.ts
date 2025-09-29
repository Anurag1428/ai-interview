import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  resumeText?: string;
  interviewStatus: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  answers: Answer[];
  finalScore?: number;
  summary?: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Answer {
  questionId: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number;
  score?: number;
  feedback?: string;
}

interface CandidateState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  currentCandidate: null,
  loading: false,
  error: null,
};

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Omit<Candidate, 'id' | 'createdAt' | 'lastActiveAt'>>) => {
      const newCandidate: Candidate = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      state.candidates.push(newCandidate);
      state.currentCandidate = newCandidate;
    },
    updateCandidate: (state, action: PayloadAction<{ id: string; updates: Partial<Candidate> }>) => {
      const { id, updates } = action.payload;
      const candidateIndex = state.candidates.findIndex(c => c.id === id);
      if (candidateIndex !== -1) {
        state.candidates[candidateIndex] = {
          ...state.candidates[candidateIndex],
          ...updates,
          lastActiveAt: new Date().toISOString(),
        };
        if (state.currentCandidate?.id === id) {
          state.currentCandidate = state.candidates[candidateIndex];
        }
      }
    },
    setCurrentCandidate: (state, action: PayloadAction<string>) => {
      if (action.payload === '') {
        state.currentCandidate = null;
      } else {
        const candidate = state.candidates.find(c => c.id === action.payload);
        state.currentCandidate = candidate || null;
      }
    },
    addAnswer: (state, action: PayloadAction<{ candidateId: string; answer: Answer }>) => {
      const { candidateId, answer } = action.payload;
      const candidateIndex = state.candidates.findIndex(c => c.id === candidateId);
      if (candidateIndex !== -1) {
        const existingAnswerIndex = state.candidates[candidateIndex].answers.findIndex(
          a => a.questionId === answer.questionId
        );
        if (existingAnswerIndex !== -1) {
          state.candidates[candidateIndex].answers[existingAnswerIndex] = answer;
        } else {
          state.candidates[candidateIndex].answers.push(answer);
        }
        state.candidates[candidateIndex].lastActiveAt = new Date().toISOString();
        
        if (state.currentCandidate?.id === candidateId) {
          state.currentCandidate = state.candidates[candidateIndex];
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addCandidate,
  updateCandidate,
  setCurrentCandidate,
  addAnswer,
  setLoading,
  setError,
  clearError,
} = candidateSlice.actions;

export default candidateSlice.reducer;


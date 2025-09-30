import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTab: 'interviewee' | 'interviewer';
  showWelcomeBackModal: boolean;
  showResumeUploadModal: boolean;
  chatMessages: ChatMessage[];
  isTyping: boolean;
  currentDraftAnswer: string;
  draftAnswerQuestionId: string | null;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    questionId?: string;
    difficulty?: string;
    timeRemaining?: number;
  };
}

const initialState: UIState = {
  activeTab: 'interviewee',
  showWelcomeBackModal: false,
  showResumeUploadModal: false,
  chatMessages: [],
  isTyping: false,
  currentDraftAnswer: '',
  draftAnswerQuestionId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'interviewee' | 'interviewer'>) => {
      state.activeTab = action.payload;
    },
    setWelcomeBackModal: (state, action: PayloadAction<boolean>) => {
      state.showWelcomeBackModal = action.payload;
    },
    setResumeUploadModal: (state, action: PayloadAction<boolean>) => {
      state.showResumeUploadModal = action.payload;
    },
    addChatMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      const message: ChatMessage = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.chatMessages.push(message);
    },
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    updateLastMessage: (state, action: PayloadAction<Partial<ChatMessage>>) => {
      if (state.chatMessages.length > 0) {
        const lastMessage = state.chatMessages[state.chatMessages.length - 1];
        Object.assign(lastMessage, action.payload);
      }
    },
    setDraftAnswer: (state, action: PayloadAction<{ answer: string; questionId: string }>) => {
      state.currentDraftAnswer = action.payload.answer;
      state.draftAnswerQuestionId = action.payload.questionId;
    },
    clearDraftAnswer: (state) => {
      state.currentDraftAnswer = '';
      state.draftAnswerQuestionId = null;
    },
  },
});

export const {
  setActiveTab,
  setWelcomeBackModal,
  setResumeUploadModal,
  addChatMessage,
  clearChatMessages,
  setTyping,
  updateLastMessage,
  setDraftAnswer,
  clearDraftAnswer,
} = uiSlice.actions;

export default uiSlice.reducer;


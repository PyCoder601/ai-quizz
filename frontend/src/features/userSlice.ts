import type { QuizType, UserType } from '../types.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: UserType | null;
  quizzes: QuizType[] | null;
  curr_quiz: QuizType | null;
  quota: number;
}

const initialState: UserState = {
  user: null,
  quizzes: [],
  curr_quiz: null,
  quota: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.quizzes = action.payload.quizzes;
      state.quota = action.payload.quota;
    },
    setCurrentQuiz: (state, action: PayloadAction<QuizType | null>) => {
      state.curr_quiz = action.payload;
    },
    addQuiz: (state, action: PayloadAction<QuizType>) => {
      state.quizzes?.push(action.payload);
    },
    decrementQuota: (state) => {
      state.quota = state.quota > 0 ? state.quota - 1 : 0;
    },
  },
});

export const { loginUser, setCurrentQuiz, addQuiz, decrementQuota } =
  userSlice.actions;

export const selectQuizzes = (state: { user: UserState }) => {
  return state.user.quizzes;
};

export const selectUser = (state: { user: UserState }) => {
  return state.user.quizzes;
};

export const selectCurrQuiz = (state: { user: UserState }) => {
  return state.user.curr_quiz;
};

export const selectQuota = (state: { user: UserState }) => {
  return state.user.quota;
};

export default userSlice.reducer;

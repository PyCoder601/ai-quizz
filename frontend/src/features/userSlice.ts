import type { QuizType, UserType } from '../types.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: UserType | null;
  quizzes: QuizType[] | null;
  curr_quiz: QuizType | null;
}

const initialState: UserState = {
  user: null,
  quizzes: [],
  curr_quiz: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.quizzes = action.payload.quizzes;
    },
    setCurrentQuiz: (state, action: PayloadAction<QuizType | null>) => {
      state.curr_quiz = action.payload;
    },
    addQuiz: (state, action: PayloadAction<QuizType>) => {
      state.quizzes?.push(action.payload);
    },
  },
});

export const { loginUser, setCurrentQuiz, addQuiz } = userSlice.actions;

export const selectQuizzes = (state: { user: UserState }) => {
  return state.user.quizzes;
};

export const selectUser = (state: { user: UserState }) => {
  return state.user.quizzes;
};

export const selectCurrQuiz = (state: { user: UserState }) => {
  return state.user.curr_quiz;
};

export default userSlice.reducer;

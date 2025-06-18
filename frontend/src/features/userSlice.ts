import type { QuizType, UserType } from '../types.ts';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: UserType | null;
  quizzes: QuizType[] | null;
}

const initialState: UserState = {
  user: null,
  quizzes: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.quizzes = action.payload.quizzes;
    },
  },
});

export const { loginUser } = userSlice.actions;

export const selectQuizzes = (state: UserState) => {
  return state.quizzes;
};

export const selectUser = (state: UserState) => {
  return state.user;
};

export default userSlice.reducer;

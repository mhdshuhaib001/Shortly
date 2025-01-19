import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../service/api';

export const loginUser = createAsyncThunk(
  'user/login',
  async (googleToken) => {
    const response = await apiService.auth.login(googleToken);
    return {
      user: response.data.user,
      token: response.data.token
    };
  }
);

const initialState = {
  user: {
    id: null,
    name: null,
    email: null,
    picture: null,
  },
  token: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = initialState.user;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;

export default userSlice.reducer;
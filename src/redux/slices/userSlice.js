import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.admin = action.payload;
    },
    clearUser: (state) => {
      state.admin = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
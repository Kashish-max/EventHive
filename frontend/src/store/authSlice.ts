import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface AuthState {
  authState: boolean;
  user: any;
  open: boolean;
  search: string;
  defaultTab: string;
  update: boolean;
}

// Initial state
const initialState: AuthState = {
  authState: false,
  user: null,
  open: false,
  search: "",
  defaultTab: "hackathons",
  update: false, 
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setOpen(state, action) {
      state.open = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setDefaultTab(state, action) {
      state.defaultTab = action.payload;
    },
    setUpdate(state, action) {
      state.update = action.payload;
    }
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setAuthState, setUser, setOpen, setSearch, setDefaultTab, setUpdate } = authSlice.actions;
export const selectAuthState = (state: AppState) => state.auth.authState;
export const selectUser = (state: AppState) => state.auth.user;
export const selectOpen = (state: AppState) => state.auth.open;
export const selectSearch = (state: AppState) => state.auth.search;
export const selectDefaultTab = (state: AppState) => state.auth.defaultTab;
export const selectUpdate = (state: AppState) => state.auth.update;
export default authSlice.reducer;

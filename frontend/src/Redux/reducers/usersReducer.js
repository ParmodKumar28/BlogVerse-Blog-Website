// User state management — auth and profile
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import userService from "../../api/userService";

// Sign up
export const signUpAsync = createAsyncThunk(
  "users/signup",
  async ({ email, username, password }, { rejectWithValue }) => {
    try {
      return await userService.signUp({ email, username, password });
    } catch (error) {
      const msg = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Login
export const loginAsync = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await userService.login({ email, password });
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Logout
export const logoutAsync = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.logout();
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      return rejectWithValue("Logout failed");
    }
  }
);

// Restore session using JWT token from localStorage (sent via Authorization header)
// Called once on app mount — if the token is valid, the server returns the user.
export const fetchCurrentUserAsync = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getMe();
    } catch (error) {
      // Pass the HTTP status so the rejected handler can distinguish auth errors
      // from transient network failures
      const status = error?.response?.status ?? null;
      return rejectWithValue(status);
    }
  }
);

// Update profile (username and/or profile picture)
export const updateProfileAsync = createAsyncThunk(
  "users/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(formData);
    } catch (error) {
      const msg = error.response?.data?.error || "Profile update failed.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// Initial State — restores token and isSignIn flag from localStorage
const INITIAL_STATE = {
  isSignIn: Boolean(localStorage.getItem("token")),
  token: localStorage.getItem("token") || "",
  signedUser: null,   // null = unknown, {} = confirmed logged out
  signUpLoading: false,
  loginLoading: false,
  profileLoading: false,
  sessionRestored: false, // true once /me call completes (success or failure)
};

const usersSlice = createSlice({
  name: "users",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {

    // Sign up
    builder.addCase(signUpAsync.pending, (state) => { state.signUpLoading = true; });
    builder.addCase(signUpAsync.fulfilled, (state) => {
      state.signUpLoading = false;
      toast.success("Registered! You can now log in.");
    });
    builder.addCase(signUpAsync.rejected, (state) => { state.signUpLoading = false; });

    // Login
    builder.addCase(loginAsync.pending, (state) => { state.loginLoading = true; });
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.loginLoading = false;
      if (action.payload && action.payload.token) {
        state.token = action.payload.token;
        state.signedUser = action.payload.user;
        state.isSignIn = true;
        state.sessionRestored = true;
        localStorage.setItem("token", action.payload.token);
        toast.success("Login Successful!");
      } else {
        state.token = "";
        state.signedUser = null;
        state.isSignIn = false;
        toast.error("Invalid response from server. Please check your API URL configuration.");
      }
    });
    builder.addCase(loginAsync.rejected, (state) => { state.loginLoading = false; });

    // Logout
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.isSignIn = false;
      state.token = "";
      state.signedUser = null;
      state.sessionRestored = true;
      localStorage.removeItem("token");
      toast.success("Logged out successfully!");
    });

    // Restore session via /me — called silently on app mount
    builder.addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.signedUser = action.payload.user;
        state.isSignIn = true;
        state.sessionRestored = true;
      } else {
        state.signedUser = null;
        state.isSignIn = false;
        state.sessionRestored = true;
        localStorage.removeItem("token");
      }
    });
    builder.addCase(fetchCurrentUserAsync.rejected, (state, action) => {
      // Only wipe the token if the server explicitly rejected it (401 Unauthorized).
      // For network errors or server timeouts (null status), keep the token so the
      // user isn't silently logged out due to a transient failure on first load.
      const httpStatus = action.payload;
      if (httpStatus === 401 || httpStatus === 403) {
        state.signedUser = null;
        state.isSignIn = false;
        localStorage.removeItem("token");
      }
      // Always mark session as restored so the app can continue rendering
      state.sessionRestored = true;
    });

    // Update profile
    builder.addCase(updateProfileAsync.pending, (state) => { state.profileLoading = true; });
    builder.addCase(updateProfileAsync.fulfilled, (state, action) => {
      state.profileLoading = false;
      state.signedUser = action.payload.user;
      toast.success("Profile updated successfully!");
    });
    builder.addCase(updateProfileAsync.rejected, (state) => { state.profileLoading = false; });
  },
});

export const usersReducer = usersSlice.reducer;
export const usersSelector = (state) => state.usersReducer;

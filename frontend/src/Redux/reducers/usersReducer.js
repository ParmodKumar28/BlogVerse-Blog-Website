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

// Restore session from the httpOnly refresh cookie (also mints a fresh access cookie)
// Called once on app mount — if the cookie is valid, the server returns the user.
export const fetchCurrentUserAsync = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.refresh();
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

// Initial State — auth now lives in httpOnly cookies, so we start signed-out
// and let the session-restore call (on app mount) decide the real state.
const INITIAL_STATE = {
  isSignIn: false,
  signedUser: null,   // null = unknown, object = confirmed user
  signUpLoading: false,
  loginLoading: false,
  profileLoading: false,
  sessionRestored: false, // true once the refresh/me call completes (success or failure)
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
      if (action.payload && action.payload.user) {
        // Server set the httpOnly auth cookies; we only keep the user in memory
        state.signedUser = action.payload.user;
        state.isSignIn = true;
        state.sessionRestored = true;
        toast.success("Login Successful!");
      } else {
        state.signedUser = null;
        state.isSignIn = false;
        toast.error("Invalid response from server. Please check your API URL configuration.");
      }
    });
    builder.addCase(loginAsync.rejected, (state) => { state.loginLoading = false; });

    // Logout
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.isSignIn = false;
      state.signedUser = null;
      state.sessionRestored = true;
      toast.success("Logged out successfully!");
    });

    // Restore session via refresh cookie — called silently on app mount
    builder.addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
      if (action.payload && action.payload.user) {
        state.signedUser = action.payload.user;
        state.isSignIn = true;
      } else {
        state.signedUser = null;
        state.isSignIn = false;
      }
      state.sessionRestored = true;
    });
    builder.addCase(fetchCurrentUserAsync.rejected, (state, action) => {
      // Only treat as signed-out if the server explicitly rejected it (401/403).
      // For network errors/timeouts (null status), leave state untouched.
      const httpStatus = action.payload;
      if (httpStatus === 401 || httpStatus === 403) {
        state.signedUser = null;
        state.isSignIn = false;
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

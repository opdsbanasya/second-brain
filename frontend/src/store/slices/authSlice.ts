import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  sessionChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionChecked: false,
};

const normalizeUser = (user: any): User => ({ id: user._id ?? user.id, name: user.name, email: user.email });

export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users/me");
    return { user: normalizeUser(response.data.user) };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "No active session");
  }
});

// Async thunks for making API calls
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to login");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return { ...response.data, user: normalizeUser(response.data.user) };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to register");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.sessionChecked = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.sessionChecked = true;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.sessionChecked = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.sessionChecked = true;
    });
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.sessionChecked = true;
    });
    builder.addCase(restoreSession.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.sessionChecked = true;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

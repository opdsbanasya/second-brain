import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

interface ShareState {
  loading: boolean;
  error: string | null;
}

const initialState: ShareState = {
  loading: false,
  error: null,
};

export const createShareLink = createAsyncThunk(
  "share/createShareLink",
  async (contentId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/shared-links", { contentId });
      return response.data.shareLink;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create share link");
    }
  }
);

const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createShareLink.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createShareLink.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createShareLink.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default shareSlice.reducer;

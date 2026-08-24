import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import type { Tag } from "../../lib/data";

interface TagState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (query: string = "", { rejectWithValue }) => {
    try {
      const response = await api.get(`/tags?q=${encodeURIComponent(query)}`);
      // Map backend tags
      return response.data.tags.map((tag: any) => ({
        id: tag._id || tag.name,
        name: tag.name,
        color: tag.color || "slate", // Default fallback if no color
        useCount: tag.useCount,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags",
      );
    }
  },
);

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default tagSlice.reducer;

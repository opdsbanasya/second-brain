import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";
import type { ContentItem } from "../../lib/data";

interface ContentState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchContents = createAsyncThunk(
  "content/fetchContents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/content");
      // Map backend _id to id, and tags to tagIds to match frontend types
      return response.data.contents.map((item: any) => ({
        ...item,
        id: item._id,
        tagIds: item.tags || [],
        type: item.contentType || "note",
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contents",
      );
    }
  },
);

export const createContent = createAsyncThunk(
  "content/createContent",
  async (contentData: Partial<ContentItem>, { rejectWithValue }) => {
    try {
      const payload = {
        title: contentData.title,
        link: contentData.link,
        contentType: contentData.type,
        tags: contentData.tagIds,
        description: contentData.description,
      };
      const response = await api.post("/content", payload);
      const item = response.data.content;
      return {
        ...item,
        id: item._id,
        tagIds: item.tags || [],
        type: item.contentType || "note",
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create content",
      );
    }
  },
);

export const deleteContent = createAsyncThunk(
  "content/deleteContent",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/content/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete content",
      );
    }
  },
);

export const updateContent = createAsyncThunk(
  "content/updateContent",
  async (
    { id, data }: { id: string; data: Partial<ContentItem> },
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        title: data.title,
        link: data.link,
        contentType: data.type,
        tags: data.tagIds,
        description: data.description,
      };
      const response = await api.put(`/content/${id}`, payload);
      const item = response.data.content;
      return {
        ...item,
        id: item._id,
        tagIds: item.tags || [],
        type: item.contentType || "note",
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update content",
      );
    }
  },
);

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchContents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchContents.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchContents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createContent.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    // Delete
    builder.addCase(deleteContent.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    // Update
    builder.addCase(updateContent.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
  },
});

export default contentSlice.reducer;

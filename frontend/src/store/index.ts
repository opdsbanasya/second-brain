import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contentReducer from "./slices/contentSlice";
import tagReducer from "./slices/tagSlice";
import shareReducer from "./slices/shareSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    tags: tagReducer,
    share: shareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

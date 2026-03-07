import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  completeModule,
  getCourseProgress,
  getNextModule,
} from "../utils/progressApi";

/*
---------------------------------------
GET COURSE PROGRESS
---------------------------------------
*/
export const fetchCourseProgress = createAsyncThunk(
  "progress/fetchCourseProgress",
  async (courseId) => {
    const data = await getCourseProgress(courseId);
    return data;
  },
);

/*
---------------------------------------
GET NEXT MODULE
---------------------------------------
*/
export const fetchNextModule = createAsyncThunk(
  "progress/fetchNextModule",
  async (courseId) => {
    const data = await getNextModule(courseId);
    return data.next_module;
  },
);

/*
---------------------------------------
COMPLETE MODULE
---------------------------------------
*/
export const markModuleComplete = createAsyncThunk(
  "progress/markModuleComplete",
  async ({ course_id, module_id }) => {
    await completeModule(course_id, module_id);
    return module_id;
  },
);

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    completedModules: [],
    nextModule: null,
    progressPercent: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;

        const modules = action.payload;

        state.completedModules = modules.map((m) => m.module_id);

        const totalModules = modules.length;

        const completed = modules.filter((m) => m.completed).length;

        state.progressPercent =
          totalModules === 0 ? 0 : Math.round((completed / totalModules) * 100);
      })

      .addCase(fetchNextModule.fulfilled, (state, action) => {
        state.nextModule = action.payload;
      })

      .addCase(markModuleComplete.fulfilled, (state, action) => {
        state.completedModules.push(action.payload);
      });
  },
});

export default progressSlice.reducer;

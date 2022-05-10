import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import {CategoryType, FeedbackType, RoadmapType} from "../types/FeedbackType";
import {getFeedbackData, getTypes} from "../services/feedbackService";

export type FeedbackState = {
    feedbackList: FeedbackType[];
    roadmap: RoadmapType[];
    types: CategoryType[];
};

const initialState: FeedbackState = {
    feedbackList: [],
    roadmap: [],
    types: []
};

export const getFeedbackAllData = createAsyncThunk('feedback/feedbackAllData', async () => {
    const types = await getTypes()
    const feedbackData = await getFeedbackData();
    return {
        types,
        roadmap: feedbackData.roadmap,
        feedbackList: feedbackData.feedbackList,
    }
});

export const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        updateFeedbackList: (state, action: PayloadAction<FeedbackType[]>) => {
            state.feedbackList = action.payload;
        },
        updateRoadmap:  (state, action: PayloadAction<RoadmapType[]>) => {
            state.roadmap = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getFeedbackAllData.pending, state => {})
            .addCase(getFeedbackAllData.fulfilled, (state, { payload }) => {
                state.feedbackList = payload.feedbackList;
                state.roadmap = payload.roadmap;
                state.types = payload.types;
            })
            .addCase(getFeedbackAllData.rejected, state => {});
    },
});

export const {
    updateFeedbackList,
    updateRoadmap
} = feedbackSlice.actions;

export const selectFeedbackList = (state: RootState) => state.feedback.feedbackList
export const selectRoadmap = (state: RootState) => state.feedback.roadmap;
export const selectTypes = (state: RootState) => state.feedback.types;

export default feedbackSlice.reducer;

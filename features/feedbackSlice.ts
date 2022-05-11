import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import {CategoryType, FeedbackType, RoadmapType} from "../types/FeedbackType";
import {getFeedback, getFeedbackData, getTypes} from "../services/feedbackService";

export type FeedbackState = {
    feedbackList: FeedbackType[];
    roadmap: RoadmapType[];
    types: CategoryType[];
    feedback: FeedbackType;
};

const initialState: FeedbackState = {
    feedbackList: [],
    roadmap: [],
    types: [],
    feedback: {} as FeedbackType
};

export const getSelectedFeedbackData = createAsyncThunk('feedback/feedbackData', async (id: string) => {
    const feedback = await getFeedback(id);
    return {
        feedback
    }
});

export const getAllFeedbacksData = createAsyncThunk('feedback/feedbackAllData', async () => {
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
        updateFeedback: (state, action: PayloadAction<FeedbackType>) => {
            state.feedback = action.payload;
        },
        updateFeedbackList: (state, action: PayloadAction<FeedbackType[]>) => {
            state.feedbackList = action.payload;
        },
        updateRoadmap:  (state, action: PayloadAction<RoadmapType[]>) => {
            state.roadmap = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getAllFeedbacksData.fulfilled, (state, { payload }) => {
                state.feedbackList = payload.feedbackList;
                state.roadmap = payload.roadmap;
                state.types = payload.types;
            })
            .addCase(getSelectedFeedbackData.fulfilled, (state, { payload }) => {
                state.feedback = payload.feedback;
            })
    },
});

export const {
    updateFeedbackList,
    updateRoadmap
} = feedbackSlice.actions;

export const selectFeedbackList = (state: RootState) => state.feedback.feedbackList;
export const selectFeedbackById = (state: RootState) => state.feedback.feedback;
export const selectRoadmap = (state: RootState) => state.feedback.roadmap;
export const selectTypes = (state: RootState) => state.feedback.types;

export default feedbackSlice.reducer;

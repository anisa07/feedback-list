import {
    createAsyncThunk,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../store/store';
import {CategoryType, FeedbackType, RoadmapType} from "../types/FeedbackType";
import {getFeedbackById, getFeedbacks, getRoadmap, getTypes} from "../services/feedbackService";

export type FeedbackState = {
    feedbackList: FeedbackType[];
    roadmap: RoadmapType[];
    types: CategoryType[];
    feedback: FeedbackType;
    loadingFeedback: boolean;
    errorLoadingData: string;
};

const initialState: FeedbackState = {
    feedbackList: [],
    roadmap: [],
    types: [],
    feedback: {} as FeedbackType,
    loadingFeedback: false,
    errorLoadingData: ""
};

export const getSelectedFeedbackData = createAsyncThunk('feedback/feedbackData', async (id: string) => {
    const feedback = await getFeedbackById(id);
    return {
        feedback
    }
});

export const getAllFeedbacksData = createAsyncThunk('feedback/feedbackAllData', async () => {
    const types = await getTypes();
    const feedbacks = await getFeedbacks();
    const roadmap = await getRoadmap();
    return {
        types,
        roadmap,
        feedbackList: feedbacks,
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
            .addCase(getAllFeedbacksData.pending, (state) => {
                state.loadingFeedback = true;
                state.errorLoadingData = "";
            })
            .addCase(getAllFeedbacksData.fulfilled, (state, { payload }) => {
                state.types = payload.types;
                state.feedbackList = payload.feedbackList;
                state.roadmap = payload.roadmap;
                state.loadingFeedback = false;
                state.errorLoadingData = "";
            })
            .addCase(getSelectedFeedbackData.fulfilled, (state, { payload }) => {
                state.feedback = payload.feedback;
                state.loadingFeedback = false;
                state.errorLoadingData = "";
            })
            .addCase(getSelectedFeedbackData.pending, (state) => {
                state.loadingFeedback = true;
                state.errorLoadingData = "";
            })
            .addCase(getAllFeedbacksData.rejected, (state) => {
                state.errorLoadingData = "Error loading feedback list data";
                state.loadingFeedback = false;
            })
            .addCase(getSelectedFeedbackData.rejected, (state) => {
                state.errorLoadingData = "Error loading feedback data";
                state.loadingFeedback = false;
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
export const selectFeedbackLoading = (state: RootState) => state.feedback.loadingFeedback;

export default feedbackSlice.reducer;

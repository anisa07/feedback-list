import {
    Action,
    configureStore,
    ThunkAction,
} from '@reduxjs/toolkit';
import feedbackReducer from '../features/feedbackSlice';

export const store = configureStore({
    reducer: {
        feedback: feedbackReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
    >;

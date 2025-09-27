import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import candidateReducer from './slices/candidateSlice';
import interviewReducer from './slices/interviewSlice';
import uiReducer from './slices/uiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidates', 'interviews', 'ui']
};

const rootReducer = combineReducers({
  candidates: candidateReducer,
  interviews: interviewReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


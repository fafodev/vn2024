// src/app/state/app.reducer.ts
import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { languageReducer } from './language/language.reducer';

export const appReducers: ActionReducerMap<AppState> = {
    language: languageReducer,
};

// src/app/state/language/language.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setLanguage } from './language.actions';
import { initialState } from './language.state';

export const languageReducer = createReducer(
    initialState,
    on(setLanguage, (state, { language }) => ({ ...state, currentLanguage: language }))
);

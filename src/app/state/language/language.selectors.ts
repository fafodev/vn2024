import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageState } from './language.state';

export const selectLanguageState = createFeatureSelector<LanguageState>('language');

export const selectCurrentLanguage = createSelector(
    selectLanguageState,
    (state: LanguageState) => state.currentLanguage
);

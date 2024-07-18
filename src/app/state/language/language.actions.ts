// src/app/state/language/language.actions.ts
import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction(
    '[Language] Set Language',
    props<{ language: string }>()
);

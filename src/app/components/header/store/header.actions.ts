import { createAction, props } from "@ngrx/store";

export const setTheme = createAction('[Header] Set theme', props<{ theme: string }>());
export const setLanguage = createAction('[Header] Set language', props<{ language: string }>());


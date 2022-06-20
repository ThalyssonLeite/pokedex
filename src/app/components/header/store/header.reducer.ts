import { createReducer, on } from "@ngrx/store";
import * as HeaderActions from './header.actions';

export interface State {
  theme: string;
  language: string;
}

export const initialState: State = {
  theme: '',
  language: '',
}

export const headerReducer = createReducer(
  initialState,
  on(HeaderActions.setTheme, (state, { theme }) => ({
    ...state,
    theme
  })),
  on(HeaderActions.setLanguage, (state, { language }) => ({
    ...state,
    language
  })),
)

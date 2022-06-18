import { createReducer, on } from "@ngrx/store";
import * as WelcomeActions from './welcome.actions';

export interface State {
  randomPokemon: string | undefined;
  searchResults: any[];
  resultType: string | undefined;
}

export const initialState: State = {
  searchResults: [],
  randomPokemon: '',
  resultType: '',
}

export const welcomeReducer = createReducer(
  initialState,
  on(WelcomeActions.setRandomPokemon, (state, { pokemon: randomPokemon }) => ({
    ...state,
      randomPokemon
  })),
  on(WelcomeActions.setSearchResults, (state, { searchResults }) => ({
    ...state,
    searchResults
  })),
  on(WelcomeActions.setResultType, (state, { resultType }) => ({
    ...state,
    resultType
  })),
)

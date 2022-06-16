import { createReducer, on } from "@ngrx/store";
import * as WelcomeActions from './welcome.actions';

export interface State {
  randomPokemon: string | undefined;
  searchResults: any[];
}

export const initialState: State = {
  randomPokemon: undefined,
  searchResults: [],
}

export const welcomeReducer = createReducer(
  initialState,
  on(WelcomeActions.setRandomPokemon, (state, { pokemon: randomPokemon }) => ({
    ...state,
      randomPokemon
  })),
  on(WelcomeActions.setSearchResults, (state, { searchResults: searchResults }) => ({
    ...state,
    searchResults
  })),
)

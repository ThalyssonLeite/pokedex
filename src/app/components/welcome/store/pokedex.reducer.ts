import { createReducer, on } from "@ngrx/store";
import * as WelcomeActions from './pokedex.actions';

export interface State {
  randomPokemon: string | undefined;
}

export const initialState: State = {
  randomPokemon: undefined,
}

export const welcomeReducer = createReducer(
  initialState,
  on(WelcomeActions.setRandomPokemon, (state, { pokemon: randomPokemon }) => ({
    ...state,
      randomPokemon
  })),
)

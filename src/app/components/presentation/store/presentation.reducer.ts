import { createReducer, on } from "@ngrx/store";
import * as PresentationActions from './presentation.actions';

export interface State {
  choosenPokemon: any,
  visible: boolean,
}

export const initialState: State = {
  choosenPokemon: {},
  visible: false,
}

export const presentationReducer = createReducer(
  initialState,
  on(PresentationActions.setChoosenPokemon, (state, { pokemon: choosenPokemon }) => ({
    ...state,
    choosenPokemon,
    visible: true,
  })),
)

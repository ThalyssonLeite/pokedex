import { createReducer, on } from "@ngrx/store";
import * as PokedexActions from './pokedex.actions';

export interface State {
  urls: string[],
  names: string[],
  results: any[],
  filter: string,
  choosenPokemon: any,
}

export const initialState: State = {
  urls: [],
  names: [],
  results: [],
  filter: 'id',
  choosenPokemon: {},
}

export const pokedexReducer = createReducer(
  initialState,
  on(PokedexActions.setPokeList, (state, { urls, names }) => ({
    ...state,
      urls,
      names
  })),
  on(PokedexActions.setFilter, (state, { filtername: filter }) => ({
    ...state,
      filter
  })),
  on(PokedexActions.setResults, (state, { results }) => ({
    ...state,
    results
  })),
  on(PokedexActions.setChoosenPokemon, (state, { pokemon }) => ({
    ...state,
    pokemon
  })),
)

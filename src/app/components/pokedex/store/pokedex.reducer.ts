import { createReducer, on } from "@ngrx/store";
import * as PokedexActions from './pokedex.actions';

export interface State {
  urls: string[],
  names: string[],
  results: any[],
  types: any[],
  filter: string,
}

export const initialState: State = {
  urls: [],
  names: [],
  results: [],
  types: [],
  filter: 'id',
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
  on(PokedexActions.setTypes, (state, { types }) => ({
    ...state,
    types
  })),
)

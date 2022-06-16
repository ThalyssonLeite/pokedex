import { createAction, props } from "@ngrx/store";

export const setPokeList = createAction('[Pokédex] Set pokémons list', props<{ urls: string[], names: string[] }>());
export const setFilter = createAction('[Pokédex] Set filter', props<{ filtername: string }>());
export const setResults = createAction('[Pokédex] Set results', props<{ results: any[] }>());
export const setChoosenPokemon = createAction('[Pokédex] Set choosen Pokemon', props<{ pokemon: any[] }>());


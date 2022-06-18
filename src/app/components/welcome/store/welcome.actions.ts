import { createAction, props } from "@ngrx/store";

export const setRandomPokemon = createAction('[Welcome] Set random pokémon', props<{ pokemon: string }>());
export const setSearchResults = createAction('[Welcome] Set search results', props<{ searchResults: any[] }>());
export const setResultType = createAction('[Welcome] Set search results', props<{ resultType: string }>());


import { createAction, props } from "@ngrx/store";

export const setRandomPokemon = createAction('[Welcome] Set random pokémon', props<{ pokemon: string }>());


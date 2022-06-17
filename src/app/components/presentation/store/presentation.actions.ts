import { createAction, props } from "@ngrx/store";

export const setChoosenPokemon = createAction('[Presentation] Set choosen Pokemon', props<{ pokemon: any[] }>());
export const closePresentation = createAction('[Presentation] Close presentation');


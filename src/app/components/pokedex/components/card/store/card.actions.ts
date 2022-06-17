import { createAction, props } from "@ngrx/store";

export const setImageType = createAction('[Card] set imageType', props<{ imageType: string }>());


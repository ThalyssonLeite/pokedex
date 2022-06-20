import { createReducer, on } from "@ngrx/store";
import * as CardActions from './card.actions';

export interface State {
  imageType: string;
}

export const initialState: State = {
  imageType: 'official',
}

export const cardReducer = createReducer(
  initialState,
  on(CardActions.setImageType, (state, { imageType }) => ({
    ...state,
    imageType
  })),
)

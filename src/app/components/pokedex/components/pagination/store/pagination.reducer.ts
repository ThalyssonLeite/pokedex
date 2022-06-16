import { createReducer, on } from "@ngrx/store";
import * as PaginationActions from './pagination.actions';

export interface State {
  activePage: number,
  pagination: {
    buttons: any[],
    items: any[],
  },
}

export const initialState: State = {
  activePage: 1,
  pagination: {
    buttons: [],
    items: []
  },
}

export const paginationReducer = createReducer(
  initialState,
  on(PaginationActions.updatePagination, (state, { activePage, buttons, items }) => ({
    ...state,
    activePage,
    pagination: {
      buttons,
      items
    }
  })),
)

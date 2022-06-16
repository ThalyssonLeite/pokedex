import { createAction, props } from "@ngrx/store";

export const updatePagination = createAction('[Pagination] update pagination', props<{ activePage: number, buttons: any[], items: any[] }>());


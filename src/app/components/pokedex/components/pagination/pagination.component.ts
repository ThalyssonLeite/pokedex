import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PaginationLib } from 'src/app/libs/pagination.lib';
import { updatePagination } from './store/pagination.actions';

@Component({
  selector: 'poke-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  paginationLib: PaginationLib;
  items: any[];
  buttons: any[];
  paginationState$: Subscription;
  pokedexState$: Subscription;
  input: any;

  constructor (private store: Store<{ pagination, pokedex }>) {
  }

  ngOnInit(): void {
    const store = this.store;

    this.paginationState$ = store.select('pokedex').subscribe(state => {
      if (!state?.urls) return;

      this.initPaginationLib(state.urls);

      this.updateState(this.paginationLib.firstOutput);

      if (this.pokedexState$) this.pokedexState$.unsubscribe();

      this.pokedexState$ = store.select('pagination').subscribe(({ pagination }) => {
        if (!pagination?.items) return;

        this.items = pagination.items;
        this.buttons = pagination.buttons;
      })
    })
  }

  initPaginationLib (inputItems: any[]) {
    const itemsPerPage = 8;
    const visibleButtons = 5;
    this.paginationLib = new PaginationLib({ inputItems, itemsPerPage, visibleButtons });
  }

  setActivePage (page: number): void {
    if (!page) return;
    const output = this.paginationLib.setActivePage(page);
    this.updateState(output);
  }

  forward (): void {
    const output = this.paginationLib.forwardPage();

    this.updateState(output);
  }

  backward (): void {
    const output = this.paginationLib.backwardPage();
    this.updateState(output);
  }

  updateState ({ buttons, items }: { buttons: any[], items: any[] }) {
    const page = this.paginationLib.activePage;

    this.store.dispatch(updatePagination({ buttons, items, activePage: page }))
  }

  formatInput ($event) {
    if (!this.input.length) return;
    const toNumber = parseInt(this.input);
    const isNaN = Number.isNaN(toNumber);
    this.input = isNaN
      ? ''
      : Number.isNaN(toNumber) ? '' : toNumber;

    const isTooHigh = this.paginationLib.numberOfPages < parseInt(this.input);
    const isTooLow = parseInt(this.input) < 1;

    if (isTooHigh) {
      this.input = String(this.paginationLib.numberOfPages);
    } else if (isTooLow) {
      this.input = String(1);
    }

    $event.currentTarget.value = this.input;
  }

  ngOnDestroy(): void {
    if (this.paginationState$) this.paginationState$.unsubscribe();
    if (this.pokedexState$) this.pokedexState$.unsubscribe();
  }
}

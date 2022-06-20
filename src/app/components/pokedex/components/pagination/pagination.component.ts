import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PaginationLib } from 'src/app/libs/pagination.lib';
import { updatePagination } from './store/pagination.actions';

@Component({
  selector: 'poke-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewInit, OnDestroy {
  paginationLib: PaginationLib;
  paginationLibLoaded: boolean = false;
  items: any[];
  buttons: any[];
  paginationState$: Subscription;
  pokedexState$: Subscription;
  input: any;
  ulrs: string[];
  buttonsFontSize: string;

  itemsPerPage: number = 8;

  @ViewChild('pageInput') pageInput: ElementRef;

  constructor (private store: Store<{ pagination, pokedex }>) {
  }

  ngOnInit(): void {
    const store = this.store;

    this.paginationState$ = store.select('pokedex').subscribe(state => {
      if (!state?.urls.length) return;
      this.ulrs = state.urls;

      this.initPaginationLib(this.ulrs, true)

      // this.updateState({ buttons: state.urls, names: state.names})

      if (this.pokedexState$) this.pokedexState$.unsubscribe();

      this.pokedexState$ = store.select('pagination').subscribe(({ pagination }) => {
        if (!pagination?.items) return;

        this.items = pagination.items;
        this.buttons = pagination.buttons;
      })
    })

  }

  ngAfterViewInit(): void {
    let body;

    //For understand the enter when we search for a name
    this.pageInput.nativeElement.onfocus = (e) => {
      e.stopPropagation();

      body = e.target.closest('body');

      body.onkeypress = (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') this.setActivePage(this.input);
      }
    }

    //For cleaning the body event
    this.pageInput.nativeElement.onblur = (e) => {
      e.stopPropagation();

      body.onkeypress = null;
    }
  }

  listenToBreakPointsChanges () {
    const width = screen.width;

    if (width >= 0 && width <= 400 && this.itemsPerPage !== 1) this.itemsPerPage = 1, this.initPaginationLib(this.ulrs);
      else if (width >= 400 && width <= 622 && this.itemsPerPage !== 2) this.itemsPerPage = 2, this.initPaginationLib(this.ulrs);
      else if (width >= 623 && width <= 1051 && this.itemsPerPage !== 4) this.itemsPerPage = 4, this.initPaginationLib(this.ulrs);
      else if (width >= 1052 && width <= 1367 && this.itemsPerPage !== 6) this.itemsPerPage = 6, this.initPaginationLib(this.ulrs);
      else if (width >= 1368 && this.itemsPerPage !== 8) this.itemsPerPage = 8, this.initPaginationLib(this.ulrs);
   window.addEventListener('resize', () => {
      const width = screen.width;

      if (width >= 0 && width <= 400 && this.itemsPerPage !== 1) this.itemsPerPage = 1, this.initPaginationLib(this.ulrs);
      else if (width >= 400 && width <= 622 && this.itemsPerPage !== 2) this.itemsPerPage = 2, this.initPaginationLib(this.ulrs);
      else if (width >= 623 && width <= 1051 && this.itemsPerPage !== 4) this.itemsPerPage = 4, this.initPaginationLib(this.ulrs);
      else if (width >= 1052 && width <= 1367 && this.itemsPerPage !== 6) this.itemsPerPage = 6, this.initPaginationLib(this.ulrs);
      else if (width >= 1368 && this.itemsPerPage !== 8) this.itemsPerPage = 8, this.initPaginationLib(this.ulrs);
   })
  }

  initPaginationLib (inputItems: any[], firstLoad?: boolean) {
    const visibleButtons = 5;

    const width = screen.width;

    if (width >= 0 && width <= 400 && this.itemsPerPage !== 1) this.itemsPerPage = 1;
    else if (width >= 400 && width <= 622 && this.itemsPerPage !== 2) this.itemsPerPage = 2;
    else if (width >= 623 && width <= 1051 && this.itemsPerPage !== 4) this.itemsPerPage = 4;
    else if (width >= 1052 && width <= 1367 && this.itemsPerPage !== 6) this.itemsPerPage = 6;
    else if (width >= 1368 && this.itemsPerPage !== 8) this.itemsPerPage = 8;

    this.paginationLib = new PaginationLib({ inputItems, itemsPerPage: this.itemsPerPage, visibleButtons });
    this.updateState(this.paginationLib.firstOutput);

    this.paginationLibLoaded = true;


    if (firstLoad) this.listenToBreakPointsChanges();
  }

  setActivePage (page: number): void {
    if (!page) return;
    const output = this.paginationLib.setActivePage(page);
    this.updateState(output);
    this.input = '';
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
    const temp = [...buttons].pop().number.toString();
    const buttonsFontSize = (temp.length > 3)
      ? 11
      : (temp.length > 2)
        ? 14
        : 16;

    this.buttonsFontSize = `--font-size: ${buttonsFontSize}px`;

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

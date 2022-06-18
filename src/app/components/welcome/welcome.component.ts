import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setSearchResults } from './store/welcome.actions';
import { setRandomPokemon } from './store/welcome.actions';

@Component({
  selector: 'poke-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  filteredNames: string[];
  types: any[] = [];
  names: string[];
  randomPokemon: string;
  pokedexState$: Subscription;
  searchInput: string;
  sugestions: string[];
  pokemonExists: boolean = true;
  results: any[];
  resultsListener$: Subscription;

  @ViewChild('input') input: ElementRef;
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(private store: Store<{ pokedex, pagination }>, private renderer: Renderer2 ) {
    //For closing the sugestions when we click outside
    this.renderer.listen('window', 'click', (e) => {
      e.stopPropagation();

      if (!e.target.closest('.search-bar')) this.sugestions = [];
    });
  }

  ngAfterViewInit(): void {
    let body;

    //For understand the enter when we search for a name
    this.input.nativeElement.onfocus = (e) => {
      e.stopPropagation();

      body = e.target.closest('body');

      body.onkeypress = (e) => {
        e.stopPropagation();

        if (e.key === 'Enter') this.submitSearch(), this.chooseSugestion();
      }
    }

    //For cleaning the body event
    this.input.nativeElement.onblur = (e) => {
      e.stopPropagation();

      body.onkeypress = null;
    }
  }

  ngOnInit(): void {
    this.pokedexState$ = this.store.select('pokedex').subscribe(({ names, types, results }) => {
      const filteredNames = [...names].filter(name => !name.includes('-'));
      this.names = names;
      this.filteredNames = filteredNames;
      this.randomPokemon = filteredNames[this.genereteRandomNumber(filteredNames.length)];

      if (!this.types.length) this.types = this.normalizeTypes(types);

      if (this.randomPokemon) {
        this.randomPokemon = filteredNames[this.genereteRandomNumber(filteredNames.length)];
        this.store.dispatch(setRandomPokemon({ pokemon: this.randomPokemon }));
      }

      if (this.names.length) this.ngOnDestroy();
    });

    this.listenToResults();
  }

  normalizeTypes (types) {
    return types.map(type => {
      return {
        sugestion: `Type: ${type.name.slice(0, 1).toUpperCase() + type.name.slice(1)}`,
        name: type.name,
        url: type.url
      }
    })
  }

  listenToResults () {
    this.store.select('pokedex').subscribe(({ results }) => {
      this.results = results;

      if (this.results.length) this.destroyResultsListener();
    })
  };

  genereteRandomNumber (maxRange: number) {
    const range = maxRange + 1;
    const randomNumber = Math.floor(Math.random() * range);

    return randomNumber;
  }

  generateSugestions (): void | any[] {
    this.pokemonExists = true;
    if (!this.searchInput) return this.sugestions = [];

    const formatedInput = this.searchInput.toLocaleLowerCase();
    const oneWordNames = this.names.filter(name => !name.includes('-'));
    const multiWordNames = this.names.filter(name => name.includes('-'));
    const sugestions = [
      ...oneWordNames.filter(name => name.includes(formatedInput)).slice(0, 6),
      ...multiWordNames.filter(name => name.includes(formatedInput))
    ].slice(0, 6);

    this.sugestions = sugestions.length === 1 && sugestions[0].length === this.searchInput.length
      ? []
      : sugestions;
  }

  chooseSugestion (sugestion?: string): void {
    this.sugestions = [];

    if (!sugestion) return;
    this.searchInput = sugestion;
  }

  submitSearch (): any {
    const pokemon = this.searchInput;
    if (!pokemon) return;

    this.searchInput = '';

    this.filterAndDispacthSearchList(pokemon);
  }

  filterAndDispacthSearchList (pokemon: string): any {
    const pokemonLowerCase = pokemon.toLocaleLowerCase();
    const pokemonExists = this.names.some(name => name.includes(pokemonLowerCase));

    if (!pokemonExists) return this.pokemonExists = false;

    this.store.dispatch(setSearchResults({ searchResults: this.results.filter(result => result.name.includes(pokemonLowerCase)) }));
  }

  ngOnDestroy(): void {
    if (this.pokedexState$) this.pokedexState$.unsubscribe();
  }

  destroyResultsListener () {
    if (this.resultsListener$) this.resultsListener$.unsubscribe();
  }
}

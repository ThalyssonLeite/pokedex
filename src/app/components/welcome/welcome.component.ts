import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setSearchResults } from './store/welcome.actions';
import { setRandomPokemon } from './store/welcome.actions';

@Component({
  selector: 'poke-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  filteredNames: string[];
  names: string[];
  randomPokemon: string;
  pokedexState$: Subscription;
  searchInput: string;
  sugestions: string[];
  pokemonExists: boolean = true;
  results: any[];
  resultsListener$: Subscription;

  constructor(private store: Store<{ pokedex, pagination }>) { }

  ngOnInit(): void {
    this.pokedexState$ = this.store.select('pokedex').subscribe(({ names, results }) => {
      const filteredNames = [...names].filter(name => !name.includes('-'));
      this.names = names;
      this.filteredNames = filteredNames;
      this.randomPokemon = filteredNames[this.genereteRandomNumber(filteredNames.length)];

      this.store.dispatch(setRandomPokemon({ pokemon: this.randomPokemon }))

      if (this.filteredNames.length) this.ngOnDestroy();
    });

    this.listenToResults();
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
    const sugestions = this.filteredNames.filter(name => name.startsWith(formatedInput)).slice(0, 6);
    this.sugestions = sugestions.length === 1 && sugestions[0].length === this.searchInput.length
      ? []
      : sugestions;
  }

  chooseSugestion (sugestion: string): void {
    this.sugestions = [];
    this.searchInput = sugestion;
  }

  submitSearch (pokemon: string): any {
    this.filterAndDispacthSearchList(pokemon);
  }

  filterAndDispacthSearchList (pokemon: string): any {
    const pokemonLowerCase = pokemon.toLocaleLowerCase();
    const pokemonExists = this.names.some(name => name.startsWith(pokemonLowerCase));

    if (!pokemonExists) return this.pokemonExists = false;

    this.store.dispatch(setSearchResults({ searchResults: this.results.filter(result => result.name.startsWith(pokemonLowerCase)) }));
  }

  ngOnDestroy(): void {
    if (this.pokedexState$) this.pokedexState$.unsubscribe();
  }

  destroyResultsListener () {
    if (this.resultsListener$) this.resultsListener$.unsubscribe();
  }
}

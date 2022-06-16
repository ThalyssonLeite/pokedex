import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PokedexService } from 'src/app/services/pokedex.service';
import { setSearchResults } from '../welcome/store/welcome.actions';
import { setFilter, setPokeList, setResults } from './store/pokedex.actions';

@Component({
  selector: 'poke-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  pokemons: any[];
  activeFilter: string = 'id';
  results: any[];
  searchResults: any[] = [];
  dataSource: any[];

  constructor (private pokedexService: PokedexService, private store: Store<{ pagination, pokedex, welcome }>) { };

  ngOnInit(): void {
    this.getPokemons();
    this.listenToPaginationChanges();
    this.listenToPokedexChanges();
    this.listenToSearchResultsChanges();
  }

  getPokemons () {
    this.pokedexService
    .getPokeList()
    .subscribe(res => {
      this.results = [...res.results]

      this.store.dispatch(setResults({ results: this.results }));

      this[`${this.activeFilter}Filter`]();
    })
  }

  listenToPaginationChanges () {
    this.store.select('pagination').subscribe(({ pagination }) => {
      if (!pagination?.items) return;

      this.getPokemonsInfo(pagination.items);
    })
  }

  listenToPokedexChanges () {
    this.store.select('pokedex').subscribe(({ filter, searchResults }) => {
      if (filter && filter !== this.activeFilter) this[`${filter}Filter`]();
    });
  }

  listenToSearchResultsChanges () {
    this.store.select('welcome').subscribe(({ searchResults }) => {
      this.searchResults = searchResults;

      this.updateDataSource();

      if (searchResults) this[`${this.activeFilter}Filter`]();
    });
  }

  async getPokemonsInfo (pokemonUrlList) {
    const arrayOfPokemonsResponses = await Promise.all(pokemonUrlList.map(url => this.pokedexService.getPokemon(url)));
    const parsedPromises = await Promise.all(arrayOfPokemonsResponses.map(res => res.json()));

    this.pokemons = parsedPromises;
  }

  nameFilter () {
    this.activeFilter = 'name';
    this.updateDataSource();

    if (!this.dataSource) return;

    this.dataSource.sort((a, b) => a.name.localeCompare(b.name));

    const names = this.dataSource.map(result => result.name);
    let urls = this.dataSource.map(result => result.url);

    this.store.dispatch(setPokeList({ names, urls }));
  }

  idFilter () {
    this.activeFilter = 'id';
    this.updateDataSource();

    if (!this.dataSource) return;

    this.dataSource.sort((a, b) => {
      const extractIdRegex = /pokemon\/(.+?)\//;

      a = parseInt(a.url.match(extractIdRegex)[1]);
      b = parseInt(b.url.match(extractIdRegex)[1]);

      return a - b;
    });

    const names = this.dataSource.map(result => result.name);
    let urls = this.dataSource.map(result => result.url);

    this.store.dispatch(setPokeList({ names, urls }));
  }

  setFilter (filtername: string) {
    this.store.dispatch(setFilter({ filtername }));
  }

  updateDataSource (): any {
    if (!this.results) return;

    this.dataSource = this.searchResults.length
      ? [...this.searchResults]
      : [...this.results];
  }

  resetSearchResults () {
    this.store.dispatch(setSearchResults({ searchResults: [] }));
  }

  choosePokemon (pokemon: any): void {
    if (!pokemon) return;


  }
}

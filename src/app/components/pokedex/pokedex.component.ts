import { Component, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { PokedexService } from 'src/app/services/pokedex.service';
import { setChoosenPokemon, closePresentation } from '../presentation/store/presentation.actions';
import { setSearchResults } from '../welcome/store/welcome.actions';
import { setImageType } from './components/card/store/card.actions';
import {  setFilter, setPokeList, setResults, setTypes } from './store/pokedex.actions';

@Component({
  selector: 'poke-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  imageTypes: string[] = ['Oficial', 'Pixel art', 'Cartoon', '3D'];
  pokemons: any[] = Array(8);
  activeFilter: string = 'id';
  results: any[];
  searchResults: any[] = [];
  dataSource: any[];
  dropdownExpanded: boolean = false;
  resultType: string = '';
  searchTypeColor: string = '';

  constructor (private pokedexService: PokedexService, private store: Store<{ pagination, pokedex, welcome, card }>, private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e) => {
      e.stopPropagation();

      if (!e.target.closest('.image-type-dropdown-wrapper')) this.dropdownExpanded = false;
    });
  };

  ngOnInit(): void {
    this.getTypes();
    this.getPokemons();
    this.listenToPaginationChanges();
    this.listenToPokedexChanges();
    this.listenToSearchResultsChanges();
    this.listenToImageTypeChanges();
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

  getTypes () {
    this.pokedexService
    .getTypeList()
    .subscribe(res => {
      this.store.dispatch(setTypes({ types: res.results }));
    })
  }

  listenToPaginationChanges () {
    this.store.select('pagination').subscribe(({ pagination }) => {
      if (!pagination?.items) return;

      this.getPokemonsInfo(pagination.items);
    })
  }

  listenToPokedexChanges () {
    this.store.select('pokedex').subscribe(({ filter, results }) => {
      if (filter && filter !== this.activeFilter && results.length) this[`${filter}Filter`]();
    });
  }

  listenToSearchResultsChanges () {
    this.store.select('welcome').subscribe(({ searchResults, resultType }) => {
      this.resultType = resultType;
      if (resultType) this.setSearchTypeColor(resultType);
      if (!searchResults) return;

      //Stop execution when finding  [], []. At least one should have length. If we let that it will call multiple times the backend.
      const nonRepetitiveEmptySearchResult = this.searchResults.length || searchResults.length;

      this.searchResults = searchResults;

      this.updateDataSource();

      if (nonRepetitiveEmptySearchResult) this[`${this.activeFilter}Filter`]();
    });
  }

  listenToImageTypeChanges () {
    this.store.select('card').subscribe(({ imageType }) => {
      const animationDelayTime = 310;
      setTimeout(() => {
        const tempArr = [...this.imageTypes].filter(type => type !== imageType)
        tempArr.unshift(imageType);

        this.imageTypes = tempArr;
      }, animationDelayTime);
    });
  }

  async getPokemonsInfo (pokemonUrlList: string[]): Promise<void> {
    this.pokemons = Array(pokemonUrlList.length);
    const arrayOfPokemonsResponses = await Promise.all(pokemonUrlList.map(url => this.pokedexService.getPokemon(url)));
    const parsedPromises = await Promise.all(arrayOfPokemonsResponses.map(res => res.json()));

    this.pokemons = parsedPromises;
    this.setFirstPokemon(this.pokemons[0]);
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

  setFirstPokemon (pokemon: any): void {
    if (!pokemon) return;

    this.store.dispatch(setChoosenPokemon({ pokemon }));
    this.store.dispatch(closePresentation());
  }

  chooseImageType (imageType: string) {
    if (imageType === this.imageTypes[0]) return;
    this.store.dispatch(setImageType({ imageType }));
  }

  toggleDropdown () {
    this.dropdownExpanded = !this.dropdownExpanded;
  }

  arraysAreEqual (firstArr: any[], secondArr: any[]): boolean {
    if (firstArr.length !== secondArr.length) return false;
    return firstArr.some((item, i) => { if (item[i] !== secondArr[i]) return true });
  }

  setSearchTypeColor (type: string): void {
    const color = this.pokedexService.typeConfig[type];
    this.searchTypeColor = `--type-color: ${color}`;
  }
}

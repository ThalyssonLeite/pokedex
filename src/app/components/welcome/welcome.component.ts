import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PokedexService } from 'src/app/services/pokedex.service';
import { setResultType, setSearchResults } from './store/welcome.actions';
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
  sugestions: any[];
  pokemonExists: boolean = true;
  results: any[];
  resultsListener$: Subscription;
  typeResultsActive: boolean;

  @ViewChild('input') input: ElementRef;
  @ViewChild('submitButton') submitButton: ElementRef;

  constructor(private store: Store<{ pokedex, welcome }>, private renderer: Renderer2, private pokedexService: PokedexService ) {
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

  listenToWelcomeChanges () {
    this.store.select('welcome').subscribe(state => {
      Boolean(state.searchResults)
    });
  }

  normalizeTypes (types) {
    return types.map(type => {
      return {
        type: true,
        name: type.name,
        url: type.url
      }
    }).filter(poke => !(poke.name === 'shadow') && !(poke.name === 'unknown'))
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
    const types = this.types.filter(type => type.name.includes(formatedInput));
    const oneWordNames = this.names.filter(name => !name.includes('-'));
    const multiWordNames = this.names.filter(name => name.includes('-'));

    const sugestions = [...[
      ...oneWordNames.filter(name => name.includes(formatedInput)).slice(0, 5),
      ...multiWordNames.filter(name => name.includes(formatedInput))
    ].slice(0, 5), ...types].slice(0, 6);

    this.sugestions = sugestions;
  }

  chooseSugestion (sugestion?: any): void {
    this.sugestions = [];
    if (!sugestion) return;

    const checkedSugestion = this.isType(sugestion) ? sugestion.name : sugestion;

    this.searchInput = checkedSugestion;
  }

  submitSearch (): any {
    const pokemon = this.searchInput;
    if (!pokemon) return;

    this.filterAndDispacthSearchList(pokemon);
  }

  filterAndDispacthSearchList (pokemon: string): any {
    const pokemonLowerCase = pokemon.toLowerCase().trim();
    const pokemonExists = this.names.some(name => name.includes(pokemonLowerCase)) || this.types.some(pokemon => pokemon.name.includes(pokemonLowerCase));

    if (!pokemonExists) return this.pokemonExists = false;

    const isType = this.types.find(type => type.name === pokemonLowerCase);

    if (isType) return this.pokedexService.getType(isType.url).subscribe(res => {
      this.store.dispatch(setSearchResults({ searchResults: res.pokemon.map(poke => poke.pokemon) }));
      this.store.dispatch(setResultType({ resultType: isType.name }));
    })

    this.store.dispatch(setSearchResults({ searchResults: this.results.filter(result => result.name.includes(pokemonLowerCase)) || [] }));
    this.store.dispatch(setResultType({ resultType: undefined }));
  }

  isType (value) {
    return typeof value === 'object' ? true : false;
  }

  ngOnDestroy(): void {
    if (this.pokedexState$) this.pokedexState$.unsubscribe();
  }

  destroyResultsListener () {
    if (this.resultsListener$) this.resultsListener$.unsubscribe();
  }
}

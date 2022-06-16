import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PokedexService } from 'src/app/services/pokedex.service';
import { setFilter, setPokeList } from './store/pokedex.actions';

@Component({
  selector: 'poke-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {

  pokemons: any[];
  results: any[];
  activeFilter: string = 'id';

  constructor (private pokedexService: PokedexService, private store: Store<{ pagination, pokedex }>) { };

  ngOnInit(): void {
    this.listenToPokemonsListChanges();
    this.listenToFilterChanges();
  }

  listenToPokemonsListChanges () {
    this.pokedexService
      .getPokeList()
      .subscribe(res => {
        this.results = [...res.results]

        this.idFilter();
      });

    this.store.select('pagination').subscribe(({ pagination }) => {
      if (!pagination?.items) return;

      this.getPokemonsInfo(pagination.items);
    })
  }

  listenToFilterChanges () {
    this.store.select('pokedex').subscribe(({ filter }) => {
      if (filter && filter !== this.activeFilter) this[`${filter}Filter`]() ;
    });
  }

  async getPokemonsInfo (pokemonUrlList) {
    const arrayOfPokemonsResponses = await Promise.all(pokemonUrlList.map(url => this.pokedexService.getPokemon(url)));
    const parsedPromises = await Promise.all(arrayOfPokemonsResponses.map(res => res.json()));

    this.pokemons = parsedPromises;
  }

  nameFilter () {
    this.activeFilter = 'name';
    if (!this.results) return;

    this.results.sort((a, b) => a.name.localeCompare(b.name));

    const names = this.results.map(result => result.name);
    let urls = this.results.map(result => result.url);

    this.store.dispatch(setPokeList({ names, urls }));
  }

  idFilter () {
    this.activeFilter = 'id';
    if (!this.results) return;

    this.results.sort((a, b) => {
      const extractIdRegex = /pokemon\/(.+?)\//;

      a = parseInt(a.url.match(extractIdRegex)[1]);
      b = parseInt(b.url.match(extractIdRegex)[1]);

      return a - b;
    });

    const names = this.results.map(result => result.name);
    let urls = this.results.map(result => result.url);

    this.store.dispatch(setPokeList({ names, urls }));
  }

  setFilter (filtername: string) {
    this.store.dispatch(setFilter({ filtername }));
  }
}

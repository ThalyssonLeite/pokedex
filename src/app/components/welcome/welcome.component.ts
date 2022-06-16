import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { setRandomPokemon } from './store/pokedex.actions';

@Component({
  selector: 'poke-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  names: string[];
  randomPokemon: string;
  pokedexState$: Subscription;
  searchInput: string;
  sugestions: string[];

  constructor(private store: Store<{ pokedex, pagination }>) { }

  ngOnInit(): void {
    this.pokedexState$ = this.store.select('pokedex').subscribe(({ names }) => {
      const filteredNames = [...names].filter(name => !name.includes('-'));
      this.names = filteredNames;
      this.randomPokemon = filteredNames[this.genereteRandomNumber(filteredNames.length)];

      this.store.dispatch(setRandomPokemon({ pokemon: this.randomPokemon }))

      if (this.names.length) this.ngOnDestroy();
    });
  }

  genereteRandomNumber (maxRange: number) {
    const range = maxRange + 1;
    const randomNumber = Math.floor(Math.random() * range);

    return randomNumber;
  }

  generateSugestions () {
    const formatedInput = this.searchInput.toLocaleLowerCase();
    this.sugestions = this.names.filter(name => name.startsWith(formatedInput));
  }

  ngOnDestroy(): void {
    if (this.pokedexState$) this.pokedexState$.unsubscribe();
  }
}

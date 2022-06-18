import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { setChoosenPokemon } from 'src/app/components/presentation/store/presentation.actions';

@Component({
  selector: 'poke-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() pokemon;
  pokemonImage: string;

  @ViewChild('image') image: ElementRef

  constructor(private store: Store<{ card }>) {}

  imageConfig = {
    'oficial': 'official-artwork',
    '3d': 'home',
    'cartoon': 'dream_world',
    'pixel art': 'pixel art'
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.normalizeBugs();
  }

  ngOnInit(): void {
    this.store.select('card').subscribe(({ imageType }) => {
      if (!this.pokemon) return;
      const type = this.imageConfig[imageType.toLowerCase()];

      if (type === 'pixel art') return this.pokemonImage = this.pokemon.sprites.front_default;
      else this.pokemonImage = this.pokemon.sprites.other[type].front_default;
    });
  }

  choosePokemon (): void {
    //Provides the image to presentation
    this.store.dispatch(setChoosenPokemon({ pokemon: { ...this.pokemon, image: this.pokemonImage} }));
  }

  normalizeBugs () {
    if (!this.pokemon) return;
    const idString = String(this.pokemon.id);

    const weight = this.pokemon.weight ? this.pokemon.weight : 10000;
    const height = this.pokemon.height ? this.pokemon.height : 10000;

    this.pokemon = { ...this.pokemon, weight, height };
  }
}

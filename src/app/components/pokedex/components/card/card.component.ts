import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { setChoosenPokemon } from 'src/app/components/presentation/store/presentation.actions';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'poke-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() pokemon;
  pokemonImage: string;
  height: string;
  weight: string;

  @ViewChild('image') image: ElementRef

  constructor(private store: Store<{ card, header }>, public translationService: TranslationService) {}

  imageConfig = {
    'official': 'official-artwork',
    '3d': 'home',
    'cartoon': 'dream_world',
    'pixel_art': 'pixel_art'
  }

  ngOnChanges(): void {
    this.normalizeBugs();
    this.listenToHeaderState();
  }

  ngOnInit(): void {
    this.listenToCardsState();
  }

  listenToCardsState () {
    this.store.select('card').subscribe(({ imageType }) => {
      if (!this.pokemon) return;
      const type = this.imageConfig[imageType];

      if (type === 'pixel_art') return this.pokemonImage = this.pokemon.sprites.front_default;
      else this.pokemonImage = this.pokemon.sprites.other[type].front_default;
    });
  }

  listenToHeaderState () {
    this.store.select('header').subscribe(({ language }) => {
      if (!this.pokemon) return;

      const isEnglish = language !== 'en';

      this.height = isEnglish ? `${this.pokemon.weight / 10}kg` : `${(this.pokemon.weight * 0.220462).toFixed(1)}lb`;
      this.weight = isEnglish ? `${this.pokemon.weight / 10}m` : `${(this.pokemon.height * 0.3280839895).toFixed(1)}ft`;
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

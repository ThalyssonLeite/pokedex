import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'poke-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() pokemon;
  pokemonImage: string;

  constructor(private store: Store<{ card }>) { }

  ngOnInit(): void {
    this.store.select('card').subscribe(({ imageType }) => {
      let type;

      switch (imageType) {
        case 'Oficial':
          type = 'official-artwork'
          break;
        case '3D':
          type = 'home'
          break;
        case 'Cartoon':
          type = 'dream_world'
          break;
        default:
          type = 'Pixel art'
      }

      if (type === 'Pixel art') return this.pokemonImage = this.pokemon.sprites.front_default;
      else this.pokemonImage = this.pokemon.sprites.other[type].front_default
    });
  }

}

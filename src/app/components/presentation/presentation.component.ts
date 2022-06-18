import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { closePresentation } from './store/presentation.actions';

@Component({
  selector: 'poke-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit {
  pokemon: any;
  visible: boolean;
  pokemonTypes: any[];
  pokemonStats: any[];
  circleStyle: string;

  private typeConfig = {
    normal: '#A8A878',
    fire: '#F08030',
    fighting: '#C03028',
    water: '#6890F0',
    flying: '#A890F0',
    grass: '#78C850',
    poison: '#A040A0',
    electric: '#F8D030',
    ground: '#F8D030',
    psychic: '#F85888',
    rock: '#B8A038',
    ice: '#98D8D8',
    bug: '#A8B820',
    dragon: '#7038F8',
    ghost: '#705898',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    shadow: '#E2E2E2',
  }

  private statConfig = {
    hp: {
      ceil: 255,
      color: '#C4F789'
    },
    attack: {
      ceil: 190,
      color: '#EA686D'
    },
    defense: {
      ceil: 250,
      color: '#F7802A'
    },
    speed: {
      ceil: 200,
      color: '#49D0B0'
    }
  }

  @ViewChild('wrapper') wrapper: ElementRef;

  constructor(private store: Store<{ presentation }>, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.store.select('presentation').subscribe(state => {
      if (!Object.keys(state.choosenPokemon).length) return;

      this.pokemon = state.choosenPokemon;
      this.visible = state.visible;

      this.setPokemonTypes();
      this.setCircleColor();
      this.setStatsPercentage();
    });
  }

  setPokemonTypes () {
    this.pokemonTypes = this.pokemon.types.map(type => {
      const typeName = type.type.name.toLowerCase().trim();

      const typeColor = this.typeConfig[typeName];
      if (!typeColor) return;
      const typeStyle = `--color: ${typeColor}`;

      return {
        style: typeStyle,
        name: typeName
      };
    })
    .filter(type => type !== undefined);
  };

  setStatsPercentage () {
    this.pokemonStats = this.pokemon.stats.map(stat => {
      const statName = stat.stat.name.toLowerCase().trim();

      const statMaxValue = this.statConfig[statName];
      if (!statMaxValue) return;
      const percentage = 100 * stat.base_stat / statMaxValue.ceil;
      const statStyle = `--width: ${Math.ceil(percentage)}%; --bg: ${statMaxValue.color};`;

      return {
        style: statStyle,
        name: statName,
        base: stat.base_stat
      };
    })
    .filter(type => type !== undefined);
  };

  setCircleColor () {
    const hexColor = this.pokemonTypes[0].style.split(' ')[1];

    const bgColor = `--bg: ${hexColor}15`;
    const bgActiveColor = `--bg-active: ${hexColor}30`;
    const borderColor = `--border: ${hexColor}4f`;
    const borderActive = `--border-active: ${hexColor}95`;

    this.circleStyle = [bgColor, borderColor, bgActiveColor, borderActive].join('; ');
  }

  //Function used in template
  closePresentation (): void {
    this.store.dispatch(closePresentation());
  }
}

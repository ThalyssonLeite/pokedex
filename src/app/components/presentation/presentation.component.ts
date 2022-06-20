import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PokedexService } from 'src/app/services/pokedex.service';
import { TranslationService } from 'src/app/services/translation.service';
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
  closeButtonColor: string;
  mainTypeColor: string;
  weight: string;
  height: string;

  private typeConfig: any;
  private statConfig: any;

  @ViewChild('wrapper') wrapper: ElementRef;

  constructor(
    private store: Store<{ presentation, header }>,
    private pokedexService: PokedexService,
    public translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.typeConfig = this.pokedexService.typeConfig;
    this.statConfig = this.pokedexService.statConfig;

    this.store.select('presentation').subscribe(state => {
      if (!Object.keys(state.choosenPokemon).length) return;

      this.pokemon = state.choosenPokemon;
      this.visible = state.visible;

      this.setPokemonTypes();
      this.setCircleColor();
      this.setStatsPercentage();
      this.setButtonColor();
      this.setMainTypeColor();
      this.listenToHeaderState();
    });

  }

  listenToHeaderState () {
    this.store.select('header').subscribe(({ language }) => {
      if (!this.pokemon) return;

      const isEnglish = language !== 'en';

      this.height = isEnglish ? `${this.pokemon.weight / 10}kg` : `${(this.pokemon.weight * 0.220462).toFixed(1)}lb`;
      this.weight = isEnglish ? `${this.pokemon.weight / 10}m` : `${(this.pokemon.height * 0.3280839895).toFixed(1)}ft`;
    }).unsubscribe();
  }

  getHeightAndWeight () {

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

  setButtonColor () {
    const hexColor = this.pokemonTypes[0].style.split(' ')[1];

    const bgColor = `--bg: ${hexColor};`;

    this.closeButtonColor = bgColor;
  }

  setMainTypeColor () {
    this.mainTypeColor = this.pokemonTypes[0].style.split(' ')[1];
  }

  //Function used in template
  closePresentation (): void {
    this.store.dispatch(closePresentation());
  }
}

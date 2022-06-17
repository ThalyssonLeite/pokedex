import { Component, OnInit } from '@angular/core';
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

  constructor(private store: Store<{ presentation }>) { }

  ngOnInit(): void {
    this.store.select('presentation').subscribe(state => {
      this.pokemon = state.choosenPokemon;
      this.visible = state.visible;
    });
  }

  closePresentation (): void {
    this.store.dispatch(closePresentation());
  }
}

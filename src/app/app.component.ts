import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  presentationVisible: boolean;

  constructor (private store: Store<{ presentation }>) {};

  ngOnInit(): void {
    this.listenToPresentation();
  }

  listenToPresentation () {
    this.store.select('presentation').subscribe(state => this.presentationVisible = state.visible);
  }
}

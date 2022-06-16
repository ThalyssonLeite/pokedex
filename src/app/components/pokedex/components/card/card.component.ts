import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'poke-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() pokemon;

  constructor() { }

  ngOnInit(): void {
  }

}

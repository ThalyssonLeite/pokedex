import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'poke-square-shape',
  templateUrl: './square-shape.component.html',
  styleUrls: ['./square-shape.component.scss']
})
export class SquareShapeComponent implements OnInit, OnChanges {
  shapeBalls = Array(36);
  @Input() color: string;
  bgStyle: string;

  constructor() { }

  ngOnInit(): void {
    this.ngOnChanges();
  }

  ngOnChanges() {
    if (this.color) this.bgStyle = `--square-shape: ${this.color}`;
  }
}

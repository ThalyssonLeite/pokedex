import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'poke-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  themeDropdownExpanded: boolean = false;
  themes = ['Claro', 'Escuro'];
  constructor() { }

  ngOnInit(): void {
  }

  chooseTheme (theme: string) {
    const [ previousTheme, choosenTheme ] = this.themes;
    if (theme === previousTheme) return;

    const animationDelay = 300;
    setTimeout(() => this.themes = [choosenTheme, previousTheme], animationDelay);
  }

  toggleDropdown (dropdown: string) {
    const dropdownProperty = this[`${dropdown}DropdownExpanded`];
    this[`${dropdown}DropdownExpanded`] = !dropdownProperty;
  }
}

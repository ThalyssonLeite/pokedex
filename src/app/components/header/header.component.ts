import { Component, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslationService } from 'src/app/services/translation.service';
import { setLanguage, setTheme } from './store/header.actions';

@Component({
  selector: 'poke-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  themeDropdownExpanded: boolean = false;
  languageDropdownExpanded: boolean = false;
  themes: string[];
  languages: string[] = ['pt', 'en', 'es']
  defaultLanguage: string = 'en';
  i18n: any;

  constructor(private store: Store<{ header }>, private renderer: Renderer2, public translationService: TranslationService) {
    //Close THEMES when click outside
    this.renderer.listen('window', 'click', (e) => {
      e.stopPropagation();

      if (!e.target.closest('.themes-wrapper')) this.themeDropdownExpanded = false;
    });

    //Close LANGUAGES when click outside
    this.renderer.listen('window', 'click', (e) => {
      e.stopPropagation();

      if (!e.target.closest('.languages-wrapper')) this.languageDropdownExpanded = false;
    });
  }

  ngOnInit(): void {
    this.checkTheme();
    this.checkLanguage();
    this.listenToHeaderChanges();
  }

  listenToHeaderChanges () {
    this.store.select('header').subscribe(({ theme, language }) => {
      //THEMES
      const body: any = window.document.body;
      body.classList = `${theme}-theme`;

      this.setLocalStorageTheme(theme);
      this.chooseTheme(theme, true);

      //LANGUAGES
      this.setLocalStorageLanguage(language);
    });
  }

  toggleDropdown (dropdown: string) {
    const dropdownProperty = this[`${dropdown}DropdownExpanded`];
    this[`${dropdown}DropdownExpanded`] = !dropdownProperty;
  }

  /*::::: THEMES :::::*/
  chooseTheme (theme: string, firstLoad?: boolean) {
    const previousThemes = this.themes.filter(t => t !== theme);
    const animationDelay = 200;

    setTimeout(() => this.themes = [theme, ...previousThemes], animationDelay);

    if (theme === this.getActiveTheme() || firstLoad) return;

    this.store.dispatch(setTheme({ theme }));
  }

  checkTheme () {
    const browserColorScheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const storageTheme = localStorage.getItem('color_theme') || '';
    const theme = storageTheme || browserColorScheme;
    const secondaryThemeOption = theme === 'light' ? 'dark' : 'light';
    this.themes = [theme, secondaryThemeOption];
    this.store.dispatch(setTheme({ theme }));

    matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      const theme = e.matches ? 'light' : 'dark';
      this.store.dispatch(setTheme({ theme }));
    })
  }

  getActiveTheme () {
    return window.document.body.classList[0].split('-').shift();
  }

  setLocalStorageTheme (theme: string) {
    localStorage.setItem('color_theme', theme);
  }
  /*===== THEMES =====*/

  /*::::: LANGUAGES :::::*/
  chooseLanguage (language: string, firstLoad?: boolean) {
    const previousLanguages = this.languages.filter(t => t !== language);
    const animationDelay = 200;

    if (language === this.getActiveLanguage() || firstLoad) return;

    setTimeout(() => this.languages = [language, ...previousLanguages], animationDelay);

    this.store.dispatch(setLanguage({ language }));
  }

  checkLanguage () {
    const browserLanguage = this.languages.filter(lang => lang === navigator.language.slice(-3))[0] || '';
    const storageLanguage = this.getActiveLanguage();
    const language = storageLanguage || browserLanguage || this.defaultLanguage;
    const secondaryLanguagesOptions = this.languages.filter(l => l !== language);
    this.languages = [language, ...secondaryLanguagesOptions];
    this.store.dispatch(setLanguage({ language }));
  }

  getActiveLanguage () {
    return localStorage.getItem('user_lang') || '';
  }

  setLocalStorageLanguage (language: string) {
    localStorage.setItem('user_lang', language);
  }
  /*===== LANGUAGES =====*/
}

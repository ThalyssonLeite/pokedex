import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { languages } from "../translations/languages";

@Injectable({
  providedIn: 'root'
})

export class TranslationService {
  translations: any;

  constructor (private store: Store<{ header }>) {
    this.store.select('header').subscribe(({ language }) => {
      this.translations = languages[language];
    });
  };
}

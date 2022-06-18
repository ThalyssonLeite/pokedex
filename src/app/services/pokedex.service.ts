import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class PokedexService {
  constructor (private http: HttpClient) {};

  getPokeList (): Observable<any> {
    const pokeListUrl = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    return this.http.get<any>(pokeListUrl);
  }

  getTypeList (): Observable<any> {
    const typeListUrl = 'https://pokeapi.co/api/v2/type?limit=100000&offset=0';
    return this.http.get<any>(typeListUrl);
  }

  getType (url): Observable<any> {
    return this.http.get<any>(url);
  }

  getPokemon (pokemonUrl): Promise<any> {
    return fetch(pokemonUrl);
  }
}

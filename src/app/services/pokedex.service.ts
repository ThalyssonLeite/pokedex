import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable ({
  providedIn: 'root'
})

export class PokedexService {

  readonly typeConfig = {
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
    unknown: '#68A090',
  }

  readonly statConfig = {
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

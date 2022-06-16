import { paginationReducer as pagination } from "../components/pokedex/components/pagination/store/pagination.reducer";
import { pokedexReducer as pokedex } from "../components/pokedex/store/pokedex.reducer";
import { welcomeReducer as welcome } from "../components/welcome/store/pokedex.reducer";

export const appReducers = {
  pagination,
  pokedex,
  welcome
}

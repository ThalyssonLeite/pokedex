import { paginationReducer as pagination } from "../components/pokedex/components/pagination/store/pagination.reducer";
import { cardReducer as card } from "../components/pokedex/components/card/store/card.reducer";
import { pokedexReducer as pokedex } from "../components/pokedex/store/pokedex.reducer";
import { welcomeReducer as welcome } from "../components/welcome/store/welcome.reducer";
import { presentationReducer as presentation } from "../components/presentation/store/presentation.reducer";

export const appReducers = {
  pagination,
  pokedex,
  welcome,
  presentation,
  card,
}

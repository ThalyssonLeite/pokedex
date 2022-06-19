export class PaginationLib {
  //Logica para criar o array de botões
  //@Param(items)
  private items: any[] = [];
  //@Param(items_per_page)
  private items_per_page: number;
  //@Param(number_of_visible_buttons)
  private number_of_visible_buttons: number;
  //@Param(active_page)
  private active_page: number;

  private number_of_items: number;
  private number_of_pages: number;
  private pagination_buttons: any[];
  readonly firstOutput: { items: any[], buttons: number[] };

  constructor ({ inputItems, itemsPerPage, visibleButtons }: { inputItems: any[], itemsPerPage: number, visibleButtons: number}) {
    this.items = inputItems;
    this.items_per_page = itemsPerPage;
    this.number_of_visible_buttons = visibleButtons;

    this.number_of_items = this.items.length;
    this.number_of_pages = Math.ceil(this.number_of_items / this.items_per_page);

    this.firstOutput = this.setActivePage(1);
  }

  private getVisibleItems ({ items, active_page, rows_per_page }) {
    const firstSlicePosition = active_page * rows_per_page - rows_per_page;
    const finalSlicePosition = active_page * rows_per_page;
    return items.slice(firstSlicePosition, finalSlicePosition)
  }

  private getVisiblePaginationButtons ({ active_page, pagination_buttons, number_of_visible_buttons }) {
    const visibleButtonsisOdd = Boolean(number_of_visible_buttons % 2);

    const lengthProportion = 1;
    const middleIndexOfVisibleButtons = (number_of_visible_buttons / 2) - lengthProportion;
    const middleIndexRounded = visibleButtonsisOdd
    ? Math.ceil(middleIndexOfVisibleButtons)
    : Math.floor(middleIndexOfVisibleButtons);

    const isNotInTheBeginningOfThePageButtons = active_page > (middleIndexRounded + lengthProportion);
    const isNotInTheEndingOfThePageButtons = active_page < (pagination_buttons.length - middleIndexRounded);
    const shouldCentralizeButton = isNotInTheBeginningOfThePageButtons && isNotInTheEndingOfThePageButtons;

    if (!shouldCentralizeButton) {
      const firstIndex = 0;
      const initialSlicePosition = isNotInTheBeginningOfThePageButtons === false
      ? firstIndex
      : pagination_buttons.length - number_of_visible_buttons;
      const finalSlicePosition = isNotInTheBeginningOfThePageButtons === false
      ? number_of_visible_buttons
      : undefined;
      return pagination_buttons.slice(initialSlicePosition, finalSlicePosition);
    }

    const halfOfVisibleButtons = number_of_visible_buttons / 2;
    const amountOfPagesVisibleToGoBack = middleIndexRounded;
    const amountOfPagesVisibleToGoForward = visibleButtonsisOdd
    ? middleIndexRounded
    : halfOfVisibleButtons;

    const indexOfTheActivePage = pagination_buttons.findIndex(page => page.number === active_page);
    const initialSlicePosition = indexOfTheActivePage - amountOfPagesVisibleToGoBack;
    const finalSlicePosition = indexOfTheActivePage + amountOfPagesVisibleToGoForward + 1;
    return pagination_buttons.slice(initialSlicePosition, finalSlicePosition);
  }

  setActivePage (activePage: number): { items: any[], buttons: number[] } {
    this.active_page =
      activePage < 1
        ? 1
        : activePage > this.number_of_pages
          ? this.number_of_pages
          : Number(activePage);

    //generating pagination buttons
    const generatePaginationButtons = (_, i) => ({ number: i + 1, active: false });
    const temp = [...Array(this.number_of_pages).keys()].map(generatePaginationButtons)
    temp.forEach(page => page.active = page.number === this.activePage);
    this.pagination_buttons = temp;

    //Lógica para selecionar os items exibidos
    const visible_items = this.getVisibleItems({ items: this.items, active_page: this.active_page, rows_per_page: this.items_per_page });

    //Lógica para controlar quantos botões devem ser visualizados
    const visible_pagination_buttons = this.getVisiblePaginationButtons({
      active_page: this.active_page,
      pagination_buttons: this.pagination_buttons,
      number_of_visible_buttons: this.number_of_visible_buttons
    });

    return {
      items: visible_items,
      buttons: visible_pagination_buttons
    }
  }

  forwardPage () {
    if (this.active_page < this.number_of_pages) this.active_page += 1;
    return this.setActivePage(this.active_page);
  }

  backwardPage () {
    if (this.active_page > 1) this.active_page -= 1;
    return this.setActivePage(this.active_page);
  }

  get activePage (): number {
    return this.active_page || 1;
  }

  get numberOfPages (): number {
    return this.number_of_pages;
  }
}

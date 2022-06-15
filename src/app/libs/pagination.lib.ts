export class PaginationLib {
  //Logica para criar o array de botões
  //@Param(items)
  items = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ];
  //@Param(items_per_page)
  items_per_page = 30;
  //@Param(number_of_visible_buttons)
  number_of_visible_buttons = 10;
  //@Param(active_page)
  active_page = 1;

  constructor ({ items, itemsPerPage, visibleButtons }) {
    this.items = items;
    this.items_per_page = itemsPerPage;
    this.number_of_visible_buttons = visibleButtons;
  }

  number_of_items = this.items.length;
  number_of_pages = Math.ceil(this.number_of_items / this.items_per_page);

  private generatePaginationButtons = (_, i) => ({ number: i + 1, active: false });

  pagination_buttons = [...Array(this.number_of_pages).keys()].map(this.generatePaginationButtons);

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

  setActivePage (activePage) {
    this.active_page = activePage;

    this.pagination_buttons.forEach(page => page.active = page.number === this.active_page);

    //Lógica para selecionar os items exibidos
    const visible_items = this.getVisibleItems({ items: this.items, active_page: this.active_page, rows_per_page: this.items_per_page });

    //Lógica para controlar quantos botões devem ser visualizados
    const visible_pagination_buttons = this.getVisiblePaginationButtons({
      active_page: this.active_page,
      pagination_buttons: this.pagination_buttons,
      number_of_visible_buttons: this.number_of_visible_buttons
    });

    return {
      visibleItems: visible_items,
      paginationSlice: visible_pagination_buttons
    }
  }

  forwardPage () {
    if (this.active_page < this.number_of_pages) this.active_page += 1;
    this.setActivePage(this.active_page);
  }

  backwardPage () {
    if (this.active_page > 1) this.active_page -= 1;
    this.setActivePage(this.active_page);
  }
}

export class location {
  coords: Array<number> = [];

  /**
   * Сеттер для координат пользователя
   * @param lat
   * @param lng
   * @constructor
   */
  public Set(lat: number, lng: number) {
    this.coords = [lat, lng];
  }

  /**
   * Геттер для координат пользователя
   * @returns {Array<number>}
   * @constructor
   */
  Get() {
    return this.coords
  }

}

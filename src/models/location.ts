export class location {
  coords: Array<number>

  public set(lat: number, lng: number) {
    let arr = []
    arr[0] = lat
    arr[1] = lng
    this.coords = arr
  }

  get() {
    return this.coords
  }
}

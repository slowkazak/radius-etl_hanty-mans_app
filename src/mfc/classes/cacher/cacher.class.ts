export class CacherClass {
  /**
   * конструктор сласса кешера
   * @param provider - провайдер кешера ls,sqlite,indexdeddb
   */
  private provider: string = 'ls';

  constructor() {

  }

  private GetMethodsfromProvider() {
    let res = {set: null, get: null, valuerequiremethod: null};
    switch (this.provider) {
      case 'ls':
        res.set = (key, val) => {
          localStorage.setItem(key, val);
        };
        res.get = (key) => {
          localStorage.getItem(key);
        };
        res.valuerequiremethod = 'stringify';
        break;
    }
    return res;
  }

  SetCache(key: string, value: any) {
    let methodes = this.GetMethodsfromProvider();
    methodes.valuerequiremethod === "stringify" ?
      methodes.set('data', JSON.stringify(value)) :
      methodes.set('data', value);
  }

  GetCache(key: string) {
    let methodes = this.GetMethodsfromProvider();
    return methodes.get(key);
  }
}

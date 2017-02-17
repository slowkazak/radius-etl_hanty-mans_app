export interface OmsDateInterface {
  // years: Array<{
  //   id: any,
  //   month: Array<{
  //     id: any,
  //     days: Array<{
  //       id: any,
  //       times: Array<any>
  //     }>
  //   }>
  // }>
  date: any;
  month: any;
  year: any;
  visitLength:any;
  day: Array<{day: any, time: Array<any>}>
}

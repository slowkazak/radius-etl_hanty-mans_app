export class Filter {
  display: Object = {
    dumps: true, // свалки
    roads: true, // дефекты дорог
    offense: true, // правонарушения
    improve: true // улучшим город
  }
  status: Object = {
    solved: true, // решенные
    accepted: true, // принятые
    processing: true, // в работе
    not_solved: true // не решенные
  }

  Set(){
    localStorage.setItem('fl', JSON.stringify({display:this.display, status:this.status}));
  }
  Get(){
    let data:any =localStorage.getItem('fl');
    data? (data = JSON.parse(data), this.status = data.status, this.display = data.display):false;
  }
}

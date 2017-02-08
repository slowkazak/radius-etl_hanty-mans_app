export class Filter {
  display: Object = {
    dumps: false, // свалки
    roads: true, // дефекты дорог
    offense: false, // правонарушения
    improve: true // улучшим город
  }
  status: Object = {
    solved: true, // решенные
    accepted: true, // принятые
    processing: true, // в работе
    not_solved: true // не решенные
  }
}

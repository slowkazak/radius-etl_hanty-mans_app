export const settings = {
  default_lat: 61.008038,
  default_lng: 69.035848,
  adm_api_path: "http://api.admhmansy.ru",
  adm_domain_path: "http://admhmansy.ru",
  files_url:"http://api.admhmansy.ru/files/",
  image_file_extentions: [".png", ".bmp", ".jpg", ".jpg", ".jpeg", ".pcx", ".gif"],
  passport_validator_regexp: "\d{4}\s\d{6}",
  object_media_placeholder_count:4,
  max_video_size_bytes:52428799,
  max_marker_title_length:20,
  error_codes: [{code: "form_no_reqirement_data", title: "Недостаточно данных для выполнения запроса"}],
  polls_types: [
    {"type": "radio", "id": 0},
    {"type": "checkbox", "id": 1},
    {"type": "dropdown", "id": 2},
    {"type": "multiselect", "id": 3},
    {"type": "text", "id": 4},
    {"type": "memo", "id": 5}
  ],
  api_methods: {
    user_update: {
      domain: "adm_api_path",
      method: "/user/update",
      auth_param: "user_id",
      data_param: "data"
    },
    votes_list: {
      domain: "adm_domain_path",
      method: "/vote/vote_api/vote_list.php",
      auth_param: "",
      data_param: ""
    },
    user_info: {
      domain: "adm_api_path",
      method: "/user/info",
      auth_param: "access_token",
      data_param: ""
    },
    vote: {
      domain: "adm_domain_path",
      method: "/vote/vote_api/vote_form.php",
      auth_param: "",
      data_param: "VOTE_ID"
    }
  },
  status_type_id:[
    {id:10,title:"Модерирование"},
    {id:20,title:"В работе"},
    {id:25,title:"Предложение принято"},
    {id:30,title:"Решен"},
    {id:40,title:"Не решен"},
    {id:100,title:"Отклонен модератором"},
    {id:150,title:"Удален"},
    {id:666,title:"ДТП без летального исхода"},
    {id:667,title:"ДТП с летальным исходом"}
  ],
  citylist: [
    {
      name: 'Белоярский',
      state: 'Белоярский район',
      coord: {lat: 63.697366, lng: 66.701972}
    },
    {
      name: 'Когалым',
      state: 'МО город Когалым',
      coord: {lat: 62.263872, lng: 74.482878}
    },
    {
      name: 'Лангепас',
      state: 'МО город Лангепас',
      coord: {lat: 61.253701, lng: 75.180725}
    },
    {
      name: 'Лянтор',
      state: 'Сургутский район',
      coord: {lat: 61.620663, lng: 72.155352}
    },
    {
      name: 'Мегион',
      state: 'МО город Мегион',
      coord: {lat: 61.031835, lng: 76.102549}
    },
    {
      name: 'Нефтеюганск',
      state: 'МО город Нефтеюганск',
      coord: {lat: 61.088212, lng: 72.616331}
    },
    {
      name: 'Нижневартовск',
      state: 'МО город Нижневартовск',
      coord: {lat: 60.939742, lng: 76.569601}
    },
    {
      name: 'Нягань',
      state: 'МО город Нягань',
      coord: {lat: 62.145759, lng: 65.433654}
    },
    {
      name: 'Покачи',
      state: 'МО город Покачи',
      coord: {lat: 61.742253, lng: 75.594120}
    },
    {
      name: 'Пыть-Ях',
      state: 'МО город Пыть-Ях',
      coord: {lat: 60.758589, lng: 72.836526}
    },
    {
      name: 'Радужный',
      state: 'МО город Радужный',
      coord: {lat: 62.134265, lng: 77.458439}
    },
    {
      name: 'Советский',
      state: 'Советский район',
      coord: {lat: 61.620663, lng: 72.155352}
    },
    {
      name: 'Сургут',
      state: 'Городской округ город Сургут',
      coord: {lat: 61.254052, lng: 73.396204}
    },
    {
      name: 'Урай',
      state: 'МО город Урай',
      coord: {lat: 60.129632, lng: 64.803944}
    },
    {
      name: 'Ханты-Мансийск',
      state: 'МО город Ханты-Мансийск',
      coord: {lat: 61.003180, lng: 69.018902}
    },
    {
      name: 'Югорск',
      state: 'МО город Югорск',
      coord: {
        lat: 61.314917, lng: 63.331964
      }
    }
  ]
}

angular.module('app', [
  'veasyTable',
  'ui.sortable'
])

.controller('AppController', ['$scope', '$timeout', function ($scope, $timeout) {

  $scope.people = [];
  $scope.selecteds = [];

  var init = function () {
    $scope.people = [
      {
        "id": 1,
        "first_name": "Joshua",
        "last_name": "Moreno",
        "email": "jmoreno0@etsy.com",
        "country": "China",
        "ip_address": "129.239.106.169",
        "city": "Gangtun"
      },
      {
        "id": 2,
        "first_name": "Michael",
        "last_name": "Mendoza",
        "email": "mmendoza1@slashdot.org",
        "country": "Zambia",
        "ip_address": "80.175.78.131",
        "city": "Chibombo"
      },
      {
        "id": 3,
        "first_name": "Debra",
        "last_name": "Martinez",
        "email": "dmartinez2@businessinsider.com",
        "country": "Philippines",
        "ip_address": "86.100.107.98",
        "city": "Dampol"
      },
      {
        "id": 4,
        "first_name": "Patricia",
        "last_name": "Hall",
        "email": "phall3@npr.org",
        "country": "China",
        "ip_address": "87.113.76.213",
        "city": "Hongshan"
      },
      {
        "id": 5,
        "first_name": "Carol",
        "last_name": "Roberts",
        "email": "croberts4@nifty.com",
        "country": "Vietnam",
        "ip_address": "1.134.25.108",
        "city": "Duyên Hải"
      },
      {
        "id": 6,
        "first_name": "David",
        "last_name": "Davis",
        "email": "ddavis5@issuu.com",
        "country": "China",
        "ip_address": "149.52.78.251",
        "city": "Shaheying"
      },
      {
        "id": 7,
        "first_name": "Cheryl",
        "last_name": "James",
        "email": "cjames6@bizjournals.com",
        "country": "China",
        "ip_address": "16.117.164.10",
        "city": "Lukou"
      },
      {
        "id": 8,
        "first_name": "Jesse",
        "last_name": "Mccoy",
        "email": "jmccoy7@creativecommons.org",
        "country": "Portugal",
        "ip_address": "158.44.99.120",
        "city": "Pinhal de Frades"
      },
      {
        "id": 9,
        "first_name": "Jeffrey",
        "last_name": "Schmidt",
        "email": "jschmidt8@bravesites.com",
        "country": "China",
        "ip_address": "20.149.13.50",
        "city": "Xiangshan"
      },
      {
        "id": 10,
        "first_name": "Julie",
        "last_name": "Burke",
        "email": "jburke9@state.gov",
        "country": "Indonesia",
        "ip_address": "24.197.201.132",
        "city": "Kombandaru"
      },
      {
        "id": 11,
        "first_name": "Helen",
        "last_name": "Cox",
        "email": "hcoxa@jalbum.net",
        "country": "China",
        "ip_address": "102.62.226.115",
        "city": "Micheng"
      },
      {
        "id": 12,
        "first_name": "Walter",
        "last_name": "Cox",
        "email": "wcoxb@bloomberg.com",
        "country": "Indonesia",
        "ip_address": "21.76.205.178",
        "city": "Nagrog"
      },
      {
        "id": 13,
        "first_name": "Martha",
        "last_name": "Murphy",
        "email": "mmurphyc@newsvine.com",
        "country": "Philippines",
        "ip_address": "232.165.15.77",
        "city": "Abut"
      },
      {
        "id": 14,
        "first_name": "Raymond",
        "last_name": "Austin",
        "email": "raustind@usa.gov",
        "country": "Ecuador",
        "ip_address": "141.246.85.53",
        "city": "Velasco Ibarra"
      },
      {
        "id": 15,
        "first_name": "Ashley",
        "last_name": "King",
        "email": "akinge@wikia.com",
        "country": "Poland",
        "ip_address": "141.139.196.179",
        "city": "Choszczno"
      },
      {
        "id": 16,
        "first_name": "Helen",
        "last_name": "Berry",
        "email": "hberryf@disqus.com",
        "country": "Italy",
        "ip_address": "222.42.33.82",
        "city": "Palermo"
      },
      {
        "id": 17,
        "first_name": "Alan",
        "last_name": "Kim",
        "email": "akimg@merriam-webster.com",
        "country": "Poland",
        "ip_address": "4.47.4.216",
        "city": "Stoczek Łukowski"
      },
      {
        "id": 18,
        "first_name": "Sandra",
        "last_name": "Freeman",
        "email": "sfreemanh@dmoz.org",
        "country": "Japan",
        "ip_address": "107.29.78.25",
        "city": "Kōnosu"
      },
      {
        "id": 19,
        "first_name": "Doris",
        "last_name": "Fox",
        "email": "dfoxi@homestead.com",
        "country": "Latvia",
        "ip_address": "108.44.111.57",
        "city": "Tukums"
      },
      {
        "id": 20,
        "first_name": "Jennifer",
        "last_name": "Fox",
        "email": "jfoxj@abc.net.au",
        "country": "Brazil",
        "ip_address": "83.137.45.69",
        "city": "Cambuí"
      }
    ];
  };

  $scope.addPerson = function (person) {
    person.id = ($scope.people.length + 1);
    $scope.people.push(person);
    $scope.person = {};
  };

  // ------------------------------ VEasyTable Configs - START
  $scope.config = {
    id: 'my-veasy-table',
    columns: [
      { header: 'Id',         value: 'id',          show: true },
      { header: 'First Name', value: 'first_name',  show: true },
      { header: 'Last Name',  value: 'last_name',   show: true },
      { header: 'Email',      value: 'email',       show: true },
      { header: 'Country',    value: 'country',     show: true },
      { header: 'IP',         value: 'ip_address',  show: true },
      { header: 'City',       value: 'city',        show: true }
    ],
    checkbox: {
      enable: true,
      size: 20
    },
    pagination: {
      enable: true,
      currentPage: 0,
      itemsPerPage: 10,
    },
    filter: {
      enable: true,
      conditional: true,
      delay: 500
    },
    columnFilter: {
      enable: true,
      autoOpen: true
    },
    sort: {
      enable: true
    },
    resizable: {
      enable: true,
      minimumSize: 30
    },
    events: {
      onClickRow: function (row) {
        alert('Row Clicked: ' + JSON.stringify(row.id) + '. More details in your console.');
        console.log(JSON.stringify(row, null, 2));
        console.log('---------------------------------');
      },
      onApplyColumnFilter: function (columns) {
        alert('Applied Columns! More details in your console.');
        console.log(JSON.stringify(columns, null, 2));
        console.log('---------------------------------');
      }
    },
    i18n: {
      message: {
        noData: 'Não existem dados para exibir'
      },
      filter: {
        by: 'Filtrar por...',
        and: 'E',
        or: 'OU'
      },
      pagination: {
        itemsByPage: 'Itens por Página',
        totalItems: 'Total de Itens'
      },
      columnFilter: {
        title: 'Quais colunas você deseja exibir?',
        okButton: 'Ok',
        cancelButton: 'Cancelar'
      }
    }
  };
  // ------------------------------ EasyTable Configs - END

  $timeout(function () {
    init();
  }, 2500);

}]);

angular.module('app', [
  'veasyTable',
  'ui.sortable'
])

.controller('AppController', ['$scope', '$timeout', function ($scope, $timeout) {

  $scope.people = [];
  $scope.selecteds = [];

  var init = function () {
    $scope.config = {
      id: 'veasy-table',
      columns: [
        { header: 'Id',         value: 'id',          size: 10, show: true },
        { header: 'First Name', value: 'first_name',  size: 40, show: true },
        { header: 'Last Name',  value: 'last_name',   size: 40, show: true },
        { header: 'Email',      value: 'email',       size: 0, show: false },
        { header: 'Country',    value: 'country',     size: 0, show: false },
        { header: 'IP',         value: 'ip_address',  size: 10, show: true }
      ]
      ,
      checkbox: {
        enable: true,
        size: 20
      }
      ,
      pagination: {
        enable: true,
        currentPage: 0,
        itemsPerPage: 10,
      }
      ,
      filter: {
        enable: true,
        conditional: true,
        delay: 500
      }
      ,
      columnFilter: {
        enable: true,
        autoOpen: true,
        modalSize: 'md'
      }
      ,
      sort: {
        enable: true
      }
      ,
      resizable: {
        enable: true,
        minimumSize: 10
      }
      // ,
      // events: {
      //   onClickRow: function (row) {
      //     alert('Row Clicked: ' + JSON.stringify(row.id) + '. More details in your console.');
      //     console.log(JSON.stringify(row, null, 2));
      //     console.log('---------------------------------');
      //   },
      //   onApplyColumnFilter: function (columns) {
      //     alert('Applied Columns! More details in your console.');
      //     console.log(JSON.stringify(columns, null, 2));
      //     console.log('---------------------------------');
      //   }
      // }
      ,
      i18n: {
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

    $scope.people = [
      {
        "id":1,
        "first_name":"Cynthia",
        "last_name":"Austin",
        "email":"caustin0@squarespace.com",
        "country":"United States",
        "ip_address":"51.42.156.149"
      },
      {
        "id":2,
        "first_name":"Betty",
        "last_name":"Davis",
        "email":"bdavis1@apple.com",
        "country":"Finland",
        "ip_address":"145.20.219.23"
      },
      {
        "id":3,
        "first_name":"Virginia",
        "last_name":"Graham",
        "email":"vgraham2@barnesandnoble.com",
        "country":"Russia",
        "ip_address":"100.147.0.151"
      },
      {
        "id":4,
        "first_name":"Jose",
        "last_name":"Olson",
        "email":"jolson3@is.gd",
        "country":"Syria",
        "ip_address":"244.187.122.209"
      },
      {
        "id":5,
        "first_name":"Ernest",
        "last_name":"Gordon",
        "email":"egordon4@illinois.edu",
        "country":"Poland",
        "ip_address":"92.127.223.207"
      },
      {
        "id":6,
        "first_name":"Jeremy",
        "last_name":"Elliott",
        "email":"jelliott5@slideshare.net",
        "country":"China",
        "ip_address":"148.10.148.51"
      },
      {
        "id":7,
        "first_name":"Stephen",
        "last_name":"Arnold",
        "email":"sarnold6@cisco.com",
        "country":"China",
        "ip_address":"169.78.157.137"
      },
      {
        "id":8,
        "first_name":"Judith",
        "last_name":"Morris",
        "email":"jmorris7@homestead.com",
        "country":"Sweden",
        "ip_address":"4.244.15.178"
      },
      {
        "id":9,
        "first_name":"Teresa",
        "last_name":"Frazier",
        "email":"tfrazier8@ebay.com",
        "country":"China",
        "ip_address":"47.17.42.49"
      },
      {
        "id":10,
        "first_name":"Maria",
        "last_name":"Howell",
        "email":"mhowell9@taobao.com",
        "country":"Philippines",
        "ip_address":"15.48.57.70"
      },
      {
        "id":11,
        "first_name":"Keith",
        "last_name":"Oliver",
        "email":"kolivera@telegraph.co.uk",
        "country":"Indonesia",
        "ip_address":"254.29.97.166"
      },
      {
        "id":12,
        "first_name":"Teresa",
        "last_name":"Elliott",
        "email":"telliottb@wikipedia.org",
        "country":"Indonesia",
        "ip_address":"120.71.250.184"
      },
      {
        "id":13,
        "first_name":"Carolyn",
        "last_name":"Snyder",
        "email":"csnyderc@cbslocal.com",
        "country":"China",
        "ip_address":"4.104.117.77"
      },
      {
        "id":14,
        "first_name":"Ruth",
        "last_name":"James",
        "email":"rjamesd@discuz.net",
        "country":"Indonesia",
        "ip_address":"7.240.234.163"
      },
      {
        "id":15,
        "first_name":"Eugene",
        "last_name":"Little",
        "email":"elittlee@gmpg.org",
        "country":"China",
        "ip_address":"57.164.15.150"
      },
      {
        "id":16,
        "first_name":"Ann",
        "last_name":"Mitchell",
        "email":"amitchellf@macromedia.com",
        "country":"Iran",
        "ip_address":"185.106.34.152"
      },
      {
        "id":17,
        "first_name":"James",
        "last_name":"Griffin",
        "email":"jgriffing@wordpress.com",
        "country":"Russia",
        "ip_address":"133.254.32.219"
      },
      {
        "id":18,
        "first_name":"Wayne",
        "last_name":"Barnes",
        "email":"wbarnesh@nifty.com",
        "country":"Bangladesh",
        "ip_address":"200.158.137.137"
      },
      {
        "id":19,
        "first_name":"Nicole",
        "last_name":"Jordan",
        "email":"njordani@psu.edu",
        "country":"China",
        "ip_address":"162.166.20.65"
      },
      {
        "id":20,
        "first_name":"Harold",
        "last_name":"Roberts",
        "email":"hrobertsj@globo.com",
        "country":"Indonesia",
        "ip_address":"91.6.145.8"
      }
    ];
  };

  $scope.addPerson = function (person) {
    person.id = ($scope.people.length + 1);
    $scope.people.push(person);
    $scope.person = {};
  };

  $timeout(function () {
    init();
  }, 2500);

}]);

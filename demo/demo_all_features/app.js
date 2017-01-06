angular.module('myModule', ['veasy.table'])

  .controller('myController', ['$scope', 'mockService', function($scope, mockService) {
    var init = function () {
      $scope.config = mockService.veasyTableConfig();
      $scope.message = 'Please, open your browser\'s console to see all events broadcasts.';
      addListeners();
      loadUsers();
    };

    var loadUsers = function() {
      mockService.findAll().then(function (data) {
        $scope.resultList = data;
      });
    };

    var addListeners = function() {
      addPaginationListeners();
      addSearchListeners();
      addSortListeners();
      addRowListeners();
      addColumnListeners();
      addSelectionListeners();
    };

    var addPaginationListeners = function() {
      $scope.$on('veasyTable:onStartPagination', function (event, data) {
        console.log('veasyTable:onStartPagination', data);
      });
      $scope.$on('veasyTable:onEndPagination', function (event, data) {
        console.log('veasyTable:onEndPagination', data);
      });
    };

    var addSearchListeners = function() {
      $scope.$on('veasyTable:onStartSearch', function (event, data) {
        console.log('veasyTable:onStartSearch', data);
      });
      $scope.$on('veasyTable:onEndSearch', function (event, data) {
        console.log('veasyTable:onEndSearch', data);
      });
    };

    var addSortListeners = function() {
      $scope.$on('veasyTable:onStartSort', function (event, data) {
        console.log('veasyTable:onStartSort', data);
      });
      $scope.$on('veasyTable:onEndSort', function (event, data) {
        console.log('veasyTable:onEndSort', data);
      });
    };

    var addRowListeners = function() {
      $scope.$on('veasyTable:onClickRow', function (event, data) {
        console.log('veasyTable:onClickRow', data);
      });
    };

    var addColumnListeners = function() {
      $scope.$on('veasyTable:onApplyColumnFilter', function (event, data) {
        console.log('veasyTable:onApplyColumnFilter', data);
      });
    };

    var addSelectionListeners = function() {
      $scope.$on('veasyTable:selectedItems', function (event, data) {
        console.log('veasyTable:selectedItems', data);
      });
    };

    init();
  }])

  .factory('mockService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    return {
      veasyTableConfig: function() {
        return {
          columns: [
            { size: 5,  header: 'Id', value: 'id', filter: { type: 'number', fractionSize: 0 } },
            { size: 10, header: 'First Name', value: 'first_name' },
            { size: 10, header: 'Gender', value: 'gender', hideOn: '', default: 'Not Informed' },
            { size: 10, header: 'Company', value: 'company', hideOn: 'xs', default: 'Not Informed' },
            { size: 15, header: 'Address', value: 'address', hideOn: 'xs' },
            { size: 10, header: 'Money', value: 'money', hideOn: '', filter: { type: 'currency', symbol: 'R$', fractionSize: 2 } },
            { size: 30, header: 'Photo', value: 'photo', hideOn: 'sm xs' },
            { size: 10, header: 'Date of Birth', value: 'birth_date', hideOn: 'lg md sm xs', filter: { type: 'date', format: 'dd/MM/yyyy HH:mm:ss' } }
          ],
          contextMenu: {
            enable: true,
            icon: 'fa fa-ellipsis-v',
            options: [
              { icon: 'fa fa-plus', label: 'Adicionar', action: function(row) { alert('Adicionar: ' + JSON.stringify(row)); } },
              { icon: 'fa fa-pencil', label: 'Editar', action: function(row) { alert('Editar: ' + JSON.stringify(row)); } },
              { icon: 'fa fa-trash', label: 'Excluir', action: function(row) { alert('Excluir: ' + JSON.stringify(row)); } }
            ]
          },
          toggleColumns: {
            enable: true,
            position: 'begin',
            icons: {
              opened: 'fa fa-chevron-down',
              closed: 'fa fa-chevron-right'
            }
          },
          clickRow: {
            enable: true
          },
          checkbox: {
            enable: true
          },
          sort: {
            enable: true
          },
          pagination: {
            enable: true,
            currentPage: 0,
            itemsPerPage: 10
          },
          filter: {
            enable: true,
            conditional: true,
            delay: 300
          },
          columnFilter: {
            enable: true,
            modalOptions: {
              size: 'md',
              autoOpen: false,
              keyboard: true,
              backdrop: true
            }
          },
          labels: {
            filter: {
              by: 'Filtrar por...',
              all: 'Todas',
              and: 'E',
              or: 'OU'
            },
            pagination: {
              itemsPerPage: 'Itens por Página',
              totalItems: 'Total de Itens'
            },
            modal: {
              title: 'Quais colunas você deseja exibir?',
              okButton: 'Aplicar',
              cancelButton: 'Cancelar'
            }
          }
        };
      },
      findAll: function() {
        var deferred = $q.defer();

        $timeout(function() {
          $http.get('../people.json').then(function(res) {
            res.data.forEach(function(row) {
              row.date = new Date(row.date);
              row.money = parseFloat(row.money);
            });

            deferred.resolve(res.data);
          }, function(err) {
            deferred.reject(err);
          });
        }, 0);

        return deferred.promise;
      }
    };
  }]);

angular.module('myModule', ['veasy.table'])

  .controller('myController', ['$scope', 'mockService', function($scope, mockService) {
    var init = function () {
      $scope.config = mockService.veasyTableConfig();

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
            { header: 'Id', value: 'id', hideOn: '', filter: { type: 'number', fractionSize: 0 } },
            { header: 'First Name', value: 'first_name', hideOn: '' },
            { header: 'Last Name', value: 'last_name', hideOn: 'xs' },
            { header: 'Email', value: 'email', hideOn: 'sm xs' },
            { header: 'Gender', value: 'gender', hideOn: 'sm xs' },
            { header: 'Money', value: 'money', hideOn: 'xs', filter: { type: 'currency', symbol: 'R$', fractionSize: 2 } },
            { header: 'Date', value: 'date', hideOn: 'lg md sm xs', filter: { type: 'date', format: 'dd/MM/yyyy HH:mm:ss' } }
          ],
          toggleColumns: {
            enable: true,
            position: 'begin',
            icons: {
              opened: 'fa fa-chevron-down',
              closed: 'fa fa-chevron-right'
            }
          },
          checkbox: {
            enable: true,
          },
          sort: {
            enable: true
          },
          pagination: {
            enable: true,
            currentPage: 0,
            itemsPerPage: 10,
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

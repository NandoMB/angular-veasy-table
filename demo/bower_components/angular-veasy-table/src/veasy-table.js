angular.module('veasyTable', [
  'ui.bootstrap',
  'veasyTable.templates'
])

.directive('veasyTable', ['$window', '$filter', '$templateCache', '$timeout', '$modal', function ($window, $filter, $templateCache, $timeout, $modal) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'veasy-table.html',
    scope: {
      list: '=',
      selectedItems: '=',
      config: '='
    },
    link: function (scope, element, attributes, controller) {
      var init = function () {
        addResizeEventOnWindow();

        scope.isLoading = true;

        if (!scope.config.checkbox) scope.config.checkbox = {};
        if (!scope.config.pagination) scope.config.pagination = {};
        if (!scope.config.filter) scope.config.filter = {};
        if (!scope.config.columnFilter) scope.config.columnFilter = {};
        if (!scope.config.ordenation) scope.config.ordenation = {};
        if (!scope.config.resizable) scope.config.resizable = {};

        // Checkbox
        if (!scope.config.checkbox.enable) {
          scope.config.checkbox.enable = false;
          scope.config.checkbox.size = 0;
        }

        // Pagination
        if (!scope.config.pagination.enable) {
          scope.config.pagination.enable = false;
          scope.config.pagination.currentPage = 0;
          scope.config.pagination.itemsPerPage = scope.list.length || 0;
        }

        // Filter
        if (!scope.config.filter.enable) {
          scope.config.filter.enable = false;
          scope.config.filter.conditional = false;
        }

        // Column Filter
        if (!scope.config.columnFilter.enable) {
          scope.config.columnFilter.enable = false;
        }

        // Ordenation
        if (!scope.config.ordenation.enable) {
          scope.config.ordenation.enable = false;
        }

        // Resizable
        if (!scope.config.resizable.enable) {
          scope.config.resizable.enable = false;
          scope.config.resizable.minimumSize = 30;
        }

        // Others
        scope.predicate = '';
        scope.reverse = false;
        scope.query = '';
        scope.condition = 'AND';
        scope.colspan = 1;
        scope.visibleColumns = [];
        scope.paginatedList = [];
        scope.filteredList = [];
        scope.cbs = [];

        scope.search();

        for (var i = 0; i < scope.filteredList.length; i++) {
          scope.cbs[i] = false;
        };

        scope.dragColIndex;
        scope.initialPosition;
        scope.direction;
        scope.tableWidth = angular.element('#' + scope.config.id).width();


      };

      var addResizeEventOnWindow = function () {
        $window.addEventListener("resize", function () {
          scope.tableWidth = angular.element('#' + scope.config.id).width();
          setInitialColumnsSize();
          scope.$apply();
        });
      }

      /*
       * ============================ Checkbox Controller ============================
       */

      scope.checkboxSize = function () {
        return scope.config.checkbox.size + 'px';
      }

      scope.getIndex = function (row) {
        return scope.filteredList.indexOf(row);
      };

      scope.checkRow = function (row) {
        var index = scope.getIndex(row);
        var checkbox = scope.cbs[index];
        var position = scope.selectedItems.indexOf(row);

        if (checkbox && position === -1) {
          scope.selectedItems.push(row);
        }

        if (checkbox && position > -1) {
          scope.selectedItems.splice(position, 1);
          scope.cbs[index] = false;
        }

        if (!checkbox && position > -1) {
          scope.selectedItems.splice(position, 1);
        }
      };

      scope.checkAllRows = function (checkbox) {
        angular.forEach(scope.paginatedList, function (group) {
          angular.forEach(group, function (item, index) {
            scope.cbs[scope.getIndex(item)] = checkbox;
            scope.checkRow(item);
          });
        });
      };

      var checkSelectedCheckboxes = function () {
        angular.forEach(scope.selectedItems, function (item) {
          scope.cbs[scope.getIndex(item)] = true;
        });
      };

      /*
       * ============================ Filter Controller ============================
       */

      scope.changeCondition = function (condition) {
        scope.condition = condition;
        scope.search();
      };

      scope.search = function () {
        scope.filteredList = $filter('filter')(scope.list, function (row) {
          switch (scope.condition) {
            case 'AND':
              return searchWithANDCondition(row);
            case 'OR':
              return searchWithORCondition(row);
          }
        });

        if (scope.config.ordenation.enable) {
          if (scope.predicate !== '') {
            scope.filteredList = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
          }
        }

        scope.config.pagination.currentPage = 0;
        scope.generatePages();
      };

      var searchWithANDCondition = function (row) {
        var rowData = '';

        angular.forEach(scope.config.columns, function (column) {
          rowData += (' ' + row[column.value]);
        });

        var result = [];
        var terms = angular.lowercase(scope.query).split(" ");

        angular.forEach(terms, function (term) {
          result.push(rowData.toString().toLowerCase().indexOf(term) >= 0);
        });

        if (result.indexOf(false) !== -1) return false;

        return true;
      };

      var searchWithORCondition = function (row) {
        var terms = angular.lowercase(scope.query).split(" ");
        var result = [];

        angular.forEach(scope.config.columns, function (column) {
          var value = row[column.value];
          angular.forEach(terms, function (term) {
            result.push(value.toString().toLowerCase().indexOf(term) >= 0);
          });
        });

        if (result.indexOf(true) >= 0) return true;

        return false;
      };

      scope.generatePages = function () {
        scope.paginatedList = [];
        for (var i = 0; i < scope.filteredList.length; i++) {
          var index = i / scope.config.pagination.itemsPerPage;
          if (i % scope.config.pagination.itemsPerPage === 0) {
            if (!isNaN(index) && isFinite(index)) scope.paginatedList[Math.floor(index)] = [scope.filteredList[i]];
          } else {
            if (!isNaN(index) && isFinite(index)) scope.paginatedList[Math.floor(index)].push(scope.filteredList[i]);
          }
        }
      };

      /*
       * ============================ OrderBy Controller ============================
       */

      scope.sort = function (predicate) {
        if (!scope.config.ordenation.enable) return;

        if (scope.predicate === predicate) scope.reverse = !scope.reverse;

        scope.predicate = predicate;

        if (scope.predicate !== '') {
          scope.filteredList = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
          scope.generatePages();
        }
      };

      scope.orderByIcon = function (direction, predicate) {
        if (!scope.config.ordenation) return false;

        switch (direction) {
          case 'asc':
            return scope.predicate === predicate && scope.reverse;
          case 'desc':
            return scope.predicate === predicate && !scope.reverse;
          default:
            return true;
        }
      };

      /*
       * ============================ Pagination Controller ============================
       */

      scope.pages = function () {
        if (!scope.config.pagination.enable) return;

        var start = scope.config.pagination.currentPage;
        var totalPages = scope.paginatedList.length - 1;
        var range = 5;
        var result = [];

        if (start > totalPages - range)
          start = totalPages - range + 1;

        for (var i = start; i < start + range; i++) {
          if (i >= 0)
            result.push(i);
        }

        checkSelectedCheckboxes();
        return result;
      };

      scope.prevPage = function () {
        if (scope.config.pagination.currentPage > 0) {
          scope.config.pagination.currentPage--;
        }
      };

      scope.nextPage = function () {
        if (scope.config.pagination.currentPage < scope.paginatedList.length - 1) {
          scope.config.pagination.currentPage++;
        }
      };

      scope.setPage = function (page) {
        scope.config.pagination.currentPage = page;
      };

      scope.prevPageDisabled = function () {
        return scope.config.pagination.currentPage === 0 ? "disabled" : "";
      };

      scope.nextPageDisabled = function () {
        return scope.config.pagination.currentPage === (scope.paginatedList.length - 1) ? "disabled" : "";
      };

      scope.$watchCollection('list', function (newValue) {
        scope.search();
        if (scope.list.length > 0) {
          if (!scope.config.pagination.enable) {
            scope.config.pagination.itemsPerPage = scope.list.length;
            scope.generatePages();
          }

          setVisibleColumnsInitial();
          scope.isLoading = false;
        }
      });

      /*
       * ============================ Filter Column Controller ============================
       */

      var setVisibleColumnsInitial = function () {
        var array = [];

        angular.forEach(scope.config.columns, function (column) {
          if(column.show) {
            array.push(column);
          }
        });

        scope.visibleColumns = array;
        scope.colspan = scope.visibleColumns.length + 1;
        setInitialColumnsSize();
      };

      scope.openColumnFilter = function (size) {
        var modal = $modal.open({
          templateUrl: 'veasy-table-modal.html',
          controller: 'ColumnFilterController',
          size: size,
          resolve: {
            columns: function () {
              return scope.config.columns;
            }
          }
        });

        modal.result.then(function (visibleColumns) {
          scope.visibleColumns = visibleColumns;
          scope.colspan = scope.visibleColumns.length + 1;
          setInitialColumnsSize();
        }, function () {
          // dismiss
        });
      };

      /*
       * ============================ Resizable ============================
       */

      var setInitialColumnsSize = function () {
        scope.tableWidth = angular.element('#' + scope.config.id).width();

        angular.forEach(scope.visibleColumns, function (column, index) {
          scope.visibleColumns[index].size = (scope.tableWidth - scope.config.checkbox.size) / scope.visibleColumns.length;
        });
      };

      scope.onDrag = function (event, index) {
        scope.dragging = true;
        scope.initialPosition = normalizeMousePosition(event).x;
        scope.dragColIndex = index;
      };

      scope.onLeave = function (event) {
        scope.onStopDrag(event);
      };

      scope.onStopDrag = function (event) {
        scope.dragging = false;
        scope.dragColIndex = undefined;
      };

      scope.onMove = function (event) {
        if (!scope.dragging) return;

        var index = scope.dragColIndex;
        var rightColumnSize = scope.visibleColumns[index].size;
        var leftColumnSize = scope.visibleColumns[index - 1].size;
        var offset = normalizeTableOffset(event);
        var actualPosition = normalizeMousePosition(event).x;

        if (actualPosition > scope.initialPosition) scope.direction = true; // to right
        if (actualPosition < scope.initialPosition) scope.direction = false; // to left

        var pixels = calculateDistance(scope.initialPosition, actualPosition, offset.left);

        if (((rightColumnSize + pixels) < scope.config.resizable.minimumSize) || ((leftColumnSize - pixels) < scope.config.resizable.minimumSize)) pixels = 0;

        move(pixels, index);
      };

      var normalizeMousePosition = function (event) {
        event = event || window.event;

        var pageX = event.pageX;
        var pageY = event.pageY;

        if (pageX === undefined) {
          pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return { x: pageX, y: pageY };
      };

      var normalizeTableOffset = function (event) {
        return document.getElementById(scope.config.id).getBoundingClientRect();
      };

      var getTableSize = function () {
        return angular.element('#' + scope.config.id).width();
      }

      var calculateDistance = function (initialPosition, actualPosition, offset) {
        scope.direction = true;

        if (actualPosition < initialPosition) scope.direction = false;

        var a = Math.abs(parseInt(initialPosition - offset));
        var b = Math.abs(parseInt(actualPosition - offset));

        scope.initialPosition = actualPosition;

        return (a - b);
      };

      var move = function (pixels, index) {
        scope.visibleColumns[index].size += pixels;
        scope.visibleColumns[index - 1].size -= pixels;
      };

      init();
    }
  };
}])


.controller('ColumnFilterController', ['$scope', '$modalInstance', 'columns', function ($scope, $modalInstance, columns) {

  var init = function () {
    $scope.visibleColumns = [];
    $scope.columns = columns;
    $scope.setVisibleColumns();
  }

  $scope.ok = function () {
    $modalInstance.close($scope.visibleColumns);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.setVisibleColumns = function () {
    var array = [];

    angular.forEach($scope.columns, function (column) {
      if(column.show) {
        array.push(column);
      }
    });

    $scope.visibleColumns = array;
  };

  init();

}]);
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
        scope.isLoading = true;
        scope.tableSize = 0;
        scope.minimumTableSize = 400;
        scope.condition = 'AND';
        scope.paginatedList = [];

        validateConfig();

        scope.$watch(function () {
          return angular.element('#' + scope.config.id).width();
        }, function (newTableSize) {
          if (newTableSize > scope.minimumTableSize) {
            scope.tableSize = newTableSize;
          }
        });

        scope.$watch(function () {
          return scope.config.columns;
        }, function (newColumns) {
          if (newColumns && newColumns.length > 0) {
            loadTable(newColumns, scope.config.resizable.minimumSize);
          }
        });

        scope.$watch(function () {
          return scope.list;
        }, function (newList) {
          if (newList && newList.length > 0) {

            if (!scope.config.pagination.enable) {
              scope.config.pagination.itemsPerPage = newList.length;
              scope.currentPage = 0;
            } else {
              scope.currentPage = scope.config.pagination.currentPage;
            }

            loadData(newList);
            scope.isLoading = false;
          }
        });
      };

      var validateConfig = function () {
        if (!scope.config) scope.config = {};
        if (!scope.config.id) scope.config.id = 'veasy-table';
        if (!scope.config.columns) scope.config.columns = [];
        if (!scope.config.checkbox) scope.config.checkbox = {};
        if (!scope.config.checkbox.enable) scope.config.checkbox.enable = false;
        if (!scope.config.checkbox.size) scope.config.checkbox.size = 20;
        if (!scope.config.resizable) scope.config.resizable = {};
        if (!scope.config.resizable.enable) scope.config.resizable.enable = false;
        if (!scope.config.resizable.minimumSize) scope.config.resizable.minimumSize = 1;
        if (!scope.config.pagination) scope.config.pagination = {};
        if (!scope.config.pagination.enable) scope.config.pagination.enable = false;
        if (!scope.config.pagination.enable) scope.config.pagination.currentPage = 0;
        if (!scope.config.pagination.enable) scope.config.pagination.itemsPerPage = 10;
      };

      var loadTable = function (columnsArray, minimumColumnSize) {
        if (scope.config.columnFilter.autoOpen && defineColumnsVisibility(columnsArray).length < 1)
          scope.openColumnFilter(scope.config.columnFilter.modalSize);

        scope.visibleColumns = defineColumns(angular.copy(columnsArray), angular.copy(minimumColumnSize));
        defineColspan(scope.visibleColumns.length);
      };

      var loadData = function (list) {
        generatePages(list);
        scope.totalOfItems = list.length;
      };

      /*
       * Initial Column Size
       */

      var defineColumns = function (columnsArray, minimumSize) {
        var columns = defineColumnsVisibility(columnsArray);
        columns = defineColumnsSize(columns, minimumSize);
        return columns;
      };

      var defineColumnsVisibility = function (columnsArray) {
        return columnsArray.filter(function (column) {
          return column.show;
        });
      };

      var defineColumnsSize = function (columnsArray, minimumSize) {
        var idsVisibleColumns = [];

        var amount = columnsArray.reduce(function (total, element, index, array) {
          if (element.show) {
            if (element.size && element.size >= minimumSize) {
              idsVisibleColumns.push(index);
              return (total + element.size);
            } else {
              // delete element.size;
              // return total;
              element.size = minimumSize;
              return (total + element.size);
            }
          } else {
            if (element.size) delete element.size;
            return total;
          }
        }, 0);

        if (idsVisibleColumns.length < 1)
          return splitEqually(getTableSize(), columnsArray);

        var remainder = (100 - amount);
        var lastIndex = idsVisibleColumns[idsVisibleColumns.length - 1];

        if (!columnsArray[lastIndex].size || (columnsArray[lastIndex].size + remainder) < minimumSize)
          return splitEqually(getTableSize(), columnsArray);

        columnsArray[lastIndex].size += remainder;

        return splitByDefinedSize(getTableSize(), columnsArray);
      };

      var splitByDefinedSize = function (tableSize, columnsArray) {
        angular.forEach(columnsArray, function (column) {
          column.size = Math.round(tableSize * column.size) / 100;
        });
        return columnsArray;
      };

      var splitEqually = function (tableSize, columnsArray) {
        angular.forEach(columnsArray, function (column, index) {
          column.size = Math.round((tableSize / columnsArray.length) * 100) / 100;
        });
        return columnsArray;
      };

      /*
       * Resizable
       */

      scope.onDragStart = function (event, index) {
        scope.initialPosition = normalizeMousePosition(event).x;
        scope.draggableColumnIndex = index;
        scope.dragging = true;
      };

      scope.onDragStop = function (event) {
        scope.draggableColumnIndex = undefined;
        scope.dragging = false;

        // if (!!scope.config.events.onApplyColumnFilter) {
        //   if (scope.resizeTimer)
        //     $timeout.cancel(scope.resizeTimer);

        //   scope.resizeTimer = $timeout(function () {
        //     scope.onApplyColumnFilter(angular.copy(scope.visibleColumns));
        //   }, 5000);
        // }
      };

      scope.onMove = function (event, columns) {
        if (!scope.dragging) return;

        var index = angular.copy(scope.draggableColumnIndex);
        var rightColumnSize = columns[index].size;
        var leftColumnSize = columns[index - 1].size;
        var minimumSize = getColumnMinimumSizeInPixels();
        var offset = normalizeTableOffset(event);
        var actualPosition = normalizeMousePosition(event).x;

        if (actualPosition > scope.initialPosition)
          scope.direction = true; // to right
        if (actualPosition < scope.initialPosition)
          scope.direction = false; // to left

        var pixels = calculateResizeDistance(scope.initialPosition, actualPosition, offset.left);

        if (((rightColumnSize + pixels) < minimumSize) || ((leftColumnSize - pixels) < minimumSize))
          pixels = 0;

        move(pixels, index);
      };

      var calculateResizeDistance = function (initialPosition, actualPosition, offset) {
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

      /*
       * Data Filter
       */

      scope.changeCondition = function (condition, query) {
        scope.condition = condition;
        scope.search(condition, query);
      };

      scope.changeQuery = function (condition, query) {
        if (scope.queryBusy)
          $timeout.cancel(scope.queryBusy);

        scope.queryBusy = $timeout(function () {
          scope.search(condition, query);
        }, scope.config.filter.delay);
      };

      scope.search = function (condition, query) {
        var list = executeSearch(condition, query);
        scope.totalOfItems = list.length;
        loadData(list);
      };

      var executeSearch = function (condition, query) {
        scope.searching = true;

        var result = $filter('filter')(scope.list, function (row) {
          switch (condition) {
            case 'AND':
              return searchWithANDCondition(row, query);
            case 'OR':
              return searchWithORCondition(row, query);
          }
        });

        // if (scope.config.sort.enable) {
        //   if (scope.predicate !== '') {
        //     scope.filteredList = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
        //   }
        // }

        // if (!scope.isLoading)
        //   scope.config.pagination.currentPage = 0;

        scope.searching = false;
        return result;
      };

      var searchWithANDCondition = function (row, query) {
        var rowData = '';

        angular.forEach(scope.visibleColumns, function (column) {
          rowData += (' ' + row[column.value]);
        });

        var result = [];
        var terms = angular.lowercase(query).split(' ');

        angular.forEach(terms, function (term) {
          result.push(rowData.toString().toLowerCase().indexOf(term) >= 0);
        });

        if (result.indexOf(false) !== -1) return false;

        return true;
      };

      var searchWithORCondition = function (row, query) {
        var terms = angular.lowercase(query).split(' ');
        var result = [];

        angular.forEach(scope.visibleColumns, function (column) {
          var value = row[column.value] ? row[column.value] : '';
          angular.forEach(terms, function (term) {
            result.push(value.toString().toLowerCase().indexOf(term) >= 0);
          });
        });

        if (result.indexOf(true) >= 0) return true;

        return false;
      };

      /*
       * Pagination
       */

      var generatePages = function (list) {
        scope.paginatedList = [];

        for (var i = 0; i < list.length; i++) {
          var index = i / scope.config.pagination.itemsPerPage;
          if (i % scope.config.pagination.itemsPerPage === 0) {
            if (!isNaN(index) && isFinite(index)) scope.paginatedList[Math.floor(index)] = [list[i]];
          } else {
            if (!isNaN(index) && isFinite(index)) scope.paginatedList[Math.floor(index)].push(list[i]);
          }
        }
      };

      scope.pages = function () {
        if (!scope.config.pagination.enable) return;

        var start = scope.currentPage;
        var totalPages = scope.paginatedList.length - 1;
        var range = 5;
        var result = [];

        if (start > totalPages - range)
          start = totalPages - range + 1;

        for (var i = start; i < start + range; i++) {
          if (i >= 0)
            result.push(i);
        }

        // checkSelectedCheckboxes();

        return result;
      };

      scope.setPage = function (page) {
        scope.currentPage = page;
      };

      scope.prevPage = function () {
        if (scope.currentPage > 0) scope.currentPage--;
      };

      scope.prevPageDisabled = function () {
        return scope.currentPage == 0 ? 'disabled' : '';
      };

      scope.nextPage = function () {
        if (scope.currentPage < scope.paginatedList.length - 1) scope.currentPage++;
      };

      scope.nextPageDisabled = function () {
        return scope.currentPage == (scope.paginatedList.length - 1) ? 'disabled' : '';
      };

      /**
       * Order by
       */

      scope.sort = function (predicate, list) {
        if (!scope.config.sort.enable) return;

        if (scope.predicate === predicate)
          scope.reverse = !scope.reverse;

        scope.predicate = predicate;

        if (scope.predicate !== '') {
          list = $filter('orderBy')(list, scope.predicate, scope.reverse);
        }
      };

      scope.orderByIcon = function (direction, predicate) {
        if (!scope.config.sort.enable) return false;

        switch (direction) {
          case 'asc':
            return scope.predicate === predicate && scope.reverse;
          case 'desc':
            return scope.predicate === predicate && !scope.reverse;
          default:
            return true;
        }
      };

      /**
       * Column Filter
       */

      scope.openColumnFilter = function (size) {
        var modal = $modal.open({
          templateUrl: 'veasy-table-modal.html',
          controller: 'ColumnFilterController',
          size: size,
          resolve: {
            config: function () {
              return scope.config;
            }
          }
        });

        modal.result.then(function (columns) {
          loadTable(columns, scope.config.resizable.minimumSize);
          // scope.onApplyColumnFilter(angular.copy(columns));
        });
      };

      scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) { return true; },
        itemMoved: function (event) {},
        orderChanged: function(event) {},
        containment: '#board'
      };

      /*
       * Utils
       */

      var getTableSize = function () {
        var tableSize = angular.copy(scope.tableSize);

        if (scope.config.checkbox.enable)
          tableSize -= scope.config.checkbox.size;

        return tableSize;
      };

      var normalizeTableOffset = function (event) {
        return document.getElementById(scope.config.id).getBoundingClientRect();
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

      var getColumnMinimumSizeInPixels = function () {
        var tableSize = angular.copy(scope.tableSize);
        return ((scope.config.resizable.minimumSize * tableSize) / 100);
      };

      var defineColspan = function (colspan) {
        if (scope.config.checkbox.enable)
          colspan += 1;

        scope.colspan = colspan;
      }

      init();

    }
  };
}])

.controller('ColumnFilterController', ['$scope', '$modalInstance', 'config', function ($scope, $modalInstance, config) {

  var init = function () {
    $scope.config = config;
    $scope.columns = config.columns;
    $scope.visibleColumns = getVisibleColumns($scope.columns);
  }

  $scope.ok = function () {
    var visibleColumns = getVisibleColumns($scope.columns);
    $modalInstance.close(visibleColumns);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  var getVisibleColumns = function (columns) {
    var array = [];

    angular.forEach(columns, function (column) {
      if (column.$$hashKey)
        delete column.$$hashKey;

      if (column.size)
        delete column.size;

      if (column.show)
        array.push(column);
    });

    return array;
  };

  init();

}]);


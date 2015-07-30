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

        // Validate Config
        validateCheckbox();
        validatePagination();
        validateFilter();
        validateColumnFilter();
        validateSort();
        validateResizable();
        validateEvents();
        validateTranslate();

        // Others
        scope.dragColIndex;
        scope.initialPosition;
        scope.direction;
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
      };

      scope.$watch(function () {
        return angular.element('#' + scope.config.id).width();
      }, function (newTableSize) {
        scope.tableWidth = newTableSize;

        if (scope.isLoading) {
          var minimumColumnSizePercent = angular.copy(scope.config.resizable.minimumSize);
          scope.config.resizable.minimumSize = (newTableSize * scope.config.resizable.minimumSize) / 100;

          setColumnsSizeOnLoad(newTableSize, minimumColumnSizePercent);
        }
      });

      var setColumnsSizeOnLoad = function (tableSize, minimumColumnSize) {
        var visibleColumnsIds = [];

        var totalSize = scope.config.columns.reduce(function (total, element, index, array) {
          if (element.show) {
            if (!element.size || element.size < minimumColumnSize) {
              delete element.size;
              element.show = false;
              return total;
            }
            visibleColumnsIds.push(index);
            return total + element.size;
          } else {
            if (element.size)
              delete element.size;

            return total;
          }
        }, 0);

        var rest = 100 - totalSize;
        var lastVisibleColumnIndex = visibleColumnsIds[visibleColumnsIds.length -1];

        if (!scope.config.columns[lastVisibleColumnIndex].size)
          return setColumnsSize();

        scope.config.columns[lastVisibleColumnIndex].size += rest;

        if (scope.config.columns[lastVisibleColumnIndex].size < minimumColumnSize)
          return setColumnsSize();

        if (scope.config.checkbox.enable)
          tableSize -= scope.config.checkbox.size

        angular.forEach(scope.config.columns, function (column) {
          if (column.size)
            column.size = (tableSize * column.size) / 100;
        });
      };

      var resetAllColumnsSize = function (array) {
        scope.$apply(function () {
          angular.forEach(array, function (column, index) {
            column.size = 0;
          });
        });
      };

      var addResizeEventOnWindow = function () {
        $window.addEventListener('resize', function () {
          var backup = angular.copy(scope.visibleColumns);

          angular.forEach(backup, function (column) {
            column.size = (column.size * 100) / scope.tableWidth;
          });

          resetAllColumnsSize(scope.visibleColumns);
          scope.tableWidth = getTableSize();

          angular.forEach(backup, function (column) {
            column.size = (column.size * scope.tableWidth) / 100;
          });

          scope.$apply(function () {
            scope.visibleColumns = backup;
          });
        });
      };

      var validateCheckbox = function () {
        if (!scope.config.checkbox) {
          scope.config.checkbox = {
            enable: false,
            size: 0
          };
        }

        if (scope.config.checkbox.enable) {
          if (!scope.config.checkbox.size || scope.config.checkbox.size < 20)
            scope.config.checkbox.size = 20;
        }
      };

      var validatePagination = function () {
        if (!scope.config.pagination) {
          scope.config.pagination = {
            enable: false,
            currentPage: 0,
            itemsPerPage: scope.list.length || 10
          };
        }

        if (scope.config.pagination.enable) {
          if (!scope.config.pagination.currentPage || scope.config.pagination.currentPage <= 0)
            scope.config.pagination.currentPage = 0;
          else {
            scope.config.pagination.currentPage -= 1;
          }
          if (!scope.config.pagination.itemsPerPage)
            scope.config.pagination.itemsPerPage = 10;
        }
      };

      var validateFilter = function () {
        if (!scope.config.filter) {
          scope.config.filter = {
            enable: false,
            conditional: false
          };
        }

        if (scope.config.filter.enable) {
          if (!scope.config.filter.conditional)
            scope.config.filter.conditional = false;
        }
      };

      var validateColumnFilter = function () {
        if (!scope.config.columnFilter) {
          scope.config.columnFilter = {
            enable: false
          };
        }

        if (scope.config.columnFilter.enable) {
          if (!scope.config.columnFilter.autoOpen)
            scope.config.columnFilter.autoOpen = false;

          if (!scope.config.columnFilter.modalSize)
            scope.config.columnFilter.modalSize = 'sm';
        }
      };

      var validateSort = function () {
        if (!scope.config.sort) {
          scope.config.sort = {
            enable: false
          };
        }
      };

      var validateResizable = function () {
        if (!scope.config.resizable) {
          scope.config.resizable = {
            enable: false
          };
        }

        if (scope.config.resizable.enable) {
          if (!scope.config.resizable.minimumSize || scope.config.resizable.minimumSize < 1)
            scope.config.resizable.minimumSize = 5;
        }
      };

      var validateEvents = function () {
        if (!scope.config.events) scope.config.events = {};
        if (!scope.config.events.onClickRow) scope.config.events.onClickRow = undefined;
        if (!scope.config.events.onApplyColumnFilter) scope.config.events.onApplyColumnFilter = undefined;
      };

      var validateTranslate = function () {
        if (!scope.config.i18n) scope.config.i18n = {};
        // Filter
        if (!scope.config.i18n.filter) scope.config.i18n.filter = {};
        if (!scope.config.i18n.filter.by) scope.config.i18n.filter.by = 'Filter by...';
        if (!scope.config.i18n.filter.and) scope.config.i18n.filter.and = 'AND';
        if (!scope.config.i18n.filter.or) scope.config.i18n.filter.or = 'OR';
        // Pagination
        if (!scope.config.i18n.pagination) scope.config.i18n.pagination = {};
        if (!scope.config.i18n.pagination.itemsByPage) scope.config.i18n.pagination.itemsByPage = 'Items by Page';
        if (!scope.config.i18n.pagination.totalItems) scope.config.i18n.pagination.totalItems = 'Total Items';
        // Column Filter
        if (!scope.config.i18n.columnFilter) scope.config.i18n.columnFilter = {};
        if (!scope.config.i18n.columnFilter.title) scope.config.i18n.columnFilter.title = 'Which columns you want to display?';
        if (!scope.config.i18n.columnFilter.okButton) scope.config.i18n.columnFilter.okButton = 'Ok';
        if (!scope.config.i18n.columnFilter.cancelButton) scope.config.i18n.columnFilter.cancelButton = 'Cancel';
      };

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

      scope.changeQuery = function () {
        if (scope.busy)
          $timeout.cancel(scope.busy);

        scope.searching = true;
        scope.busy = $timeout(function () {
          scope.search();
          scope.searching = false;
        }, scope.config.filter.delay);
      };

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

        if (scope.config.sort.enable) {
          if (scope.predicate !== '') {
            scope.filteredList = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
          }
        }

        if (!scope.isLoading)
          scope.config.pagination.currentPage = 0;

        scope.generatePages();
      };

      var searchWithANDCondition = function (row) {
        var rowData = '';

        angular.forEach(scope.visibleColumns, function (column) {
          rowData += (' ' + row[column.value]);
        });

        var result = [];
        var terms = angular.lowercase(scope.query).split(' ');

        angular.forEach(terms, function (term) {
          result.push(rowData.toString().toLowerCase().indexOf(term) >= 0);
        });

        if (result.indexOf(false) !== -1) return false;

        return true;
      };

      var searchWithORCondition = function (row) {
        var terms = angular.lowercase(scope.query).split(' ');
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
        if (!scope.config.sort.enable) return;

        if (scope.predicate === predicate) scope.reverse = !scope.reverse;

        scope.predicate = predicate;

        if (scope.predicate !== '') {
          scope.filteredList = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
          scope.generatePages();
        }
      };

      scope.orderByIcon = function (direction, predicate) {
        if (!scope.config.sort) return false;

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
        return scope.config.pagination.currentPage === 0 ? 'disabled' : '';
      };

      scope.nextPageDisabled = function () {
        return scope.config.pagination.currentPage === (scope.paginatedList.length - 1) ? 'disabled' : '';
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

          if (scope.config.columnFilter.autoOpen && !haveVisibleColumn(scope.config.columns))
            scope.openColumnFilter(scope.config.columnFilter.modalSize);
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

        scope.colspan = scope.visibleColumns.length;

        if (scope.config.checkbox.enable)
          scope.colspan += 1;
      };

      var haveVisibleColumn = function (array) {
        var filtered = array.filter(function (element) {
          return element.show;
        });

        return filtered.length > 0;
      };

      scope.openColumnFilter = function (size) {
        scope.onApplyColumnFilter(scope.visibleColumns);

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
          scope.visibleColumns = angular.copy(columns);
          scope.colspan = scope.visibleColumns.length + 1;
          setColumnsSize();
          scope.onApplyColumnFilter(angular.copy(columns));
        });
      };

      scope.dragControlListeners = {
        accept: function (sourceItemHandleScope, destSortableScope) {
          return true;
        },
        itemMoved: function (event) {},
        orderChanged: function(event) {},
        containment: '#board'
      };

      /*
       * ============================ Resizable ============================
       */

      var setColumnsSize = function () {
        var tableSize = angular.copy(scope.tableWidth);

        if (scope.config.checkbox.enable)
          tableSize = tableSize - scope.config.checkbox.size;

        if (scope.isLoading && scope.visibleColumns.length > 0) {
          var minimumColumnSize = (scope.config.resizable.minimumSize / tableSize) * 100;

          var totalSize = scope.visibleColumns.reduce(function (total, nextElement, index, array) {
            return total + nextElement.size;
          }, 0);

          var rest = 100 - totalSize;

          var lastIndex = scope.config.columns.length - 1;
          scope.visibleColumns[lastIndex].size += rest;

          if (scope.config.columns[lastIndex].size < minimumColumnSize) {
            angular.forEach(scope.visibleColumns, function (column, index) {
              scope.visibleColumns[index].size = (tableSize / scope.visibleColumns.length);
            });
          } else {
            angular.forEach(scope.visibleColumns, function (column) {
              if (column.size)
                column.size = (tableSize * column.size) / 100;
            });
          }
        } else {
          angular.forEach(scope.visibleColumns, function (column, index) {
            scope.visibleColumns[index].size = (tableSize / scope.visibleColumns.length);
          });
        }
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

      /*
       * ============================== Events ==============================
       */

      scope.onClickRow = function (selectedRow) {
        if (scope.config.events.onClickRow) {
          var row = angular.copy(selectedRow);

          if (row.$$hashKey)
            delete row.$$hashKey;

          scope.config.events.onClickRow(row);
        }
      };

      scope.onApplyColumnFilter = function (columns) {
        if (scope.config.events.onApplyColumnFilter) {
          var tableWidth = angular.copy(scope.tableWidth);

          if (scope.config.checkbox.enable)
            tableWidth -= scope.config.checkbox.size;

          angular.forEach(columns, function (column, index) {
            column.size = (column.size * 100) / tableWidth;
          });

          scope.config.events.onApplyColumnFilter(columns);
        }
      };

      init();

    }
  };
}])


.controller('ColumnFilterController', ['$scope', '$modalInstance', 'config', function ($scope, $modalInstance, config) {

  var init = function () {
    $scope.config = config;
    $scope.columns = config.columns;
    $scope.visibleColumns = [];
    $scope.setVisibleColumns();
  }

  $scope.ok = function () {
    $scope.setVisibleColumns($scope.columns);
    $modalInstance.close($scope.visibleColumns);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.setVisibleColumns = function (columns) {
    var array = [];

    angular.forEach(columns, function (column) {
      if(column.show) {
        array.push(column);
      }
    });

    $scope.visibleColumns = array;
  };

  init();

}]);

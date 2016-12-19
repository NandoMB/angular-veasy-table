angular.module('veasy.table')

  .directive('veasyTable', ['$templateCache', '$window', '$filter', '$timeout', 'vtScreenService', 'vtPaginationService', 'vtSearchService', 'vtCheckboxService', 'vtColumnService', 'vtConfigService', 'vtModalService', function ($templateCache, $window, $filter, $timeout, vtScreenService, vtPaginationService, vtSearchService, vtCheckboxService, vtColumnService, vtConfigService, vtModalService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'template.html',
      scope: {
        config: '=',
        list: '='
      },
      link: function (scope, element, attributes, controller) {

        var init = function () {
          scope.config = vtConfigService.validate(scope.config);
          scope.vetModalId = vtModalService.getModalId(scope.config.id);
          scope.filterColumnsList = vtSearchService.getColumnsDropdown(scope.config.columns, scope.config.labels);
          scope.selectedColumn = scope.filterColumnsList[0];
          scope.condition = 'AND';
          scope.searching = false;

          scope.master = {
            checkbox: false,
            expanded: false
          };

          scope.checkboxes = [];
          scope.expanded = [];
          scope.resultList = [];

          registerEvents();
          enableFeatures(scope.config);
          updateVeasyTable();
        };

        var enableFeatures = function (config) {
          if (config.toggleColumns.enable)
            addToggleIcon(scope.config);

          if (config.columnFilter.enable && config.columnFilter.modalOptions.autoOpen) {
            $timeout(function () {
              scope.openColumnFilterModal(config.columns);
            }, 0);
          }
        };

        /**
         * Registra os eventos.
         */
        var registerEvents = function () {

          scope.$watch('list', function (result) {
            if (!result) return;

            scope.resultList = angular.copy(result);
            scope.filteredList = angular.copy(result);
            paginate(scope.filteredList, scope.config.pagination.itemsPerPage, 0);
            dispatchVtEvent('resize');
          });

          scope.$watch('config.columns', function (result) {
            if (!result) return;
            dispatchVtEvent('resize');
          }, true);

          $window.addEventListener('resize', function () {
            scope.updatingTableColumns = true;
            scope.outOfBound = false;

            scope.$apply(function () {
              $timeout(function () {
                if (vtScreenService.isBrokenLayout(scope.config.id)) scope.outOfBound = true;

                updateVeasyTable();
                updateAllHiddenRowsContent();

                $timeout(function () {
                  scope.updatingTableColumns = false;
                }, 500);
              }, 0);
            });
          });
        };

        var dispatchVtEvent = function (eventName) {
          $timeout(function () {
            $window.dispatchEvent(new Event(eventName));
          }, 0);
        };

        scope.getTBodyStyle = function () {
          var element = angular.element('table#' + scope.config.id);
          var obj = {};

          if (element) {
            obj['width'] = element.width() ? element.width() + 'px' : '0px';
            obj['height'] = element.height() ? element.height() + 'px' : '0px';
            if (element.position()) {
              obj['top'] = element.position().top ? element.position().top + 'px' : '0px';
              obj['left'] = element.position().left ? element.position().left + 'px' : '0px';
            }
          }

          return obj;
        };

        var updateVeasyTable = function () {
          scope.toggleRowColspan = vtColumnService.defineToggleRowColspan(scope.config.columns);
          vtColumnService.closeAllOpenedRows(scope.resultList);
        };
        /** --------------------------------------------------------------------
         *                         Column Filter (Modal)
         * ------------------------------------------------------------------ */

        scope.openColumnFilterModal = function (columns) {
          scope.modalColumns = vtModalService.getColumns(columns);
          scope.modalCheckboxMaster = vtModalService.initMasterCheckbox(scope.vetModalId, scope.modalColumns);

          vtModalService.openModal(scope.vetModalId, scope.config.columnFilter.modalOptions);
        };

        scope.checkWindowSize = function (column) {
          var selector = '#' + scope.vetModalId + ' input#cbMaster-' + column.value;
          scope.modalCheckboxMaster[column.value] = vtModalService.defineMasterCheckboxState(selector, column);
        };

        scope.checkWindowSizeMaster = function (column, masterValue) {
          for (var prop in column.hideOn) {
            column.hideOn[prop] = masterValue;
          }
        };

        scope.checkAllByScreenSize = function (size, modalColumns, value) {
          if (!scope.screenSize) scope.screenSize = {};
          scope.screenSize[size] = !value;
          scope.modalCheckboxMaster = vtModalService.checkAllByScreenSize(size, modalColumns, scope.screenSize[size], scope.vetModalId);
        };

        scope.onConfirmColumnFilterModal = function (data) {
          scope.config.columns = vtModalService.updateColumnsVisibility(scope.config.columns, data);
          delete scope.modalColumns;

          vtModalService.closeModal(scope.vetModalId);
          scope.$emit('veasyTable:onApplyColumnFilter', angular.copy(scope.config.columns));
        };

        /** --------------------------------------------------------------------
         *                            User Events
         * ------------------------------------------------------------------ */
        scope.onClickRow = function (row) {
          var copyRow = angular.copy(row);
          delete copyRow.$$hashKey;

          scope.$emit('veasyTable:onClickRow', copyRow);
        };

        /** --------------------------------------------------------------------
         *                      Checkboxes/Items Selections
         * ------------------------------------------------------------------ */
        scope.checkAllPageRows = function (currentPage, checkboxMaster) {
          if (!scope.checkboxes[currentPage]) scope.checkboxes[currentPage] = {};

          for (var i = 0; i < scope.checkboxes[currentPage].length; i++) {
            scope.checkboxes[currentPage][i] = checkboxMaster;
          }
          sendSelectedItems();
        };

        scope.checkRow = function (event, currentPage, rowIndex) {
          event.stopPropagation();
          if (!scope.checkboxes[currentPage]) scope.checkboxes[currentPage] = {};
          if (!scope.checkboxes[currentPage][rowIndex]) scope.checkboxes[currentPage][rowIndex] = !!scope.checkboxes[currentPage][rowIndex];
          defineCheckboxMasterState(currentPage);
          sendSelectedItems();
        };

        var sendSelectedItems = function() {
          scope.$emit('veasyTable:selectedItems', vtCheckboxService.getSelectedItems(scope.checkboxes, scope.paginatedList))
          // scope.selectedItems = vtCheckboxService.getSelectedItems(scope.checkboxes, scope.paginatedList);
        };

        var initCheckboxes = function (paginatedList) {
          scope.checkboxes = vtCheckboxService.reset(paginatedList);
          sendSelectedItems();
        };

        var defineCheckboxMasterState = function (currentPage) {
          var selector = '#' + scope.config.id + ' input#checkbox-master';
          scope.master.checkbox = vtCheckboxService.defineCheckboxMasterState(selector, scope.checkboxes, currentPage);
        };

        /** --------------------------------------------------------------------
         *                            Sort
         * ------------------------------------------------------------------ */

        scope.sort = function (predicate) {
          scope.$emit('veasyTable:onStartSort');

          if (scope.predicate === predicate)
            scope.reverse = !scope.reverse;

          scope.predicate = predicate;

          if (scope.predicate !== '') {
            var list = $filter('orderBy')(scope.filteredList, scope.predicate, scope.reverse);
            paginate(list, scope.config.pagination.itemsPerPage, 0);
          }

          scope.$emit('veasyTable:onEndSort');
        };

        scope.defineSortableIcon = function (direction, columnName) {
          return {
            'fa-sort': changeSortableDirection('', columnName),
            'fa-sort-asc': changeSortableDirection('asc', columnName),
            'fa-sort-desc': changeSortableDirection('desc', columnName)
          }
        };

        var changeSortableDirection = function (direction, predicate) {
          if (direction === 'asc') return scope.predicate === predicate && !scope.reverse;
          if (direction === 'desc') return scope.predicate === predicate && scope.reverse;
          return true;
        };

        /** --------------------------------------------------------------------
         *                            Search
         * ------------------------------------------------------------------ */

        scope.selectFilterColumn = function (terms, condition, col) {
          scope.selectedColumn = col;
          if (terms)
            scope.search(terms, condition, col);
        };

        scope.changeSearchCondition = function (terms, condition, selectedColumn) {
          scope.condition = condition;
          if (terms)
            scope.search(terms, condition, selectedColumn);
        }

        scope.search = function (terms, condition, column) {
          if (!condition || !column) return;

          if (scope.queryBusy)
            $timeout.cancel(scope.queryBusy);

          scope.searching = true;
          scope.$emit('veasyTable:onStartSearch');

          scope.queryBusy = $timeout(function () {
            scope.filteredList = vtSearchService.search(terms || '', condition, column, scope.resultList);
            paginate(scope.filteredList, scope.config.pagination.itemsPerPage, 0);
            scope.searching = false;
            scope.$emit('veasyTable:onEndSearch');
          }, scope.config.filter.delay);
        };

        /** --------------------------------------------------------------------
         *                          Data Filters
         * ------------------------------------------------------------------ */

        scope.isUrl = function (column) {
          return column.filter.type === 'url';
        };

        scope.applyFilter = function (value, filter) {
          if (filter.type === 'currency') return $filter('currency')(value, filter.symbol, filter.fractionSize);
          if (filter.type === 'date') return $filter('date')(value, filter.format, filter.timezone);
          if (filter.type === 'json') return $filter('json')(value, filter.spacing);
          if (filter.type === 'url') return $filter('vtUrl')(value, filter.text, filter.target);
          if (filter.type === 'number') return $filter('number')(value, filter.fractionSize);
          if (filter.type === 'limitTo') return $filter('limitTo')(value, filter.limit, filter.begin);
          if (filter.type === 'lowercase') return $filter('lowercase')(value);
          if (filter.type === 'uppercase') return $filter('uppercase')(value);
          return value;
        };

        /** --------------------------------------------------------------------
         *                            Pagination
         * ------------------------------------------------------------------ */

        scope.changeItemsPerPage = function (itemsPerPage) {
          paginate(scope.filteredList, itemsPerPage, 0);
        };

        scope.setPage = function (page) {
          scope.currentPage = page;
          scope.pages = vtPaginationService.pages(scope.paginatedList.length - 1, page, 5);

          // $timeout(function () {
          scope.expanded = [];
          scope.master.expanded = false;
          initHiddenRowsContent();
          // delete scope.master.checkbox;
          defineCheckboxMasterState(scope.currentPage);
          // }, 0);
        };

        scope.nextPage = function () {
          if (scope.currentPage < scope.paginatedList.length - 1) scope.setPage(scope.currentPage + 1);
        };

        scope.previousPage = function () {
          if (scope.currentPage > 0) scope.setPage(scope.currentPage - 1);
        };

        scope.isNextPageDisabled = function (list) {
          if (!list) return;
          return scope.currentPage === (list.length - 1);
        };

        scope.isPreviousPageDisabled = function () {
          return scope.currentPage === 0;
        };

        var paginate = function (list, pageSize, initialPage) {
          if (!scope.config.pagination.enable) {
            scope.paginatedList = [list];
            scope.currentPage = 0;
            return;
          };
          scope.$emit('veasyTable:onStartPagination');
          scope.paginatedList = vtPaginationService.paginate(list, pageSize);
          scope.setPage(initialPage);
          initCheckboxes(scope.paginatedList);
          scope.$emit('veasyTable:onEndPagination');
        };

        /** --------------------------------------------------------------------
         *                          Responsivity
         * ------------------------------------------------------------------ */

        var initHiddenRowsContent = function () {
          if (!scope.hiddenContent) scope.hiddenContent = [];
          if (!scope.hiddenContent[scope.currentPage || 0]) scope.hiddenContent[scope.currentPage || 0] = [];
        };

        var updateHiddenRowsContent = function (rowIndex, row) {
          initHiddenRowsContent();
          scope.hiddenContent[scope.currentPage][rowIndex] = vtColumnService.getHiddenContent(row, scope.config.columns);
        };

        var updateAllHiddenRowsContent = function () {
          if (!scope.paginatedList || !scope.paginatedList[scope.currentPage]) return;

          for (var i = 0; i < scope.paginatedList[scope.currentPage].length; i++) {
            updateHiddenRowsContent(i, scope.paginatedList[scope.currentPage][i]);
          }
        };

        scope.initToggleButton = function (rowIndex, row) {
          scope.expanded[rowIndex] = false;
          updateHiddenRowsContent(rowIndex, row);
        };

        scope.toggleRow = function (event, rowIndex, row) {
          event.stopPropagation();
          scope.expanded[rowIndex] = !scope.expanded[rowIndex];
        };

        scope.showToggleIcon = function (column) {
          return scope.config.toggleColumns && scope.config.toggleColumns.enable && column.toggle && scope.haveHiddenColumn(scope.config.columns);
        };

        scope.toggleAllRows = function () {
          scope.master.expanded = !scope.master.expanded;

          if (scope.master.expanded) {
            openAllClosedRows();
          } else {
            closeAllOpenedRows();
          }
        };

        var openAllClosedRows = function () {
          for (var i = 0; i < scope.expanded.length; i++) {
            scope.expanded[i] = true;
          }
        };

        var closeAllOpenedRows = function () {
          for (var i = 0; i < scope.expanded.length; i++) {
            scope.expanded[i] = false;
          }
        };

        scope.showToggleHeader = function (column) {
          return !column.toggle || (column.toggle && scope.haveHiddenColumn(scope.config.columns));
        };

        scope.haveHiddenColumn = function (columns) {
          return vtColumnService.haveHiddenColumn(columns);
        };

        scope.getToggleIconClasses = function (config, openCondition, closeCondition) {
          var icons = {};
          icons[config.toggleColumns.icons.closed] = closeCondition;
          icons[config.toggleColumns.icons.opened] = openCondition;
          return icons;
        };

        var addToggleIcon = function (config) {
          if (config.toggleColumns.position === 'begin') {
            config.columns.unshift({ header: '', value: 'toggle', hideOn: '', toggle: true });
          } else {
            config.columns.push({ header: '', value: 'toggle', hideOn: '', toggle: true });
          }
        };

        scope.getColumnStyle = function (column) {
          if (column.toggle)
            return { 'width': '37px', 'text-align': 'center' };

          // Hackfix to work ellipsis
          if (scope.outOfBound)
            return { 'max-width': '1px', 'min-width': '1px' };

          return {};
        };

        var calculateMaxWidth = function () {
          var filteredColumns = scope.config.columns.filter(function (column) {
            return !column.toggle && !column.isHidden;
          }) || [];
          return (vtScreenService.veasyTable().width/filteredColumns.length) + 'px';
        };

        scope.responsiveHiddenContentStyle = function () {
          var screenSize = vtScreenService.screenSize();
          if (screenSize === 'lg') return { 'max-width': '1060px' };
          if (screenSize === 'md') return { 'max-width': '860px' };
          if (screenSize === 'sm') return { 'max-width': '660px' };
          if (screenSize === 'xs') return { 'max-width': '260px' };
          return {};
        };

        scope.hideColumnOn = function (column, hideColumnOn) {
          if (!vtScreenService.isNeedToHide(hideColumnOn)) {
            delete column.isHidden;
            return false;
          }

          column.isHidden = true;
          return true;
        };


        /** --------------------------------------------------------------------
         *                          Initialize
         * ------------------------------------------------------------------ */

        init();
      }
    }
  }]);

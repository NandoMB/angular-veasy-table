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
          scope.updatingTableColumns = true;
          scope.searching = false;
          scope.terms = '';
          scope.condition = 'AND';
          scope.master = { checkbox: false, expanded: false };
          scope.checkboxes = [];
          scope.expanded = [];
          scope.resultList = [];
          registerEvents();
          enableFeatures(scope.config);
          updateVeasyTable();
        };

        var enableFeatures = function (config) {
          if (config.contextMenu.enable) {
            addContextMenu(config);
          }
          if (config.toggleColumns.enable) {
            addToggleIcon(config);
          }
          if (config.columnFilter.enable && config.columnFilter.modalOptions.autoOpen) {
            $timeout(function () {
              scope.openColumnFilterModal(config.columns);
            }, 0);
          }
        };

        const digest = function (msg) {
          $timeout(function () {
            scope.$digest();
          });
        };

        /**
         * Registra os eventos.
         */
        var registerEvents = function () {
          scope.$watchCollection('list', function (result) {
            if (!result) return;
            scope.updatingTableColumns = true;
            scope.resultList = angular.copy(result);
            scope.filteredList = angular.copy(result);
            if (!scope.dropdownFilters) {
              catalogDropdownFilter(scope.config.columns, result);
            }
            scope.addDropdownFilter(null, scope.dropdownFilters || []);
            dispatchVtEvent('resize');
          });

          scope.$watchCollection('config.columns', function (result) {
            if (!result) return;
            dispatchVtEvent('resize');
          });

          $window.addEventListener('resize', function () {
            scope.updatingTableColumns = true;
            scope.outOfBound = false;
            scope.$apply(function () {
              $timeout(function () {
                if (vtScreenService.isBrokenLayout(scope.config.id)) {
                  scope.outOfBound = true;
                }
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
         *                              Context Menu
         * ------------------------------------------------------------------ */
        var addContextMenu = function (config) {
          config.columns.push({ header: '', value: 'contextMenu', contextMenu: true, size: '37px' });
        };

        /** --------------------------------------------------------------------
         *                         Column Filter (Modal)
         * ------------------------------------------------------------------ */
        scope.openColumnFilterModal = function (columns) {
          scope.modalColumns = vtModalService.getColumns(columns);
          scope.modalCheckboxMaster = vtModalService.initMasterCheckbox(scope.vetModalId, scope.modalColumns);
          vtModalService.openModal(scope.vetModalId, scope.config.columnFilter.modalOptions);
        };

        scope.checkWindowSize = function (column, size) {
          var selector = '#' + scope.vetModalId + ' input#cbMaster-' + column.value;
          column.hideOn[size] = !column.hideOn[size];
          scope.modalCheckboxMaster[column.value] = vtModalService.defineMasterCheckboxState(selector, column);
        };

        scope.checkWindowSizeMaster = function (column, masterValue) {
          for (var prop in column.hideOn) {
            column.hideOn[prop] = !masterValue;
          }
        };

        scope.checkAllByScreenSize = function (size, modalColumns, value) {
          if (!scope.screenSize) {
            scope.screenSize = {};
          }
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
        scope.onClickRow = function (event, row) {
          if (event.target.className.indexOf('vt-dropdown') !== -1 || !scope.config.clickRow.enable) return;
          var copyRow = angular.copy(row);
          delete copyRow.$$hashKey;
          scope.$emit('veasyTable:onClickRow', copyRow);
        };

        /** --------------------------------------------------------------------
         *                      Checkboxes/Items Selections
         * ------------------------------------------------------------------ */
        scope.checkAllPageRows = function (currentPage, checkboxMaster) {
          if (!scope.checkboxes[currentPage]) {
            scope.checkboxes[currentPage] = {};
          }
          for (var i = 0; i < scope.checkboxes[currentPage].length; i++) {
            scope.checkboxes[currentPage][i] = checkboxMaster;
          }
          sendSelectedItems();
        };

        scope.checkRow = function (event, currentPage, rowIndex) {
          event.stopPropagation();
          if (!scope.checkboxes[currentPage]) scope.checkboxes[currentPage] = {};
          scope.checkboxes[currentPage][rowIndex] = !scope.checkboxes[currentPage][rowIndex];
          defineCheckboxMasterState(currentPage);
          sendSelectedItems();
        };

        var sendSelectedItems = function () {
          scope.$emit('veasyTable:selectedItems', vtCheckboxService.getSelectedItems(scope.checkboxes, scope.paginatedList))
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
          if (scope.predicate === predicate) {
            scope.reverse = !scope.reverse;
          }
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
         *                          Dropdown Filter
         * ------------------------------------------------------------------ */
        scope.openDropdownFilter = function (id) {
          $timeout(function () {
            $('#dd-' + id).dropdown('toggle');
          }, 0);
        };

        scope.addDropdownFilter = function (event, filters) {
          if (event) {
            event.stopPropagation();
          }
          var cols = '';
          var filtersConfig = [];
          var columns = scope.config.columns.map(function (elem) { return elem.value });
          columns.forEach(function (columnName) {
            if (filters[columnName]) {
              var terms = filters[columnName].filter(function (elem) {
                if (!elem.checked) return false;
                cols += elem.column + ' ';
                return true;
              }).map(function (elem) {
                return elem.label;
              }).join(' ');
              if (cols.indexOf(columnName) !== -1) {
                var column = scope.filterColumnsList.filter(function (elem) {
                  return elem.value === columnName;
                })[0];
                filtersConfig.push({ terms: terms, condition: 'OR', column: column, isCaseSensitive: true, ignoreSpecialCharacters: false });
              }
            }
          });
          scope.searchByDropdownFilter(filtersConfig);
        };

        var catalogDropdownFilter = function (columns, list) {
          var filters = addHeadersToDropdownFilter(columns);
          scope.dropdownFilters = addValuesToDropdownFilter(columns, filters, list);
        };

        var addHeadersToDropdownFilter = function (columns) {
          return columns.filter(function (column) {
            return column.dropdown;
          }).map(function (column) {
            return column.value;
          }).reduce(function (previous, current) {
            previous[current] = [];
            return previous;
          }, {});
        };

        var addValuesToDropdownFilter = function (columns, filters, list) {
          var keys = Object.keys(filters);
          list.forEach(function (row) {
            keys.forEach(function (key) {
              var defaultValue = getDefaultColumnValue(columns, key);
              var tempArray = filters[key].map(function (element) { return element.label; });
              if (tempArray.indexOf(row[key] || defaultValue) === -1) {
                var aux = { label: row[key], column: key, checked: false };
                if (defaultValue) {
                  aux.defaultValue = defaultValue;
                }
                if (!existeNoArray(filters[key], aux)) {
                  filters[key].push(aux);
                }
              }
            });
          });
          return filters;
        };

        var existeNoArray = function (array, item) {
          var exist = array.filter(function (elem) {
            return elem.label === item.label;
          });
          return exist.length > 0;
        };

        var getDefaultColumnValue = function (columns, key) {
          return columns.filter(function (column) {
            return column.value === key;
          })[0].default || '';
        };

        scope.searchByDropdownFilter = function (array) {
          if (scope.queryBusy) {
            $timeout.cancel(scope.queryBusy);
          }
          var list = scope.resultList;
          scope.searching = true;
          scope.$emit('veasyTable:onStartSearch');
          array.forEach(function (elem) {
            list = vtSearchService.search(elem.terms, elem.condition, elem.column, list, true, elem.isCaseSensitive, elem.ignoreSpecialCharacters);
          });
          scope.filteredList = angular.copy(list);
          scope.dropDownFilterList = angular.copy(list);
          scope.queryBusy = $timeout(function () {
            scope.search(scope.terms, scope.condition, scope.selectedColumn, false);
            scope.searching = false;
            scope.$emit('veasyTable:onEndSearch');
          }, scope.config.filter.delay);
        };

        /** --------------------------------------------------------------------
         *                           Input Text Filter
         * ------------------------------------------------------------------ */
        scope.selectFilterColumn = function (terms, condition, col) {
          scope.selectedColumn = col;
          if (terms) {
            scope.search(terms, condition, col, false);
          }
        };

        scope.changeSearchCondition = function (terms, condition, selectedColumn) {
          scope.condition = condition;
          if (terms) {
            scope.search(terms, condition, selectedColumn, false);
          }
        }

        scope.search = function (terms, condition, column) {
          if (!condition || !column) return;
          if (scope.queryBusy) {
            $timeout.cancel(scope.queryBusy);
          }
          scope.searching = true;
          scope.$emit('veasyTable:onStartSearch');
          scope.terms = terms || '';
          scope.queryBusy = $timeout(function () {
            scope.filteredList = vtSearchService.search(scope.terms, condition, column, scope.dropDownFilterList || scope.resultList, false, scope.config.filter.isCaseSensitive, scope.config.filter.ignoreSpecialCharacters);
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
          if (filter) {
            if (filter.type === 'currency') return $filter('currency')(value, filter.symbol, filter.fractionSize);
            if (filter.type === 'date') return $filter('date')(value, filter.format, filter.timezone);
            if (filter.type === 'json') return $filter('json')(value, filter.spacing);
            if (filter.type === 'url') return $filter('vtUrl')(value, filter.text, filter.target);
            if (filter.type === 'number') return $filter('number')(value, filter.fractionSize);
            if (filter.type === 'limitTo') return $filter('limitTo')(value, filter.limit, filter.begin);
            if (filter.type === 'lowercase') return $filter('lowercase')(value);
            if (filter.type === 'uppercase') return $filter('uppercase')(value);
          }
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
          scope.expanded = [];
          scope.master.expanded = false;
          initHiddenRowsContent();
          defineCheckboxMasterState(scope.currentPage);
          digest();
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
            digest();
            return;
          };
          scope.$emit('veasyTable:onStartPagination');
          scope.paginatedList = vtPaginationService.paginate(list, pageSize);
          scope.setPage(initialPage);
          initCheckboxes(scope.paginatedList);
          scope.$emit('veasyTable:onEndPagination');
          digest();
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
            config.columns.unshift({ header: '', value: 'toggle', hideOn: '', toggle: true, size: '37px' });
          } else {
            config.columns.push({ header: '', value: 'toggle', hideOn: '', toggle: true, size: '37px' });
          }
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

        scope.getColumnStyle = function (column) {
          return calculateMaxWidthDefaultColumn(scope.config, scope.config.columns, column.size);
        };

        var calculateMaxWidthDefaultColumn = function (config, columns, columnSize) {
          var veasyTableWidth = vtScreenService.getVeasyTableFreeSpace(config, columns);
          var percentualTotal = vtColumnService.getDefaultColumns(columns).reduce(function (sum, element) { return sum + element.size; }, 0);
          if (unit.isPixel(columnSize)) {
            return columnSize.split('px')[0];
          }
          if (unit.isPercentage(columnSize)) {
            return percentageToPixel(columnSize.split('%')[0], veasyTableWidth);
          }
          if (!unit.isPixel(columnSize) && !unit.isPercentage(columnSize)) {
            var columnWidth = percentageDistribution(percentualTotal, columnSize);
            return percentageToPixel(columnWidth, veasyTableWidth);
          }
        };

        var percentageDistribution = function (total, columnSize) {
          return (((100 - total) / total) * columnSize) + columnSize;
        };

        var percentageToPixel = function (percentage, total) {
          return (percentage * total) / 100;
        };

        var unit = {
          isPixel: function (columnSize) { return columnSize.toString().indexOf('px') !== -1 ? true : false; },
          isPercentage: function (columnSize) { return columnSize.toString().indexOf('%') !== -1 ? true : false; }
        };

        /** --------------------------------------------------------------------
         *                          Initialize
         * ------------------------------------------------------------------ */
        init();
      }
    }
  }]);

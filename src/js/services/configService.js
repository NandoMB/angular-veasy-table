angular.module('veasy.table')

  .service('vtConfigService', [ function () {

    var validateConfigs = function (config) {
      if (!config) config = {};
      if (!config.columns) config.columns = [];

      config.id = validateIdConfig(config.id);
      config.toggleColumns = validateToggleColumnsConfig(config.toggleColumns);
      config.checkbox = validateCheckboxConfig(config.checkbox);
      config.sort = validateSortConfig(config.sort);
      config.pagination = validatePaginationConfig(config.pagination);
      config.filter = validateFilterConfig(config.filter);
      config.columnFilter = validateColumnFilterConfig(config.columnFilter);
      config.labels = validateTranslationConfig(config.labels);
      return config;
    };

    var validateIdConfig = function(id) {
      if (!id) return generateRandomId();
    };

    var generateRandomId = function() {
      var number = Math.round(Math.random()*4 * 100000);
      var newId = 'veasy-table-' + number;
      var elements = angular.element('table#' + newId);
      
      if (elements && elements.length > 0)
        generateRandomId();

      return newId;
    };

    var validateToggleColumnsConfig = function (toggleColumns) {
      if (!toggleColumns) toggleColumns = {};
      if (!toggleColumns.enable) toggleColumns.enable = false;
      if (!toggleColumns.position) toggleColumns.position = false;
      if (!toggleColumns.icons) toggleColumns.icons = {};
      if (!toggleColumns.icons.opened) toggleColumns.icons.opened = 'fa fa-chevron-down';
      if (!toggleColumns.icons.closed) toggleColumns.icons.closed = 'fa fa-chevron-left';
      return toggleColumns;
    };

    var validateCheckboxConfig = function (checkbox) {
      if (!checkbox) checkbox = {};
      if (!checkbox.enable) checkbox.enable = false;
      return checkbox;
    };

    var validateSortConfig = function (sort) {
      if (!sort) sort = {};
      if (!sort.enable) sort.enable = false;
      return sort;
    };

    var validatePaginationConfig = function (pagination) {
      if (!pagination) pagination = {};
      if (!pagination.enable) pagination.enable = false;
      if (!pagination.currentPage) pagination.currentPage = 0;
      if (!pagination.itemsPerPage) pagination.itemsPerPage = 10;
      return pagination;
    };

    var validateFilterConfig = function (filter) {
      if (!filter) filter = {};
      if (!filter.enable) filter.enable = false;
      if (!filter.conditional) filter.conditional = false;
      if (!filter.delay) filter.delay = 500;
      return filter;
    };

    // FIXME: REFATORAR
    var validateColumnFilterConfig = function (columnFilter) {
      if (!columnFilter) columnFilter = {};
      if (!columnFilter.enable) columnFilter.enable = false;
      if (!columnFilter.modalOptions) columnFilter.modalOptions = {};
      if (!columnFilter.modalOptions.size) columnFilter.modalOptions.size = 'md';
      if (!columnFilter.modalOptions.autoOpen) columnFilter.modalOptions.autoOpen = false;
      if (!columnFilter.modalOptions.keyboard) columnFilter.modalOptions.keyboard = true;
      if (!columnFilter.modalOptions.backdrop) columnFilter.modalOptions.backdrop = true;
      return columnFilter;
    };

    var validateTranslationConfig = function (labels) {
      if (!labels) labels = {};
      if (!labels.filter) labels.filter = {};
      if (!labels.filter.by) labels.filter.by = 'Filter by...';
      if (!labels.filter.all) labels.filter.all = 'All';
      if (!labels.filter.and) labels.filter.and = 'AND';
      if (!labels.filter.or) labels.filter.or = 'OR';
      if (!labels.pagination) labels.pagination = {};
      if (!labels.pagination.itemsPerPage) labels.pagination.itemsPerPage = 'Items by Page';
      if (!labels.pagination.totalItems) labels.pagination.totalItems = 'Total of Items';
      if (!labels.modal) labels.modal = {};
      if (!labels.modal.title) labels.modal.title = 'Which columns you want to display?';
      if (!labels.modal.okButton) labels.modal.okButton = 'Apply';
      if (!labels.modal.cancelButton) labels.modal.cancelButton = 'Cancel';
      return labels;
    };

    return {
      validate: validateConfigs
    };

  }]);

angular.module('veasy.table')

  .service('vtSearchService', ['$filter', function ($filter) {

    var defineFilterColumnsDropdown = function (columns, labels) {
      var array = [];
      var filters = {};

      columns.forEach(function (column, index) {
        if (!column.toggle) {
          array.push(column);
          filters[column.value] = column.filter;
        }
      });

      array.unshift({ header: labels.filter.all, value: 'all', filters: filters });

      return array;
    };

    var search = function (terms, condition, column, list) {
      var splittedTerms = terms.split(' ');

      return $filter('filter')(list, function (row) {
        if (condition === 'AND')
          return searchWithANDCondition(splittedTerms, transformValue(column, row));
        if (condition === 'OR')
          return searchWithORCondition(splittedTerms, transformValue(column, row));
      });
    };

    var searchWithANDCondition = function (terms, value) {
      return terms.every(function (term) {
        return value.toString().toLowerCase().indexOf(term.toLowerCase()) !== -1;
      });
    };

    var searchWithORCondition = function (terms, value) {
      return terms.some(function (term) {
        return value.toString().toLowerCase().indexOf(term.toLowerCase()) !== -1;
      });
    };

    var applyFilter = function (value, filter) {
      var type = filter ? filter.type : '';
      if (type === 'date') return $filter('date')(value, filter.format, filter.timezone);
      if (type === 'currency') return $filter('currency')(value, filter.symbol, filter.fractionSize);
      if (type === 'number') return $filter('number')(value, filter.fractionSize);
      return value;
    };

    var transformValue = function (column, row) {
      if (row.$$hashKey) delete row.$$hashKey;

      if (column.value === 'all')
        return transformAllColumnsValue(column, row);

      return applyFilter(row[column.value] || '', column.filter);
    };

    var transformAllColumnsValue = function (column, row) {
      var str = '';

      for (var prop in row) {
        str += (applyFilter(row[prop] || '', column.filters[prop]) + ' ');
      }

      return str;
    };

    return {
      getColumnsDropdown: defineFilterColumnsDropdown,
      search: search
    };

  }]);

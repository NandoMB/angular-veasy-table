angular.module('veasy.table')

  .service('searchService', ['$filter', function ($filter) {

    var defineFilterColumnsDropdown = function (columns, labels) {
      var array = [{ header: labels.filter.all, value: 'all' }];

      columns.forEach(function (column, index) {
        if (!column.toggle)
          array.push(column);
      });

      return array;
    };

    var search = function (terms, condition, column, list) {
      return $filter('filter')(list, function (item) {
        var value = angular.lowercase(transformElementToLowerCaseString(column.value, item));
        var splittedTerms = angular.lowercase(terms).split(' ');

        if (condition === 'AND')
          return searchWithANDCondition(splittedTerms, value, column);

        if (condition === 'OR')
          return searchWithORCondition(splittedTerms, value, column);
      });
    };

    var searchWithANDCondition = function (terms, value, column) {
      return terms.every(function (term) {
        return compare(term, value, column);
      });
    };

    var searchWithORCondition = function (terms, value, column) {
      return terms.some(function (term) {
        return compare(term, value, column);
      });
    };

    var compare = function (term, value, column) {
      var type = column.filter ? column.filter.type : '';

      if(type === 'date') return compareTo.date(term, value, column.filter);
      if(type === 'currency') return compareTo.number(term, value);
      if(type === 'number') return compareTo.number(term, value);
      // if(type === 'json') return; // TODO: Implementar

      return compareTo.string(term, value);
    };

    var compareTo = {
      string: function (term, value) {
        return value.indexOf(term) !== -1;
      },
      number: function (term, value) {
        return value.toString().indexOf(term) !== -1;
      },
      date: function (term, value, filter) {
        var filteredValue = $filter('date')(value, filter.format, filter.timezone);
        return filteredValue.indexOf(term) !== -1;
      }
    };

    // FIXME: Melhorar
    var transformElementToLowerCaseString = function (column, item) {
      if (item.$$hashKey) delete item.$$hashKey;
      if (column !== 'all') return item[column] || '';

      var str = '';
      for (var prop in item) {
        str += item[prop] + ' ';
      }
      return str;
    };

    return {
      getColumnsDropdown: defineFilterColumnsDropdown,
      search: search
    };

  }]);

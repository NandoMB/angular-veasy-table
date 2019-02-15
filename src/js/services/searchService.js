angular.module('veasy.table').service('vtSearchService', ['$filter', function ($filter) {

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

  var search = function (terms, condition, column, list, isDropdownFilter, isCaseSensitive, ignoreSpecialCharacters) {
    var splittedTerms = terms.split(' ');
    return $filter('filter')(list, function (row) {
      var rowValue = ignoreSpecialCharacters ? replaceSpecialCharacters(transformValue(column, row)) : transformValue(column, row);
      if (condition === 'AND') return executeSearch('AND', splittedTerms, rowValue, isDropdownFilter, isCaseSensitive, ignoreSpecialCharacters);
      if (condition === 'OR') return executeSearch('OR', splittedTerms, rowValue, isDropdownFilter, isCaseSensitive, ignoreSpecialCharacters);
    });
  };

  var executeSearch = function (conditional, terms, row, isDropdownFilter, isCaseSensitive, ignoreSpecialCharacters) {
    var conditionalFunction = conditional === 'AND' ? Array.prototype.every : Array.prototype.some;
    var parsedRow = replaceSpecialCharacters(row);
    return conditionalFunction.bind(terms)(function (term) {
      term = term.toString();
      var parsedTerm = replaceSpecialCharacters(term);
      if (isDropdownFilter) {
        if (isCaseSensitive && ignoreSpecialCharacters) return parsedRow === parsedTerm;
        if (isCaseSensitive) return row.toString() === term;
        if (ignoreSpecialCharacters) return parsedRow.toLowerCase() === parsedTerm.toLowerCase();
        return row.toString().toLowerCase() === term.toLowerCase();
      } else {
        if (isCaseSensitive && ignoreSpecialCharacters) return parsedRow.indexOf(parsedTerm) !== -1;
        if (isCaseSensitive) return row.toString().indexOf(term) !== -1;
        if (ignoreSpecialCharacters) return parsedRow.toLowerCase().indexOf(parsedTerm.toLowerCase()) !== -1;
        return row.toString().toLowerCase().indexOf(term.toLowerCase()) !== -1;
      }
    });
  };

  var replaceSpecialCharacters = function (str) {
    var translate = {
      'á': 'a', 'â': 'a', 'à': 'a', 'ã': 'a', 'Á': 'A', 'Â': 'A', 'À': 'A', 'Ã': 'A',
      'ç': 'c', 'Ç': 'C',
      'é': 'e', 'ê': 'e', 'É': 'E', 'Ê': 'E',
      'í': 'i', 'Í': 'I',
      'ó': 'o', 'ô': 'o', 'õ': 'o', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O',
      'ú': 'u', 'ü': 'u', 'Ú': 'U', 'Ü': 'U'
    };
    return str.replace(new RegExp('[' + Object.keys(translate).join('') + ']', 'g'), function (character) { return translate[character]; });
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
    if (column.value === 'all') return transformAllColumnsValue(column, row);
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

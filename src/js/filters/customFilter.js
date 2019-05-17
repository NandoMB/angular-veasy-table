angular.module('veasy.table')
  .filter('vtUrl', ['$sanitize', function ($sanitize) {
    return function (input, text, target) {
      return $sanitize('<a target="' + target + '" href="' + input + '">' + input + '</a>');
    };
  }])
  .filter('vtLocaleOrderBy', [function () {
    return function (array, predicate, reverse) {
      if (!Array.isArray(array)) return array;
      if (!predicate) return array;

      array.sort(function (first, second) {
        const valueA = first[predicate];
        const valueB = second[predicate];
        if (typeof valueA === 'string') {
          return !reverse ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }
        if (typeof valueA === 'number' || typeof valueA === 'boolean') {
          return !reverse ? valueA - valueB : valueB - valueA;
        }
        return 0;
      });

      return array;
    }
  }]);

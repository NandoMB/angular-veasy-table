angular.module('veasy.table')

  .service('vtPaginationService', [ function () {

    var isFiniteNumber = function (index) {
      return !isNaN(index) && isFinite(index);
    };

    var paginate = function (list, pageSize) {
      if (!list) return [];

      var paginatedList = [];

      for (var i = 0; i < list.length; i++) {
        var pageIndex = i / pageSize;

        if (isFiniteNumber(pageIndex)) {
          if (i % pageSize === 0) {
            paginatedList[Math.floor(pageIndex)] = [list[i]];
          } else {
            paginatedList[Math.floor(pageIndex)].push(list[i]);
          }
        }
      }

      return paginatedList;
    };

    var pages = function (totalPages, initialPage, range) {
      if (initialPage > totalPages - range)
        initialPage = totalPages - range + 1;

      var result = [];
      for (var i = initialPage; i < initialPage + range; i++) {
        if (i >= 0) result.push(i);
      }

      return result;
    };

    return {
      paginate: paginate,
      pages: pages
    };

  }]);

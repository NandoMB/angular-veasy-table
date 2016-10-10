angular.module('veasy.table')

.service('vtColumnService', [ function () {

  var haveHiddenColumn = function(columns) {
    if (!columns) return;

    return columns.some(function(column) {
      return column.isHidden;
    });
  };

  var openRow = function(rows, index, parentIndex, parentRow, columns) {
    rows.splice(index, 0, { rowIndex: index, isToggleable: true });
  };

  var closeRow = function(rows, index) {
    rows.splice(index, 1);
  };

  var openedRows = function(rows) {
    if (!rows) return;

    return rows.filter(function(row) {
      return row.isToggleable;
    });
  };

  var closeAllOpenedRows = function(rows, activeRowIndex) {
    var rowsToClose = openedRows(rows);

    if (!rowsToClose) return;

    for (var i = 0; i < rowsToClose.length; i++) {
      if (rowsToClose[i].rowIndex !== activeRowIndex)
        closeRow(rows, rows.indexOf(rowsToClose[i]));
    }
  };

  var defineToggleRowColspan = function(columns) {
    var filteredColumns = columns.filter(function(column) {
      return !column.isHidden;
    }) || [];
    
    return filteredColumns.length + 1;
  };

  var getHiddenContent = function (parentRow, columns) {
    var hiddenContent = [];

    columns.forEach(function (column) {
      if (column.isHidden)
        hiddenContent.push({ header: column.header, value: parentRow[column.value], filter: column.filter });
    });

    return hiddenContent;
  };

  return {
    openRow: openRow,
    closeRow: closeRow,
    closeAllOpenedRows: closeAllOpenedRows,
    haveHiddenColumn: haveHiddenColumn,
    defineToggleRowColspan: defineToggleRowColspan,
    getHiddenContent: getHiddenContent
  };

}]);

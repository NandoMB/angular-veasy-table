angular.module('veasy.table')

  .service('vtModalService', [ 'vtCheckboxService', '$timeout', function (vtCheckboxService, $timeout) {

    var getModalId = function (id) {
      return id.replace(/veasy-table-/gi, 'veasy-table-modal-');
    };

    var initMasterCheckbox = function (modalId, modalColumns) {
      var checkboxMaster = {};

      modalColumns.forEach(function (col) {
        var selector = '#' + modalId + ' input#cbMaster-' + col.value;
        $timeout(function () {
          checkboxMaster[col.value] = defineMasterCheckboxState(selector, col);
        }, 0);
      });

      return checkboxMaster;
    };

    var defineMasterCheckboxState = function (selector, column) {
      var checked = false;
      var unchecked = false;

      angular.forEach(column.hideOn, function (size) {
        if (size) checked = true;
        else unchecked = true;
      });

      return vtCheckboxService.defineCheckboxState(selector, checked, unchecked);
    };

    var getColumns = function (columns) {
      return columns.map(function (column) {
        var sizeArray = column.hideOn.split(' ');

        return {
          header: column.header,
          value: column.value,
          hideOn: {
            lg: isVisibleColumn(sizeArray, 'lg'),
            md: isVisibleColumn(sizeArray, 'md'),
            sm: isVisibleColumn(sizeArray, 'sm'),
            xs: isVisibleColumn(sizeArray, 'xs')
          }
        };
      });
    };

    var isVisibleColumn = function (array, size) {
      return array.indexOf(size) === -1;
    };

    var updateColumnsVisibility = function (configColumns, modalColumns) {
      var columns = angular.copy(configColumns);
      var hide = {};

      modalColumns.forEach(function (col) {
        var hideOn = '';
        for (var prop in col.hideOn) {
          if (!col.hideOn[prop]) {
            hideOn += prop + ' ';
          }
        }
        hide[col.value] = hideOn.trim();
      });

      columns.forEach(function (col) {
        if (col.$$hashKey) delete col.$$hashKey;
        if (!col.toggle) col.hideOn = hide[col.value];
      });

      return columns;
    };

    var openModal = function (id, modalConfig) {
      angular.element('#' + id).modal({
        keyboard: modalConfig.keyboard,
        backdrop: modalConfig.backdrop
      });

      // tooltip fixes
      angular.element('[data-toggle="tooltip-screen-size"]').tooltip();
    };

    var closeModal = function (id) {
      angular.element('#' + id).modal('hide');
    };

    var checkAllByScreenSize = function (screenSize, modalColumns, value, modalId) {
      var checkboxMaster = {};

      modalColumns.forEach(function (column) {
        column.hideOn[screenSize] = value;

        var selector = '#' + modalId + ' input#cbMaster-' + column.value;
        checkboxMaster[column.value] = defineMasterCheckboxState(selector, column);
      });

      return checkboxMaster;
    };

    return {
      getModalId: getModalId,
      initMasterCheckbox: initMasterCheckbox,
      defineMasterCheckboxState: defineMasterCheckboxState,
      updateColumnsVisibility: updateColumnsVisibility,
      checkAllByScreenSize: checkAllByScreenSize,
      getColumns: getColumns,
      openModal: openModal,
      closeModal: closeModal
    };
  }]);

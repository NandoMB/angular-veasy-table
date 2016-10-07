angular.module('veasy.table')

  .service('checkboxService', ['$timeout', function ($timeout) {

    var resetCheckboxesToInitialState = function (list) {
      var checkboxes = [];
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[i].length; j++) {
          checkboxes[i] = [];
          checkboxes[i][j] = false;
        }
      }
      return checkboxes;
    };

    var defineCheckboxMasterState = function (selector, checkboxes, page) {
      var checked = false;
      var unchecked = false;

      angular.forEach(checkboxes[page], function (value, index) {
        if (value) checked = true;
        else unchecked = true;
      });

      return defineCheckboxState(selector, checked, unchecked);
    };

    var defineCheckboxState = function (selector, checked, unchecked) {
      if (checked && unchecked) {
        defineIndeterminateStage(selector, true);
        return false;
      }

      if (checked) {
        defineIndeterminateStage(selector, false);
        return true;
      }

      if (unchecked) {
        defineIndeterminateStage(selector, false);
        return false;
      }
    };

    var defineIndeterminateStage = function(selector, value) {
      angular.element(selector).prop('indeterminate', value);
    };

    return {
      reset: resetCheckboxesToInitialState,
      defineCheckboxMasterState: defineCheckboxMasterState,
      defineCheckboxState: defineCheckboxState
    };

  }]);

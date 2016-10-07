angular.module('veasy.table')

  .filter('url', ['$sanitize', function ($sanitize) {
    return function (input, text, target) {
      // if (!text) {
      //   var matches = input.match(/\w+:\/\/([\w|\.]+)/);
      //   if (matches) text = matches[0];
      // }
      // return $sanitize('<a target="' + target + '" href="' + input + '">' + text + '</a>');

      return $sanitize('<a target="' + target + '" href="' + input + '">' + input + '</a>');
    };
  }]);

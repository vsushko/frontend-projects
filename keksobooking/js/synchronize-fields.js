'use strict';

(function () {
  window.synchronizeFields = (function () {
    return function (firstElement, secondElement, firstElementValues, secondElementValues, callback) {
      firstElement.addEventListener('change', function () {
        if (typeof callback === 'function') {
          callback(secondElement, secondElementValues[firstElementValues.indexOf(firstElement.value)]);
        }
      });
    };
  })();
})();

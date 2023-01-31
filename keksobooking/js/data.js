
'use strict';

(function () {
  /**
  * Обработка неуспешного выполнения запроса
  * @param {String} message сообщение об ошибке
  */
  var onError = function (message) {
    window.util.onError(message);

    window.data = {
      advertisements: []
    };
  };

  /**
   * Обработка успешного выполнения запроса
   * @param {Object} data набор полученных данных
   */
  var onLoad = function (data) {
    window.data = {
      advertisements: data
    };
  };

  // получим данные с сервера
  window.backend.load(onLoad, onError);
})();

